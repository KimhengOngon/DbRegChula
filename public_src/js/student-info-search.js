/* global searchOptions, dataTableLanguage */

$(function () {
  console.log(searchOptions);
  $('#search_result').DataTable({
    serverSide: true,
    searching: false,
    ajax: {
      url: '/student-info/search-data',
      data: {
        additionalOptions: searchOptions // This is global data on the ejs page
      }
    },
    columns: [
      { data: 'sid' },
      { data: 'fname_en' },
      { data: 'lname_en' },
      { data: 'year' },
      { data: 'behaviorScore' },
      {
        data: 'sid',
        render: function (data) {
          return '<a href="/student-info/' + data + '">Open</a>';
        }
      }
    ],
    language: dataTableLanguage // This is global variable from data-table-language
  });
});
