import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Modal = (props) => {
  return (
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
  );
};

export default Modal;
