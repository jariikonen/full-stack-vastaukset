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
    submitHandler,
    newNameState,
    nameChangeHandler,
    newNumberState,
    numberChangeHandler
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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

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

  const setNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const clearLists = (id) => {
    setPersons(persons.filter(n => n.id !== id))
    setPersonsToShow(personsToShow.filter(n => n.id !== id))
  }

  const createPerson = (newPerson) => {
    personService
        .createPerson(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showIfVisible(returnedPerson)
          setNewName('')
          setNewNumber('')
          setNotification(
            `Added ${returnedPerson.name} to the phonebook`,
            'success'
          )
          console.log('added new person:', returnedPerson)
        })
        .catch(error => {
          setNotification(error.message, 'error')
          console.log(error)
        })
  }

  const updatePerson = (newPerson) => {
    personService
        .updatePerson(newPerson.id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id !== newPerson.id ? person : newPerson
          ))
          setPersonsToShow(persons.map(person =>
            person.id !== newPerson.id ? person : newPerson
          ))
          setNewName('')
          setNewNumber('')
          setNotification(
            `Updated number for ${returnedPerson.name}`,
            'success'
          )
          console.log('updated person:', returnedPerson)
        })
        .catch(error => {
          if (error.code === 'ERR_BAD_REQUEST') {
            setNotification(
              `Update failed, ${newPerson.name} has been removed from the ` +
                'server',
              'error')
            clearLists(newPerson.id)
          }
          else {
            setNotification(error.message, 'error')
          }
          console.log(error)
        })
  }

  const addPerson = (event) => {
    event.preventDefault()

    const found = persons.find(person =>
      person.name === newName
    )
    if (found) {
      if (window.confirm(
        `${newName} is already in the phonebook, ` +
          'replace the old number with a new one?'
      )) {
        updatePerson({
          ...found,
          number: newNumber
        })
      }
    }
    else {
      createPerson({
        name: newName,
        number: newNumber
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
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
          clearLists(returnedId)
          setNotification(
            `Removed ${person.name} from the phonebook`,
            'success'
          )
        })
        .catch(error => {
          if (error.code === 'ERR_BAD_REQUEST') {
            setNotification(
              `Delete failed, ${person.name} has already been removed from ` +
                'the server',
              'error')
            clearLists(id)
          }
          else {
            setNotification(error.message, 'error')
          }
          console.log(error)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        type={notificationType}
      />
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
          )
        })}
    </div>
  )

}

export default App
