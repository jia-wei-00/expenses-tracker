import React, { useState } from "react";
import "./Home.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

const Home = () => {
  const [type, setType] = useState("expense");

  return (
    <div className="home">
      <h1 className="title">Expense Tracker</h1>
      <h3>Balance (September)</h3>
      <span>RM300</span>
      <div className="record__box">
        <div className="amount__income">
          <h4>INCOME</h4>
          <p>RM0.00</p>
        </div>
        <div className="amount__expense">
          <h4>EXPENSE</h4>
          <p>RM0.00</p>
        </div>
      </div>
      <h3 className="history__title">History</h3>
      <div className="history">
        <div className="record__expense">
          <div>
            <p>Phone</p>
            <p>-5000</p>
          </div>
          <span className="delete">
            <DeleteForeverIcon />
          </span>
          <span className="edit">
            <EditIcon />
          </span>
        </div>
        <div className="record__income">
          <div>
            <p>Phone</p>
            <p>+5000</p>
          </div>
          <span className="delete">
            <DeleteForeverIcon />
          </span>
          <span className="edit">
            <EditIcon />
          </span>
        </div>
      </div>
      <h3 className="history__title">Add Transaction</h3>
      <div className="transaction">
        <button
          className={type === "expense" && "active"}
          onClick={() => setType("expense")}
        >
          Expense
        </button>
        <button
          className={type === "income" && "active"}
          onClick={() => setType("income")}
        >
          Income
        </button>

        {type === "expense" ? (
          <>
            <p className="t__title">Name</p>
            <input placeholder="Enter expense name..." />
            <p className="t__title">Amount</p>
            <input placeholder="Enter expense amount..." />
          </>
        ) : (
          <>
            <p className="t__title">Name</p>
            <input placeholder="Enter income name..." />
            <p className="t__title">Amount</p>
            <input placeholder="Enter income amount..." />
          </>
        )}

        <button className="add">Add Transaction</button>
      </div>
    </div>
  );
};

export default Home;
