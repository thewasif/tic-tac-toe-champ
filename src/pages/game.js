import { useEffect, useContext, useState } from 'react';
import { GameBoard } from '../lib/game';
import { GlobalContext } from '../context/GlobalContext';
import { database } from '../.firebase';

function Game(props) {
  const { state } = useContext(GlobalContext);
  const [remoteData, setRemoteData] = useState(null);

  const roomID = props.match.params.id;

  useEffect(() => {
    database.ref(props.match.params.id).on('value', (snap) => {
      const remoteObj = snap.val();
      setRemoteData(remoteObj);

      if (remoteObj._turn === state.username) {
        console.log('YOUR TURN!!!');
      }
    });
  }, [props.match.params.id, state.username]);

  const mark = (index) => {
    if (remoteData._turn !== state.username) {
      console.log('It is not your turn');
      return;
    }

    const { PLAYER_ONE, PLAYER_TWO } = remoteData;

    let game = new GameBoard(PLAYER_ONE, PLAYER_TWO);
    game.board = remoteData.board;
    game._turn = remoteData._turn;
    game.winner = remoteData.winner ? remoteData.winner : null;
    game.draw = remoteData.draw;
    game.mark(index);

    const dataToBeSent = JSON.parse(JSON.stringify(game));
    database
      .ref(props.match.params.id)
      .set(dataToBeSent)
      .then((res) => console.log('res', res))
      .catch((e) => console.log(e));
  };

  return (
    <div className='game'>
      <h3>
        Turn: <i>Player One</i>
      </h3>
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
