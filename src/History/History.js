import React, { useState } from "react";
import "./History.css";
import { getHistoryAPI } from "../actions";
import { connect } from "react-redux";
import Moment from "moment";
import Button from "@mui/material/Button";

const History = (props) => {
  const [date, setDate] = useState("");

  let tmpDate = Moment(date).format("MMMM YYYY");

  const fetchRecord = async () => {
    await props.getRecord(tmpDate);
  };

  console.log(props.history);

  return (
    <div className="history-page">
      <input
        value={date}
        type="month"
        onChange={(e) => setDate(e.target.value)}
      />
      <Button onClick={() => fetchRecord()} variant="outlined" color="error">
        SEARCH
      </Button>
      {/* <h3>Balance ({date})</h3>
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
            </div>
          ))}
      </div> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    history: state.recordState.history,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getRecord: (payload) => dispatch(getHistoryAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
