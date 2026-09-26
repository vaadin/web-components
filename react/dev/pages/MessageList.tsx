import { MessageList, type MessageListItem } from '../../packages/react-components/src/MessageList.js';
import { MessageInput, type MessageInputSubmitEvent } from '../../packages/react-components/src/MessageInput.js';
import { useState } from 'react';

export default function MessageListPage() {
  const [messages, setMessages] = useState<MessageListItem[]>([
    {
      text: 'Hello! How can I help you today?',
      time: '10:00 AM',
      userName: 'Support Agent',
      userColorIndex: 1,
    },
    {
      text: 'I have a question about the product.',
      time: '10:05 AM',
      userName: 'Customer',
      userColorIndex: 2,
    },
  ]);

  const [newMessageUserName, setNewMessageUserName] = useState('You');
  const [newMessageUserAbbr, setNewMessageUserAbbr] = useState('');
  const [newMessageUserImg, setNewMessageUserImg] = useState('');
  const [newMessageUserColorIndex, setNewMessageUserColorIndex] = useState(3);
  const [newMessageClassName, setNewMessageClassName] = useState('');

  const addMessage = (text: string) => {
    const newMessage: MessageListItem = {
      text,
      time: new Date().toLocaleTimeString(),
      userName: newMessageUserName,
      userColorIndex: newMessageUserColorIndex,
    };

    // Add optional properties if they are set
    if (newMessageUserAbbr) {
      newMessage.userAbbr = newMessageUserAbbr;
    }

    if (newMessageUserImg) {
      newMessage.userImg = newMessageUserImg;
    }

    if (newMessageClassName) {
      newMessage.className = newMessageClassName;
    }

    setMessages([...messages, newMessage]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>Message List</h1>
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
          <MessageList items={messages} />
          <MessageInput
            onSubmit={(e: MessageInputSubmitEvent) => {
              addMessage(e.detail.value);
            }}
          />
        </div>

        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <button onClick={() => setMessages([])} style={{ marginLeft: '10px' }}>
            Clear All Messages
          </button>
        </div>
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>

        <label>
          User Name:{' '}
          <input type="text" value={newMessageUserName} onChange={(e) => setNewMessageUserName(e.target.value)} />
        </label>
        <label>
          User Abbreviation:{' '}
          <input type="text" value={newMessageUserAbbr} onChange={(e) => setNewMessageUserAbbr(e.target.value)} />
        </label>
        <label>
          User Image URL:{' '}
          <input type="text" value={newMessageUserImg} onChange={(e) => setNewMessageUserImg(e.target.value)} />
        </label>
        <label>
          User Color Index (1-10):{' '}
          <input
            type="number"
            min="1"
            max="10"
            value={newMessageUserColorIndex}
            onChange={(e) => setNewMessageUserColorIndex(Number(e.target.value))}
          />
        </label>
        <label>
          Message CSS Class:{' '}
          <input type="text" value={newMessageClassName} onChange={(e) => setNewMessageClassName(e.target.value)} />
        </label>

        <button
          onClick={() => {
            addMessage('This is a sample message.');
          }}
        >
          Add Sample Message
        </button>
      </div>
    </div>
  );
}
