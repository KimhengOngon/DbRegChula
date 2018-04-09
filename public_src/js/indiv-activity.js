function renderBarChart() {
  if(data.length <= 0) return;

  var ctx = document.getElementById('chart');
  var labelList = [];
  var dataList = [];
  var i=0;
  data.sort(function(a, b) { 
    return a.year - b.year;
  });
  while(i < data.length){
    var duration = 0;
    var y = data[i].year;
    duration += data[i].duration;
    i++;
    while(i < data.length)
    {
      if(y == data[i].year)
      {
        duration += data[i].duration;
        i++;
      }
      else
        break;
    }
    labelList.push(y);
    dataList.push(duration);
  }

  return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labelList,
        datasets: [{
          label: 'จำนวนชั่วโมงรวมต่อปี',
          data: dataList,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          xAxes: [{
            barThickness: 150
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
            }
          }]
        }
      }
    });
  
}

$(document).ready(function () {
  renderBarChart();
});
