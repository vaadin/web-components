import { BoardRow } from '../../packages/react-components/src/BoardRow.js';
import { Message } from '../../packages/react-components/src/Message.js';
import { MessageInput } from '../../packages/react-components/src/MessageInput.js';
import { MessageList } from '../../packages/react-components/src/MessageList.js';

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
