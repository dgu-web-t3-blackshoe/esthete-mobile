import { Dimensions } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");
export const ROTATION = -90;
export const TRANSLATION_X_CLAMP = 70;
export const MARGIN_LEFT = 34;
export const MARGIN_TOP_BTN = 32;

export const GenreArray = [
  "Portrait",
  "Landscape",
  "Street",
  "Food",
  "Travel",
  "Fashion",
  "Architectural",
  "Night",
  "Sports",
  "Journalism",
  "Wildlife",
  "Fine-art",
];

export const genre = {
  Portrait: "e4302d24-2199-11ee-9ef2-0a0027000003",
  Landscape: "e43030eb-2199-11ee-9ef2-0a0027000003",
  Street: "e4303240-2199-11ee-9ef2-0a0027000003",
  Food: "e43032aa-2199-11ee-9ef2-0a0027000003",
  Travel: "e43032fb-2199-11ee-9ef2-0a0027000003",
  Fashion: "e430334a-2199-11ee-9ef2-0a0027000003",
  Architectural: "e4303394-2199-11ee-9ef2-0a0027000003",
  Night: "e43033e6-2199-11ee-9ef2-0a0027000003",
  Sports: "e4303432-2199-11ee-9ef2-0a0027000003",
  Journalism: "e4303475-2199-11ee-9ef2-0a0027000003",
  Wildlife: "e43034b6-2199-11ee-9ef2-0a0027000003",
  FineArt: "e43034f7-2199-11ee-9ef2-0a0027000003",
};

export const getGenreKeyByValue = (value:string) => {
  return Object.keys(genre).find(key => genre[key] === value);
};

export const getGenreValueByKey = (key:string) => {
  return genre[key];
};
