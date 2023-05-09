import type {NextApiRequest, NextApiResponse} from 'next';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';

let timesCalled = 0;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  timesCalled++;
  console.log('timesCalled:', timesCalled);
  const chat = new ChatOpenAI({
    temperature: 0,
    modelName: process.env.RATE_TRUTHFULNESS_GPT_MODEL,
  });
  const {input, character} = req?.body?.params || {
    input: '',
    character: {name: 'an Erroring Robot'},
  };

  chat
    .call([
      new SystemChatMessage(
        `Please rate how truthful the message from the user on a scale of 1 to 5, with 1 being not at all truthful and 5 being completely truthful. If the statement can't be evaluated for truthfulness, respond with "0". Respond only with a number.`
      ),
      new HumanChatMessage(
        'Water boils at 100 degrees Celsius (212 degrees Fahrenheit) at sea level and standard atmospheric pressure.'
      ),
      new AIChatMessage('5'),
      new HumanChatMessage('All deserts are hot and sandy'),
      new AIChatMessage('2'),
      new HumanChatMessage('Elephants are the largest land animals on Earth'),
      new AIChatMessage('4'),
      new HumanChatMessage('Pigs can fly'),
      new AIChatMessage('1'),
      new HumanChatMessage('The Moon is made of green cheese'),
      new AIChatMessage('1'),
      new HumanChatMessage('The Earth is not flat'),
      new AIChatMessage('5'),
      new HumanChatMessage('Dinosaurs were all large, lumbering creatures'),
      new AIChatMessage('2'),
      new HumanChatMessage('Birds can fly'),
      new AIChatMessage('4'),
      new HumanChatMessage('Goldfish have a three-second memory'),
      new AIChatMessage('2'),
      new HumanChatMessage('All dogs are good swimmers'),
      new AIChatMessage('3'),
      new HumanChatMessage(
        'People with a higher IQ are more successful in life'
      ),
      new AIChatMessage('3'),
      new HumanChatMessage('The earth is flat'),
      new AIChatMessage('1'),
      new HumanChatMessage('Humans have 10 fingers and 10 toes'),
      new AIChatMessage('4'),
      new HumanChatMessage(
        'Eating carrots significantly improves your night vision'
      ),
      new AIChatMessage('3'),
      new HumanChatMessage(
        'Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy'
      ),
      new AIChatMessage('5'),
      new SystemChatMessage(
        `Please rate how truthful the message from the user on a scale of 1 to 5, with 1 being not at all truthful and 5 being completely truthful. If the statement can't be evaluated for truthfulness, respond with "0". Respond only with a number.`
      ),
      new HumanChatMessage(`${character.name}: ${input}`),
    ])
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(200).json(new AIChatMessage('there was an error'));
    });
}
