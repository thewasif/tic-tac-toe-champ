import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GameBoard } from '../lib/game';
import { GlobalContext } from '../context/GlobalContext';
import { database } from '../.firebase';
import { leaveRoom, sendData } from '../functions';

function Game(props) {
  const { state } = useContext(GlobalContext);
  const [remoteData, setRemoteData] = useState(null);

  const history = useHistory();

  const roomID = props.match.params.id;

  useEffect(() => {
    // get live data from remote server and update it in state
    database.ref(props.match.params.id).on('value', (snap) => {
      setRemoteData(snap.val());
    });
  }, [props.match.params.id]);

  const mark = async (index) => {
    if (remoteData._turn !== state.username) {
      console.log('It is not your turn');
      return;
    }

    const { PLAYER_ONE, PLAYER_TWO } = remoteData;

    let game = new GameBoard(PLAYER_ONE, PLAYER_TWO);
    game.board = remoteData.board;
    game._turn = remoteData._turn;
    game.winner = remoteData.winner ? remoteData.winner : null;

    game.mark(index);

    const data = JSON.parse(JSON.stringify(game));

    try {
      await sendData(roomID, data);
    } catch (error) {
      console.log(error);
    }
  };

  const restart = async () => {
    const data = {
      ...remoteData,
      board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      winner: null,
      draw: false,
    };

    try {
      await sendData(roomID, data);
    } catch (error) {
      console.log(error);
    }
  };

  const leave = async () => {
    try {
      await leaveRoom(roomID, state.username);
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='game'>
      <h3>
        Turn: <i>Player One</i>
      </h3>
      <button onClick={leave}>Leave Room</button>
      {remoteData?.winner ? <h4>{remoteData.winner} is Winner</h4> : null}
      {remoteData?.draw ? <h4>It's a draw :(</h4> : null}
      {remoteData?.winner || remoteData?.draw ? (
        <button onClick={restart}>Restart</button>
      ) : null}

      <h4>Room ID: {roomID}</h4>
      <div className='game__board'>
        {remoteData?.board.map((e, index) => (
          <div
            key={index}
            className='game__board--box'
            onClick={() => mark(index + 1)}
          >
            {e === 0 ? '' : e}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
