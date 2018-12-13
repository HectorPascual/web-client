$(document).ready(function(){
  var base_url = "http://pbe-project.herokuapp.com/"
  $("#login_button").click(function(){
    var name = $("#name").val();
    var password = $("#pass").val();
    // Checking for blank fields.
    var Url = base_url +"auth?"+password
    if( name =='' || password ==''){
      alert("Please fill all fields...!");
      console.log("hey")
    } else{

      $.ajax({
        url: Url,
        type:"GET",
        success: function(result){
          console.log(result)
          console.log("precheck")
          if(result!=[]){
            console.log("postcheck")
            name_db = result[0].name
            uid_db = result[0].uid
            if(name == name_db && password == uid_db){
                alert("Login Succesful")
                $("#login-div").hide()
                updateUI(name)
            }
          }
          else{
            alert("Wrong username or password")
          }
        },
        error: function(error){
          console.log('Error : '+ $(error))
        }
      });
    }
  });

  function updateUI(name){
    //HIDE LOGIN
    $("#name").hide()
    $("#pass").hide()
    $("#user-label").hide()
    $("#pass-label").hide()
    $("#login_button").hide()

    var welc_text = $("#welcome_text")
    welc_text.html("Welcome " + name)
    welc_text.show()

    $("#logout_button").show()

    //SHOW QUERY INPUT AREA
    var query_input = $("#query_input")
    query_input.show()
    query_input.off("keydown").on( "keydown", function(event) {
      if(event.which == 13){
        var query = query_input.val();
        console.log(query)
        query_input.val('')
        var Url = base_url + query
        $.ajax({
          url: Url,
          type:"GET",
          success: function(result){
              createTable(result)
              $("#showData").show()
          },
          error: function(error){
            console.log('Error : '+ $(error))
          }
        });
    }
    });


    $("#logout_button").click(function(){

      var Url = base_url + "logout"

        $.ajax({
          url: Url,
          type:"GET",
          success: function(result){

          },
          error: function(error){
            $("#login-div").show()
            $("#name").show().val('')
            $("#pass").show().val('')
            $("#user-label").show()
            $("#pass-label").show()
            $("#login_button").show()

            $("#showData").hide()
            $("#welcome_text").hide()
            $("#logout_button").hide()
            $("#query_input").hide()
            }
        });

    });

  }

  function createTable(result){
     var color_classes=["table-light","table-info"]
     var col = [];

     for (var key in result[0]) {
         if (key!="_id" && key!="uid") {
             col.push(key);
         }
     }
     var table = document.createElement("table");
     console.log("table created")
     table.setAttribute("class", "table table-bordered");
     table.setAttribute("id","data_table")
     //table.addClass("table-bordered")
     //The value of -1 can also be used, this results in a new row being inserted at the last position.
     var tr = table.insertRow(-1);                   // TABLE ROW.

     for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.setAttribute("class","bg-primary");
        th.setAttribute("style","color: white;");
        th.innerHTML = col[i];
        tr.appendChild(th);
     }

     // ADD JSON DATA TO THE TABLE AS ROWS.
     for (var i = 0; i < result.length; i++) {

        tr = table.insertRow(-1);
        tr.setAttribute("class",color_classes[i%2])
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = result[i][col[j]];
        }
     }

     // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
     var divContainer = document.getElementById("showData");
     divContainer.innerHTML = "";
     divContainer.appendChild(table);

  }
});
