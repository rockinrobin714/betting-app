import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.css";
import Person from "../components/person";
import Form from "../components/form";

export default () => {
  const [status, setStatus] = useState("loading");
  const [people, setPeople] = useState(null);

  useEffect(() => {
    let canceled = false;

    if (status !== "loading") return;

    axios("./api/get-all-people").then((result) => {
      if (canceled === true) return;
      if (result.status !== 200) {
        console.error("error loading people!");
        console.error(result);
        return;
      }

      setPeople(result.data.people);
      setStatus("loaded");
    });
    return () => {
      canceled = true;
    };
  }, [status]);

  const reloadPeople = () => setStatus("loading");

  return (
    <main>
      <h1 className={styles.heading}>Tom's Betting List</h1>
      <Form reloadPeople={reloadPeople} />
      {people ? (
        <ul className={styles.people}>
          {people.map((person) => (
            <li key={person._id} className={styles.person}>
              <Person reloadPeople={reloadPeople} person={person} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.loading}>Loading people...</p>
      )}
    </main>
  );
};
