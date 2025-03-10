import Message from '@/core/Message';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export function messageInputsToChatMessages(inputs: Message[]) {
  return inputs.map((input) => {
    if (input.isUser) {
      return new HumanMessage({
        content: input?.text ?? '',
        additional_kwargs: {},
      });
    } else {
      return new AIMessage({
        content: input?.text ?? '',
        additional_kwargs: {},
      });
    }
  });
}
