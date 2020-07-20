import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import AddNameModal from "../components/add-name-modal";
import Table from "../components/table";
import AddDateModal from "../components/add-date-modal";

import "bootstrap/dist/css/bootstrap.min.css";

export default () => {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [showAddDateModal, setAddDateModal] = useState(false);
  const [showAddNameModal, setAddNameModal] = useState(false);
  const [date, setDate] = useState();

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
      setData(result.data);
      setStatus("loaded");
    });
    return () => {
      canceled = true;
    };
  }, [status]);

  const reloadData = () => setStatus("loading");

  return (
    <main style={{ padding: "50px" }}>
      <h1>Sports Betting Analyzer</h1>
      <div style={{ marginLeft: "-20px" }}>
        <Button
          style={{ margin: "20px" }}
          onClick={() => setAddDateModal(true)}
        >
          Add New Date (Column)
        </Button>
        <Button
          style={{ margin: "20px" }}
          onClick={() => setAddNameModal(true)}
        >
          Add New Person (Row)
        </Button>
      </div>
      {data ? (
        <Table newDate={date} data={data} reloadData={reloadData} />
      ) : (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      <AddDateModal
        setDate={setDate}
        handleClose={() => setAddDateModal(false)}
        show={showAddDateModal}
      />
      <AddNameModal
        reloadData={reloadData}
        handleClose={() => setAddNameModal(false)}
        show={showAddNameModal}
      />
    </main>
  );
};
