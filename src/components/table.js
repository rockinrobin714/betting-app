import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

import Cell from "./cell";

const DataTable = ({ data, newDate, reloadData }) => {
  const [tableData, setTableData] = useState([]);
  const [sortIdx, setSortIdx] = useState();
  const [sortDir, setSortDir] = useState(true);
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

  const calculateStats = (row) => {
    console.log(row);
    const rowCopy = [...row];
    rowCopy.shift();
    // rowCopy.filter((item) => item);
    console.log(rowCopy);
  };

  useEffect(() => {
    const initialData = [];
    for (let key in dataObj) {
      const row = Array(dates.length + 1).fill("");
      row[0] = dataObj[key].name;
      dataObj[key].bets.forEach((bet) => {
        row[dates.indexOf(bet.date) + 1] = bet.wins;
      });
      calculateStats(row);
      initialData.push({ id: key, row });
    }
    setTableData(initialData);
  }, []);

  const formatDate = (date) => {
    return `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`;
  };

  const handleDelete = (id) => {
    axios.post("/api/delete-person", { id }).then(reloadData);
  };

  const sortNames = () => {
    const dataCopy = [...tableData];
    const sortDirNum = sortDir ? 1 : -1;
    dataCopy.sort((a, b) => sortDirNum * a.row[0].localeCompare(b.row[0]));
    if (sortIdx === "name") {
      setSortDir(!sortDir);
    } else {
      setSortIdx("name");
      setSortDir(false);
    }
    setTableData(dataCopy);
  };

  const sortBets = () => {
    // todo
  };

  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th onClick={sortNames}>
            Name {sortIdx === "name" && (sortDir ? "⬆️" : "⬇️")}
          </th>
          {dates.map((date, idx) => (
            <th onClick={() => sortBets(idx)} key={date}>
              {formatDate(date)}
            </th>
          ))}
          <th>Delete Row</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((userInfo) => (
          <tr key={userInfo.id}>
            {userInfo.row.map((item, idx) => (
              <Cell
                key={`${userInfo.id}-${idx}`}
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
