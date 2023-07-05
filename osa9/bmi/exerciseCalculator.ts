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

export const calculateExercises = (
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
