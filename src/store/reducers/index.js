import { combineReducers } from "redux";
import authReducer from "./authReducer";
// import mapReducer from "./mapReducer";
// import profileReducer from "./profileReducer";
// import postCreateReducer from "./postCreateReducer";
// import postEditReducer from "./postEditReducer";
// import currentSessionReducer from "./currentSessionReducer";
import { LOGOUT_USER } from "../constants";

const allReducers = combineReducers({
  user: authReducer,
  // map: mapReducer,
  // profile: profileReducer,
  // postCreate: postCreateReducer,
  // postEdit: postEditReducer,
  // currentSession: currentSessionReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_USER) {
    return allReducers(undefined, action);
  }

  return allReducers(state, action);
};

export default rootReducer;
