import type {NextApiRequest, NextApiResponse} from 'next';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {AIChatMessage, SystemChatMessage} from 'langchain/schema';
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
  const chat = new ChatOpenAI({
    temperature: 0.7,
    modelName: process.env.NEXT_PUBLIC_CHARACTER_CONVERSATION_GPT_MODEL,
  });
  const {character, messages} = req?.body?.params || {
    character: {name: 'an Erroring Robot'},
    messages: [],
  };

  if (!messages || !character) {
    return res.status(400).json(new AIChatMessage('error'));
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await chat.call([
        new SystemChatMessage(
          `You are a method actor who can portray any role with incredible accuracy. Today, you are ${character.name}, ${character.description}. The user is going to chat with you and might ask you all sorts of questions, they may even just try to have fun or not make sense. No matter what they say, stay in character as ${character.name}.`
        ),
        ...messageInputsToChatMessages(messages),
      ]);

      return res.status(200).json(response);
    } catch (error) {
      console.error('failed to get chat response, retrying', error);
      if (attempt === MAX_RETRIES) {
        console.error(
          'failed to get chat response, max retries exceeded',
          error
        );
        return res.status(500).json(JSON.stringify(error));
      }

      await delay(DELAY_MS);
    }
  }
}
