import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AddDateModal = ({ handleClose, setDate, show }) => {
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const saveDisabled = !day || !month || !year;

  const formatNum = (n) => {
    return n > 9 ? "" + n : "0" + n;
  };

  const handleSubmit = () => {
    setDate(`${year}${formatNum(month)}${formatNum(day)}`);
    setDay(new Date().getDate());
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>
          Month
          <input
            min={1}
            max={12}
            onChange={(e) => setMonth(e.target.value)}
            type="number"
            value={month}
          />
        </label>
        <label>
          Day
          <input
            min={1}
            max={31}
            onChange={(e) => setDay(e.target.value)}
            type="number"
            value={day}
          />
        </label>
        <label>
          Year
          <input
            min={2010}
            max={2030}
            onChange={(e) => setYear(e.target.value)}
            type="number"
            value={year}
          />
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          disabled={saveDisabled}
          variant="primary"
          onClick={handleSubmit}
        >
          Save New Date
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDateModal;
