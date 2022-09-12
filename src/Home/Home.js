import React, { useState, useEffect } from "react";
import "./Home.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { connect } from "react-redux";
import { postRecord, getRecordAPI, deleteRecordAPI } from "../actions";
import firebase from "firebase/compat/app";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import "bootstrap/dist/css/bootstrap.min.css";

const Home = (props) => {
  const [type, setType] = useState("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);

  function EditModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let timestamp = firebase.firestore.Timestamp.now();
  let date =
    monthNames[timestamp.toDate().getMonth()] +
    " " +
    timestamp.toDate().getFullYear();

  const handlePostRecord = (e) => {
    e.preventDefault();

    const payload = {
      type: type,
      date: date,
      name: name,
      amount: amount,
      timestamp: timestamp,
    };

    props.postRecord(payload);
    reset(e);
  };

  const reset = () => {
    setName("");
    setAmount("");
  };

  const handleDelete = (id) => {
    const payload = {
      id: id,
      date: date,
    };

    props.deleteRecord(payload);
    calculateAmount();
  };

  const calculateAmount = async () => {
    let tmpincome = 0;
    let tmpexpense = 0;

    await props.record.forEach((record) => {
      if (record.type === "expense") {
        tmpexpense += parseFloat(record.amount);
      } else if (record.type === "income") {
        tmpincome += parseFloat(record.amount);
      }
    });

    setBalance(tmpincome - tmpexpense);
    setExpense(tmpexpense);
    setIncome(tmpincome);
  };

  useEffect(() => {
    const fetchRecord = async () => {
      await props.getRecord(date);
      calculateAmount();
    };

    fetchRecord().catch(console.error);
  }, [props.record.length]);

  return (
    <div className="home">
      <h1 className="title">Expense Tracker</h1>
      <h3>Balance ({date})</h3>
      <span>RM{balance}</span>
      <div className="record__box">
        <div className="amount__income">
          <h4>INCOME</h4>
          <p>RM{income}</p>
        </div>
        <div className="amount__expense">
          <h4>EXPENSE</h4>
          <p>RM{expense}</p>
        </div>
      </div>
      <h3 className="history__title">History</h3>

      <div className="history">
        {props.record.length > 0 &&
          props.record.map((record, key) => (
            <div
              className={
                record.type === "expense" ? "record__expense" : "record__income"
              }
              key={key}
            >
              <div>
                <p>{record.name}</p>
                <p>
                  {record.type === "expense" ? "-" : "+"}
                  {record.amount}
                </p>
              </div>
              <span onClick={() => handleDelete(record.id)} className="delete">
                <DeleteForeverIcon />
              </span>
              <span className="edit" onClick={() => setModalShow(true)}>
                <EditIcon />
              </span>
            </div>
          ))}
      </div>
      <h3 className="history__title">Add Transaction</h3>
      <div className="transaction">
        <button
          className={type === "expense" ? "active" : undefined}
          onClick={() => setType("expense")}
        >
          Expense
        </button>
        <button
          className={type === "income" ? "active" : undefined}
          onClick={() => setType("income")}
        >
          Income
        </button>

        {type === "expense" ? (
          <>
            <p className="t__title">Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter expense name..."
            />
            <p className="t__title">Amount</p>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter expense amount..."
              type="number"
            />
          </>
        ) : (
          <>
            <p className="t__title">Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter income name..."
            />
            <p className="t__title">Amount</p>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="t__title"
              type="number"
              placeholder="Enter income amount..."
            />
          </>
        )}

        <button onClick={(event) => handlePostRecord(event)} className="add">
          Add Transaction
        </button>
      </div>

      <EditModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    record: state.recordState.record,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postRecord: (payload) => dispatch(postRecord(payload)),
  getRecord: (payload) => dispatch(getRecordAPI(payload)),
  deleteRecord: (payload) => dispatch(deleteRecordAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
