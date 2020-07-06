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
          <span>{winArr.join(" ")}</span>
          <button
            style={{ marginLeft: "20px", ...style }}
            onClick={() => deleteBet()}
          >
            <span role="img" aria-label="delete">
              ❌
            </span>
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

  const handleEdit = (wins) => {
    axios
      .post("/api/add-bet", { wins, date: dates[idx - 1], person: id })
      .then(() => {
        reloadData();
        setIsEditing(false);
      });
  };

  const deleteBet = () => {
    const { id } = item;
    axios.post("/api/delete-bet", { id }).then(reloadData);
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

  return (
    <td key={`${id}-${idx}`}>
      {typeof item === "object" ? (
        <>{formatCell(item, id)}</>
      ) : item ? (
        item
      ) : (
        <>
          {isEditing ? (
            buttons.map((button) => (
              <>
                <button
                  key={`${id}-${idx}-${button.label}`}
                  style={style}
                  onClick={() => handleEdit(button.wins)}
                >
                  <span role="img" aria-label="add">
                    {button.label}
                  </span>
                </button>
              </>
            ))
          ) : (
            <button style={style} onClick={() => setIsEditing(true)}>
              <span role="img" aria-label="edit">
                ❓
              </span>
            </button>
          )}
        </>
      )}
    </td>
  );
};

export default Cell;
