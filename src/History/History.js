import React, { useState, useEffect } from "react";
import "./History.css";
import { getHistoryAPI } from "../actions";
import { Dayjs } from "dayjs";
import firebase from "firebase/compat/app";
import { connect } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { TextField } from "@mui/material";
import Moment from "moment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts-drilldown";
drilldown(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const History = (props) => {
  const [date, setDate] = useState(
    Moment(firebase.firestore.Timestamp.now().toDate()).format("YYYY-MM")
  );
  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [food, setFood] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [entertainment, setEntertainment] = useState(0);
  const [household, setHousehold] = useState(0);
  const [others, setOthers] = useState(0);
  const [salary, setSalary] = useState(0);
  const [incomeOthers, setIncomeOthers] = useState(0);
  const [foodChart, setFoodChart] = useState([]);
  const [transportChart, setTransportChart] = useState([]);
  const [entertainmentChart, setEntertainmentChart] = useState([]);
  const [householdChart, setHouseholdChart] = useState([]);
  const [othersChart, setOthersChart] = useState([]);
  const [salaryChart, setSalaryChart] = useState([]);
  const [incomeOthersChart, setIncomeOthersChart] = useState([]);
  const [alignment, setAlignment] = useState("expense");

  let tmpDate = Moment(date).format("MMMM YYYY");

  const calculateAmount = async () => {
    let tmpincome = 0;
    let tmpexpense = 0;
    let tmpfood = 0;
    let tmptransport = 0;
    let tmpentertain = 0;
    let tmphousehold = 0;
    let tmpothers = 0;
    let tmpsalary = 0;
    let tmpincomeothers = 0;

    await props.history.forEach((record) => {
      if (record.type === "expense") {
        tmpexpense += parseFloat(record.amount);
        if (record.category === "Food") {
          tmpfood += parseFloat(record.amount);
        } else if (record.category === "Transportation") {
          tmptransport += parseFloat(record.amount);
        } else if (record.category === "Entertainment") {
          tmpentertain += parseFloat(record.amount);
        } else if (record.category === "Household") {
          tmphousehold += parseFloat(record.amount);
        } else if (record.category === "Others") {
          tmpothers += parseFloat(record.amount);
        }
      } else if (record.type === "income") {
        tmpincome += parseFloat(record.amount);
        if (record.category === "Salary") {
          tmpsalary += parseFloat(record.amount);
        } else if (record.category === "Others") {
          tmpincomeothers += parseFloat(record.amount);
        }
      }
    });

    setFood(tmpfood);
    setTransportation(tmptransport);
    setEntertainment(tmpentertain);
    setHousehold(tmphousehold);
    setOthers(tmpothers);
    setSalary(tmpsalary);
    setIncomeOthers(tmpincomeothers);
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

  const expenseoptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Pie Chart",
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
          format: "{point.name}: RM{point.y:.2f}",
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>RM{point.y:.2f}</b> of total<br/>',
    },

    series: [
      {
        name: alignment,
        colorByPoint: true,
        data: [
          {
            name: "Food",
            y: food,
            drilldown: "Food",
          },
          {
            name: "Transportation",
            y: transportation,
            drilldown: "Transportation",
          },
          {
            name: "Entertainment",
            y: entertainment,
            drilldown: "Entertainment",
          },
          {
            name: "Household",
            y: household,
            drilldown: "Household",
          },
          {
            name: "Others",
            y: others,
            drilldown: "Others",
          },
        ],
      },
    ],
    drilldown: {
      series: [
        {
          name: "Food",
          id: "Food",
          data: foodChart,
        },
        {
          name: "Transportation",
          id: "Transportation",
          data: transportChart,
        },
        {
          name: "Entertainment",
          id: "Entertainment",
          data: entertainmentChart,
        },
        {
          name: "Household",
          id: "Household",
          data: householdChart,
        },
        {
          name: "Others",
          id: "Others",
          data: othersChart,
        },
      ],
    },
  };

  const incomeoptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Pie Chart",
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
          format: "{point.name}: RM{point.y:.2f}",
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>RM{point.y:.2f}</b> of total<br/>',
    },

    series: [
      {
        name: alignment,
        colorByPoint: true,
        data: [
          {
            name: "Salary",
            y: salary,
            drilldown: "Salary",
          },
          {
            name: "Others",
            y: incomeOthers,
            drilldown: "Others",
          },
        ],
      },
    ],
    drilldown: {
      series: [
        {
          name: "Salary",
          id: "Salary",
          data: salaryChart,
        },
        {
          name: "Others",
          id: "Others",
          data: incomeOthersChart,
        },
      ],
    },
  };

  const styles = (theme) => ({
    multilineColor: {
      color: "white",
    },
  });

  useEffect(() => {
    fetchRecord();
    calculateAmount();

    const fetchData = async () => {
      if (alignment === "expense") {
        setFoodChart([]);
        setTransportChart([]);
        setEntertainmentChart([]);
        setHouseholdChart([]);
        setOthersChart([]);
        await props.history.map((record, key) => {
          if (record.type === "expense") {
            if (record.category === "Food") {
              setFoodChart((foodChart) => [
                ...foodChart,
                [record.name, parseFloat(record.amount)],
              ]);
            } else if (record.category === "Transportation") {
              setTransportChart((transportChart) => [
                ...transportChart,
                [record.name, parseFloat(record.amount)],
              ]);
            } else if (record.category === "Entertainment") {
              setEntertainmentChart((entertainmentChart) => [
                ...entertainmentChart,
                [record.name, parseFloat(record.amount)],
              ]);
            } else if (record.category === "Household") {
              setHouseholdChart((householdChart) => [
                ...householdChart,
                [record.name, parseFloat(record.amount)],
              ]);
            } else if (record.category === "Others") {
              setOthersChart((othersChart) => [
                ...othersChart,
                [record.name, parseFloat(record.amount)],
              ]);
            }
          }
        });
      } else if (alignment === "income") {
        setSalaryChart([]);
        setIncomeOthersChart([]);
        await props.history.map((record, key) => {
          if (record.type === "income") {
            if (record.category === "Salary") {
              setSalaryChart((salaryChart) => [
                ...salaryChart,
                [record.name, parseFloat(record.amount)],
              ]);
            } else if (record.category === "Others") {
              setIncomeOthersChart((incomeOthersChart) => [
                ...incomeOthersChart,
                [record.name, parseFloat(record.amount)],
              ]);
            }
          }
        });
      }
    };
    fetchData().catch(console.error);
  }, [props.history.length, date, alignment]);

  return (
    <div className="history-page">
      <h1 className="title">History</h1>
      <form>
        <input
          value={date}
          type="month"
          onChange={(e) => setDate(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            views={["year", "month"]}
            label="Year and Month"
            minDate={new Date("2022-09-01")}
            maxDate={new Date("2052-09-01")}
            value={date}
            onChange={(newValue: Dayjs) => {
              setDate(newValue.format("MMMM YYYY"));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={null}
                style={{ color: "white" }}
              />
            )}
          />
        </LocalizationProvider>
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

        {/* {data.length > 0 && ( */}
        <HighchartsReact
          highcharts={Highcharts}
          options={alignment === "expense" ? expenseoptions : incomeoptions}
        />
        {/* )} */}

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
