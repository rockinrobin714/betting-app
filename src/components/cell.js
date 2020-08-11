import React, { useState } from "react";
import axios from "axios";

const Cell = ({ dates, item, id, idx, reloadData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getColor = (percent) => {
    if (percent < 0.25) {
      return "#f5325b";
    } else if (percent < 0.5) {
      return "#ff8400";
    } else if (percent < 0.75) {
      return "#ffca00";
    }
    return "#7ed321";
  };
  const formatCell = (input) => {
    if (input.wins) {
      let winArr = [];
      input.wins.forEach((win) => {
        if (win === "win") {
          winArr.push("✅");
        } else {
          winArr.push("⛔️");
        }
      });
      return (
        <>
          <button style={style} onClick={() => setIsEditing(true)}>
            <span>{winArr.join(" ")}</span>
          </button>
        </>
      );
    } else {
      if (input.total === 0) {
        return "N/A";
      }
      const percentage = input.win / input.total;
      const color = getColor(percentage);
      return (
        <>
          <span style={{ whiteSpace: "nowrap" }}>
            {input.win}/{input.total} {Math.round(percentage * 100)}%
            <div
              style={{
                marginLeft: "5px",
                display: "inline-block",
                height: "15px",
                width: "15px",
                borderRadius: "50%",
                backgroundColor: color,
              }}
            ></div>
          </span>
        </>
      );
    }
  };

  const handleBetClick = (wins) => {
    const url = item.id ? "/api/edit-bet" : "/api/add-bet";
    const data = { wins, date: dates[idx - 1], person: id };
    if (item.id) {
      data.id = item.id;
    }
    axios.post(url, data).then(() => {
      reloadData();
      setIsEditing(false);
    });
  };

  const deleteBet = () => {
    const { id } = item;
    axios.post("/api/delete-bet", { id }).then(reloadData);
    setIsEditing(false);
  };

  const buttons = [
    { label: "➕", wins: ["win"] },
    { label: "➕➕", wins: ["win", "win"] },
    { label: "➕➖", wins: ["win", "lose"] },
    { label: "➖", wins: ["lose"] },
    { label: "➖➖", wins: ["lose", "lose"] },
  ];

  const style = {
    background: "transparent",
    border: 0,
    cursor: "pointer",
  };

  const editingButtons = () => {
    return (
      <>
        {buttons.map((button) => (
          <button
            key={`${id}-${idx}-${button.label}`}
            style={style}
            onClick={() => handleBetClick(button.wins)}
          >
            <span role="img" aria-label="add">
              {button.label}
            </span>
          </button>
        ))}
        {item.id && (
          <button onClick={deleteBet} style={style}>
            ❌
          </button>
        )}
      </>
    );
  };

  const deletePerson = () => {
    axios.post("/api/delete-person", { id }).then(reloadData);
  };

  const renderContent = () => {
    if (isEditing) {
      return editingButtons();
    } else if (typeof item === "object") {
      return formatCell(item, id);
    } else if (item) {
      return (
        <>
          {item}
          {id !== "avg" && (
            <button
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
              }}
              onClick={deletePerson}
            >
              <span role="img" aria-label="delete">
                ❌
              </span>
            </button>
          )}
        </>
      );
    } else if (id === "avg") {
      return null;
    }
    return (
      <button style={style} onClick={() => setIsEditing(true)}>
        <span role="img" aria-label="edit">
          ❓
        </span>
      </button>
    );
  };

  return <td key={`${item?.id || id}-${idx}`}>{renderContent()}</td>;
};

export default Cell;
