import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ filterHandler }) =>
  <form>
    <div>
      filter shown with: <input onChange={filterHandler} />
    </div>
  </form>

const PersonForm = ({
    submitHandler, newNameState, nameChangeHandler,
    newNumberState, numberChangeHandler
}) =>
  <form onSubmit={submitHandler}>
    <div>
      name: <input
        value={newNameState}
        onChange={nameChangeHandler}
      />
    </div>
    <div>
      number: <input
        value={newNumberState}
        onChange={numberChangeHandler}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Persons = ({ persons }) =>
  <>
    {persons.map(person =>
      <div key={person.name}>{person.name} {person.number}</div>
    )}
  </>

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])
  const [filterValue, setFilterValue] = useState('')

  useEffect (() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setPersonsToShow(initialPersons)
      })
  }, [])
  console.log(
    'render', personsToShow.length,
    'personsToShow:', personsToShow,
    'all persons:', persons)

  const addPerson = (event) => {
    event.preventDefault()

    const found = persons.find(person =>
      person.name === newName
    )
    if (found) {
      alert(`${newName} is already in the phonebook`)
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          console.log('added new person:', returnedPerson)

          const show = returnedPerson.name.toLowerCase().includes(
            filterValue.toLowerCase()
          )
          if (show) {
            console.log('new person is shown')
            setPersonsToShow(personsToShow.concat(returnedPerson))
          }
          else {
            console.log('new person is not shown')
          }
        })
        .catch(error => {
          console.log(error)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) =>
    setNewName(event.target.value)

  const handleNumberChange = (event) =>
    setNewNumber(event.target.value)
  
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    const found = persons.filter(person =>
      person.name.toLowerCase().includes(
        event.target.value.toLowerCase()
    ))
    setPersonsToShow(found)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filterHandler={handleFilterChange}
      />

      <h2>Add new contact</h2>
      <PersonForm
        submitHandler={addPerson}
        newNameState={newName}
        nameChangeHandler={handleNameChange}
        newNumberState={newNumber}
        numberChangeHandler={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )

}

export default App
