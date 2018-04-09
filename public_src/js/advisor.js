var st = new Array( [y1.length, y2.length, y3.length, y4.length, y5.length],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0] );

var t = 0;
var nisitGraph;

for(var i=0; i< y1.length; i++){
  if (y1[i].GPAX >= 1.8 && y1[i].GPAX < 2) st[1][0]++;
  if (y1[i].GPAX < 1.5) st[2][0]++;
}

for(var i=0; i< y2.length; i++){
  if (y2[i].GPAX >= 1.8 && y2[i].GPAX < 2) st[1][1]++;
  if (y2[i].GPAX < 1.5) st[2][1]++;
}

for(var i=0; i< y3.length; i++){
  if (y3[i].GPAX >= 1.8 && y3[i].GPAX < 2) st[1][2]++;
  if (y3[i].GPAX < 1.5) st[2][2]++;
}

for(var i=0; i< y4.length; i++){
  if (y4[i].GPAX >= 1.8 && y4[i].GPAX < 2) st[1][3]++;
  if (y4[i].GPAX < 1.5) st[2][3]++;
}

for(var i=0; i< y5.length; i++){
  if (y5[i].GPAX >= 1.8 && y5[i].GPAX < 2) st[1][4]++;
  if (y5[i].GPAX < 1.5) st[2][4]++;
}

for(var i=0; i< abs.length; i++){
  var yr = new Date().getFullYear() - abs[i].ent_year + Math.floor(new Date().getMonth()/12 + 4/12);
  st[3][yr-1]++;
}

function updateGraph() {
  if (!nisitGraph) {
    createChart();
  } else {
    nisitGraph.data.datasets[0].data[0] = st[t][0];
    nisitGraph.data.datasets[0].data[1] = st[t][1];
    nisitGraph.data.datasets[0].data[2] = st[t][2];
    nisitGraph.data.datasets[0].data[3] = st[t][3];
    nisitGraph.data.datasets[0].data[4] = st[t][4];
    nisitGraph.update();
  }
}

$('#myTab a[data-toggle="tab"]').on('click', function (e) {
  t = $('#myTab a[data-toggle="tab"]').index(e.target);
  updateGraph();
});

function createChart() {
  var chartElem = document.getElementById("nisit-chart");
  nisitGraph = new Chart(chartElem, {
    type: 'bar',
    data: {
      labels: ["ปี1", "ปี2", "ปี3", "ปี4", "ปีอื่นๆ"],
      datasets: [{
        label: 'จำนวนนิสิต',
        data: [st[t][0],st[t][1], st[t][2], st[t][3], st[t][4]],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 10
          }
        }]
      }
    }
  });
}


$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  const yr_label = ["ปี 1","ปี 2", "ปี 3", "ปี 4", "ปีอื่นๆ"];

  let yr_sum = '';
  for (let i = 0; i < 5; i++) {

    yr_sum += '<tr>' + '<th>' + yr_label[i] + '</th>';
    for (let s = 0; s < 4; s++) {
      yr_sum += '<td>'+ st[s][i] +'</td>';
    }
    yr_sum += '</tr>';
  }


  yr_sum += '<tr>' + '<th>ทั้งหมด</th>';
  for (let i = 0; i < 4; i++) {
    yr_sum += '<td>'+ st[i].reduce((a, b) => a + b, 0) +'</td>';
  }
  yr_sum += '</tr>';

  $('.year_label').html(yr_sum);

  createChart();
});