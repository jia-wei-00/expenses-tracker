import React, { useState, useEffect } from "react";
import "./History.css";
import { getHistoryAPI } from "../actions";
import firebase from "firebase/compat/app";
import { connect } from "react-redux";
import Moment from "moment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts-drilldown";
drilldown(Highcharts);

const History = (props) => {
  const [date, setDate] = useState(
    Moment(firebase.firestore.Timestamp.now().toDate()).format("MMMM YYYY")
  );
  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [data, setData] = useState([]);
  const [alignment, setAlignment] = useState("expense");

  let tmpDate = Moment(date).format("MMMM YYYY");

  // var data = [
  // {
  //   name: "Chrome",
  //   y: 61.04,
  // },
  // {
  //   name: "Safari",
  //   y: 9.47,
  // },
  // {
  //   name: "Edge",
  //   y: 9.32,
  // },
  // {
  //   name: "Firefox",
  //   y: 8.15,
  // },
  // ];

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

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Browser market shares. January, 2022",
    },
    subtitle: {
      text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
    },

    accessibility: {
      announceNewData: {
        enabled: true,
      },
      point: {
        valueSuffix: "%",
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y:.1f}%",
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },

    series: [
      {
        name: "Browsers",
        colorByPoint: true,
        data: data,
      },
    ],
    // drilldown: {
    //   series: [
    //     {
    //       name: "Chrome",
    //       id: "Chrome",
    //       data: [
    //         ["v97.0", 36.89],
    //         ["v96.0", 18.16],
    //         ["v95.0", 0.54],
    //         ["v94.0", 0.7],
    //         ["v93.0", 0.8],
    //         ["v92.0", 0.41],
    //         ["v91.0", 0.31],
    //         ["v90.0", 0.13],
    //         ["v89.0", 0.14],
    //         ["v88.0", 0.1],
    //         ["v87.0", 0.35],
    //         ["v86.0", 0.17],
    //         ["v85.0", 0.18],
    //         ["v84.0", 0.17],
    //         ["v83.0", 0.21],
    //         ["v81.0", 0.1],
    //         ["v80.0", 0.16],
    //         ["v79.0", 0.43],
    //         ["v78.0", 0.11],
    //         ["v76.0", 0.16],
    //         ["v75.0", 0.15],
    //         ["v72.0", 0.14],
    //         ["v70.0", 0.11],
    //         ["v69.0", 0.13],
    //         ["v56.0", 0.12],
    //         ["v49.0", 0.17],
    //       ],
    //     },
    //     {
    //       name: "Safari",
    //       id: "Safari",
    //       data: [
    //         ["v15.3", 0.1],
    //         ["v15.2", 2.01],
    //         ["v15.1", 2.29],
    //         ["v15.0", 0.49],
    //         ["v14.1", 2.48],
    //         ["v14.0", 0.64],
    //         ["v13.1", 1.17],
    //         ["v13.0", 0.13],
    //         ["v12.1", 0.16],
    //       ],
    //     },
    //     {
    //       name: "Edge",
    //       id: "Edge",
    //       data: [
    //         ["v97", 6.62],
    //         ["v96", 2.55],
    //         ["v95", 0.15],
    //       ],
    //     },
    //     {
    //       name: "Firefox",
    //       id: "Firefox",
    //       data: [
    //         ["v96.0", 4.17],
    //         ["v95.0", 3.33],
    //         ["v94.0", 0.11],
    //         ["v91.0", 0.23],
    //         ["v78.0", 0.16],
    //         ["v52.0", 0.15],
    //       ],
    //     },
    //   ],
    // },
  };

  useEffect(() => {
    fetchRecord();
    calculateAmount();
    // setData([]);

    const fetchData = async () => {
      await props.history.map((record, key) => {
        setData(...data, [
          {
            name: props.history[key].name,
            y: parseFloat(props.history[key].amount),
          },
        ]);
      });
    };
    fetchData().catch(console.error);
  }, [props.history.length, date]);

  // console.log(data.length, "data length");
  console.log(data, "data");
  console.log(props.history.length, "firebase length");

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

        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          style={{ width: "100%", marginTop: "20px" }}
        >
          <ToggleButton
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            className="history__expense"
            value="expense"
          >
            <h4>EXPENSE</h4>(<p>RM{expense}</p>)
          </ToggleButton>
          <ToggleButton
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            className="history__income"
            value="income"
          >
            <h4>INCOME</h4>(<p>RM{income}</p>)
          </ToggleButton>
        </ToggleButtonGroup>

        {data.length === props.history.length && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}

        <h3 className="history__page__history">History</h3>

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
