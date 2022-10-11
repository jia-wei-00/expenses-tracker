import db, { auth, fieldValue } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  SET_USER,
  GET_RECORD,
  SET_LOADING,
  GET_HISTORY,
  GET_TODO_RECORD,
  GET_TODO_RECORD_ARRAY,
} from "./actionType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const setLoading = (payload) => ({
  type: SET_LOADING,
  payload: payload,
});

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

export const getTodoRecordArray = (payload) => ({
  type: GET_TODO_RECORD_ARRAY,
  payload: payload,
});

export const setUser = (payload) => ({
  type: SET_USER,
  payload: payload,
});

export function resetPassword(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    await toast.promise(
      sendPasswordResetEmail(auth, payload).then((error) => {
        dispatch(setLoading(false));
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

export function postRecordArrayAPI(payload) {
  return (dispatch) => {
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));

    if (payload.exists > 0) {
      db.collection("expense__tracker")
        .doc(payload.user)
        .collection("todo__list")
        .doc("todo__array")
        .update({
          todo__array: fieldValue.arrayUnion({
            text: payload.text,
            timestamp: payload.timestamp,
          }),
        })
        .then((success) => {
          toast.update(id, {
            render: "Successfully Add Data",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          dispatch(setLoading(false));
          console.log("gotdata");
          dispatch(getTodoRecordArrayApi(payload.user));
        })
        .catch((error) => {
          console.log(error.message);
          toast.update(id, {
            render: error.message,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          dispatch(setLoading(false));
        });
    } else {
      db.collection("expense__tracker")
        .doc(payload.user)
        .collection("todo__list")
        .doc("todo__array")
        .set({
          todo__array: fieldValue.arrayUnion({
            text: payload.text,
            timestamp: payload.timestamp,
          }),
        })
        .then((success) => {
          toast.update(id, {
            render: "Successfully Add Data",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          dispatch(setLoading(false));
          console.log("nodata");
          dispatch(getTodoRecordArrayApi(payload.user));
        })
        .catch((error) => {
          console.log(error.message);
          toast.update(id, {
            render: error.message,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          dispatch(setLoading(false));
        });
    }
  };
}

export function updateTodoRecordArray(payload) {
  return (dispatch) => {
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));

    db.collection("expense__tracker")
      .doc(payload.user)
      .collection("todo__list")
      .doc("todo__array")
      .update({
        todo__array: payload.array,
      })
      .then((success) => {
        toast.update(id, {
          render: "Successfully Update Data",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
        dispatch(getTodoRecordArrayApi(payload.user));
      })
      .catch((error) => {
        console.log(error.message);
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      });
  };
}

export function postTodoRecordAPI(payload) {
  return (dispatch) => {
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));
    db.collection("expense__tracker")
      .doc(payload.user)
      .collection("todo__list")
      .add({
        text: payload.text,
        timestamp: payload.timestamp,
      })
      .then((success) => {
        toast.update(id, {
          render: "Successfully Add Data",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      });
  };
}

export function getTodoRecordAPI(data) {
  return (dispatch) => {
    let payload;

    db.collection("expense__tracker")
      .doc(data.user)
      .collection("todo__list")
      .orderBy("index", "asc")
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

export function getTodoRecordArrayApi(data) {
  return (dispatch) => {
    let payload;
    db.collection("expense__tracker")
      .doc(data.user)
      .collection("todo__list")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => {
          return doc.data();
        });
        dispatch(getTodoRecordArray(payload));
      });
  };
}

export function deleteTodoRecordAPI(payload) {
  return async (dispatch) => {
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));

    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection("todo__list")
      .doc(payload.id)
      .delete()
      .then((success) => {
        toast.update(id, {
          render: "Successfully Delete Data",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
        dispatch(getRecord(payload));
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      });
  };
}

export function updateTodoRecordAPI(payload) {
  return async (dispatch) => {
    const id = toast.loading("Please wait...");

    dispatch(setLoading(true));
    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection("todo__list")
      .doc(payload.id)
      .update({
        text: payload.text,
      })
      .then((success) => {
        toast.update(id, {
          render: "Successfully Update Data",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
        dispatch(getRecord(payload));
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      });
  };
}

export function postRecord(payload) {
  return (dispatch) => {
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));

    db.collection("expense__tracker")
      .doc(payload.user)
      .collection(payload.date)
      .add({
        type: payload.type,
        name: payload.name,
        amount: payload.amount,
        category: payload.category,
        timestamp: payload.timestamp,
      })
      .then((success) => {
        toast.update(id, {
          render: "Successfully Add Data",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
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
  return async (dispatch) => {
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));
    auth
      .signInWithEmailAndPassword(data.username, data.password)
      .then((auth) => {
        toast.update(id, {
          render: "Welcome " + auth.user.email,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));

        dispatch(setUser(auth.user));
      })
      .catch((error) => {
        dispatch(setLoading(false));
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      });
  };
}

export function signOutAPI() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    await toast.promise(
      auth
        .signOut()
        .then(() => {
          dispatch(setUser(null));
          dispatch(setLoading(false));
        })
        .catch((error) => {
          dispatch(setLoading(false));
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
      .orderBy("timestamp", "desc")
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
      .orderBy("timestamp", "desc")
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
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));

    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection(payload.date)
      .doc(payload.id)
      .delete()
      .then((success) => {
        toast.update(id, {
          render: "Successfully Delete Data",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
        dispatch(getRecord(payload));
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      });
  };
}

export function updateRecordAPI(payload) {
  return async (dispatch) => {
    const id = toast.loading("Please wait...");
    dispatch(setLoading(true));

    await db
      .collection("expense__tracker")
      .doc(payload.user)
      .collection(payload.date)
      .doc(payload.id)
      .update({
        name: payload.name,
        amount: payload.amount,
        category: payload.category,
      })
      .then((success) => {
        toast.update(id, {
          render: "Successfully Update Data",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
        dispatch(getRecord(payload));
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        dispatch(setLoading(false));
      });
  };
}
