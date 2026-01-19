import { randomValueFromArray } from "@helpers/arrays";

export function randomState() {
  const states = ["Alabama", "Alaska", "Arizona"];
  return randomValueFromArray(states);
}
