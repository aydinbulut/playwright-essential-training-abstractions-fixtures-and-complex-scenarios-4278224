import { randomValueFromArray } from "./arrays";

export function randomState() {
  const states = ["Alabama", "Alaska", "Arizona"];
  return randomValueFromArray(states);
}