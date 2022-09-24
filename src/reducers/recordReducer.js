import {
  GET_RECORD,
  GET_HISTORY,
  GET_TODO_RECORD,
} from "../actions/actionType";

export const iniState = {
  record: [],
  history: [],
  todoRecord: [],
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
    default:
      return state;
  }
};

export default recordReducer;
