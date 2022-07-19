import { useState } from 'react';

const Filter = ({ filterHandler }) =>
  <form>
    <div>
      filter shown with: <input
        onChange={filterHandler}
      />
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [personsToShow, setPersonsToShow] = useState(persons)
  const [filterValue, setFilterValue] = useState('')

  const addPerson = (event) => {
    event.preventDefault();

    const found = persons.find(person =>
      person.name === newName
    );
    if (found) {
      alert(`${newName} is already in the phonebook`);
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      };
      console.log('added new person:', personObject);
      setPersons(persons.concat(personObject));

      const show = personObject.name.toLowerCase().includes(
        filterValue.toLowerCase()
      );
      if (show) {
        console.log('new person is shown');
        setPersonsToShow(personsToShow.concat(personObject));
      }
      else {
        console.log('new person is not shown');
      };
    };

    setNewName('');
    setNewNumber('');
  }

  const handleNameChange = (event) =>
    setNewName(event.target.value);

  const handleNumberChange = (event) =>
    setNewNumber(event.target.value);
  
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    const found = persons.filter(person =>
      person.name.toLowerCase().includes(
        event.target.value.toLowerCase()
    ));
    setPersonsToShow(found);
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
  );

};

export default App;
