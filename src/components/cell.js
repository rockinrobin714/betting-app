import React, { useState } from "react";
import axios from "axios";

const Cell = ({ dates, item, id, idx, reloadData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const formatWins = (wins) => {
    let winArr = [];
    wins.forEach((win) => {
      if (win) {
        winArr.push("✅");
      } else {
        winArr.push("⛔️");
      }
    });
    return winArr.join(" ");
  };

  const handleEdit = (wins) => {
    console.log(dates);
    console.log(dates[idx - 1]);
    axios
      .post("/api/add-bet", { wins, date: dates[idx - 1], person: id })
      .then(() => {
        reloadData();
        setIsEditing(false);
      });
  };

  const buttons = [
    { label: "➕", wins: [true] },
    { label: "➕➕", wins: [true, true] },
    { label: "➕➖", wins: [true, false] },
    { label: "➖", wins: [false] },
    { label: "➖➖", wins: [false, false] },
  ];

  return (
    <td key={`userInfo[0]-${idx}`}>
      {typeof item === "object" ? (
        formatWins(item)
      ) : item ? (
        item
      ) : (
        <>
          {isEditing ? (
            buttons.map((button) => (
              <button
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
                onClick={() => handleEdit(button.wins)}
              >
                <span role="img" aria-label="add">
                  {button.label}
                </span>
              </button>
            ))
          ) : (
            <button
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
              }}
              onClick={() => setIsEditing(true)}
            >
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
