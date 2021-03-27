import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { createRoom, joinRoom } from '../functions/index';
import { GameBoard } from '../lib/game';
import { GlobalContext } from '../context/GlobalContext';
import Loader from '../components/Loader';

function Home() {
  const history = useHistory();
  const { setUsername } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const onCreateRoomClick = async () => {
    let name = prompt('What is your name?') || '';
    if (name.trim() === '') return;

    let gameObj = JSON.parse(JSON.stringify(new GameBoard(name, null)));
    gameObj._turn = name;
    setLoading(true);
    try {
      let { roomID } = await createRoom({
        ...gameObj,
        PLAYER_ONE: name,
      });
      await setUsername(name);
      history.push(`/game/${roomID}`);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onJoinRoomClick = async () => {
    let roomID = prompt('Please enter Room ID') || '';
    let name = prompt('What is your name?') || '';

    if (roomID.trim() === '' || name.trim() === '') return;

    setLoading(true);
    try {
      let response = await joinRoom(roomID, name);
      await setUsername(name);
      history.push(`/game/${response.roomID}`);
    } catch (error) {
      console.log(error);
      alert('No such room! Please eneter a valid Room ID');
    }
    setLoading(false);
  };

  return (
    <div className='home'>
      <h1 className='home__title'>Tic Tac Toe</h1>
      <div className='home__btn-group'>
        <button onClick={onCreateRoomClick}>Create a New Room</button>
        <button onClick={onJoinRoomClick}>Join a Room</button>
        <button onClick={() => alert('This feature is not available yet.')}>
          Play Offline{' '}
        </button>

        <Loader visible={loading} />
      </div>
    </div>
  );
}

export default Home;
