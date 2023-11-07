import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "antd";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const App = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
    },
  });
  const [year, setYear] = useState(1950);
  const [countries, setCountries] = useState([
    "China",
    "India",
    "USA",
    "Russia",
    "Japan",
    "Indonesia",
    "Germany",
    "Brazil",
    "UK",
    "Italy",
    "France",
    "Bangladesh",
  ]);
  const [fetchingData, setFetchingData] = useState(false);
  useEffect(() => {
    if (fetchingData) {
      const timer = setInterval(() => {
        if (year <= 2021) {
          fetchDataForYear(year);
          setYear(year + 1);
        } else {
          setFetchingData(false);
        }
      }, 5000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [year, countries, fetchingData]);
  const fetchDataForYear = (targetYear) => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/PullData?year=${targetYear}&countries=${countries.join(",")}`
      )
      .then((response) => {
        const data = response.data;
        const Country_name = data.map((entry) => entry["Country name"]);
        const populations = data.map((entry) => parseInt(entry["Population"]));
        setChartData((prevData) => ({
          ...prevData,
          series: [{ data: populations }],
          options: {
            ...prevData.options,
            xaxis: { categories: Country_name },
          },
        }));
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      });
  };

  const startFetchingData = () => {
    setYear(1950);
    setFetchingData(true);
  };
  const years = Array.from({ length: 72 }, (_, i) => i + 1950);

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <p>Population growth per country, 1950 to 2021</p>
        <p>Click on the legend below to filter by continent 👇</p>
        <Button onClick={startFetchingData}>Start Fetching Data</Button>
      </Col>
      <Col xs={24}>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </Col>
    </Row>
  );
};

export default App;
