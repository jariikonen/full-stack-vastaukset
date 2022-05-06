const Header = (props) => (
  <div>
    <h1>{props.course}</h1>
  </div>
)

const Content = (props) => (
  <>
    <p>{props.parts[0]} {props.exerciseCounts[0]}</p>
    <p>{props.parts[1]} {props.exerciseCounts[1]}</p>
    <p>{props.parts[2]} {props.exerciseCounts[2]}</p>
  </>
)

const Total = (props) => (
  <p>Number of exercises {props.exercises}</p>
)

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const parts = [part1, part2, part3]
  const exerciseCounts = [exercises1, exercises2, exercises3]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} exerciseCounts={exerciseCounts} />
      <Total exercises={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App
