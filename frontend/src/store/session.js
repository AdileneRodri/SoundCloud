import { csrfFetch } from "./csrf";

const initialState = { user: null };

export const SET_SESSION_USER = "session/setUser";
export const REMOVE_SESSION_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_SESSION_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_SESSION_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  // get user that just logged in
  const res = await csrfFetch('/api/currentUser/login', {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await res.json();
  dispatch(setUser(data));
  return res;
};

const sessionReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case SET_SESSION_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_SESSION_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
