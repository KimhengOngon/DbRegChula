$(function() {
  let sid = $('#sid').html()
  let ent = $('#ent_year').html()
  let year = $('#year').html()
  year = Number(ent) + Number(year) - 1
  console.log(year);
  $.ajax({
      method: "POST",
      url: "/enroll/summary",
      data: {
        sid: sid,
        year: year,
        semester: 1,
        ent_year: ent
      }
    })
    .done(function(result) {
      console.log(result);
      if(result.gpax < 1.8) {
        $('.info_probation').html(`<td><b>ติดโปร</b></td>
          <td>สูง</td>`);
      } else if(result.gpax < 2.0) {
        $('.info_probation').html(`<td><b>ติดโปร</b></td>
          <td>ต่ำ</td>`);        
      }
    });

})
