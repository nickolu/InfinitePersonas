import {v4 as uuidv4} from 'uuid';

export default abstract class Message {
  text: string;
  isUser: boolean;
  name?: string;
  id: string;
  constructor({
    text,
    isUser,
    name,
  }: {
    text: string;
    isUser: boolean;
    name: string;
  }) {
    this.text = text;
    this.isUser = isUser;
    this.name = name;
    this.id = uuidv4();
  }
}

export class UserMessage extends Message {
  constructor(text: string) {
    super({
      text,
      isUser: true,
      name: 'User',
    });
  }
}

export class SystemMessage extends Message {
  constructor(text: string) {
    super({
      text,
      isUser: false,
      name: 'System',
    });
  }
}

export class BotMessage extends Message {
  constructor(text: string) {
    super({
      text,
      isUser: false,
      name: 'Bot',
    });
  }
}
