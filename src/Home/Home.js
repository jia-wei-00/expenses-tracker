import React, { useState, useEffect } from "react";
import "./Home.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
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

const Input = styled(TextField)({
  "& .MuiInput-input": {
    color: "white !important",
  },
  "& label": {
    color: "white !important",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "white",
  },
});

const Home = (props) => {
  const [type, setType] = useState("");
  const [addTransaction, setAddTransaction] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [category, setCategory] = useState("");
  const [modalType, setModalType] = useState("");
  const [editModalCategory, setEditModalCategory] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalAmount, setModalAmount] = useState("");
  const [modalId, setModalId] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleClose = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
  };

  const handleOpenEdit = (props) => {
    setModalName(props.name);
    setModalAmount(props.amount);
    setModalId(props.id);
    setModalType(props.type);
    setOpenEditModal(true);
    setEditModalCategory(props.category);
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
      category: category,
      timestamp: timestamp,
    };

    props.postRecord(payload);

    reset(e);
  };

  const reset = () => {
    setName("");
    setAmount("");
    setCategory("");
    setAddTransaction(false);
  };

  const updateRecord = () => {
    const payload = {
      user: props.user,
      name: modalName,
      amount: modalAmount,
      category: editModalCategory,
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
        <span>RM{balance.toFixed(2)}</span>
        <div className="record__box">
          <div className="amount__income">
            <h4>INCOME</h4>
            <p>RM{income.toFixed(2)}</p>
          </div>
          <div className="amount__expense">
            <h4>EXPENSE</h4>
            <p>RM{expense.toFixed(2)}</p>
          </div>
        </div>
        <div></div>
        <h3 className="history__title">
          History
          <Input
            id="standard-password-input"
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
            type="text"
            placeholder={"Search"}
            required
            style={{ color: "white" }}
          />
        </h3>

        <div className="history">
          {props.record.length > 0 &&
            props.record
              .filter(
                (record) =>
                  record.name.toLowerCase().includes(search) ||
                  record.amount.toLowerCase().includes(search)
              )
              .map((record, key) => (
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
              <FormControl fullWidth>
                <TextField
                  id="standard-password-input"
                  label="Name"
                  variant="standard"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  type="text"
                  placeholder={"Enter Name"}
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
                  {modalType === "expense" ? (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={editModalCategory}
                      label="Age"
                      onChange={(e) => setEditModalCategory(e.target.value)}
                      required
                    >
                      <MenuItem value="Food">Food</MenuItem>
                      <MenuItem value="Transportation">Transportation</MenuItem>
                      <MenuItem value="Entertainment">Entertainment</MenuItem>
                      <MenuItem value="Household">Household</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  ) : (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={editModalCategory}
                      label="Age"
                      onChange={(e) => setEditModalCategory(e.target.value)}
                      required
                    >
                      <MenuItem value="Salary">Salary</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  )}
                </FormControl>
                <TextField
                  id="standard-password-input"
                  label="Amount"
                  variant="standard"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  placeholder={"Enter Amount"}
                  type="number"
                  style={{ marginBottom: "20px" }}
                  required
                />
              </FormControl>
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
            </Typography>
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
      {/* End Confirm Delete Popup */}

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
                    style={{ marginBottom: "20px", color: "black" }}
                  />

                  <FormControl
                    variant="standard"
                    style={{ marginBottom: "20px" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Type *
                    </InputLabel>
                    {type === "expense" ? (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={category}
                        label="Age"
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <MenuItem value="Food">Food</MenuItem>
                        <MenuItem value="Transportation">
                          Transportation
                        </MenuItem>
                        <MenuItem value="Entertainment">Entertainment</MenuItem>
                        <MenuItem value="Household">Household</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    ) : (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={category}
                        label="Age"
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <MenuItem value="Salary">Salary</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    )}
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

                  <Button
                    style={{ border: "1px solid black", color: "black" }}
                    variant="outlined"
                    type="submit"
                  >
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
