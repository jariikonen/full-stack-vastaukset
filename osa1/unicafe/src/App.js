import {useState} from 'react'

const Button = ({ handleClick, text }) =>
  <button onClick={handleClick}>{text}</button>

const Statistics = ({ good, neutral, bad }) => {
  const all=good+neutral+bad
  const average=(good*1+bad*(-1))/all
  const positive=good/all

  if ( all > 0 ) {
    return (
      <>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>
        <p>all {all}</p>
        <p>average {average.toFixed(2)}</p>
        <p>positive {(positive*100).toFixed(1)}%</p>
      </>
    )
  }

  return (
    <p>No feedback given</p>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handler = (stateFunction, newState) => () =>
    stateFunction(newState)

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={handler(setGood, good+1)} text='good' />
      <Button handleClick={handler(setNeutral, neutral+1)} text='neutral' />
      <Button handleClick={handler(setBad, bad+1)} text='bad' />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
