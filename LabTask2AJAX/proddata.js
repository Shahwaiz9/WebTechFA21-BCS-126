function displayData() {
  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories",
    method: "GET",
    dataType: "json",
  success: function (data) {
    var List1 = $("#storiesList");
    List1.empty();

    $.each(data, function (index, element) {
      List1.append(
        `<div class="mb-3">
     <h2>${element.title}</h2>
      <p>${element.content}</p>
         <div>
            <button class="btn-edit" data-id="${element.id} ">Edit</button>
        <button class="btn-del" data-id="${element.id}">Delete</button>
        </div>
         </div>
          <hr />
          `
        );
      });
    },
    error: function (error) {
      console.error("Stories couldn't be fetched", error);
    },
  });
}

function deleteData() {
  let Id = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "https://usmanlive.com/wp-json/api/stories/" + Id,
    
    success: function () {
      displayData(); 
    },
    error: function (error) {
      console.error("Error in deletion", error);
    },
  });
}
function editData(event) {
  event.preventDefault();
  let storyId = $(this).attr("data-id");
  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
    method: "GET",
    success: function (data) {
      console.log(data);
      $("#clearBtn").show();
      $("#createTitle").val(data.title);
      $("#createContent").val(data.content);
      $("#createBtn").html("Update");
      $("#createBtn").attr("data-id", data.id);
    },
    error: function (error) {
      console.error("Error deleting story:", error);
    },
  });
}

function FormSubmission(event) {
  event.preventDefault();
  let Id = $("#createBtn").attr("data-id");
  var title = $("#createTitle").val();
  var content = $("#createContent").val();
  if (Id) {
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories/" + Id,
      method: "PUT",

      data: { title, content },
      success: function () {
        displayData(); 
      },
      error: function (error) {
        console.error("Error in submission:", error);
      },
    });
  } else {
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories",
      method: "POST",
      data: { title, content },
      success: function () {
        displayData(); 
      },
      error: function (error) {
        console.error("Error in post:", error);
      },
    });
  }
}
$(document).ready(function () {

  displayData();
  $(document).on("click", ".btn-del", deleteData);
  $(document).on("click", ".btn-edit", editData);
  
  $("#createForm").submit(FormSubmission);
  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    $("#clearBtn").hide();
    $("#createBtn").removeAttr("data-id");
    $("#createBtn").html("Create");
    $("#createTitle").val("");
    $("#createContent").val("");
  });
});