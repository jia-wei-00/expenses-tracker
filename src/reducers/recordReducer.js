import { GET_RECORD } from "../actions/actionType";

export const iniState = {
  record: [],
};

const recordReducer = (state = iniState, action) => {
  switch (action.type) {
    case GET_RECORD:
      return {
        ...state,
        record: action.payload,
      };
    default:
      return state;
  }
};

export default recordReducer;
