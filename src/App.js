import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "antd";
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
          barHeight: "95%",
          borderRadius: 3,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [],
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      colors: [
        "#190482",
        "#7752FE",
        "#8E8FFA",
        "#232D3F",
        "#04364A",
        "#176B87",
        "#64CCC5",
        "#12486B",
        "#00A9FF",
        "#363062",
      ],
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
      }, 500);

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
    //console.log(year);
    if (fetchingData) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/PullData?year=${year}`)
        .then((response) => {
          const data = response.data;
          const Country_name = data.map((item) => item["Country name"]);
          const populations = data.map((item) => parseInt(item["Population"]));
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
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        });
    }
  }, [year, fetchingData]);
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} className="textMid">
        <h1>Population growth per country, 1950 to 2021</h1>
        <h2>Click on the legend below to filter by continent 👇</h2>
      </Col>
      <Col xs={24}>
        <Card bordered={true} className="CardConfig">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        </Card>
      </Col>
      <Col xs={24} md={12} className="align-justify-center">
        {" "}
        <Button onClick={toggleFetching} className="textMid radiusO On-OffBTN">
          {fetchingData ? (
            <i class="align-justify-center fi fi-sr-pause"></i>
          ) : (
            <i class="align-justify-center fi fi-sr-play"></i>
          )}
        </Button>
      </Col>
      <Col xs={24} md={12} className="align-justify-center textRight">
        <div className="TotalPopulation">
          <h1>{year}</h1>
          <h2>Total : {totalPopulation.toLocaleString()}</h2>
        </div>
      </Col>
    </Row>
  );
};

export default App;
