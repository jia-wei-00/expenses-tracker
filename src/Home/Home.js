import React, { useState, useEffect } from "react";
import "./Home.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { connect } from "react-redux";
import {
  postRecord,
  getRecordAPI,
  deleteRecordAPI,
  updateRecordAPI,
} from "../actions";
import firebase from "firebase/compat/app";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Moment from "moment";

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
  const [modalId, setModalId] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleClose = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
  };

  const handleOpenEdit = (props) => {
    setModalName(props.name);
    setModalAmount(props.amount);
    setModalId(props.id);
    setOpenEditModal(true);
  };

  const handleOpenDelete = (props) => {
    setModalId(props.id);
    setModalName(props.name);
    setOpenDeleteModal(true);
  };

  let timestamp = firebase.firestore.Timestamp.now().toDate();
  let date = Moment(timestamp).format("MMMM YYYY");

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

  const updateRecord = () => {
    const payload = {
      name: modalName,
      amount: modalAmount,
      id: modalId,
      date: date,
    };
    props.updateRecord(payload);
    setOpenEditModal(false);
  };

  const handleDelete = () => {
    const payload = {
      id: modalId,
      date: date,
    };

    props.deleteRecord(payload);
    calculateAmount();
    setOpenDeleteModal(false);
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
      <div className="home-container">
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
                  record.type === "expense"
                    ? "record__expense"
                    : "record__income"
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
                <span
                  onClick={() => handleOpenDelete(record)}
                  className="delete"
                >
                  <DeleteForeverIcon />
                </span>
                <span className="edit" onClick={() => handleOpenEdit(record)}>
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

          <form onSubmit={(event) => handlePostRecord(event)}>
            <p className="t__title">Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                type === "expense"
                  ? "Enter expense name..."
                  : "Enter income name..."
              }
              type="text"
              required
            />
            <p className="t__title">Amount</p>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={
                type === "expense"
                  ? "Enter expense amount..."
                  : "Enter income amount..."
              }
              type="number"
              required
            />

            <button type="submit" className="add">
              Add Transaction
            </button>
          </form>
        </div>
      </div>

      {/* EditModal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openEditModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <div>
                <h5>Name</h5>
                <input
                  className="input-edit"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                />
              </div>
              <div>
                <h5>Amount</h5>
                <input
                  className="input-edit"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                />
              </div>
            </Typography>
            <Button
              variant="outlined"
              style={{
                color: "white",
                border: "1px solid black",
                marginTop: "10px",
                background: "black",
                width: "100%",
              }}
              onClick={() => updateRecord()}
            >
              Update
            </Button>
          </Box>
        </Fade>
      </Modal>
      {/* Edit Modal End */}

      {/* Confirm Delete Popup */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDeleteModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDeleteModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Confirm Delete "{modalName}"?
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <Button
                onClick={() => handleDelete()}
                variant="outlined"
                color="error"
              >
                DELETE
              </Button>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      {/* End Popup */}
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
  updateRecord: (payload) => dispatch(updateRecordAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
