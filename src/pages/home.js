import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { createRoom, joinRoom } from '../functions/index';
import { game } from '../lib/game';
import { GlobalContext } from '../context/GlobalContext';

function Home() {
  const history = useHistory();
  const { setUsername } = useContext(GlobalContext);

  const onCreateRoomClick = async () => {
    let name = prompt('What is your name?');
    let gameObj = JSON.parse(JSON.stringify(game));
    gameObj._turn = name;

    try {
      let { roomID } = await createRoom({
        ...gameObj,
        first_player: name,
      });
      await setUsername(name);
      history.push(`/game/${roomID}`);
    } catch (error) {
      console.log(error);
    }
  };

  const onJoinRoomClick = async () => {
    let roomID = prompt('Please enter Room ID...');
    let name = prompt('What is your name?');

    try {
      let response = await joinRoom(roomID, name);
      await setUsername(name);
      history.push(`/game/${response.roomID}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='home'>
      <h1 className='home__title'>Tic Tac Toe Champ</h1>
      <div className='home__btn-group'>
        <button onClick={onCreateRoomClick}>Create a New Room</button>
        <button onClick={onJoinRoomClick}>Join a Room</button>
        <button>Play Offline </button>
      </div>
    </div>
  );
}

export default Home;
