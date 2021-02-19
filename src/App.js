import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./includes/css/App.css";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData } from "./includes/utilities/functions";

function App() {
  // State =  How to write a variable in REACT
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);
  const [casesType, setCasesType] = useState("cases");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  //UseEfect = Runs a piece of code base on a given condition
  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom, ...
            value: country.countryInfo.iso2, // USA, UK, ...
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);

          setCountries(countries);
        });
    };

    getCountries();
  }, [countries]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/{country}

    const url =
      countryCode == "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  const onCasesTypeChange = async (event) => {
    const casesType = event.target.value;

    setCasesType(casesType);
    console.log(casesType);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* Header */}
          <h1>Covid 19 Tracker</h1>

          {/* Title +  Dropdown field */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              {/* Loop through all the countries and show a dropdown list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* C19 Cases infobox */}
          <InfoBox
            title="Coronavirus Cases"
            newCases={countryInfo.todayCases}
            totalCases={countryInfo.cases}
          ></InfoBox>

          {/* Recovered infobox */}
          <InfoBox
            title="Recovered Cases"
            newCases={countryInfo.todayRecovered}
            totalCases={countryInfo.recovered}
          ></InfoBox>

          {/* Deaths infobox */}
          <InfoBox
            title="Death Cases"
            newCases={countryInfo.todayDeaths}
            totalCases={countryInfo.deaths}
          ></InfoBox>
        </div>

        {/* Map */}
        <div className="app__map">
          <Map></Map>
        </div>
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Cases by country Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>

          <div className="app__graphsettings">
            <h3>Worldwide</h3>
            <FormControl className="app__graphdropdown">
              <Select
                value={casesType}
                onChange={onCasesTypeChange}
                variant="outlined"
              >
                <MenuItem value="cases">Cases</MenuItem>
                <MenuItem value="recovered">Recovered</MenuItem>
                <MenuItem value="deaths">Deaths</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* Graph */}
          <LineGraph casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
