import { SET_USER, SET_TOKEN, SET_USER_ID, SET_LOCATION } from "./actions";

export interface State {
  TOKEN: any;
  USER: any;
  location: {
    lat: number | null;
    lon: number | null;
  };
}

interface Action {
  type: string;
  payload: any;
}

const initialState: State = {
  TOKEN: null,
  USER: null,
  location: { lat: null, lon: null },
};

function rootReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        TOKEN: action.payload.token,
        USER: action.payload.userId,
      };
    case SET_TOKEN:
      return { ...state, TOKEN: action.payload.token };
    case SET_USER_ID:
      return { ...state, USER: action.payload.userId };
    case SET_LOCATION:
      return {
        ...state,
        location: {
          lat: action.payload.lat,
          lon: action.payload.lon,
        },
      };
    default:
      return state;
  }
}

export default rootReducer;
