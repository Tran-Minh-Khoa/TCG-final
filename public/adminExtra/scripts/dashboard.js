var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Earnings",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [],
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0,
      },
    },
    scales: {
      xAxes: [
        {
          time: {
            unit: "date",
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 7,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true, // Y-axis starts at 0
            stepSize: 1, // Minimum step size is 1
            maxTicksLimit: 5,
            padding: 10,
            callback: function (value, index, values) {
              // You can customize the formatting of tick labels here
              return "$" + number_format(value.toFixed(2)); // Display float values with 2 decimal places
            },
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2],
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: "#6e707e",
      titleFontSize: 14,
      borderColor: "#dddfeb",
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: "index",
      caretPadding: 10,
      callbacks: {
        label: function (tooltipItem, chart) {
          var datasetLabel =
            chart.datasets[tooltipItem.datasetIndex].label || "";
          return datasetLabel + ": $" + number_format(tooltipItem.yLabel, 2);
        },
      },
    },
  },
});
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Direct", "Referral", "Social"],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
        hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf"],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: "#dddfeb",
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false,
    },
    cutoutPercentage: 80,
  },
});
const tableBody = document
  .getElementById("table-card")
  .getElementsByTagName("tbody")[0];

async function GetEarningData(days = 14) {
  try {
    const response = await fetch(`/admin/dashboard/earnings/${days}`);
    const data = await response.json();

    if (response.ok) {
      // Successful response
      return data;
    } else {
      // Handle error response
      console.error("Error:", data.message || "Unknown error");
      return [];
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Network error:", error.message || "Unknown error");
    return [];
  }
}

async function GetTotalEarning(days) {
  try {
    const response = await fetch(`/admin/dashboard/totalEarning/${days}`);
    const data = await response.json();

    if (response.ok) {
      // Successful response
      return data;
    } else {
      // Handle error response
      console.error("Error:", data.message || "Unknown error");
      return [];
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Network error:", error.message || "Unknown error");
    return [];
  }
}

async function GetOrderAmount() {
  try {
    const response = await fetch(`/admin/dashboard/todayOrder`);
    const data = await response.json();

    if (response.ok) {
      // Successful response
      return data;
    } else {
      // Handle error response
      console.error("Error:", data.message || "Unknown error");
      return [];
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Network error:", error.message || "Unknown error");
    return [];
  }
}

async function GetTopSetRevenue(days) {
  try {
    const response = await fetch(`/admin/dashboard/topSetRevenue/${days}`);
    const data = await response.json();

    if (response.ok) {
      // Successful response
      return data;
    } else {
      // Handle error response
      console.error("Error:", data.message || "Unknown error");
      return [];
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Network error:", error.message || "Unknown error");
    return [];
  }
}

async function GetTopRevenue(days) {
  try {
    const response = await fetch(`/admin/dashboard/topRevenue/${days}`);
    const data = await response.json();

    if (response.ok) {
      // Successful response
      return data;
    } else {
      // Handle error response
      console.error("Error:", data.message || "Unknown error");
      return [];
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Network error:", error.message || "Unknown error");
    return [];
  }
}
async function UpdateEarningData() {
  var dailyElement = document.getElementById("daily-earning");
  var weeklyElement = document.getElementById("weekly-earning");
  var monthlyElement = document.getElementById("monthly-earning");
  var orderElement = document.getElementById("order-amount");

  // Get the earning data for different durations
  var daily = await GetTotalEarning(1);
  var weekly = await GetTotalEarning(7);
  var monthly = await GetTotalEarning(30);
  var order = await GetOrderAmount();

  // Update the content of the elements with the new data
  if (orderElement) {
    orderElement.textContent = order.data.toString();
  }

  // Update the content of the elements with the new data
  if (dailyElement) {
    dailyElement.textContent = "$" + number_format(daily.data, 2);
  }

  if (weeklyElement) {
    weeklyElement.textContent = "$" + number_format(weekly.data, 2);
  }

  if (monthlyElement) {
    monthlyElement.textContent = "$" + number_format(monthly.data, 2);
  }
}
async function UpdatePieChart(days) {
  const res = await GetTopSetRevenue(days);
  console.log(res);
  // Update the chart labels and data
  myPieChart.data.labels = res.map((entry) => entry._id);
  myPieChart.data.datasets[0].data = res.map((entry) => entry.totalRevenue);

  // Update the chart
  myPieChart.update();
}

async function UpdateChart(days) {
  const res = await GetEarningData(days);
  // Update the chart labels and data
  myLineChart.data.labels = res.data.map((entry) => entry.date);
  myLineChart.data.datasets[0].data = res.data.map((entry) => entry.totalPrice);

  // Update the chart
  myLineChart.update();
}

async function UpdateTable(days) {
  try {
    const topRevenue = await GetTopRevenue(days);

    // Clear existing rows from the table
    tableBody.innerHTML = "";

    // Iterate through the fetched data and add rows to the table
    topRevenue.forEach((card) => {
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td>${card.cardId}</td>
        <td>${card.cardName}</td>
        <td>${card.setId}</td>
        <td>$${card.Price.toFixed(2)}</td>
        <td>${card.amount}</td>
        <td>$${card.totalRevenue.toFixed(2)}</td>
      `;
    });
  } catch (error) {
    console.error("Error updating table:", error);
  }
}
UpdateAll(7);
function UpdateAll(days) {
  UpdateChart(days);
  UpdateEarningData();
  UpdatePieChart(days);
  UpdateTable(days);
}
