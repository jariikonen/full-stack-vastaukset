import axios from "axios";
import { DiagnosisEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<DiagnosisEntry[]>(`${apiBaseUrl}/diagnoses`);

  return data;
};

const diagnosesService = {
  getAll,
};

export default diagnosesService;
