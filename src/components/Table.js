import React from "react";
import "../includes/css/Table.css";
import numeral from "numeral"

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({country, cases, countryInfo}) => (
        <tr>
          <td><img width="20px" height="12  px" src={countryInfo.flag}/>   {country}</td>
          <td>
            <strong>{numeral(cases).format("000,000")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
