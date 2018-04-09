$(function() {

  let ent = $('.nav-tabs').data('ent');

  function addRow(table, row, more) {
    if (row['grade'] == 'Z' && !more) {
      return table;
    }
    table += '<tr ';
    if (!more) {
      if (row['grade'] == 'D' || row['grade'] == 'D+' || row['grade'] == 'W') {
        table += 'class="warning"' + '>';
      } else if (row['grade'] == 'F') {
        table += 'class="danger"' + '>';
      } else if (row['grade'] == 'A') {
        table += 'class="success"' + '>';
      }
    }
    table += '>';
    if (more) {
      table += '<td>' + row['created_time'] + '</td>'
      table += '<td>เพิ่ม</td>'
    }
    table += '<td>' + row['course_no'] + '</td>' +
      '<td>' + row['shortname'] + '</td>' +
      '<td>' + row['credit'] + '</td>'
    if (!more)
      table += '<td>' + row['grade'] + '</td>'
    table += '</tr>';
    if ((row['grade'] == 'Z' || row['grade'] == 'W') && more) {
      table += '<tr ';
      table += '>';
      if (more) {
        table += '<td>' + row['edited_time'] + '</td>'
        if (row['grade'] == 'Z')
          table += '<td>ลด</td>'
        else
          table += '<td>ถอน</td>'
      }
      table += '<td>' + row['course_no'] + '</td>' +
        '<td>' + row['shortname'] + '</td>' +
        '<td>' + row['credit'] + '</td>'
      if (!more)
        table += '<td>' + row['grade'] + '</td>'
      table += '</tr>';
    }
    return table
  }

  function DrawEnroll(data) {
    let detail_table = '';
    let table = '';
    for (var i = 0; i < data.length; i++) {
      let row = data[i];
      table = addRow(table, row, false);
      detail_table = addRow(detail_table, row, true);
    }

    $('.grade_table').html(table);

    $('.detail_table').html(detail_table);

  }

  let sid = $('#sid').html()
  $('.tab_semester').click(function() {
    let year = $(this).data('year')
    let semester = $(this).data('semester')
    $.ajax({
        method: "POST",
        url: "/enroll/detail",
        data: {
          sid: sid,
          year: year,
          semester: semester
        }
      })
      .done(function(result) {
        DrawEnroll(result)
      });
    $.ajax({
        method: "POST",
        url: "/enroll/summary",
        data: {
          sid: sid,
          year: year,
          semester: semester,
          ent_year: ent
        }
      })
      .done(function(result) {
        drawSumTable(result)
      });
  })

  $.ajax({
      method: "POST",
      url: "/enroll/detail",
      data: {
        sid: sid,
        year: ent,
        semester: '1'
      }
    })
    .done(function(result) {
      DrawEnroll(result)
    });


  $.ajax({
      method: "POST",
      url: "/enroll/summary",
      data: {
        sid: sid,
        year: ent,
        semester: '1',
        ent_year: ent
      }
    })
    .done(function(result) {
      drawSumTable(result)
    });


  function drawSumTable(result) {
    let sum_table = '<tr ';
    if (result['gpax'] == 0) {
      sum_table += '>';
    } else if (result['gpax'] > 3.6) {
      sum_table += 'class="success"' + '>';
    } else if (result['gpax'] > 3.25) {
      sum_table += 'class="info"' + '>';
    } else if (result['gpax'] < 1.8) {
      sum_table += 'class="danger"' + '>';
    } else if (result['gpax'] < 2.0) {
      sum_table += 'class="warning"' + '>';
    } else {
      sum_table += '>';
    }
    if (result['gpax'] == undefined) {
      for (var i = 0; i < 7; i++) {
        sum_table += '<td>-</td>';
      }
    } else {
      sum_table += '<td>' + result['ca'] + '</td>';
      sum_table += '<td>' + result['cg'] + '</td>';
      sum_table += '<td>' + Math.floor(result['gpa']*100) / 100 + '</td>';
      sum_table += '<td>' + result['cax'] + '</td>';
      sum_table += '<td>' + result['cgx'] + '</td>';
      sum_table += '<td>' + Math.floor(result['gpax']*100) / 100 + '</td>';
      sum_table += '<td>' + result['gpx'] + '</td>';
    }
    sum_table += '</tr>';
    $('.sum_grade_table').html(sum_table);
  }


});
