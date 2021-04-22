import React from 'react';
import spinner from './spinner.png';

export default function Week({ loading, weekData }) {
  return (
    <div className="View-Wrap">
      {loading ? (
        <div className="Loading-wrap">
          <div className="Spinner">
            <h4>Loading...</h4>
            <img src={spinner} alt="sun-emoji"></img>
          </div>
        </div>
      ) : (
        <div>
          <div className="Day-Basics">
            <h3>7-Day Forecast</h3>
            <div className="Hourly-Headers">
              <div className="Temp-Flex">
                <h5 className="Time">Time</h5>
                <h5 className="Temp">{'Temp (℉)'}</h5>
                <h5 className="Forecast">Forecast</h5>
              </div>
            </div>
            {weekData &&
              weekData.map((day, index) => (
                <div className="Temp-Flex" key={day.name}>
                  <div className="Time">{day.name}</div>
                  <div className="Temp">{day.temperature}</div>
                  <div className="Forecast">{day.shortForecast}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
