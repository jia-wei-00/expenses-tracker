import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import db from "../firebase";
import {
  SET_USER,
  GET_RECORD,
  SET_LOADING,
  GET_HISTORY,
  GET_TODO_RECORD,
} from "./actionType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const getRecord = (payload) => ({
  type: GET_RECORD,
  payload: payload,
});

export const getHistory = (payload) => ({
  type: GET_HISTORY,
  payload: payload,
});

export const getTodoRecord = (payload) => ({
  type: GET_TODO_RECORD,
  payload: payload,
});

export const setUser = (payload) => ({
  type: SET_USER,
  payload: payload,
});

export function resetPassword(payload) {
  return async (dispatch) => {
    await toast.promise(
      sendPasswordResetEmail(auth, payload).then((error) => {
        console.log(error);
      }),
      {
        pending: "Loading... Please wait",
        success: "Success please check your email inbox and spam",
        error: "Error occur 🤯",
        theme: "dark",
      }
    );
  };
}

export function postTodoRecordAPI(payload) {
  return (dispatch) => {
    db.collection("expense__tracker")
      .doc(payload.user)
      .collection("todo__list")
      .add({
        text: payload.text,
        timestamp: payload.timestamp,
      });
  };
}

export function getTodoRecordAPI(data) {
  return (dispatch) => {
    let payload;

    db.collection("expense__tracker")
      .doc(data.user)
      .collection("todo__list")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch(getTodoRecord(payload));
      });
  };
}

export function deleteTodoRecordAPI(payload) {
  return async (dispatch) => {
    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection("todo__list")
      .doc(payload.id)
      .delete();

    dispatch(getRecord(payload));
  };
}

export function updateTodoRecordAPI(payload) {
  return async (dispatch) => {
    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection("todo__list")
      .doc(payload.id)
      .update({
        text: payload.text,
      });
    dispatch(getRecord(payload));
  };
}

export function postRecord(payload) {
  return (dispatch) => {
    db.collection("expense__tracker")
      .doc(payload.user)
      .collection(payload.date)
      .add({
        type: payload.type,
        name: payload.name,
        amount: payload.amount,
        category: payload.category,
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

// export function signInAPI(data) {
//   return async (dispatch) => {
//     await toast.promise(
//       auth
//         .signInWithEmailAndPassword(data.username, data.password)
//         .then((auth) => {
//           dispatch(setUser(auth.user));
//         }),
//       // .catch((error) => console.log(error.message)),
//       {
//         pending: "Loading... Please wait",
//         success: "Welcome",
//         error: "Invalid username or password",
//         theme: "dark",
//       }
//     );
//   };
// }

export function signInAPI(data) {
  return async (dispatch) => {
    const id = toast.loading("Please wait...");
    auth
      .signInWithEmailAndPassword(data.username, data.password)
      .then((auth) => {
        toast.update(id, {
          render: "Welcome " + auth.user.email,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setUser(auth.user));
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      });
  };
}

export function signOutAPI() {
  return async (dispatch) => {
    await toast.promise(
      auth
        .signOut()
        .then(() => {
          dispatch(setUser(null));
        })
        .catch((error) => {
          console.log(error.message);
        }),
      {
        pending: "Loading... Please wait",
        success: "Success Logout",
        error: "Error occur 🤯",
        theme: "dark",
      }
    );
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
        category: payload.category,
      });
    dispatch(getRecord(payload));
  };
}
