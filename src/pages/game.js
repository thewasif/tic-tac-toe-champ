import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { GameBoard } from '../lib/game';
import { GlobalContext } from '../context/GlobalContext';
import { database } from '../.firebase';
import { leaveRoom, sendData } from '../functions';
import ChatBox from '../components/ChatBox';
function Game(props) {
  const { state } = useContext(GlobalContext);
  const [remoteData, setRemoteData] = useState(null);
  const [wins, setWins] = useState({ me: 0, other: 0 });

  const history = useHistory();

  const roomID = props.match.params.id;

  useEffect(() => {
    // get live data from remote server and update it in state
    database.ref(props.match.params.id).on('value', (snap) => {
      setRemoteData(snap.val());
    });
  }, [props.match.params.id]);

  useEffect(() => {
    if (remoteData?.winner) {
      if (remoteData.winner === state.username)
        setWins({ ...wins, me: wins.me + 1 });
      else setWins({ ...wins, other: wins.other + 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteData?.winner, state.username]);

  useEffect(() => {
    if (remoteData?.winner)
      setTimeout(
        () =>
          alert(
            `${
              remoteData.winner === state.username
                ? 'You are doing good. Keep up the game, champ!'
                : 'You lost. Try better next time!'
            }`
          ),
        1000
      );

    if (remoteData?.draw) {
      setTimeout(() => {
        alert('It is a draw! You gave opponent a tough time!');
      }, 1000);
    }
  }, [remoteData?.draw, remoteData?.winner, state.username]);

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
    console.log(data);
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

  const copyRoomID = () => {
    navigator.clipboard
      .writeText(roomID)
      .then((res) => alert('ID copied!'))
      .catch((e) => alert('Could not copy ID. Please copy it manually'));
  };

  useEffect(() => {
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ''; // Legacy method for cross browser support
      }
      return ''; // Legacy method for cross browser support
    };
  }, [])

  return (
    <div className='game'>
      <div className='game__controls'>
        <button onClick={leave}>Leave Room</button>
        {remoteData?.winner || remoteData?.draw ? (
          <button onClick={restart}>Restart</button>
        ) : null}
      </div>

      <div className='game__players'>
        <div className='game__players--box'>
          <h3>{remoteData?.PLAYER_ONE}</h3>
          <p>
            {state.username === remoteData?.PLAYER_ONE ? wins.me : wins.other}
          </p>
        </div>
        <div className='game__players--box'>
          <h3>
            {remoteData?.PLAYER_TWO ? remoteData?.PLAYER_TWO : 'Waiting...'}
          </h3>
          <p>
            {state.username === remoteData?.PLAYER_TWO ? wins.me : wins.other}
          </p>
        </div>
      </div>

      {remoteData ? (
        <div className='game__message'>
          {/* Statement for turn */}
          {remoteData._turn &&
          !remoteData.winner &&
          !remoteData.draw &&
          remoteData.PLAYER_ONE &&
          remoteData.PLAYER_TWO ? (
            <h3>
              {remoteData._turn === state.username
                ? 'Your'
                : `${remoteData._turn}'s`}{' '}
              turn!
            </h3>
          ) : null}

          {/* Statement for winner */}
          {remoteData.winner ? (
            <h3>
              {remoteData.winner === state.username ? 'You won!' : 'You lost!'}
            </h3>
          ) : null}

          {/* Statement for draw */}
          {remoteData.draw ? <h3>It's a draw!</h3> : null}

          {/* Statement for room ID */}
          {remoteData.PLAYER_ONE && remoteData.PLAYER_TWO ? null : (
            <>
              <p>
                You are only one in this room. Share your room ID with someone
                to play! Your room ID is {roomID}
              </p>
              <button onClick={copyRoomID}>Copy Room ID</button>
            </>
          )}
        </div>
      ) : null}

      {/* <h4>Room ID: {roomID}</h4> */}

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

      {remoteData?.PLAYER_ONE && remoteData?.PLAYER_TWO ? (
        // <ChatBox roomID={roomID} />
        <ChatBox roomID={roomID} />
      ) : (
        <div style={{ height: 150 }}></div>
      )}
    </div>
  );
}

export default Game;
