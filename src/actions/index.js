import { auth } from "../firebase";
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

export function postRecord(payload) {
  return (dispatch) => {
    db.collection(payload.date).add({
      type: payload.type,
      name: payload.name,
      amount: payload.amount,
      timestamp: payload.timestamp,
    });
  };
}

export function getRecordAPI(data) {
  return (dispatch) => {
    let payload;

    db.collection(data)
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

    db.collection(data)
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
    await db.collection(payload.date).doc(payload.id).delete();
    dispatch(getRecord(payload));
  };
}

export function updateRecordAPI(payload) {
  return async (dispatch) => {
    await db.collection(payload.date).doc(payload.id).update({
      name: payload.name,
      amount: payload.amount,
    });
    dispatch(getRecord(payload));
  };
}
