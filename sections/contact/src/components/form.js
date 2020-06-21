import React, { useReducer } from "react";
import styles from "./form.module.css";

const INITIAL_STATE = {
  name: "",
  email: "",
  subject: "",
  body: "",
  status: "IDLE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "updateFieldValue":
      return { ...state, [action.field]: action.value };
    case "updateStatus":
      return { ...state, status: action.status };
    case "reset":
    default:
      return INITIAL_STATE;
  }
};

const Form = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setStatus = (status) => dispatch({ type: "updateStatus", status });

  const updateFieldValue = (field) => (event) => {
    dispatch({
      type: "updateFieldValue",
      field,
      value: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("PENDING");
    fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(state),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setStatus("SUCCESS");
      })
      .catch((error) => {
        console.error(error);
        setStatus("ERROR");
      });
  };

  if (state.status === "SUCCESS") {
    return (
      <p className={styles.success}>
        Message sent!
        <button
          className={`${styles.button} ${styles.centered}`}
          type="reset"
          onClick={() => dispatch({ type: "reset" })}
        >
          Reset
        </button>
      </p>
    );
  }
  return (
    <>
      {state.status === "ERROR" && (
        <p className={styles.error}>Something went wrong. Please try again</p>
      )}
      <form
        className={`${styles.form} ${
          state.status === "PENDING" && styles.pending
        }`}
        onSubmit={handleSubmit}
      >
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            name="name"
            onChange={updateFieldValue("name")}
            type="text"
            value={state.name}
          />
        </label>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            name="email"
            onChange={updateFieldValue("email")}
            type="email"
            value={state.email}
          />
        </label>
        <label className={styles.label}>
          Subject
          <input
            className={styles.input}
            name="subject"
            onChange={updateFieldValue("subject")}
            type="text"
            value={state.subject}
          />
        </label>
        <label className={styles.label}>
          Body
          <textarea
            className={styles.input}
            name="body"
            onChange={updateFieldValue("body")}
            value={state.body}
          />
        </label>
        <button className={styles.button}>Send</button>
      </form>
    </>
  );
};

export default Form;
