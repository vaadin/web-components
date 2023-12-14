import { BoardRow } from '../../src/BoardRow.js';
import { Message } from '../../src/Message.js';
import { MessageInput } from '../../src/MessageInput.js';
import { MessageList } from '../../src/MessageList.js';

export default function Row7() {
  return (
    <BoardRow>
      <MessageList
        items={[
          { text: 'Hello', time: 'today', userName: 'Bot' },
          { text: 'Message list', time: 'today', userName: 'Bot' },
        ]}
      ></MessageList>
      <Message userName="Test User">Message</Message>
      <MessageInput></MessageInput>
    </BoardRow>
  );
}
