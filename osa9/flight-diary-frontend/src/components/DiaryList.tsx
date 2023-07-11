import { DiaryEntry } from "../types";

interface DiaryListProps {
  diaries: DiaryEntry[];
}

const DiaryList = (props: DiaryListProps): JSX.Element => (
  <>
    <h2>Diary entries</h2>
    {props.diaries.map((diary) =>
      <div key={diary.id}>
        <h3>{diary.date}</h3>
        <div>weather: {diary.weather}</div>
        <div>visibility: {diary.visibility}</div>
        <div>comment: {diary.comment}</div>
      </div>    
    )}
  </>
);

export default DiaryList;
