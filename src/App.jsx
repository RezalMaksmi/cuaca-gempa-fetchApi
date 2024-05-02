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

  // console.log(URL_API);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const date = new Date();
  //     setCurrentTime(date.toLocaleTimeString());
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

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
  // ch 0. 12 . 15
  // time.times.map((e) => {
  //   console.log("appppppppppppppp", e);
  // });
  // const interval = setInterval(() => {
  //   const date = new Date();
  //   setCurrentTime(date.toLocaleTimeString("en-US", { hour12: false }));
  //   try {
  //     time.times.map((e) => {
  //       if (e.h < currentTime) {
  //         setCuaca(e.name);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }, 1000);
  // () => clearInterval(interval);

  // data.params.map((time) => {
  //   if (time.id === "weather") {
  //     console.log("pppppppppppppppppppppp", data.time);
  //   }
  // });
  // Panggil fungsi fetchData untuk mendapatkan data dari API
  // {
  //   data
  //     ? data.params[6].times.map((e) => {
  //         console.log(e);
  //         if (e.h < currentTime) {
  //           setCuaca(e.name);
  //         }
  //       })
  //     : console.log("gada");
  // }

  console.log("ini time", time);
  console.log("ini cuaca", cuaca);
  console.log("ini cuaca", quake);

  // console.log("jam berapa", currentTime);
  return (
    <div className="mx-auto w-full bg-slate-300 flex flex-col justify-center items-center">
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      {city ? (
        <p className="bg-slate-50">Anda berada di kota: {city}</p>
      ) : (
        <p>Mencari lokasi Anda...</p>
      )}

      {data ? (
        <div className="flex flex-col bg-[#d0d0d0b7]">
          <h1>Cuaca</h1>
          <h2 className="text-xl font-normal">
            {data.domain + " " + data.description}
          </h2>

          {cuaca ? (
            <>
              <Weather cuaca={cuaca.name} />
              <p className="text-xl font-normal ">{cuaca.name}</p>
            </>
          ) : (
            <>Loading...</>
          )}
        </div>
      ) : (
        <>Loading...</>
      )}
      <div className="card">
        <h1>Gempa</h1>
        {quake ? (
          <>
            <img src={quake.shakemap} width={"100%"} alt="" />
            <h2>{quake.potensi}</h2>
            <h2>{quake.tanggal}</h2>
            <h2>{quake.jam}</h2>
            <span>{quake.wilayah}</span>
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
      <p className="read-the-docs">Rezal Nur Syaifudin</p>
    </div>
  );
}

export default App;
