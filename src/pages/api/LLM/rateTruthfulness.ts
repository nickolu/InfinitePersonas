import type {NextApiRequest, NextApiResponse} from 'next';
import { ChatOpenAI } from '@langchain/openai';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';

let timesCalled = 0;

function human1(text: string) {
  const human1 = new HumanMessage(
    {'content': text}
  );
  human1.name = 'user1';
  return human1;
}

function human2(text: string) {
  const human2 = new HumanMessage(
    {'content': text}
  );
  human2.name = 'user2';
  return human2;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  timesCalled++;

  const chat = new ChatOpenAI({
    temperature: 0,
    modelName: process.env.NEXT_PUBLIC_RATE_TRUTHFULNESS_GPT_MODEL,
  });
  const {input, input1, input2, character} = req?.body?.params || {
    input: '',
    input1: '',
    input2: '',
    character: {name: 'an Erroring Robot'},
  };

  try {
    const response = await chat.invoke([
      new SystemMessage(
        {content: `Please rate how truthful the message from the user on a scale of 1 to 5, with 1 being not at all truthful and 5 being completely truthful. If the statement can't be evaluated for truthfulness, respond with "0". Respond only with a number.`}
      ),
      human1('What shape is the Earth?'),
      human2('The Earth is a spherical planet'),
      new AIMessage({
        content: '5',
        additional_kwargs: {},
      }),
      human1('What is the capital of the United States?'),
      human2('The capital of the United States is Los Angeles, CA'),
      new AIMessage({
        content: '1',
        additional_kwargs: {},
      }),
      human1('Whats the best food?'),
      human2('Pizza'),
      new AIMessage({
        content: '0',
        additional_kwargs: {},
      }),
      human1('Muhammid Ali, who was your shortest opponent?'),
      human2('It was Joe Frazier standing at 6 foot 0 inches'),
      new AIMessage({
        content: '3',
        additional_kwargs: {},
      }),
      human1(`Hey ${character.name}, ${input1 || ''}`),
      human2(input2 || '')
    ]);

    // Convert the LangChain message to a plain object before sending
    const plainResponse = {
      content: response.content,
      type: response._getType(),
    };
    
    res.status(200).json(plainResponse);
  } catch (error) {
    // console.error(error);
    // Create a plain error object instead of an AIMessage
    res.status(500).json({ 
      content: 'there was an error',
      type: 'error'
    });
  }
}
