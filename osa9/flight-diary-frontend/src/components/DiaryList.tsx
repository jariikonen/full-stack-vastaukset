import { DiaryEntry } from "../types";

interface DiaryListProps {
  diaries: DiaryEntry[];
}

const DiaryList = (props: DiaryListProps): JSX.Element => (
  <>
    <h2>Diary entries</h2>
    {props.diaries.map((diary) =>
      <div key={diary.date}>
        <h3>{diary.date}</h3>
        <p>visibility: {diary.visibility}</p>
        <p>weather: {diary.weather}</p>
      </div>    
    )}
  </>
);

export default DiaryList;
