import { useEffect, useState } from "react";
import "./App.css";
// import { Await } from "react-router-dom";
import axios from "axios";
import Weather from "./components/moleculs/Weather";

async function GetLastIndex(times, currentTime) {
  const cc = await times.filter((c) => {
    console.log("filter ", c);
    return c.h <= currentTime;
  });

  return cc[cc.length - 1];
}

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [quake, setquake] = useState(null);
  const [cuaca, setCuaca] = useState({});
  const [time, setTime] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  // location
  const [city, setCity] = useState("");
  const [principalSubdivision, setPrincipalSubdivision] = useState("");
  const removedSpacesText = principalSubdivision.split(" ").join("-");

  console.log("dimana?", city);
  console.log(location);
  const URL_API = `https://cuaca-gempa-rest-api.vercel.app/weather/${removedSpacesText.toLowerCase()}/kota-${city.toLowerCase()}`;

  useEffect(() => {
    const locationTract = async () => {
      // Mendapatkan lokasi pengguna menggunakan Geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          // Mendapatkan informasi kota berdasarkan koordinat
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
          )
            .then((response) => response.json())

            .then((data) => {
              // Menetapkan nama kota ke state
              setCity(data.city);
              setPrincipalSubdivision(data.principalSubdivision);
            })
            .catch((error) => console.error("Error fetching city:", error));
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
    locationTract();
    // ===========
    const interval = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.getHours("en-US", { hour12: false }));
    }, 1000);
    () => clearInterval(interval);

    const fetchData = async () => {
      try {
        const response = await axios.get(URL_API);
        setData(response.data.data);
        setTime(await response.data.data.params[6].times);
        setCuaca(await GetLastIndex(time, currentTime));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    const fetchQuake = async () => {
      try {
        const response = await axios.get(
          `https://cuaca-gempa-rest-api.vercel.app/quake`
        );
        setquake(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchQuake();
  }, [time, data, city, principalSubdivision]);

  // const cc = time.filter((c) => {
  //   console.log("filter ", c);
  //   return c.h <= currentTime;
  // });
  // console.log("ini cc", cc);
  // setCuaca(cc[cc.length - 1]);
  // setCuaca(cc[cc.length - 1]);

  console.log("ini time", time);
  console.log("ini cuaca", cuaca);
  console.log("ini cuaca", quake);

  // console.log("jam berapa", currentTime);
  return (
    <div className="bg-[#1d1d1d] py-8 px-2 text-white w-full flex flex-col min-h-screen">
      {city ? (
        <p className="mx-auto mb-8">Anda berada di kota : {city}</p>
      ) : (
        <p>Mencari lokasi Anda...</p>
      )}
      <div className=" w-full text-white flex flex-col md:flex-row justify-center gap-3 md:items-start items-center">
        <div className="md:w-auto w-full">
          {data ? (
            <div className="md:max-w-[300px]  w-full gap-1 rounded-lg mt-2 p-2  flex flex-col items-center md:px-7 bg-[#d0d0d04d]">
              <h1 className="font-semibold text-3xl">Cuaca</h1>
              <h2 className="text-xl font-normal">
                {data.domain + " " + data.description}
              </h2>

              {cuaca ? (
                <>
                  <div className="my-2">
                    <Weather cuaca={cuaca.name} />
                  </div>
                  <p className="text-xl font-normal ">{cuaca.name}</p>
                </>
              ) : (
                <>Loading...</>
              )}
            </div>
          ) : (
            <>Loading...</>
          )}
        </div>
        <div className="flex flex-col gap-3 mt-2">
          {quake ? (
            <>
              <div className="bg-white text-black p-3 rounded-lg flex justify-center flex-col overflow-hidden">
                <h1 className="text-3xl font-semibold mx-auto ">Informasi</h1>
                <img src={quake.shakemap} width={"100%"} alt="" />
                <span className="font-semibold text-xl px-2">
                  {quake.wilayah}
                </span>
                <h2 className="px-2 text-base">{quake.potensi}</h2>
                <div className="flex justify-between px-2 mt-2">
                  <h2>{quake.tanggal}</h2>
                  <h2>{quake.jam}</h2>
                </div>
              </div>
            </>
          ) : (
            <>Loading...</>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
