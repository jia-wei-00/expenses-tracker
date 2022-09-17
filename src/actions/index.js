import { auth } from "../firebase";
import { getAuth } from "firebase/auth";
import db from "../firebase";
import { SET_USER, GET_RECORD, SET_LOADING, GET_HISTORY } from "./actionType";

export const getRecord = (payload) => ({
  type: GET_RECORD,
  payload: payload,
});

export const getHistory = (payload) => ({
  type: GET_HISTORY,
  payload: payload,
});

export const setUser = (payload) => ({
  type: SET_USER,
  payload: payload,
});

export function postRecord(payload) {
  return (dispatch) => {
    db.collection("expense__tracker")
      .doc(payload.user)
      .collection(payload.date)
      .add({
        type: payload.type,
        name: payload.name,
        amount: payload.amount,
        timestamp: payload.timestamp,
      });
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signInAPI(data) {
  return (dispatch) => {
    auth
      .signInWithEmailAndPassword(data.username, data.password)
      .then((auth) => {
        dispatch(setUser(auth.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function getRecordAPI(data) {
  return (dispatch) => {
    let payload;

    db.collection("expense__tracker")
      .doc(data.user)
      .collection(data.date)
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch(getRecord(payload));
      });
  };
}

export function getHistoryAPI(data) {
  return (dispatch) => {
    let payload;

    db.collection("expense__tracker")
      .doc(data.user)
      .collection(data.date)
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch(getHistory(payload));
      });
  };
}

export function deleteRecordAPI(payload) {
  return async (dispatch) => {
    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection(payload.date)
      .doc(payload.id)
      .delete();

    dispatch(getRecord(payload));
  };
}

export function updateRecordAPI(payload) {
  return async (dispatch) => {
    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection(payload.date)
      .doc(payload.id)
      .update({
        name: payload.name,
        amount: payload.amount,
      });
    dispatch(getRecord(payload));
  };
}
