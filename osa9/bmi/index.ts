import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    const bmi = calculateBmi(Number(height), Number(weight));
    res.json({
      heigth: Number(height),
      weight: Number(weight),
      bmi,
    });
  } else {
    res.status(400).send({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({
      error: 'parameters missing',
    });
  }

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).send({
      error: 'malformatted parameters',
    });
  }

  const fouls = daily_exercises.filter((h) => isNaN(Number(h)));
  if (fouls.length > 0 || isNaN(Number(target))) {
    return res.status(400).send({
      error: 'malformatted parameters',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return res.json(calculateExercises(daily_exercises, target));
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
