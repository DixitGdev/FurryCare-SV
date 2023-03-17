
var limit = 10;
var start = 1;
function pagination(start) {
    var search = $("#search").val();
    jQuery.ajax({
      type: "POST",
      url: BASE_URL + "admin/holiday/list/" + start + "/" + limit,
      data: {
        search: search,
      },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          $(".pagination").html(data.html);
          $(".pagination-text").html(data.text);
          console.log("list>>>>", data.list);
          
          html(data.list);
        }
      },
    });
  }
  var id
  function html(list) {
    console.log("list>", list);
    var htmlData = "";
    
    for (var i = 0; i <= list.length; i++) {
      if (i == list.length) {
        $(".table-data").html(htmlData);
      } else {

        htmlData += "<tr><td>" + list[i].title + "</td>";
        htmlData += "<td >" + list[i].year + "</td>";
        htmlData += "<td >" + list[i].date + "</td>";
        htmlData += "<td >" + list[i].status + "</td>";
        
        htmlData += "<td>";
        htmlData +=
          "<a  onclick=\"view('" +
          list[i]._id +
          '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" ><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>';
        htmlData +=
          "<a  onclick=\"remove('" +
          list[i]._id +
          '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>';
        htmlData += "</td>";
        htmlData += "</tr>";
      }
    }
  }






function Reset(){
  $("#title").val("");
    $("#year").val(""),
    $("#date").val(""),
    $("input:radio[name=active_status]")[0].checked = true;
    $("input:radio[name=active_status]")[1].checked = false;
}

function add_record() {
    Reset();
    $("#edit-modal").modal("show");
    $(".popup-title").html("<h2>Add Holiday</h2>");

  }
  

jQuery(document).ready(function ($) {
    pagination(start);
    
  
    $(document).on("hide.bs.modal", "#edit-modal", function () {
      $("#Id").val("");
      $("#title").val("");
      $("#year").val("");
      $("#date").val("");
    });
  
    $("#edit_users").on("submit", function (e) {
      e.preventDefault();
      $(".indicator-progress").css("display", "contents");
  
      if ($("#title").val() != "") {
        //ajax call for login
        $.ajax({
          type: "POST",
          url: BASE_URL + "admin/holiday/save",
          data: {
            id: $("#Id").val(),
            title:$("#title").val(),
            year: $("#year").val(),
            date: $("#date").val(),
            active: $("input[type='radio'].form-check-input:checked").val()
          },
          success: function (response) {
            console.log("xxxx", response);
            $(".indicator-progress").hide();
            if (response.err == 1) {
              $("#success_msg").hide();
              $("#error_msg").show();
              $(".error_msg").html(response.msg);
              Swal.fire({
                text: response.msg,
                icon: "error",
                buttonsStyling: !1,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
            } else {
              $("#edit_users").trigger("reset");
              $("#edit-modal").modal("hide");
              Swal.fire({
                text: response.msg,
                icon: "success",
                buttonsStyling: !1,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
              $("#success_msg").show();
              $("#error_msg").hide();
              $(".success_msg").html(response.msg);
  
              start = 1;
              pagination(start);
            }
          },
        });
      } else {
        Swal.fire({
          text: "Fields can't be empty",
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    });
  });

  function view(id) {
   
    jQuery.ajax({
      type: "POST",
      url: BASE_URL + "admin/holiday/view",
      data: {
        id: id,
      },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          $("#Id").val(data._id);
          $("#title").val(data.title);
          $("#year").val(data.year);
          $("#date").val((data.date));        
          // if (data.active === true) {
          //   $("input:radio[name=active_status]")[0].checked = true;
          // } else {
          //   $("input:radio[name=active_status]")[1].checked = true;
          // }
          $(`input:radio[name=active_status][value=${data.active}]`).prop(
            "checked",
            true
          );
          $(".popup-title").html("<h2>Edit Holiday</h2>");
          $("#edit-modal").modal("show");
        }
      },
    });
  }



  function remove(id) {
    $("#kt_modal_new_target").modal("hide");
    Swal.fire({
      text: "Are you sure you would like to delete?",
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, return",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-light",
      },
    }).then(function (result) {
      if (result.value) {
        $.ajax({
          type: "POST",
          url: BASE_URL + "admin/holiday/delete",
          data: {
            id: id,
          },
          success: function (response) {
            if (response.err == 1) {
              Swal.fire({
                text: response.msg,
                icon: "error",
                buttonsStyling: !1,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
            } else {
              Swal.fire({
                text: response.msg,
                icon: "success",
                buttonsStyling: !1,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
              start = 1;
              pagination(start);
            }
          },
        });
      }
    });
  }

  