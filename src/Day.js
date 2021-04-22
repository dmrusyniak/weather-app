import React from 'react';
import spinner from './spinner.png';

export default function Day({ periods, loading, range, hourlyData }) {
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
            <h3>Basics</h3>
            <div className="Flex">
              <div className="">
                <h5>{'Current (℉)'}</h5>
                <p>{periods[0].temperature}</p>
              </div>
              <div>
                <h5>{'Low (℉)'}</h5>
                <p>{range && range[0]}</p>
              </div>
              <div>
                <h5>{'High (℉)'}</h5>
                <p>{range && range[1]}</p>
              </div>
            </div>
            <div className="Hourly">
              <h3>Hourly</h3>
              <div className="Hourly-Headers">
                <div className="Temp-Flex">
                  <h5 className="Time">Hour</h5>
                  <h5 className="Temp">{'Temp (℉)'}</h5>
                  <h5 className="Forecast">Forecast</h5>
                </div>
              </div>
              {hourlyData &&
                hourlyData.map((el, index) => (
                  <div className="Temp-Flex" key={index}>
                    <div className="Time">{el.time.slice(11, 16)}</div>
                    <div className="Temp">{el.temp}</div>
                    <div className="Forecast">{el.forecast}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
