import axios from "axios";
import { useEffect, useState } from "react";
import { Await } from "react-router-dom";

const Dropdown = () => {
  const [dataSearchCity, setDataSearchCity] = useState([]);
  const [dataCity, setDataCity] = useState({});

  useEffect(() => {
    const fetchSearch = async () => {
      //   try {
      //     const response = axios.get(
      //       `https://cuaca-gempa-rest-api.vercel.app/weather/jawa-timur`
      //     );
      //     setDataSearchCity(response.data.data.areas);
      //   } catch (error) {
      //     console.error("Error fetching data:", error);
      //   }

      try {
        const response = await axios.get(
          `https://cuaca-gempa-rest-api.vercel.app/weather/jawa-timur`
        );
        setDataSearchCity(response.data.data.areas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSearch();

    // const addData = async () => {
    //   if (dataSearchCity) {
    //     // dataSearchCity.map((item) => {
    //     setDataCity();
    //     // });
    //   }
    // };
    // addData();
  }, [dataCity, dataSearchCity]);

  const dataShow = () => {
    return dataCity ? <div>{dataCity}</div> : <div>Loading</div>;
  };

  //   dataSearchCity.map((item, key) => {
  //     console.log(item.description);
  //     // return (
  //     //   <option key={key} selected>
  //     //     {item.description}
  //     //   </option>
  //     // );
  //   });

  console.log("dayta cityyyyyyyyyyyyyyyyyyyyyy", dataCity);
  return (
    <div className="text-white">
      <label className="max-w-[400px] w-full block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
        Select an option
      </label>

      <select
        id="countries"
        className="max-w-[400px] bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option selected>Choose a country</option>
      </select>
    </div>
  );
};

export default Dropdown;
