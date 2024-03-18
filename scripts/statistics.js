async function fetchOptions(user_id, option) {
  return new Promise((resolve) => {
    db.collection('commutes').doc(user_id)
    .onSnapshot(userDoc => {
      var f_input = userDoc.data()[option];
      resolve(f_input);
    });
  });
}

let selectedOption = "distance";

document.querySelectorAll('#changeStatisticsDropdown a').forEach(option => {
    option.addEventListener('click', async function() {
        selectedOption = this.textContent;
        console.log(`Selected option: ${selectedOption}`);

        if (selectedOption === "Cost") {
            let f_input = await fetchOptions('g0jDfbDJzrrbP6SAqMWe', 'cost');
            createGraph('cost', f_input, f_input, f_input, f_input, f_input, f_input, f_input)
            document.getElementById('total').innerHTML = `$${f_input}`
            document.getElementById('dropdownStatisticsButton').innerHTML ='Cost'
            document.getElementById('subheading').innerHTML = 'Spent this week'
        }

        else if (selectedOption === "Time") {
          let f_input = await fetchOptions('g0jDfbDJzrrbP6SAqMWe', 'time');
          createGraph('cost', f_input, f_input, f_input, f_input, f_input, f_input, f_input)
          document.getElementById('dropdownStatisticsButton').innerHTML ='Time'
          document.getElementById('total').innerHTML = `$${f_input}`
          document.getElementById('subheading').innerHTML = 'Spent this week'
      }
        else if (selectedOption === "Distance") {
          let f_input = await fetchOptions('g0jDfbDJzrrbP6SAqMWe', 'distance');
          createGraph('cost', f_input, f_input, f_input, f_input, f_input, f_input, f_input)
          document.getElementById('dropdownStatisticsButton').innerHTML ='Distance'
          document.getElementById('total').innerHTML = `$${f_input}`
          document.getElementById('subheading').innerHTML = 'Travelled this week'
      }
    });
});

function createGraph(title, f_input, s_input, t_input, ft_input, fv_input, sx_input, sv_input){  const options = {
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
      // REPLACE THIS WITH FIRESTORE INFORMATION
      {
        name: `${title}`,
        data: [f_input, s_input, t_input, ft_input, fv_input, sx_input, sv_input],
        color: "#FE9503",
      },
    ],
    
    xaxis: {
      // REPLACE THIS WITH FIRESTORE INFORMATION
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

  if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("area-chart"), options);
    chart.render();
  }
}

