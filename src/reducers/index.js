import { combineReducers } from "redux";
import userReducer from "./userReducer";
import recordReducer from "./recordReducer";
import loadingReducer from "./loadingReducer";

const rootReducer = combineReducers({
  userState: userReducer,
  recordState: recordReducer,
  loadingState: loadingReducer,
});

export default rootReducer;
