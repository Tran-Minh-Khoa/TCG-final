// Call the dataTables jQuery plugin
$(document).ready(function() {
  var table = $('#table-card').DataTable();

   // Add checkboxes to each row
    $('#table-card tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
    });

    // Handle checkbox click events
    $('#table-card tbody').on('click', 'input[type="checkbox"]', function(e){
        e.stopPropagation();
    });

    // Get selected rows data
    $('#btnShowSelected').click(function(){
        var data = table.rows('.selected').data();
        console.log(data);
    });
});
