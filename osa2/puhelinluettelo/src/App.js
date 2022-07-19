import { useState } from 'react';

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
      <form>
        <div>
          filter shown with: <input
            onChange={handleFilterChange}
          />
        </div>
      </form>
      <h2>Add new contact</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <div key={person.name}>{person.name} {person.number}</div>
      )}
    </div>
  );

};

export default App;
