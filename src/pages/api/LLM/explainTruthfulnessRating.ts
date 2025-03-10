import type {NextApiRequest, NextApiResponse} from 'next';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {
    AIChatMessage,
    HumanChatMessage,
    SystemChatMessage,
} from 'langchain/schema';

function human1(text: string) {
    const human1 = new HumanChatMessage(text);
    human1.name = 'user';
    return human1;
}

function human2(text: string, name: string) {
    const human2 = new HumanChatMessage(text);
    human2.name = name;
    return human2;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const chat = new ChatOpenAI({
        temperature: 0,
        modelName: process.env.NEXT_PUBLIC_RATE_TRUTHFULNESS_GPT_MODEL,
    });
    const {input1, input2, character, truthfulnessRating} = req?.body
        ?.params || {
        input1: '',
        input2: '',
        character: {name: 'an Erroring Robot'},
        truthfulnessRating: 0,
    };

    console.log(
        'explainTruthfulnessRating.ts',
        input1,
        ',',
        input2,
        ',',
        character,
        ',',
        truthfulnessRating
    );

    const promptPrefix = `
    RESPONSE:
    \`\`\`
    ${character.name}: ${input2}
    \`\`\`

    for this message, assume it was spoken by ${character.name} in response to the following message: 

    PROMPT:
    \`\`\`
    User: ${input1}
    \`\`\``;

    let prompt = `we rated the response as as ${truthfulnessRating} out of 5 for truthfulness. Please give your best explanation as to why it was rated that way including which parts are factual and not factual.`;

    if (truthfulnessRating === 0) {
        prompt = `we were unable to evaluate the response for truthfulness. Please give your best explanation as to why we could not, but also describe which parts are factual and not factual.`;
    }
    try {
        const response = await chat.call([new HumanChatMessage(promptPrefix+prompt)]);

        res.status(200).json(response);
    } catch (error) {
        // console.error(error);
        res.status(500).json(new AIChatMessage('there was an error'));
    }
}
