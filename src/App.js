import React from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import "./styles.css";
import JsonData from "./Data.json"

class App extends React.Component {
  state = {
    allData: [],
    filteredData: [],
    dates: null,
    amount: {
      min: 0,
      max: 0
    },
    maxAmount: 10
  };

  componentDidMount() {
    let data = localStorage.getItem("tableData");

    if (data) {
      data = JSON.parse(data);
    }
    else{
      data = JsonData;
    }
      let maxAmount = Math.ceil(Math.max(...data.map((x) => x.amount)));

      this.setState({
        allData: data,
        filteredData: data,
        amount: {
          min: 0,
          max: maxAmount
        },
        maxAmount: maxAmount
      });
    
  }

  onDateChange = (dates) => {
    this.setState({ dates: dates });
  };

  formatDate(inputDate) {
    inputDate = new Date(inputDate);
    var dd = String(inputDate.getDate()).padStart(2, "0");
    var mm = String(inputDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = inputDate.getFullYear();
    return mm + "/" + dd + "/" + yyyy;
  }

  filterData = () => {
    debugger;
    const {allData, dates, amount} = this.state;
    let data = allData;

    if(dates && dates[0] && dates[1])
    {
    data = data.filter(row => new Date(row.date) >= dates[0] && new Date(row.date) <= dates[1])
    }

    data = data.filter(row => row.amount >= amount.min && row.amount <= amount.max)

    this.setState({filteredData: data});

  }

  render() {
    const { filteredData, dates, amount, maxAmount } = this.state;
    return (
      <div className="App">
        <fieldset className="filter">
          <legend>Filter</legend>
            <div>
              <span>Date : </span>
              <DateRangePicker
                className="datePicker"
                onChange={this.onDateChange}
                value={dates}
                readonly
              />
            </div>
            <div className="AmountFilter">
              <span>Amount :</span>
              <InputRange
                className="datePicker"
                maxValue={maxAmount}
                minValue={0}
                value={amount}
                onChange={(value) => this.setState({ amount: value })}
              />
            </div>
            <button onClick={this.filterData}>Filter</button>
        </fieldset>
        <table className="tableData">
          <thead>
            <tr className="tableRow">
              <th className="id">ID</th>
              <th className="amount">Amount</th>
              <th className="date">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((rowData) => (
              <tr key={rowData.invoiceNo} className="tableRow">
                <td className="id">{rowData.invoiceNo}</td>
                <td className="amount">{rowData.amount.toFixed(2)}</td>
                <td className="date">{this.formatDate(rowData.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filteredData.length && <div className="textCenter">No Data Available</div>}
      </div>
    );
  }
}

export default App;
