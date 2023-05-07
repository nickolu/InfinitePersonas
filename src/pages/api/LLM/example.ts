import type {NextApiRequest, NextApiResponse} from 'next';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {HumanChatMessage, SystemChatMessage} from 'langchain/schema';

const chat = new ChatOpenAI({temperature: 0.4});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  chat
    .call([
      new SystemChatMessage('This is an example system message'),
      new HumanChatMessage('Please write an example message'),
    ])
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).end();
    });
}
