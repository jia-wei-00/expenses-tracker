import { combineReducers } from "redux";
import userReducer from "./userReducer";
import recordReducer from "./recordReducer";

const rootReducer = combineReducers({
  userState: userReducer,
  recordState: recordReducer,
});

export default rootReducer;
