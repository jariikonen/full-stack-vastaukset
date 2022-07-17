import { useState } from 'react';

const Button = ({ clickHandler, text }) =>
  <button onClick={clickHandler}>{text}</button>;

const MostVotes = ({ text, votes }) => {
  console.log('MostVotes: text:', text, 'votes:', votes)

  if ( votes > 0 ) {
    return (
      <>
        <div>{text}</div>
        <div>has {votes} votes</div>
      </>
    )
  }

  return <div>{text}</div>
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ];
   
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Uint8Array(7))

  const getRndInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) ) + min;
  
  const getNewAnecdoteIndex = () => {
    let anecInd = getRndInt(0, 6);

    while (anecInd === selected) {
      anecInd = getRndInt(0, 6);
    }

    return anecInd;
  }

  const handler = (stateFunction, newState) => () =>
    stateFunction(newState);

  const anecdoteIndex = getNewAnecdoteIndex();
  const copyPoints = [...points];
  copyPoints[selected] += 1;
  
  const maxVotes = Math.max(...points);
  let mostVotesStr = 'No votes given';
  if ( maxVotes > 0 ) {
    const mostVotes = points.indexOf(maxVotes);
    mostVotesStr = anecdotes[mostVotes];
  }

  console.log('points:', points, 'copyPoints:', copyPoints);

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>has {points[selected]} votes</div>
      <Button clickHandler={handler(setPoints, copyPoints)} text='vote' />
      <Button clickHandler={handler(setSelected, anecdoteIndex)} text='next anecdote' />
      <h2>Anecdote with most votes</h2>
      <MostVotes text={mostVotesStr} votes={maxVotes} />
    </div>
  )
}

export default App
