import type {NextApiRequest, NextApiResponse} from 'next';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {AIChatMessage, SystemChatMessage} from 'langchain/schema';
import {messageInputsToChatMessages} from '@/utils/llm';

let timesCalled = 0;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  timesCalled++;
  console.log('timesCalled:', timesCalled);
  const chat = new ChatOpenAI({
    temperature: 0.7,
    modelName: process.env.CHARACTER_CONVERSATION_GPT_MODEL,
  });
  const {character, messages} = req?.body?.params || {
    character: {name: 'an Erroring Robot'},
    messages: [],
  };

  if (!messages || !character) {
    res.status(400).json(new AIChatMessage('error'));
    return;
  }

  chat
    .call([
      new SystemChatMessage(
        `You are ${character.name}, ${character.description}. Your goal is to educate and entertain children by chatting with them. Be completely truthful about any historical details you mention, but make sure your responses are family friendly.`
      ),
      ...messageInputsToChatMessages(messages),
    ])
    .then((response) => {
      console.log('example res:', response);
      return res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      return res.status(200).json(new AIChatMessage('there was an error'));
    });

  return;
}
