import React, { useEffect, useState } from "react";
import "./Memo.css";
import { connect } from "react-redux";
import {
  postTodoRecordAPI,
  getTodoRecordAPI,
  deleteTodoRecordAPI,
  updateTodoRecordAPI,
} from "../actions";
import Button from "@mui/material/Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import firebase from "firebase/compat/app";
import { styled } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Moment from "moment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "black",
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#29fd53",
  },
}));

const ModalButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "black",
  "&:hover": {
    color: "black",
    backgroundColor: "#29fd53",
  },
}));

const modalStyle = {
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

const Memo = (props) => {
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [addRecord, setAddRecord] = useState("");
  const [updateRecord, setUpdateRecord] = useState("");
  const [id, setId] = useState(0);
  const [key, setKey] = useState(0);
  const [search, setSearch] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [detailsTime, setDetailsTime] = useState("");
  const [detailsText, setDetailsText] = useState("");

  let timestamp = firebase.firestore.Timestamp.now().toDate();

  const handlePost = (e) => {
    e.preventDefault();

    const payload = {
      user: props.user,
      text: addRecord,
      timestamp: timestamp,
    };

    props.post(payload);
    reset(e);
    setAddModal(false);
  };

  const handleDeleteModal = (key, id) => {
    setId(id);
    setKey(key);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    const payload = {
      user: props.user,
      id: id,
    };

    props.delete(payload);

    setDeleteModal(false);
  };

  const handleUpdateModal = (key, id, text) => {
    setId(id);
    setKey(key);
    setUpdateRecord(text);
    setUpdateModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const payload = {
      user: props.user,
      id: id,
      text: updateRecord,
    };

    props.update(payload);

    setUpdateModal(false);
  };

  const reset = () => {
    setAddRecord("");
  };

  useEffect(() => {
    const fetchRecord = async () => {
      const payload = {
        user: props.user,
      };

      await props.fetch(payload);
    };

    fetchRecord().catch(console.error);
  }, [props.record.length]);

  return (
    <div className="memo">
      <h1 className="title">Todo</h1>
      <ColorButton
        onClick={() => setAddModal(true)}
        variant="contained"
        color="success"
      >
        Add Record
      </ColorButton>
      <div className="home-container">
        <h3 className="history__title">
          Record
          <Input
            id="standard-password-input"
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="text"
            placeholder={"Search"}
            required
            style={{ color: "white" }}
          />
        </h3>

        <div className="todo__record">
          {props.record.length > 0 &&
            props.record
              .filter((record) => record.text.toLowerCase().includes(search))
              .map((record, key) => (
                <div className="todo__list" key={key}>
                  <p className="number">{key + 1}</p>
                  <div
                    onClick={() => {
                      setId(record.id);
                      setKey(key);
                      setDetailsTime(
                        Moment(record.timestamp.toDate()).format("LLLL")
                      );
                      setDetailsText(record.text);
                      setDetailsModal(true);
                    }}
                  >
                    <p>{record.text}</p>
                  </div>

                  <span
                    className="delete"
                    onClick={() => handleDeleteModal(key, record.id)}
                  >
                    <DeleteForeverIcon />
                  </span>
                  <span
                    className="edit"
                    onClick={() =>
                      handleUpdateModal(key, record.id, record.text)
                    }
                  >
                    <EditIcon />
                  </span>
                </div>
              ))}
        </div>
      </div>

      {/* Add Record Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={addModal}
        onClose={() => setAddModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={addModal}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Add Record
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <form onSubmit={(e) => handlePost(e)}>
                <FormControl fullWidth>
                  <TextField
                    id="standard-multiline-static"
                    label="Type text here"
                    multiline
                    rows={4}
                    variant="standard"
                    style={{ marginBottom: "30px" }}
                    value={addRecord}
                    onChange={(e) => setAddRecord(e.target.value)}
                    required
                  />
                  <ModalButton
                    type="submit"
                    variant="contained"
                    color="success"
                  >
                    Add Record
                  </ModalButton>
                </FormControl>
              </form>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      {/* End Add Record Modal */}

      {/* Update Record Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={updateModal}
        onClose={() => setUpdateModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={updateModal}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Update Record "No.{key + 1}"
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <form onSubmit={(e) => handleUpdate(e)}>
                <FormControl fullWidth>
                  <TextField
                    id="standard-multiline-static"
                    label="Type text here"
                    multiline
                    rows={4}
                    variant="standard"
                    style={{ marginBottom: "30px" }}
                    value={updateRecord}
                    onChange={(e) => setUpdateRecord(e.target.value)}
                    required
                  />
                  <ModalButton
                    type="submit"
                    variant="contained"
                    color="success"
                  >
                    Update Record
                  </ModalButton>
                </FormControl>
              </form>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      {/* End Update Record Modal */}

      {/* Confirm Delete Popup */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={deleteModal}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Confirm Delete Record "No.{key + 1}"?
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

      {/* Details Modal Popup */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={detailsModal}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              <p className="number">{key + 1}</p>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <TableContainer>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      align="center"
                      colSpan={1}
                      style={{ textAlign: "left" }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      colSpan={4}
                      style={{ textAlign: "left" }}
                    >
                      {detailsText}
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      align="center"
                      colSpan={3}
                      style={{ textAlign: "left" }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      align="center"
                      colSpan={2}
                      style={{ textAlign: "left" }}
                    >
                      {detailsTime}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </TableContainer>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      {/* End Details Modal Popup */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user.email,
    record: state.recordState.todoRecord,
  };
};

const mapDispatchToProps = (dispatch) => ({
  post: (payload) => dispatch(postTodoRecordAPI(payload)),
  fetch: (payload) => dispatch(getTodoRecordAPI(payload)),
  update: (payload) => dispatch(updateTodoRecordAPI(payload)),
  delete: (payload) => dispatch(deleteTodoRecordAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Memo);
