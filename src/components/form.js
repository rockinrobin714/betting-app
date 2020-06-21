import React, { useState } from "react";
import axios from "axios";
import styles from "./form.module.css";

const Form = ({ reloadPeople }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name === "") return;
    await axios.post("/api/create-person", { name });
    setName("");
    reloadPeople();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Add a person
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          className={styles.input}
        />
      </label>
      <button className={styles.button}>Save</button>
    </form>
  );
};

export default Form;
