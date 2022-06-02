import { useState, useEffect, useContext } from 'react';
import { FiSend } from 'react-icons/fi';
import { createChatRoom, sendMessage } from '../functions';
import { firestore } from '../.firebase';
import { GlobalContext } from '../context/GlobalContext';
import ScrollToBottom from 'react-scroll-to-bottom';

function ChatBox({ roomID }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const { state } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      try {
        await createChatRoom(roomID);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [roomID]);

  useEffect(() => {
    firestore
      .collection('chats')
      .doc(roomID)
      .onSnapshot((snap) => {
        const { messages } = snap.data();
        setChat(messages);
      });
  }, [roomID]);

  const send = async () => {
    setMessage('');
    try {
      await sendMessage(roomID, message, state.username);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='chat'>
      <ScrollToBottom className='chat__messages'>
        {chat.map((message, index, array) => {
          const chat = JSON.parse(message);
          const prevChat = JSON.parse(array[index === 0 ? index : index - 1]);

          return (
            <p key={message}>
              {chat.sentBy !== prevChat.sentBy || index === 0 ? (
                <span>
                  <b>{chat.sentBy}</b> • <i>{new Date(chat.time).toLocaleTimeString()}</i> <br />
                </span>
              ) : null}

              {chat.message}
            </p>
          );
        })}
      </ScrollToBottom>

      <div className='chat__input'>
        <input
          type='text'
          placeholder={'Type...'}
          value={message}
          onKeyDown={(e) => (e.key === 'Enter' ? send() : null)}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={send}>
          {' '}
          <FiSend />{' '}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
