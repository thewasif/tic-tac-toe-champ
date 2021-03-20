import { useEffect, useContext, useState } from 'react';
import { game } from '../lib/game';
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
    game.board = remoteData.board ? remoteData.board : [];
    game.turn = remoteData._turn;
    game.mark(index);
    console.log(JSON.parse(JSON.stringify(game)));
  };

  return (
    <div className='game'>
      <h3>
        Turn: <i>Player One</i>
      </h3>
      <h4>Room ID: {roomID}</h4>
      <div className='game__board'>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((e, index) => (
          <div
            key={e}
            className='game__board--box'
            onClick={() => mark(index + 1)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Game;
