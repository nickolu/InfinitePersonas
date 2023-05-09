import type {NextApiRequest, NextApiResponse} from 'next';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';
import Message from '@/core/Message';

let timesCalled = 0;

function messageInputsToChatMessages(inputs: Message[]) {
  return inputs.map((input) => {
    if (input.isUser) {
      return new HumanChatMessage(input.text);
    } else {
      return new AIChatMessage(input.text);
    }
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  timesCalled++;
  console.log('timesCalled:', timesCalled);
  const chat = new ChatOpenAI({
    temperature: 0.7,
    modelName: process.env.OPENAI_MODEL_NAME,
  });
  const {character, messages} = req?.body?.params || {
    character: {name: 'an Erroring Robot'},
    messages: [],
  };

  console.log('CHARACTER', character);

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
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(200).json(new AIChatMessage('there was an error'));
    });
  // chat
  //   .call([
  //     new SystemChatMessage('This is an example system message'),
  //     new HumanChatMessage('Please write an example message'),
  //   ])
  //   .then((response) => {
  //     console.log(response);
  //     res.status(200).json(response);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     console.error(error);
  //     res.status(500).end();
  //   })
  //   .finally(() => {
  //     console.log('finally');
  //     if (!res.headersSent) {
  //       res.status(204).end(); // You can use any status code, like 204 No Content, to indicate that the request has been handled but there's no response body.
  //     }
  //   });
}
