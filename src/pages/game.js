import { game as gameBoard } from '../lib/game';

function Game() {
  return (
    <div className='game'>
      <h3>
        Turn: <i>Player One</i>
      </h3>
      <div className='game__board'>
        <div
          className='game__board--box'
          onClick={() => {
            const res = gameBoard.mark(1);
            console.log(res);
          }}
        ></div>
        <div className='game__board--box'></div>
        <div className='game__board--box'></div>
        <div className='game__board--box'></div>
        <div className='game__board--box'></div>
        <div className='game__board--box'></div>
        <div className='game__board--box'></div>
        <div className='game__board--box'></div>
        <div className='game__board--box'></div>
      </div>
    </div>
  );
}

export default Game;
