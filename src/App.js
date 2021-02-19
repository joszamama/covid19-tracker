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
import { sortData, prettyPrintStat } from "./includes/utilities/functions";
import "leaflet/dist/leaflet.css";

function App() {
  // State =  How to write a variable in REACT
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);
  const [casesType, setCasesType] = useState("cases");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([30.0, 0.0]);
  const [zoom, setZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [isLoading, setLoading] = useState(false);

  //UseEfect = Runs a piece of code base on a given condition
  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom, ...
            value: country.countryInfo.iso2, // USA, UK, ...
            flag: country.countryInfo.flag
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountries();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    setLoading(true);
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode == "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setLoading(false);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      });
  };

  const onCasesTypeChange = async (event) => {
    const casesType = event.target.value;

    setCasesType(casesType);

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
            isRed
            active={casesType === "cases"}
            className="infoBox__cases"
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            isloading={isLoading}
          />
          <InfoBox
            active={casesType === "recovered"}
            className="infoBox__recovered"
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            isloading={isLoading}
          />
          <InfoBox
            isGrey
            active={casesType === "deaths"}
            className="infoBox__deaths"
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            isloading={isLoading}
          />
        </div>

        {/* Map */}

        <Map countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
          casesType={casesType}></Map>

      </div>

      <Card className="app__right">
        <CardContent>
          {/* Cases by country Table */}
          <h3 className="app__tableTitle">Top countries (in cases)</h3>
          <Table countries={tableData}></Table>


          <h3 className="app__graphTitle">{country} Stats: {casesType}</h3>

          {/* Graph */}
          <LineGraph className="app__graph" casesType={casesType} countryCode={country}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
