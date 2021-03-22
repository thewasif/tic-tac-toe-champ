import { database } from '../.firebase/index';

const createRoom = (obj) => {
  const id = new Date().getTime();
  return new Promise((resolve, reject) => {
    database
      .ref(id)
      .set(obj)
      .then(() => resolve({ roomID: id }))
      .catch((error) => reject(error));
  });
};

const joinRoom = async (roomID, name) => {
  const snap = await database.ref().child(roomID).get();

  let gameObj = snap.val();

  // see which player is already in the room then enter another player accordingly
  if (gameObj.PLAYER_ONE) gameObj.PLAYER_TWO = name;
  else gameObj.PLAYER_ONE = name;

  return new Promise((resolve, reject) => {
    database
      .ref(roomID)
      .set(gameObj)
      .then(() => resolve({ roomID }))
      .catch((error) => reject(error));
  });
};

const leaveRoom = async (roomID, name) => {
  const snap = await database.ref().child(roomID).get();

  let gameObj = snap.val();
  const { PLAYER_ONE, PLAYER_TWO } = gameObj;

  // if there's only one player and he also leaves, delete the whole room
  if (PLAYER_ONE === undefined || PLAYER_TWO === undefined) {
    return new Promise((resolve, reject) => {
      database
        .ref(roomID)
        .remove()
        .then(() => resolve({ roomID }))
        .catch((error) => reject(error));
    });
  }

  if (PLAYER_ONE === name) {
    if (gameObj._turn === PLAYER_ONE) gameObj._turn = PLAYER_TWO;
    delete gameObj.PLAYER_ONE;
  } else if (PLAYER_TWO === name) {
    if (gameObj._turn === PLAYER_TWO) gameObj._turn = PLAYER_ONE;
    delete gameObj.PLAYER_TWO;
  }

  // reset board to its initial state
  gameObj.draw = false;
  gameObj.winner = null;
  gameObj.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  return new Promise((resolve, reject) => {
    database
      .ref(roomID)
      .set(gameObj)
      .then(() => resolve({ roomID }))
      .catch((error) => reject(error));
  });
};

const sendData = async (roomID, data) => {
  return new Promise((resolve, reject) => {
    database
      .ref(roomID)
      .set(data)
      .then(() => resolve(roomID))
      .catch((error) => reject(error));
  });
};

export { createRoom, joinRoom, sendData, leaveRoom };
