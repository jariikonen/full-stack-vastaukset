interface Rating {
  rating: number;
  ratingDescription: string;
}

interface CalculatorResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const rate = (average: number, target: number): Rating => {
  if (average < target / 2) {
    return {
      rating: 1,
      ratingDescription: 'goal was not met, you should try a bit harder',
    };
  } else if (average < target) {
    return {
      rating: 2,
      ratingDescription: 'not too bad but could be better',
    };
  } else {
    return {
      rating: 3,
      ratingDescription: 'goal was met, you can congratulate yourself',
    };
  }
};

const calculateExercises = (
  hours: number[],
  target: number
): CalculatorResult => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((h) => h > 0).length;
  const average = hours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  const { rating, ratingDescription } = rate(average, target);

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

interface ExerciseValues {
  target: number;
  hours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const [target, ...hours] = args.slice(2);
  const fouls = hours.filter((h) => isNaN(Number(h)));

  if (!isNaN(Number(target)) && fouls.length === 0) {
    return {
      target: Number(target),
      hours: hours.map((h) => Number(h)),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { target, hours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
