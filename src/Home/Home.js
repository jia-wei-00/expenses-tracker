import React, { useState, useEffect } from "react";
import "./Home.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
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
import TextField from "@mui/material/TextField";

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
  const [type, setType] = useState("");
  const [addTransaction, setAddTransaction] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [category, setCategory] = useState("");
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
      user: props.user,
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
      user: props.user,
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
      user: props.user,
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
      const payload = {
        user: props.user,
        date: date,
      };

      await props.getRecord(payload);
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
            onClick={() => {
              setType("expense");
              setAddTransaction(true);
            }}
          >
            Expense
          </button>
          <button
            className={type === "income" ? "active" : undefined}
            onClick={() => {
              setType("income");
              setAddTransaction(true);
            }}
          >
            Income
          </button>
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

      {/* Add Transaction Moadal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={addTransaction}
        onClose={() => setAddTransaction(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={addTransaction}>
          <Box sx={style}>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              style={{ textTransform: "capitalize" }}
            >
              Add {type} Record
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <form onSubmit={(event) => handlePostRecord(event)}>
                <FormControl fullWidth>
                  <TextField
                    id="standard-password-input"
                    label="Name"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      type === "expense"
                        ? "Enter expense name..."
                        : "Enter income name..."
                    }
                    type="text"
                    required
                    style={{ marginBottom: "20px" }}
                  />
                  <FormControl
                    variant="standard"
                    style={{ marginBottom: "20px" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Type *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={category}
                      label="Age"
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    id="standard-password-input"
                    label="Amount"
                    variant="standard"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={
                      type === "expense"
                        ? "Enter expense amount..."
                        : "Enter income amount..."
                    }
                    type="number"
                    style={{ marginBottom: "20px" }}
                    required
                  />

                  <Button variant="outlined" type="submit">
                    Add Transaction
                  </Button>
                </FormControl>
              </form>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      {/* End Add Transaction Modal */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    record: state.recordState.record,
    user: state.userState.user.email,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postRecord: (payload) => dispatch(postRecord(payload)),
  getRecord: (payload) => dispatch(getRecordAPI(payload)),
  deleteRecord: (payload) => dispatch(deleteRecordAPI(payload)),
  updateRecord: (payload) => dispatch(updateRecordAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
