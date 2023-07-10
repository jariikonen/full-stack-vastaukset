import { useEffect, useState } from "react";
import { DiaryEntry } from "./types";
import diaryService from "./services/diary";
import DiaryList from "./components/DiaryList";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  
  useEffect(() => {
    diaryService.getAll().then((diaries) => setDiaries(diaries));
  }, []);

  return (
    <>
      <h1>Flight diary</h1>
      <DiaryList diaries={diaries} />
    </>
  );
};

export default App;
