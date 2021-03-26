import { useState, useEffect, useContext } from 'react';
import { createChatRoom, sendMessage } from '../functions';
import { firestore } from '../.firebase';
import { GlobalContext } from '../context/GlobalContext';

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
    try {
      await sendMessage(roomID, message, state.username);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h5>Chat</h5>
      <div>
        {chat.map((message, index, array) => {
          const chat = JSON.parse(message);
          const prevChat = JSON.parse(array[index === 0 ? index : index - 1]);

          return (
            <p key={message}>
              {chat.sentBy !== prevChat.sentBy || index === 0 ? (
                <>
                  <b>{chat.sentBy}</b> <br />
                </>
              ) : null}

              {chat.message}
            </p>
          );
        })}
      </div>
      <div>
        <input type='text' onChange={(e) => setMessage(e.target.value)} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;