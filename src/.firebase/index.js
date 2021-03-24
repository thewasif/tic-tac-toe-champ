import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBc41Z0f4aKIItvk4Vxnml7oPjxT66Nkqc',
  authDomain: 'tic-tac-champ.firebaseapp.com',
  databaseURL: 'https://tic-tac-champ-default-rtdb.firebaseio.com',
  projectId: 'tic-tac-champ',
  storageBucket: 'tic-tac-champ.appspot.com',
  messagingSenderId: '195257038336',
  appId: '1:195257038336:web:2e4a92a3479cf3da3a4ae5',
  measurementId: 'G-9JXJ5EFLWZ',
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const firestore = firebase.firestore();

export { database, firestore };
