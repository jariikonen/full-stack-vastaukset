import { useState } from "react";
import { DiaryEntry, Weather, Visibility } from "../types";
import { isAxiosError } from "axios";
import diaryService from "../services/diary";

interface DiaryFormProps {
  diaries: DiaryEntry[];
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
}

const DiaryForm = (props: DiaryFormProps): JSX.Element => {
  const [notification, setNotification] = useState<string | null>(null);

  const displayNotification = (message: string, seconds = 10) => {
    setNotification(message);
    setTimeout(() => setNotification(null), seconds * 1000);
  }

  const addNewEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      date: { value: string };
      weather: { value: string };
      visibility: { value: string };
      comment: { value: string };
    };

    const newEntry = {
      date: target.date.value,
      weather: target.weather.value,
      visibility: target.visibility.value,
      comment: target.comment.value,
    };

    interface ValidationError {
      message: string;
      errors: Record<string, string[]>;
    }

    diaryService
      .createEntry(newEntry)
      .then((receivedEntry: DiaryEntry) => {
        props.setDiaries(props.diaries.concat(receivedEntry));
        target.date.value = new Date().toJSON().slice(0, 10);
        target.weather.value = "sunny";
        target.visibility.value = "ok";
        target.comment.value = "";
      })
      .catch((error) => {
        let errorMessage = "Something went wrong.";
        if (error instanceof Error) {
          errorMessage += " Error: " + error.message;
        }
        if (isAxiosError<ValidationError, Record<string, unknown>>(error)) {
          if (typeof error.response === "object"
            && error.response.data
            && typeof error.response.data === "string"
          ) {
            displayNotification(error.response.data);
          } else {
            displayNotification(errorMessage);
          }
        }
      });
  }

  const currentDate = new Date().toJSON().slice(0, 10);

  return (
    <>
      <h2>Add new entry</h2>
      {notification && (
        <div style={{ color: "red", marginBottom: 20 }}>{notification}</div>
      )}
      <form onSubmit={addNewEntry}>
        <div>
          <label>
            date: <input type="date" name="date" defaultValue={currentDate} />
          </label>
        </div>
        <div>
          <label>
            weather:{" "}
            {(Object.keys(Weather) as (keyof typeof Weather)[]).map((key) => {
              let checked = false;
              if (key === "Sunny") {
                checked = true;
              }
              return (
              <label key={key}>
                {Weather[key]}{" "}
                <input type="radio" name="weather" value={Weather[key]} defaultChecked={checked} />
              </label>
            )})}
          </label>
        </div>
        <div>
          <label>
            visibility:{" "}
            {(Object.keys(Visibility) as (keyof typeof Visibility)[]).map((key) => {
              let checked = false;
              if (key === "Ok") {
                checked = true;
              }
              return (
              <label key={Visibility[key]}>
                {Visibility[key]}{" "}
                <input type="radio" name="visibility" value={Visibility[key]} defaultChecked={checked} />
              </label>
            )})}
          </label>
        </div>
        <div>
          <label>
            comment: <input type="text" name="comment" />
          </label>
        </div>
        <button type="submit">add</button>
      </form>
    </>
  )
};

export default DiaryForm;
