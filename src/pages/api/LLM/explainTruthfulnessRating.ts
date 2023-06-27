import type {NextApiRequest, NextApiResponse} from 'next';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {
    AIChatMessage,
    HumanChatMessage,
    SystemChatMessage,
} from 'langchain/schema';

function human1(text: string) {
    const human1 = new HumanChatMessage(
      text
    );
    human1.name = 'user';
    return human1;
  }
  
  function human2(text: string, name: string) {
    const human2 = new HumanChatMessage(
      text
    );
    human2.name = name;
    return human2;
  }
  

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const chat = new ChatOpenAI({
        temperature: 0.6,
        modelName: process.env.RATE_TRUTHFULNESS_GPT_MODEL,
    });
    const {input, input1, input2, character, truthfulnessRating} = req?.body?.params || {
        input: '',
        input1: '',
        input2: '',
        character: {name: 'an Erroring Robot'},
        truthfulnessRating: 0
    };

    let prompt = `We rated the truthfulness of the second statement, the one made by ${character.name}, as ${truthfulnessRating} out of 5. Please give your best explanation as to why.`;
    if (truthfulnessRating === 0) {
        prompt = `We were unable to rate the second statement, the one made by ${character.name}, for truthfulness. Please give your best explanation as to why.`
    }
    try {
        const response = await chat.call([
            new SystemChatMessage(
                prompt
            ),
            human1(input1 || ''),
            human2(input2, character.name.split(' ')[0]),
        ]);

        res.status(200).json(response);
    } catch (error) {
        // console.error(error);
        res.status(500).json(new AIChatMessage('there was an error'));
    }
}