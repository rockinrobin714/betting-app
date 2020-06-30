import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AddNameModal = ({ reloadData, handleClose, show }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name === "") return;
    await axios.post("/api/create-person", { name });
    setName("");
    reloadData();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Person</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>
          Add a person
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
          />
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          disabled={!name.length}
          variant="primary"
          onClick={handleSubmit}
        >
          Save New Person
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNameModal;
