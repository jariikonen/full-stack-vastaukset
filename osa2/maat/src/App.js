import { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () =>
  <h1>Country Data</h1>;

const FilterForm = ({ filterHandler }) =>
  <form>
    <div>
      find countries: <input
        onChange={filterHandler}
      />
    </div>
    <br />
  </form>;

const CountryList = ({ countries, formHandler }) =>
  <form>
    {countries.map(country =>
      <div key={country.name.common}>
        {country.name.common}
        <button type="button" onClick={formHandler} value={`${country.name.common}`}>show</button>
      </div>
    )}
  </form>

const CountryData = ({ country }) =>
  <>
    <h2>{country.name.common}</h2>
    <div>capital: {country.capital}</div>
    <div>area: {country.area} km<sup>2</sup></div>
    <h4>languages:</h4>
    <ul>
      {Object.values(country.languages).map(language =>
        <li key={language}>{language}</li>
      )}
    </ul>
    <img src={`${country.flags.png}`} />
  </>

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [filterValue, setFilterValue] = useState('')

  useEffect (() => {
    console.log('effect');
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled');
        setCountries(response.data);
        setCountriesToShow(
          response.data.filter(
            country => country.name.common.toLowerCase().includes(
              filterValue.toLowerCase()
        )));
      });
  }, []);
  console.log(
    'countries:', countries,
    'countriesToShow', countriesToShow
  );

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    const found = countries.filter(country =>
      country.name.common.toLowerCase().includes(
        event.target.value.toLowerCase()
    ));
    setCountriesToShow(found);
  }

  const handleCountryListButtons = (event) =>
    setCountriesToShow([countriesToShow.find(country =>
      country.name.common === event.target.value
    )]);

  if ( countriesToShow.length === 1 ) {
    return (
      <>
        <Header />
        <FilterForm filterHandler={handleFilterChange} />
        <CountryData country={countriesToShow[0]} />
      </>
    );
  } else if ( countriesToShow.length > 1 && countriesToShow.length < 11 ) {
    return (
      <>
        <Header />
        <FilterForm filterHandler={handleFilterChange} />
        <CountryList
          countries={countriesToShow}
          formHandler={handleCountryListButtons}
        />
      </>
    );
  } else if ( countriesToShow.length > 10 ) {
    return (
      <>
        <Header />
        <FilterForm filterHandler={handleFilterChange} />
        <div>Too many matches, specify another filter</div>
      </>
    );
  };
  return (
    <>
      <Header />
      <FilterForm filterHandler={handleFilterChange} />
      <div>No countries match the filter</div>
    </>
  );

};

export default App;
