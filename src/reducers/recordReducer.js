import { GET_RECORD, GET_HISTORY } from "../actions/actionType";

export const iniState = {
  record: [],
  history: [],
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
    default:
      return state;
  }
};

export default recordReducer;
