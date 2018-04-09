function renderBarChart(data) {
  var ctx = document.getElementById('myChart');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['ปี1', 'ปี2', 'ปี3', 'ปี4', 'มากกว่าปี 4'],
      datasets: [{
        label: 'Average grade',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
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
            suggestedMax: 4
          }
        }]
      }
    }
  });
}

function renderDoughnutChart(labels, data) {
  var ctx = document.getElementById('notGraduatedChart');
  var data = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#00e27a',
        '#a000e2'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#00e27a',
        '#a000e2'
      ]
    }]
  };
  return new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      animation: {
        animateScale: true
      }
    }
  });
}

// Progressbar
function progressbar() {
  var elem = document.getElementById("statbar");
  var width = 1;
  var id = setInterval(frame, 10);

  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
    }
  }
}

$.ajax({
    url: 'manager-board/grade',
    type: 'GET'
  })
  .done(function(result) {
    console.log(Math.floor(result.gpax * 100) / 100);
    $('#grade').html(Math.floor(result.gpax * 100) / 100)
  })

$.ajax({
    url: 'manager-board/count',
    type: 'GET'
  })
  .done(function(result) {
    $('#count').html(result.count)
  })

$.ajax({
    url: 'manager-board/left',
    type: 'GET'
  })
  .done(function(result) {
    console.log(result);
    $('#left').html(result.leftt)
  })

$.ajax({
    url: 'manager-board/award',
    type: 'GET'
  })
  .done(function(result) {
    $('#award').html(result.award)
  })

$.ajax({
    url: 'manager-board/group',
    type: 'GET'
  })
  .done(function(result) {
    for (var i = 0; i < result.length; i++) {
      $('#bar_year'+(i+1)).css('width', result[i]/3+'%')
      $('#year'+(i+1)).html(result[i])
    }
  })

$.ajax({
    url: 'manager-board/year',
    type: 'GET'
  })
  .done(function(result) {
    renderBarChart(result);
  })

$.ajax({
    url: 'manager-board/left_major',
    type: 'GET'
  })
  .done(function(result) {
    console.log(result);
    renderDoughnutChart(result[1], result[0]);
  })
