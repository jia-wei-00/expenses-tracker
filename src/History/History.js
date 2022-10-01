import React, { useState, useEffect } from "react";
import "./History.css";
import { getHistoryAPI } from "../actions";
import firebase from "firebase/compat/app";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Moment from "moment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts-drilldown";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
drilldown(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

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
  const [search, setSearch] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [detailsTime, setDetailsTime] = useState("");
  const [detailsName, setDetailsName] = useState("");
  const [detailsType, setDetailsType] = useState("");
  const [detailsAmount, setDetailsAmount] = useState("");
  const [detailsCategory, setDetailsCategory] = useState("");

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
      </form>

      <div className="history__container">
        <h3>Balance ({tmpDate})</h3>
        <span>RM{balance.toFixed(2)}</span>

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
            <h4>EXPENSE</h4>(<p>RM{expense.toFixed(2)}</p>)
          </ToggleButton>
          <ToggleButton
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            className="history__income"
            value="income"
          >
            <h4>INCOME</h4>(<p>RM{income.toFixed(2)}</p>)
          </ToggleButton>
        </ToggleButtonGroup>

        {alignment === "expense" ? (
          <HighchartsReact highcharts={Highcharts} options={expenseoptions} />
        ) : (
          <HighchartsReact highcharts={Highcharts} options={incomeoptions} />
        )}

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

        <div className="history__record">
          {props.history.length > 0 &&
            props.history
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
                  <div
                    onClick={() => {
                      setDetailsName(record.name);
                      setDetailsType(record.type);
                      setDetailsCategory(record.category);
                      setDetailsAmount(record.amount);
                      setDetailsTime(
                        Moment(record.timestamp.toDate()).format("LLLL")
                      );
                      setDetailsModal(true);
                    }}
                  >
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
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span>Details</span>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <TableContainer component={Paper}>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      colSpan={1}
                      align="left"
                      sx={{
                        backgroundColor: "#212121",
                        color: "white",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      colSpan={4}
                      align="left"
                      sx={{ textTransform: "Capitalize" }}
                    >
                      {detailsName}
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      colSpan={1}
                      align="left"
                      sx={{
                        backgroundColor: "#212121",
                        color: "white",
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      colSpan={4}
                      align="left"
                      sx={{ textTransform: "Capitalize" }}
                    >
                      {detailsType}
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      colSpan={1}
                      align="left"
                      sx={{
                        backgroundColor: "#212121",
                        color: "white",
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      colSpan={4}
                      align="left"
                      sx={{ textTransform: "Capitalize" }}
                    >
                      {detailsCategory}
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      colSpan={1}
                      align="left"
                      sx={{
                        backgroundColor: "#212121",
                        color: "white",
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell colSpan={4} align="left">
                      RM {detailsAmount}
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell
                      colSpan={1}
                      align="left"
                      sx={{
                        backgroundColor: "#212121",
                        color: "white",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell colSpan={4} align="left">
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
    history: state.recordState.history,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getRecord: (payload) => dispatch(getHistoryAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
