import {
  GET_RECORD,
  GET_HISTORY,
  GET_TODO_RECORD,
  GET_TODO_RECORD_ARRAY,
  SET_ARRAY,
} from "../actions/actionType";

export const iniState = {
  record: [],
  history: [],
  todoRecord: [],
  todoRecordArray: [],
  setArray: [],
};

const recordReducer = (state = iniState, action) => {
  switch (action.type) {
    case GET_RECORD:
      return {
        ...state,
        record: action.payload,
      };
    case GET_HISTORY:
      return {
        ...state,
        history: action.payload,
      };
    case GET_TODO_RECORD:
      return {
        ...state,
        todoRecord: action.payload,
      };
    case GET_TODO_RECORD_ARRAY:
      return {
        ...state,
        todoRecordArray: action.payload,
      };
    case SET_ARRAY:
      return {
        ...state,
        setArray: action.payload,
      };
    default:
      return state;
  }
};

export default recordReducer;
