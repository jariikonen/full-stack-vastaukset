import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

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
    };

    setNewName('');
    setNewNumber('');
  }

  const handleNameChange = (event) =>
    setNewName(event.target.value);

  const handleNumberChange = (event) =>
    setNewNumber(event.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
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
      {persons.map(person =>
        <div key={person.name}>{person.name} {person.number}</div>
      )}
    </div>
  );

}

export default App;
