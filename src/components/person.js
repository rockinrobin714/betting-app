import React from "react";
import styles from "./person.module.css";
import axios from "axios";

const Person = ({ reloadPeople, person }) => {
  const toggleCompleted = () => {
    axios
      .post("/api/toggle-completed", {
        id: person._id,
        text: person.text,
        completed: !person.completed,
      })
      .then(reloadPeople);
  };

  const handleDelete = () => {
    axios.post("/api/delete-person", { id: person._id }).then(reloadPeople);
  };

  return (
    <>
      <p className={`${styles.text}`}>{person.name}</p>

      <label htmlFor={`person-delete-${person._id}`} className={styles.label}>
        Delete
      </label>
      <button onClick={handleDelete} className={styles.delete}>
        ❌
      </button>
    </>
  );
};

export default Person;
