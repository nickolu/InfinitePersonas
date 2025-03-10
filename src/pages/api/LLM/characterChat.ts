import type {NextApiRequest, NextApiResponse} from 'next';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, SystemMessage } from '@langchain/core/messages';
import {messageInputsToChatMessages} from '@/utils/llm';

const MAX_RETRIES = 3;
const DELAY_MS = 1000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const modelName = process.env.NEXT_PUBLIC_CHARACTER_CONVERSATION_GPT_MODEL;
  const isO3Model = modelName?.includes('o3');
  
  const chatOptions = {
    modelName,
    streaming: true,
  };
  
  // Only add temperature for non-o3 models
  if (!isO3Model) {
    Object.assign(chatOptions, { temperature: 0.7 });
  }
  
  const chat = new ChatOpenAI(chatOptions);  
  const {character, messages} = req?.body?.params || {
    character: {name: 'an Erroring Robot'},
    messages: [],
  };

  if (!messages || !character) {
    res.write(`data: ${JSON.stringify({ error: "Missing messages or character" })}\n\n`);
    return res.end();
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const stream = await chat.stream([
        new SystemMessage(
          {content: `You are a method actor who can portray any role with incredible accuracy. Today, you are ${character.name}, ${character.description}. The user is going to chat with you and might ask you all sorts of questions, they may even just try to have fun or not make sense. No matter what they say, stay in character as ${character.name}. Formatting: response conversationally with paragraphs that have line breaks between for readability.`}
        ),
        ...messageInputsToChatMessages(messages), 
      ]);

      // Stream the response chunks to the client
      for await (const chunk of stream) {
        if (chunk?.content !== null && chunk?.content !== undefined) {
          res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
        }
      }
      
      // Signal the end of the stream
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      return res.end();
    } catch (error) {
      console.error('failed to get chat response, retrying', error);
      if (attempt === MAX_RETRIES) {
        console.error(
          'failed to get chat response, max retries exceeded',
          error
        );
        res.write(`data: ${JSON.stringify({ error: JSON.stringify(error) })}\n\n`);
        return res.end();
      }

      await delay(DELAY_MS);
    }
  }
}
