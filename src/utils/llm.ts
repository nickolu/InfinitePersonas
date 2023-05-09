import Message from '@/core/Message';
import {AIChatMessage, HumanChatMessage} from 'langchain/schema';

export function messageInputsToChatMessages(inputs: Message[]) {
  return inputs.map((input) => {
    if (input.isUser) {
      return new HumanChatMessage(input.text);
    } else {
      return new AIChatMessage(input.text);
    }
  });
}
