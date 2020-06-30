import React, { useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import Cell from "./cell";

const DataTable = ({ data, newDate, reloadData }) => {
  const { people, bets } = data;

  const dataObj = {};
  let dates = newDate ? [newDate] : [];
  people.forEach((person) => {
    dataObj[person._id] = { name: person.name, bets: [] };
  });
  bets.forEach((bet) => {
    if (dataObj[bet.person]) {
      dataObj[bet.person].bets.push(bet);
      dates.push(bet.date);
    }
    // TODO: clean up bets after delete person
  });
  dates = [...new Set(dates)].sort();
  const tableData = [];
  for (let key in dataObj) {
    const row = Array(dates.length + 1).fill("");
    row[0] = dataObj[key].name;
    dataObj[key].bets.forEach((bet) => {
      row[dates.indexOf(bet.date) + 1] = bet.wins;
    });
    tableData.push({ id: key, row });
  }

  const formatDate = (date) => {
    return `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`;
  };

  const handleDelete = (id) => {
    axios.post("/api/delete-person", { id }).then(reloadData);
  };

  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          {dates.map((date) => (
            <th key={date}>{formatDate(date)}</th>
          ))}
          <th>Delete Row</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((userInfo) => (
          <tr key={userInfo.id}>
            {userInfo.row.map((item, idx) => (
              <Cell
                item={item}
                id={userInfo.id}
                idx={idx}
                dates={dates}
                reloadData={reloadData}
              />
            ))}
            <td>
              <button
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(userInfo.id)}
              >
                <span role="img" aria-label="delete">
                  ❌
                </span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default DataTable;
