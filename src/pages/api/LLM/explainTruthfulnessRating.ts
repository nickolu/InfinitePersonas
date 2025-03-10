import type {NextApiRequest, NextApiResponse} from 'next';
import { ChatOpenAI } from '@langchain/openai';
import {
    AIMessage,
    HumanMessage,
    SystemMessage,
} from '@langchain/core/messages';

function human1(text: string) {
    const human1 = new HumanMessage({
        content: text,
        additional_kwargs: {},
    });
    human1.name = 'user';
    return human1;
}

function human2(text: string, name: string) {
    const human2 = new HumanMessage({
        content: text,
        additional_kwargs: {},
    });
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
        const response = await chat.invoke([new HumanMessage({
            content: promptPrefix+prompt,
            additional_kwargs: {},
        })]);

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
