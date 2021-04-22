import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.scss';
import Day from './Day';
import Week from './Week';
import Favorites from './Favorites';

function App() {
  const [periods, setPeriods] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [range, setRange] = useState([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('');
  const [hourlyData, setHourlyData] = useState(null);
  const [favCount, setFavCount] = useState(0);
  const [favorite, setFavorite] = useState(true);

  useEffect(() => {
    if (periods) {
      getHourlyData(periods);
      setRange(getTempRange(periods));
    }
  }, [periods]);

  // get data of last-searched location upon refresh
  useEffect(() => {
    const currentLocation =
      JSON.parse(localStorage.getItem('current_location')) || [];
    if (currentLocation.length) {
      submitQueryFavorite(currentLocation);
    }
  }, []);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const currentLocation =
      JSON.parse(localStorage.getItem('current_location')) || [];
    if (favorites.indexOf(currentLocation) !== -1) {
      setFavorite(false);
    } else {
      setFavorite(true);
    }
  }, [favCount, periods]);

  const apiKey = 'AIzaSyDmhq3tKLMI4qB3WIZGGWPAchNGIwZgPFU';

  // uses Google Maps API to convert query to lat/long and return coordinates
  async function geoCode(location) {
    return axios
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: apiKey,
        },
      })
      .then(function (response) {
        const location = response.data.results[0].geometry.location;
        setLocation(response.data.results[0].formatted_address);
        localStorage.setItem(
          'current_location',
          JSON.stringify(response.data.results[0].formatted_address)
        );
        return location;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // returns the appropriate endpoint from which to get forecast
  async function fetchStation(location, week = false) {
    const url = 'https://api.weather.gov/points/';
    return axios
      .get(`${url}${location.lat},${location.lng}`)
      .then(function (response) {
        const data = response.data;
        if (week) {
          return data.properties.forecast;
        } else {
          return data.properties.forecastHourly;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // uses the appropriate weather station endpoint to return weather forecast
  async function fetchForecast(url) {
    return axios
      .get(url)
      .then(function (response) {
        const data = response.data;
        return data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getTempRange = (arr) => {
    const temps = [];

    for (let i = 0; i < 24; i++) {
      temps.push(arr[i].temperature);
    }
    temps.sort();
    return [temps[0], temps[temps.length - 1]];
  };

  const updateQuery = (event) => {
    setQuery(event.target.value);
  };

  // calls API functions when user submits query
  async function submitQuery(e) {
    e.preventDefault();
    setFavorite(true);
    setLoading(true);
    setView('day');
    const location = await geoCode(query);
    const stationURL = await fetchStation(location);
    const weekStationURL = await fetchStation(location, true);
    const forecast = await fetchForecast(stationURL);
    const weekForecast = await fetchForecast(weekStationURL);
    if (forecast) {
      setPeriods(forecast.properties.periods);
    }
    setWeekData(weekForecast.properties.periods);
    setLoading(false);
    setQuery('');
  }

  async function submitQueryFavorite(loc) {
    setLoading(true);
    setView('day');
    const location = await geoCode(loc);
    const stationURL = await fetchStation(location);
    const weekStationURL = await fetchStation(location, true);
    const forecast = await fetchForecast(stationURL);
    const weekForecast = await fetchForecast(weekStationURL);
    if (forecast) {
      setPeriods(forecast.properties.periods);
    }
    setWeekData(weekForecast.properties.periods);
    setLoading(false);
  }

  const addFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    localStorage.setItem('current_location', JSON.stringify(location));
    setFavCount(favCount + 1);
    if (favorites.indexOf(location) === -1) {
      favorites.push(location);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

  // generates array of hourly data objects and sets to state
  const getHourlyData = (arr) => {
    const hourlyArr = [];
    for (let i = 0; i < 24; i++) {
      let obj = {
        time: arr[i].startTime,
        temp: arr[i].temperature,
        forecast: arr[i].shortForecast,
      };
      hourlyArr.push(obj);
    }

    setHourlyData(hourlyArr);
  };

  const removeFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    setFavCount(favCount + 1);

    if (favorites.indexOf(location) !== -1) {
      favorites = favorites.filter((f) => f !== location);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

  function switchView() {
    switch (view) {
      case 'day':
        return (
          <Day
            loading={loading}
            range={range}
            periods={periods}
            hourlyData={hourlyData}
          />
        );
      case 'week':
        return <Week loading={loading} weekData={weekData} />;
      case 'favorites':
        return (
          <Favorites favCount={favCount} submitQuery={submitQueryFavorite} />
        );
      default:
        return <span />;
    }
  }

  return (
    <div className="App">
      <div className="Header">
        <div className="Nav">
          <a href="/">
            <h1>Weather App</h1>
          </a>
        </div>
        <p className="Intro">
          Welcome to Weather App, a React.js app for viewing forecasts from The
          National Oceanic and Atmospheric Administration.
        </p>
      </div>

      <div className="Search">
        <form onSubmit={submitQuery}>
          <label>
            search by zip or address:{' '}
            <input type="string" value={query} onChange={updateQuery} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {location ? (
          <div className="Location-Flex">
            <h3>{location}</h3>

            {favorite ? (
              <div onClick={addFavorite} className="material-icons">
                favorite_border
              </div>
            ) : (
              <div onClick={removeFavorite} className="material-icons">
                favorite
              </div>
            )}
          </div>
        ) : (
          <h3 className="Location"></h3>
        )}
      </div>

      {view && (
        <div className="Tab-Nav">
          <a
            href="#"
            onClick={() => setView('day')}
            style={{ borderBottom: view === 'day' ? 'none' : '' }}
          >
            Today's Forecast
          </a>
          <a
            href="#"
            onClick={() => setView('week')}
            style={{ borderBottom: view === 'week' ? 'none' : '' }}
            className="center"
          >
            7-Day Forecast
          </a>
          <a
            href="#"
            style={{ borderBottom: view === 'favorites' ? 'none' : '' }}
            onClick={() => setView('favorites')}
          >
            Favorites
          </a>
        </div>
      )}

      {switchView()}
    </div>
  );
}

export default App;
