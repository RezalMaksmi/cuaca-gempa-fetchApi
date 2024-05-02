import React from "react";
import cerahBerawan from "../../assets/cloudy.png";
import berawan from "../../assets/berawan.png";
import sunny from "../../assets/sunny.png";
import storm from "../../assets/storm.png";
import cloud from "../../assets/cloud.png";

const Weather = ({ cuaca }) => {
  switch (cuaca) {
    case "Cerah Berawan":
      return <img src={cerahBerawan} width={"150px"} alt="cerahBerawan" />;

    case "Berawan":
      return <img src={berawan} width={"150px"} alt="cerahBerawan" />;

    case "Cerah":
      return <img src={sunny} width={"150px"} alt="cerahBerawan" />;

    case "Hujan Petir":
      return <img src={storm} width={"150px"} alt="cerahBerawan" />;

    case "Kabut":
      return <img src={cloud} width={"150px"} alt="cerahBerawan" />;

    default:
      break;
  }
};

export default Weather;
