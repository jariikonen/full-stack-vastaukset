import { NewPatientEntry, Gender, Entry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseStringField = (value: unknown, field: string): string => {
  if (!isString(value)) {
    throw new Error(`Incorrect or missing ${field}.`);
  }

  return value;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date + ".");
  }

  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender.");
  }

  return gender;
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data.");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object &&
    "entries" in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseStringField(object.name, "name"),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseStringField(object.ssn, "ssn"),
      gender: parseGender(object.gender),
      occupation: parseStringField(object.occupation, "occupation"),
      entries: object.entries as Entry[],
    };

    return newEntry;
  }

  throw new Error("Incorrect data: a field is missing.");
};

export default toNewPatientEntry;
