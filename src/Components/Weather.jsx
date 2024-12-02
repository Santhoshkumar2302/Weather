import React, { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet, faMagnifyingGlass, faWind} from '@fortawesome/free-solid-svg-icons'
import './Weather.css'

const Weather = () => {
  const inputRef = useRef()
  const [data, setWeatherData]= useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (city)=>{
    if(city.trim() === ""){
      setError("Entry City Name");
      return;
    }
    setError("");
    setIsLoading(true)
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const datas = await response.json();

      if(!response.ok){
        setError(datas.message);
        setWeatherData(null);
        return;
      }

      const icon = `https://openweathermap.org/img/wn/${datas.weather[0].icon}@2x.png`
      setWeatherData({
        humidity: datas.main.humidity,
        windSpeed: datas.wind.speed,
        temperature: Math.floor(datas.main.temp),
        location: datas.name,
        icon: icon
      })
    }
    catch(error){
      setError("Error in Fetching Data. Please try again.")
      setWeatherData(null);
      console.error("Error in fetching Data");
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    search("Chennai");
  },[])

  return (
    <div className="weather">
        <div className="search">
            <input ref={inputRef} type="text" placeholder="search" aria-label="City name input"/>
            <button onClick={()=>search(inputRef.current.value)}aria-label="Search weather" title="Search"><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
        </div>

      {isLoading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
        {data && !isLoading&& (<>
        <img src={data.icon} alt="Weather Icon" className="icon" />
          <p className="temp">{data.temperature}°c</p>
          <p className="place">{data.location}</p>
          <div className="data">
            <div className="col">
              <FontAwesomeIcon icon={faDroplet} className="icon"/>
              <div>
                <p>{data.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <FontAwesomeIcon icon={faWind} className="icon"/>
              <div>
                <p>{data.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>

        </>)}
        {!data && !isLoading && !error && (
        <p className="placeholder">Search for a city to see its weather.</p>
      )}
    </div>
  )
}

export default Weather