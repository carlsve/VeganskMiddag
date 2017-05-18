$(document).ready(function() {

    $.get("/api", function(responseBody) {
      console.log(responseBody);
    });
});
