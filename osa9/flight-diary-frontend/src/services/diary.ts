import axios from "axios";
import { DiaryEntry } from "../types";
import toNewDiaryEntry from "../utils";

const baseUrl = "http://localhost:3001/api/diaries";

const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  const entries: DiaryEntry[] = response.data.map((entry) => {
    const diaryEntry = toNewDiaryEntry(entry) as DiaryEntry;
    diaryEntry.id = entry.id;
    return diaryEntry;
  });
  return entries;
};

const createEntry = (entry: object): Promise<DiaryEntry> => {
  return axios.post(baseUrl, entry).then((response) => response.data);
};

export default {
  getAll,
  createEntry,
};
