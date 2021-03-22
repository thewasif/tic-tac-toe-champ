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
  gameObj.PLAYER_TWO = name;

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

export { createRoom, joinRoom, sendData };
