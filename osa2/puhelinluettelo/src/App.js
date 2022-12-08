import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ filterHandler }) => (
  <form>
    <div>
      filter shown with: <input onChange={filterHandler} />
    </div>
  </form>
)

const PersonForm = ({
    submitHandler, newNameState, nameChangeHandler,
    newNumberState, numberChangeHandler
}) => (
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
)

const Person = ({ name, number, handleDelete }) => (
  <div>
    {name} {number} <button onClick={handleDelete}>Delete</button>
  </div>
)

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

  const showIfVisible = (person) => {
    const show = person.name.toLowerCase().includes(
      filterValue.toLowerCase()
    )
    if (show) {
      console.log(`person "${person.name}" is shown`)
      setPersonsToShow(personsToShow.concat(person))
    }
    else {
      console.log(`person "${person.name}" is not shown`)
    }
  }

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
        .createPerson(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          console.log('added new person:', returnedPerson)
          showIfVisible(returnedPerson)
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
    setPersonsToShow(persons.filter(person =>
      person.name.toLowerCase().includes(
        event.target.value.toLowerCase()
    )))
  }

  const handleDeleteOf = (id) => {
    const person = persons.find(person =>
      person.id === id
    )

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(returnedId => {
          setPersons(persons.filter(n => n.id !== id))
          setPersonsToShow(personsToShow.filter(n => n.id !== id))
        })
        .catch(error => {
          console.log(error)
        })
    }
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
        {personsToShow.map(person => {
          return (
            <Person
              key={person.id}
              name={person.name}
              number={person.number}
              handleDelete={() => handleDeleteOf(person.id)}
            />
          )}
        )}
    </div>
  )

}

export default App
