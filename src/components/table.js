import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Cell from "./cell";
import "./table.css";

const DataTable = ({ data, newDate, reloadData }) => {
  const [tableData, setTableData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sort, setSort] = useState({ dir: true, on: "name" });
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
    const rowCopy = row.map((bet) => bet?.wins);
    const data = [].concat.apply([], rowCopy);
    let total = { win: 0, total: 0 };
    let ten = { win: 0, total: 0 };
    let five = { win: 0, total: 0 };
    for (let i = data.length - 1; i >= 0; i--) {
      const num = total.total;
      const win = data[i] === "win";
      if (data[i]) {
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
        row[dates.indexOf(bet.date) + 1] = { id: bet._id, wins: bet.wins };
      });
      initialData.push({ id: key, row: [...row, ...calculateStats(row)] });
    }
    setTableData(initialData);
  }, [newDate, data]);

  useEffect(() => {
    sortData();
  }, [sort, tableData]);

  const formatDate = (date) => {
    return `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`;
  };

  const deletePerson = (id) => {
    axios.post("/api/delete-person", { id }).then(reloadData);
  };

  const sortData = () => {
    if (sort.on === "name") {
      sortNames();
    } else if (typeof sort.on == "number") {
      sortBets();
    } else {
      sortStats();
    }
  };

  const sortNames = () => {
    const dataCopy = [...tableData];
    const sortDirNum = sort.dir ? 1 : -1;
    dataCopy.sort((a, b) => sortDirNum * a.row[0].localeCompare(b.row[0]));
    setSortedData(dataCopy);
  };

  const calculateWinScore = (arr) => {
    let count = 0;
    if (!arr) return -3;
    arr.wins.forEach((win) => {
      if (win === "win") {
        count++;
      } else {
        count--;
      }
    });
    return count;
  };

  const sortBets = () => {
    const dataCopy = [...tableData];
    const sortDirNum = sort.dir ? 1 : -1;
    const idx = sort.on;
    dataCopy.sort((a, b) => {
      return (
        sortDirNum *
        (calculateWinScore(a.row[idx]) - calculateWinScore(b.row[idx]))
      );
    });
    setSortedData(dataCopy);
  };

  const sortStats = () => {
    const dataCopy = [...tableData];
    const sortDirNum = sort.dir ? 1 : -1;
    const totalRows = dataCopy[0].row.length;
    let idx;
    if (sort.on === "bet10") {
      idx = totalRows - 3;
    } else if (sort.on === "bet5") {
      idx = totalRows - 2;
    } else {
      idx = totalRows - 1;
    }
    dataCopy.sort((a, b) => {
      const per1 = a.row[idx].total ? a.row[idx].win / a.row[idx].total : -1;
      const per2 = b.row[idx].total ? b.row[idx].win / b.row[idx].total : -1;
      return sortDirNum * (per1 - per2);
    });
    setSortedData(dataCopy);
  };

  const downloadToCSV = () => {
    let csv = "";
    const formattedDates = dates.map((date) => formatDate(date));
    const headers = ["Name", ...formattedDates, "Last 10", "Last 5", "Total"];
    csv += `${headers.join(",")}\n`;
    tableData.forEach((item) => {
      let row = "";
      item.row.forEach((cell) => {
        if (cell.wins) {
          row += `${cell.wins.join("&")},`;
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

  const headerStyle = {
    background: "transparent",
    border: 0,
    fontWeight: 600,
  };

  return (
    <>
      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>
              <button
                style={headerStyle}
                onClick={() => setSort({ dir: !sort.dir, on: "name" })}
              >
                Name {sort.on === "name" && (sort.dir ? "⬆️" : "⬇️")}
              </button>
            </th>
            {dates.map((date, idx) => (
              <th key={date}>
                <button
                  style={headerStyle}
                  onClick={() => setSort({ dir: !sort.dir, on: idx + 1 })}
                >
                  {formatDate(date)}{" "}
                  {sort.on === idx + 1 && (sort.dir ? "⬆️" : "⬇️")}
                </button>
              </th>
            ))}
            <th>
              <button
                style={headerStyle}
                onClick={() => setSort({ dir: !sort.dir, on: "bet10" })}
              >
                Last 10 {sort.on === "bet10" && (sort.dir ? "⬆️" : "⬇️")}
              </button>
            </th>
            <th>
              <button
                style={headerStyle}
                onClick={() => setSort({ dir: !sort.dir, on: "bet5" })}
              >
                Last 5 {sort.on === "bet5" && (sort.dir ? "⬆️" : "⬇️")}
              </button>
            </th>
            <th>
              <button
                style={headerStyle}
                onClick={() => setSort({ dir: !sort.dir, on: "betTotal" })}
              >
                Total {sort.on === "betTotal" && (sort.dir ? "⬆️" : "⬇️")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((userInfo) => (
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
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={downloadToCSV}>Download .csv file</Button>
    </>
  );
};
export default DataTable;
