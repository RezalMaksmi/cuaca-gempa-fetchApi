import { useEffect, useState } from "react";
import "./App.css";
// import { Await } from "react-router-dom";
import axios from "axios";
import Weather from "./components/moleculs/Weather";
import { dataProvinsi } from "./data";

async function GetLastIndex(times, currentTime) {
  const cc = await times.filter((c) => {
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
  const [latitude, setLatitude] = useState("");
  const [keyword, setKeyword] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  // location
  const [city, setCity] = useState("");
  const [dataSearchCity, setDataSearchCity] = useState([]);
  const [description, setDescription] = useState("");
  const [principalSubdivision, setPrincipalSubdivision] = useState("");
  const removedSpacesText = principalSubdivision.split(" ").join("-");
  // const cityRemoveSplaceText = description.split(" ").join("-");
  const [provinsi, setProvinsi] = useState("");
  const removedSpacesProvinsi = provinsi.split(" ").join("-");

  console.log("dimana?", city);
  console.log(description);
  const pp = city == "Malang" && latitude == -8 ? "kota-" : "kabupaten-";

  const [selectedCity, setSelectedCity] = useState("");
  const removedSpacesCity = selectedCity.split(" ").join("-");
  const handleChange = (event) => {
    setSelectedCity(event.target.value);
  };
  // const URL_API = `https://cuaca-gempa-rest-api.vercel.app/weather/${removedSpacesText.toLowerCase()}/${city}`;

  // const newLatitude = latitude.split(".")[0];
  // console.log("latitud nya adalah", Math.round(latitude));
  const URL_API = `https://cuaca-gempa-rest-api.vercel.app/weather/${removedSpacesText.toLowerCase()}/${removedSpacesCity}`;
  console.log("URL nya adalah", URL_API);

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
            // .then((response) =>
            //   console.log("dimana inii ?????????????????", response)
            // )

            .then((data) => {
              // Menetapkan nama kota ke state
              setCity(data.city);
              setPrincipalSubdivision(data.principalSubdivision);
              setLatitude(data.latitude);
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

    const fetchCity = async () => {
      try {
        const response = await axios.get(
          `https://cuaca-gempa-rest-api.vercel.app/weather/jawa-timur`
        );
        setDataSearchCity(await response.data.data.areas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCity();

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

  // const searchSpace = (event) => {
  //   setKeyword(event.target.value);
  //   console.log(keyword);
  // };

  // const items = dataSearchCity
  //   .filter((data) => {
  //     if (keyword == null) return "";
  //     else if (
  //       data.name.toLowerCase().includes(this.state.search.toLowerCase())
  //     ) {
  //       return data;
  //     }
  //   })
  //   .map((data) => {
  //     return (
  //       <div key={data.id}>
  //         <ul>{data.description}</ul>
  //       </div>
  //     );
  //   });

  // const filteredData = dataSearchCity.filter((item) => {
  //   return item.description.includes(keyword);
  // });

  const filteredData = dataSearchCity.map((item, i) => {
    return (
      <option key={i} value={item.description.toLowerCase()}>
        {item.description}
      </option>
    );
  });

  const showDataProvinsi = dataProvinsi.map((item, i) => {
    return <option key={i}>{item.nama}</option>;
  });

  console.log("data search", selectedCity);
  console.log("data provinsi", dataProvinsi);

  return (
    <div className="bg-[#1d1d1d] py-8 px-2 text-white w-full flex flex-col min-h-screen">
      <p className="mx-auto mb-8">Anda berada di {principalSubdivision}</p>

      {city ? (
        <div className="flex flex-row gap-3 justify-center mb-6 w-full">
          <div className="text-white">
            <label className="max-w-[400px] w-full block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Pilih Provinsi
            </label>

            <select
              id="provinsi"
              className="max-w-[400px] bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose a country</option>
              {dataProvinsi ? showDataProvinsi : <></>}
            </select>
          </div>

          <div className="text-white">
            <label className="max-w-[400px] w-full block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Pilih Kota / Kabupaten
            </label>

            <select
              id="countries"
              value={selectedCity}
              onChange={handleChange}
              className="max-w-[400px] w-full bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose a country</option>
              {filteredData ? filteredData : <>Loading</>}
            </select>
          </div>
          {/* --------- */}
        </div>
      ) : (
        <p>Mencari lokasi Anda...</p>
      )}
      <div className=" w-full text-white flex flex-col md:flex-row justify-center gap-3 md:items-start items-center">
        <div className="md:w-auto w-full">
          {data ? (
            <div className="md:max-w-[300px]  w-full gap-1 rounded-lg mt-2 p-2  flex flex-col items-center md:px-7 bg-[#d0d0d04d]">
              <h1 className="font-semibold text-3xl">Cuaca</h1>
              <h2 className="text-xl font-normal">
                {data.domain && data.description ? (
                  data.domain + " " + data.description
                ) : (
                  <>Pilih Kota/Kabupaten</>
                )}
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
