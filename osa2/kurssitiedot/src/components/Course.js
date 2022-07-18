const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => {
  const total = parts.reduce(
    (sum, part) =>
      sum + part.exercises,
    0
  )

  return (
    <p><b>total of {total} excercises</b></p>
  )
}

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) =>
  <>
    {parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </>

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
