export const SET_USER = "SET_USER";
export const SET_USER_ID = "SET_USER_ID";
export const SET_TOKEN = "SET_TOKEN";
export const SET_LOCATION = "SET_LOCATION";

interface Payload {
  token: any;
  userId: any;
  lat: any;
  lon: any;
}
interface LocationPayload {
  lat: number;
  lon: number;
}

export function setUser(payload: Payload) {
  return { type: SET_USER, payload: payload };
}

export function setUserId(userId: any) {
  return { type: SET_USER_ID, payload: { userId } };
}

export function setToken(token: string) {
  return { type: SET_TOKEN, payload: { token } };
}

export function setLocation({ lat, lon }: LocationPayload) {
  return { type: SET_LOCATION, payload: { lat, lon } };
}
