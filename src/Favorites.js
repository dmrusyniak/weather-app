import React, { useEffect } from 'react';
import spinner from "./spinner.png";

export default function Favorites({ loading, favCount, submitQuery }) {
  let favorites = JSON.parse(localStorage.getItem('favorites'));

  useEffect(() => {
    favorites = JSON.parse(localStorage.getItem('favorites'));
  }, [favCount]);

  const queryFav = (fav) => {
    submitQuery(fav);
  };

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
          <div className="Hourly">
            <h3>Favorites</h3>
            {favorites &&
              favorites.map((fav, index) => (
                <div className="Fav-Wrapper" key={index}>
                  <div
                    className="Fav"
                    onClick={() => {
                      queryFav(fav);
                    }}
                  >
                    {fav}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
