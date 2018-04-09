function renderBarChart() {
  var ctx = document.getElementById('myChart');
  data = JSON.parse(JSON.stringify(st[0]))
  nisitGraph = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W'],
      datasets: [{
        label: 'จำนวนนิสิต',
        data: data,
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
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

//Grade graph
var st = new Array( [250, 600, 650, 800, 750, 700, 400, 200, 100],
                      [2, 1, 0, 0, 10,1,1,2,2],
                      [5, 2, 20, 10, 0,1,2,3,5]);

var t = 0;
var nisitGraph;

$(document).ready(function() {
  let no = $('.list-group-item').first()[0].dataset.courseno;
  console.log(no);
  $.ajax({
    method: "POST",
    url: "/course/graph",
    data: {
      course_no: no
    }
  })
  .done(function(result) {
    console.log(result);
    st[0] = [0,0,0,0,0,0,0,0,0];
    for(let i=0;i<result.length;i++){
      if(result[i].grade == "A") st[0][0] = result[i].count;
      if(result[i].grade == "B+") st[0][1] = result[i].count;
      if(result[i].grade == "B") st[0][2] = result[i].count;
      if(result[i].grade == "C+") st[0][3] = result[i].count;
      if(result[i].grade == "C") st[0][4] = result[i].count;
      if(result[i].grade == "D+") st[0][5] = result[i].count;
      if(result[i].grade == "D") st[0][6] = result[i].count;
      if(result[i].grade == "F") st[0][7] = result[i].count;
      if(result[i].grade == "W") st[0][8] = result[i].count;
    }
    renderGraph();
  });

  $('.list-group-item').click(function() {
    let no = $(this).data("courseno");
    console.log(no);
    $('.list-group-item').removeClass('active')
    $(this).addClass('active');
    $.ajax({
      method: "POST",
      url: "/course/detail",
      data: {
        course_no: no
      }
    })
    .done(function(result) {
      //console.log(result);
      $('#title').html(result.course_no +" "+ result.shortname);
      $('#name_en').html(result.name_en);
      $('#name_th').html(result.name_th);
      $('#shortname').html(result.shortname);
      $('#department').html(result.fname_th +" (ภาควิชา"+result.dname_th+")");
      $('#creditset').html(result.credit+" ("+result.subcredit_1+"-"+result.subcredit_2+"-"+result.subcredit_3+")");
      $('#course_detail').html(result.course_detail);
      switch(result.special_type){
        case '0': $('#special_type').html("ทั่วไป"); break;
        case '1': $('#special_type').html("กลุ่มวิชามนุษยศาสตร์"); break;
        case '2': $('#special_type').html("กลุ่มวิชาวิทยาศาสตร์คณิตศาสตร์"); break;
        case '3': $('#special_type').html("กลุ่มวิชาสังคมศาสตร์"); break;
        case '4': $('#special_type').html("กลุ่มวิชาสังคมศาสตร์"); break;
        case '5': $('#special_type').html("กลุ่มวิชาภาษาต่างประเทศ"); break;
        case '6': $('#special_type').html("Approved Electives"); break;
        default:$('#special_type').html("ทั่วไป default");
      }
      if(!result.pre_course_no) $('#prerequisite').html("-");
      else $('#prerequisite').html(result.pre_course_no);
    });
    $.ajax({
      method: "POST",
      url: "/course/graph",
      data: {
        course_no: no
      }
    })
    .done(function(result) {
      console.log(result);
      st[0] = [0,0,0,0,0,0,0,0,0];
      for(let i=0;i<result.length;i++){
        if(result[i].grade == "A") st[0][0] = result[i].count;
        if(result[i].grade == "B+") st[0][1] = result[i].count;
        if(result[i].grade == "B") st[0][2] = result[i].count;
        if(result[i].grade == "C+") st[0][3] = result[i].count;
        if(result[i].grade == "C") st[0][4] = result[i].count;
        if(result[i].grade == "D+") st[0][5] = result[i].count;
        if(result[i].grade == "D") st[0][6] = result[i].count;
        if(result[i].grade == "F") st[0][7] = result[i].count;
        if(result[i].grade == "W") st[0][8] = result[i].count;
        renderGraph();
      }
    });
    $.ajax({
      method: "POST",
      url: "/course/graph2",
      data: {
        course_no: no
      }
    })
    .done(function(result) {
      console.log(result);
      st[1] = [0,0,0,0,0,0,0,0,0];
      for(let i=0;i<result.length;i++){
        if(result[i].grade == "A") st[1][0] = result[i].count;
        if(result[i].grade == "B+") st[1][1] = result[i].count;
        if(result[i].grade == "B") st[1][2] = result[i].count;
        if(result[i].grade == "C+") st[1][3] = result[i].count;
        if(result[i].grade == "C") st[1][4] = result[i].count;
        if(result[i].grade == "D+") st[1][5] = result[i].count;
        if(result[i].grade == "D") st[1][6] = result[i].count;
        if(result[i].grade == "F") st[1][7] = result[i].count;
        if(result[i].grade == "W") st[1][8] = result[i].count;
        renderGraph();
      }
    });
    $.ajax({
      method: "POST",
      url: "/course/graph3",
      data: {
        course_no: no
      }
    })
    .done(function(result) {
      console.log(result);
      st[2] = [0,0,0,0,0,0,0,0,0];
      for(let i=0;i<result.length;i++){
        if(result[i].grade == "A") st[2][0] = result[i].count;
        if(result[i].grade == "B+") st[2][1] = result[i].count;
        if(result[i].grade == "B") st[2][2] = result[i].count;
        if(result[i].grade == "C+") st[2][3] = result[i].count;
        if(result[i].grade == "C") st[2][4] = result[i].count;
        if(result[i].grade == "D+") st[2][5] = result[i].count;
        if(result[i].grade == "D") st[2][6] = result[i].count;
        if(result[i].grade == "F") st[2][7] = result[i].count;
        if(result[i].grade == "W") st[2][8] = result[i].count;
        renderGraph();
      }
    });
  })
});

function renderGraph() {
  console.log(t);
  if (!nisitGraph) {
    renderBarChart();
  } else {
    for(let i=0;i<9;i++){
      nisitGraph.data.datasets[0].data[i] = st[t][i];
    }
    console.log(st[t]);
    nisitGraph.update();
  }
}

$('#myTab a[data-toggle="tab"]').on('click', function (e) {
  t = $('#myTab a[data-toggle="tab"]').index(e.target);

  renderGraph();
});
