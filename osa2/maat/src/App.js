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

const Weather = ({ weatherObj }) => {
  if (weatherObj.city === 'undefined') {
    console.log('Weather component: weatherObj.city === undefined');
    const error = typeof weatherObj.error === 'undefined' ? '' : `(${weatherObj.error})`;
    return (
      <>
        <h4>No weather {error}</h4>
      </>
    );
  }
  console.log('Weather component:', weatherObj);
  return (
    <>
      <h4>weather in {weatherObj.city}</h4>
      <div>temperature: {weatherObj.data.main.temp} <sup><small>o</small></sup>C</div>
      <img src={`http://openweathermap.org/img/wn/${weatherObj.data.weather[0].icon}@2x.png`} />
      <div>wind: {weatherObj.data.wind.speed} m/s ({weatherObj.data.wind.deg} degrees)</div>
    </>
  )
}

const App = () => {
  const api_key = process.env.REACT_APP_API_KEY

  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  useEffect(() => {
    console.log('country effect');
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('country promise fulfilled');
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

  const [weatherObj, setWeatherData] = useState({
    city: 'undefined',
    timestamp: Date.now(),
    data: {}
  });
  useEffect(() => {
    const country = countriesToShow[0];

    if (countriesToShow.length > 1
      || typeof country === 'undefined') {
      console.log('weather effect: no country');
      return;
    }
    console.log('weather effect', country);

    if (weatherObj.city === country.capital[0]
      && Date.now() < weatherObj.timestamp + 600) {
      console.log('weather effect: data still fresh');
      return;
    }
    console.log('weather effect: refresh data', country)
    
    if (typeof country.capitalInfo.latlng === 'undefined') {
      console.log('weather effect: capitalInfo is empty', country);
      setWeatherData({
        city: 'undefined',
        error: 'capitalInfo is empty'
      });
      return;
    }

    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const lat = country.capitalInfo.latlng[0];
    const lon = country.capitalInfo.latlng[1];
    const params = `lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;

    console.log('weather effect: using url', `${url}?${params}`)
    axios
      .get(`${url}?${params}`)
      .then(response => {
        console.log('weather promise fulfilled', response.data);
        setWeatherData({
          city: country.capital[0],
          timestamp: Date.now(),
          data: response.data
        });
      });
  });
  console.log('weatherObj:', weatherObj);

  const [filterValue, setFilterValue] = useState('')

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

  if (countriesToShow.length === 1) {
    console.log('render country:', countriesToShow[0].name.common);
    return (
      <>
        <Header />
        <FilterForm filterHandler={handleFilterChange} />
        <CountryData country={countriesToShow[0]} />
        <Weather weatherObj={weatherObj} />
      </>
    );
  } else if (countriesToShow.length > 1 && countriesToShow.length < 11) {
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
  } else if (countriesToShow.length > 10) {
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

}

export default App;
