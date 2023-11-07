import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
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
          distributed: true,
          horizontal: true,
          barHeight: '100%',
          borderRadius: 3,
          dataLabels: {
            position: 'top',
          }
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [],
      },
            legend: {
        position: 'top',
        horizontalAlign: 'center',
      }
      colors: ['violet', 'red', '#36B23C', '#3374FF', '#FF33E2', '#33FFF6', 'black', 'white', 'yellow', 'green'],
    },
  });
  const [year, setYear] = useState(1950);
  const [fetchingData, setFetchingData] = useState(true);
  const [totalPopulation, setTotalPopulation] = useState(0);

  const toggleFetching = () => {
    setFetchingData(!fetchingData);
  };

  useEffect(() => {
    if (fetchingData) {
      const interval = setInterval(() => {
        if (year < 2021) {
          setYear(year + 1);
        } else {
          setYear(1950);
          setTotalPopulation(0);
        }
      }, 400);

      if (year === 2021) {
        setFetchingData(false);
        setYear(1950);
        setTotalPopulation(0);
        setFetchingData(true);
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [year, fetchingData]);
  useEffect(() => {
    console.log(year);
    if (fetchingData) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/PullData?year=${year}`)
        .then((response) => {
          const data = response.data;
          const Country_name = data.map((item) => item['Country name']);
          const populations = data.map((item) => parseInt(item['Population']));
          const totalPop = populations.reduce((acc, curr) => acc + curr, 0);
          setTotalPopulation(totalPop);
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
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        });
    }
  }, [year, fetchingData]);
  return (
    <Row gutter={[24,24]}>
      <Col xs={24}>
        <p>Population growth per country, 1950 to 2021</p>
        <p>Click on the legend below to filter by continent 👇</p>
      </Col>
    <button onClick={toggleFetching}>
        {fetchingData ? 'หยุดดึงข้อมูล' : 'เริ่มดึงข้อมูล'}
      </button>
  <p>Total Population for Year {year}: {totalPopulation}</p>
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
