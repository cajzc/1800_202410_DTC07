function startStatistics() {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      updateDistance(user.uid, 'timeFrameHere')
    }
  })
}


document.getElementById('distance-yesterday').addEventListener('click', ()=>{
  console.log('distance-yesterday')
})

document.getElementById('distance-today').addEventListener('click', ()=>{
  console.log('distance-today')
})

document.getElementById('distance-last-week').addEventListener('click', ()=>{
  console.log('distanclaste-week')
})

document.getElementById('distance-month').addEventListener('click', ()=>{
  console.log('distance-month')
})


document.getElementById('distance-90-days').addEventListener('click', ()=>{
  startStatistics()
})

function updateDistance(user, timeFrame) {
  db.collection('users').doc(user).collection("commutes").get() // get the commutes collection
  .then(allHikes=> {
    console.log(allHikes)
    //var i = 1;  //Optional: if you want to have a unique ID for each hike
    allHikes.forEach(doc => { //iterate thru each doc
      console.log('test')
        var title = doc.data().name
        console.log(title)
    })
  })

}

const distance_options = {
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
      name: "New users",
      data: [6500, 6418, 6456, 6526, 6356, 6456],
      color: "#1A56DB",
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


const time_options = {
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
      name: "New users",
      data: [6500, 6418, 6456, 6526, 6356, 6456],
      color: "#1A56DB",
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



if (document.getElementById("distance-chart") && typeof ApexCharts !== 'undefined') {
  const chart = new ApexCharts(document.getElementById("distance-chart"), distance_options);
  chart.render();
}

if (document.getElementById("time-chart") && typeof ApexCharts !== 'undefined') {
  const chart = new ApexCharts(document.getElementById("time-chart"), time_options);
  chart.render();
}


