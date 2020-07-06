import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

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
    const rowCopy = [...row];
    rowCopy.shift();
    const data = [].concat.apply([], rowCopy);
    let total = { win: 0, total: 0 };
    let ten = { win: 0, total: 0 };
    let five = { win: 0, total: 0 };
    for (let i = data.length - 1; i >= 0; i--) {
      const num = total.total;
      const win = data[i] === "win";
      const empty = data[i] === "";
      if (!empty) {
        if (data[i] === "") console.log("boop");
        if (num < 10) {
          ten.total++;
          win && ten.win++;
        }
        if (num < 5) {
          five.total++;
          win && five.win++;
        }
        total.total++;
        win && total.win++;
      }
    }
    return [ten, five, total];
  };

  useEffect(() => {
    const initialData = [];
    for (let key in dataObj) {
      const row = Array(dates.length + 1).fill("");
      row[0] = dataObj[key].name;
      dataObj[key].bets.forEach((bet) => {
        row[dates.indexOf(bet.date) + 1] = bet.wins;
      });
      initialData.push({ id: key, row: [...row, ...calculateStats(row)] });
    }
    setTableData(initialData);
  }, [newDate, data]);

  const formatDate = (date) => {
    return `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`;
  };

  const deletePerson = (id) => {
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

  const sortBets = (idx) => {
    // todo
  };

  const downloadToPDF = () => {
    let csv = "";
    const formattedDates = dates.map((date) => formatDate(date));
    const headers = ["Name", ...formattedDates, "Last 10", "Last 5", "Total"];
    csv += `${headers.join(",")}\n`;
    tableData.forEach((item) => {
      let row = "";
      item.row.forEach((cell) => {
        if (Array.isArray(cell)) {
          row += `${cell.join("-")},`;
        } else if (typeof cell === "object") {
          row += `${cell.win}/${cell.total},`;
        } else {
          row += `${cell},`;
        }
      });
      csv += `${row}\n`;
    });
    const resultsToDownload = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(resultsToDownload);
    downloadLink.download = "toms-bets";
    //  Add to the page, click it, and remove from the dom
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>
              <button
                style={{
                  background: "transparent",
                  border: 0,
                }}
                onClick={sortNames}
              >
                Name {sortIdx === "name" && (sortDir ? "⬆️" : "⬇️")}
              </button>
            </th>
            {dates.map((date, idx) => (
              <th onClick={() => sortBets(idx)} key={date}>
                {formatDate(date)}
              </th>
            ))}
            <th width="200">Last 10</th>
            <th>Last 5</th>
            <th>Total</th>
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
                  onClick={() => deletePerson(userInfo.id)}
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
      <Button onClick={downloadToPDF}>Download .csv file</Button>
    </>
  );
};
export default DataTable;
