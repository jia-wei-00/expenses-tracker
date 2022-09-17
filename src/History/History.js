import React, { useState, useEffect } from "react";
import "./History.css";
import { getHistoryAPI } from "../actions";
import { connect } from "react-redux";
import Moment from "moment";
import TextField from "@mui/material/TextField";

const History = (props) => {
  const [date, setDate] = useState("");
  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);

  let tmpDate = Moment(date).format("MMMM YYYY");

  const calculateAmount = async () => {
    let tmpincome = 0;
    let tmpexpense = 0;

    await props.history.forEach((record) => {
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

  const fetchRecord = async () => {
    const payload = {
      user: props.user,
      date: tmpDate,
    };

    await props.getRecord(payload);
  };

  useEffect(() => {
    fetchRecord();
    calculateAmount();
  }, [props.history.length, date]);

  return (
    <div className="history-page">
      <h1 className="title">History</h1>
      <form>
        <input
          value={date}
          type="month"
          onChange={(e) => setDate(e.target.value)}
        />
      </form>

      <div className="history__container">
        <h3>Balance ({tmpDate})</h3>
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

        <div className="history__record">
          {props.history.length > 0 &&
            props.history.map((record, key) => (
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user.email,
    history: state.recordState.history,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getRecord: (payload) => dispatch(getHistoryAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
