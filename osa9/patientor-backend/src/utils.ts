import {
  NewPatientEntry,
  Gender,
  NewEntry,
  Entry,
  NewHealthCheckEntry,
  HealthCheckRating,
  NewBaseEntry,
  DiagnosisEntry,
  NewOccupationalHealthcareEntry,
  NewHospitalEntry,
  SickLeave,
  Discharge,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseStringField = (value: unknown, field: string): string => {
  if (!isString(value)) {
    throw new Error(`Incorrect field: ${field} is not a string.`);
  }

  if (value.length === 0) {
    throw new Error(`Incorrect field: ${field} is empty.`);
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

const isEntryType = (
  entryType: unknown
): entryType is "HealthCheck" | "OccupationalHealthcare" | "Hospital" => {
  if (
    !isString(entryType) ||
    (entryType !== "HealthCheck" &&
      entryType !== "OccupationalHealthcare" &&
      entryType !== "Hospital")
  ) {
    throw new Error(`Incorrect entry type ${JSON.stringify(entryType)}.`);
  }
  return true;
};

const toNewBaseEntry = (object: object): NewBaseEntry => {
  const baseObject = object;

  if (
    !(
      "description" in baseObject &&
      "date" in baseObject &&
      "specialist" in baseObject
    )
  ) {
    throw new Error("Incorrect base-entry: missing field");
  }

  const newBaseEntry: NewBaseEntry = {
    description: parseStringField(baseObject.description, "description"),
    date: parseDate(baseObject.date),
    specialist: parseStringField(baseObject.specialist, "specialist"),
  };

  if ("diagnosisCodes" in object) {
    newBaseEntry.diagnosisCodes = object.diagnosisCodes as Array<
      DiagnosisEntry["code"]
    >; // EI TARKISTETA!
  }

  return newBaseEntry;
};

const isHealthCheckEntry = (num: number): num is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(num);
};

const parseHealthCheckRating = (param: unknown): HealthCheckRating => {
  const num = isString(param) ? Number(param) : param;
  if (
    typeof num !== "number" ||
    !Number.isInteger(num) ||
    !isHealthCheckEntry(num)
  ) {
    throw new Error("Incorrect health check rating");
  }

  return num;
};

const toNewHealthCheckEntry = (object: object): NewHealthCheckEntry => {
  const newEntry = toNewBaseEntry(object) as NewHealthCheckEntry;
  if (!("healthCheckRating" in object)) {
    throw new Error("Incorrect health-check-entry");
  }

  newEntry.type = "HealthCheck";
  newEntry.healthCheckRating = parseHealthCheckRating(object.healthCheckRating);
  return newEntry;
};

const toNewOccupationalHealthcareEntry = (
  object: object
): NewOccupationalHealthcareEntry => {
  const newEntry = toNewBaseEntry(object) as NewOccupationalHealthcareEntry;
  if (!("employerName" in object)) {
    throw new Error("Incorrect occupational-healthcare-entry");
  }

  newEntry.type = "OccupationalHealthcare";
  newEntry.employerName = object.employerName as string; // EI TARKISTETA!

  if ("sickLeave" in object) {
    newEntry.sickLeave = object.sickLeave as SickLeave; // EI TARKISTETA!
  }

  return newEntry;
};

const toNewHospitalEntry = (object: object): NewHospitalEntry => {
  const newEntry = toNewBaseEntry(object) as NewHospitalEntry;
  if (!("discharge" in object)) {
    throw new Error("Incorrect hospital-entry");
  }

  newEntry.type = "Hospital";
  newEntry.discharge = object.discharge as Discharge; // EI TARKISTETA!

  return newEntry;
};

// Helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Missing or incorrect entry.");
  }

  if ("type" in object) {
    if (!isEntryType(object.type)) {
      throw new Error("Incorrect entry type");
    }

    switch (object.type) {
      case "HealthCheck":
        return toNewHealthCheckEntry(object);
      case "OccupationalHealthcare":
        return toNewOccupationalHealthcareEntry(object);
      case "Hospital":
        return toNewHospitalEntry(object);
      default:
        return assertNever(object.type);
    }
  }

  throw new Error("Incorrect data: a field is missing.");
};

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data.");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseStringField(object.name, "name"),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseStringField(object.occupation, "occupation"),
    };

    if ("ssn" in object) {
      newEntry.ssn = parseStringField(object.ssn, "ssn");
    }

    if ("entries" in object) {
      if (!Array.isArray(object.entries)) {
        throw new Error("Incorrect entries field: not an array");
      }

      const entries: Entry[] = object.entries.map((e: unknown) => {
        const entry = toNewEntry(e) as Entry;
        if (!e || typeof e !== "object" || !("id" in e)) {
          throw new Error("Incorrect entry: missing id");
        }
        entry.id = e.id as string; // EI TARKISTETA
        return entry;
      });

      newEntry.entries = entries;
    } else {
      newEntry.entries = [];
    }

    return newEntry;
  }

  throw new Error("Incorrect data: a field is missing.");
};
