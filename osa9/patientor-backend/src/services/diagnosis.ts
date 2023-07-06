import diagnoses from "../../data/diagnoses";
import { DiagnosisEntry } from "../types";

const getEntries = (): DiagnosisEntry[] => {
  return diagnoses;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary,
};
