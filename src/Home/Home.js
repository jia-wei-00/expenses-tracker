import React, { useState, useEffect } from "react";
import "./Home.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { connect } from "react-redux";
import { postRecord, getRecordAPI, deleteRecordAPI } from "../actions";
import firebase from "firebase/compat/app";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Home = (props) => {
  const [type, setType] = useState("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [modalName, setModalName] = useState("");
  const [modalAmount, setModalAmount] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
              <span className="edit" onClick={handleOpen(record)}>
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

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <div>
                <h5>Name</h5>
                <input className="input-edit" placeholder={modalName} />
              </div>
              <div>
                <h5>Amount</h5>
                <input className="input-edit" placeholder={modalAmount} />
              </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>
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
