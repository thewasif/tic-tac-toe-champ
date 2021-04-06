import ChatBox from './ChatBox';

function ChatModal({ visible, setVisible }) {
  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='modal__header'>
          <h1>Chat</h1>
          <h1>X</h1>
        </div>

        <div className='modal__body'>
          <ChatBox />
        </div>
        <div className='modal__footer'></div>
      </div>
    </div>
  );
}

export default ChatModal;
