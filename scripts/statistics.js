function startStatistics() {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      updateTime(user.uid, 'timeFrameHere')
    }
  })
}

// Distance query selectors
document.getElementById('distance-yesterday').addEventListener('click', () => {
  console.log('distance-yesterday')
})

document.getElementById('distance-today').addEventListener('click', () => {
  console.log('distance-today')
})

document.getElementById('distance-last-week').addEventListener('click', () => {
  console.log('distanclaste-week')
})

document.getElementById('distance-month').addEventListener('click', () => {
  console.log('distance-month')
})


document.getElementById('distance-90-days').addEventListener('click', () => {
  startStatistics()
})

// Time query selectors
document.getElementById('time-yesterday').addEventListener('click', () => {
  console.log('time-yesterday')
})

document.getElementById('time-today').addEventListener('click', () => {
  console.log('time-week')
})

document.getElementById('time-last-week').addEventListener('click', () => {
  console.log('time-last-week')
})


document.getElementById('time-month').addEventListener('click', () => {
  console.log('time-month')
})

document.getElementById('time-90-days').addEventListener('click', () => {
  startStatistics()
})


function updateTime(user, timeFrame) {
  let allTime = []
  db.collection('users').doc(user).collection("commutes").get() // get the commutes collection
    .then(allCommutes => {
      allCommutes.forEach(doc => {
        var totalTime = doc.data().commuteTotalTime.split(', ')
        // remove this once timestamp is formatted better
        var hr = parseInt(totalTime[0])
        var min = parseInt(totalTime[1])
        var sec = parseInt(totalTime[2])
        var timeFloat = parseFloat(`${hr}.${min}${sec}`);
        allTime.push(timeFloat)
      })
      createTimeGraph(allTime[0], allTime[1])
    })
}

var distanceOptions = {
  chart: {
    height: "100%",
    maxWidth: "100%",
    type: "area",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.55,
      opacityTo: 0,
      shade: "#1C64F2",
      gradientToColors: ["#FE9503"],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 6,
  },
  grid: {
    show: false,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: 0
    },
  },
  series: [
    {
      name: "New users",
      data: [6500, 6418, 6456, 6526, 6356, 6456],
      color: "#FE9503",
    },
  ],
  xaxis: {
    categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
}

function createTimeGraph(timeOne, timeTwo) {
  var timeTitle = document.getElementById('time-total')
  timeTitle.innerHTML = timeOne + timeTwo + 'hrs'
  var timeOptions = {
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    series: [
      {
        name: "Time Spent",
        data: [timeOne, timeTwo],
        color: "#FE9503",
      },
    ],
    xaxis: {
      categories: [timeOne, timeTwo],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  }
  if (document.getElementById("time-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("time-chart"), timeOptions);
    chart.render();
  }
}


if (document.getElementById("distance-chart") && typeof ApexCharts !== 'undefined') {
  const chart = new ApexCharts(document.getElementById("distance-chart"), distanceOptions);
  chart.render();
  createTimeGraph(1, 2)
}




