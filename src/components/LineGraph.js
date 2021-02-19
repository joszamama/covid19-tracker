import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    interselect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0.0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};



const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType = "cases", countryCode }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {

      const graphUrl =
        countryCode == "worldwide"
          ? "https://disease.sh/v3/covid-19/historical/all"
          : `https://disease.sh/v3/covid-19/historical/${countryCode}`;


      await fetch(graphUrl)
        .then((response) => response.json())
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {data && data.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: data,
                borderColor: "#1976d2",
                backgroundColor: "#63a4ff",
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
