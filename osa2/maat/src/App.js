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

const CountryList = ({ countries }) =>
  <>
    {countries.map(country =>
      <div key={country.name.common}>{country.name.common}</div>
    )}
  </>

const CountryData = ({ country }) =>
  <>
    <h2>{country.name.common}</h2>
    <div>capital: {country.capital}</div>
    <div>area: {country.area} km<sup>2</sup></div>
    <h4>languages:</h4>
    <ul>
      {Object.values(country.languages).map(language =>
        <li>{language}</li>
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
    setFilterValue(event.target.value)
    const found = countries.filter(country =>
      country.name.common.toLowerCase().includes(
        event.target.value.toLowerCase()
    ));
    setCountriesToShow(found);
  }

  console.log('countriesToShow.length:', countriesToShow.length)
  if ( countriesToShow.length === 1 ) {
    console.log('1 maa:', countriesToShow[0].name.common, countriesToShow[0])
    return (
      <>
        <Header />
        <FilterForm filterHandler={handleFilterChange} />
        <CountryData country={countriesToShow[0]} />
      </>
    );
  } else if ( countriesToShow.length > 1 && countriesToShow.length < 11 ) {
    console.log('1-10 maata')
    return (
      <>
        <Header />
        <FilterForm filterHandler={handleFilterChange} />
        <CountryList countries={countriesToShow} />
      </>
    );
  } else if ( countriesToShow.length > 10 ) {
    console.log('liikaa maita')
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
