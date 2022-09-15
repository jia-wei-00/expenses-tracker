import React, { useEffect } from "react";
import "./History.css";
import { getHistoryAPI } from "../actions";
import { connect } from "react-redux";

const History = (props) => {
  useEffect(() => {
    const fetchRecord = async () => {
      await props.getHistory();
    };

    fetchRecord().catch(console.error);
  }, []);
  return (
    <div className="history-page">
      {props.history}
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
  getHistory: () => dispatch(getHistoryAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
