var limit = 10;
var start = 1;

function products_list() {
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/listall/groomerproducts",
    data: {},
    success: function (response) {
      // console.log("response >> ", response);
      if (response.err == 0) {
        var html = "<option value=''>Select Product</option>";
        data = response.data;
        for (var i = 0; i <= data.length; i++) {
          if (i == data.length) {
            $("#product").html(html);
            $("#product").select2({ minimumResultsForSearch: -1 });
          } else {
            html +=
              '<option value="' +
              data[i]._id +
              '">' +
              data[i].name +
              "</option>";
          }
        }
      }
    },
  });
}
function groomer_list() {
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/groomers/list_all",
    data: {},
    success: function (response) {
      // console.log("response >> ", response);
      if (response.err == 0) {
        var html = "<option value=''>Select Groomer</option>";
        data = response.data;
        for (var i = 0; i <= data.length; i++) {
          if (i == data.length) {
            $("#groomer").html(html);
            $("#groomer").select2({ minimumResultsForSearch: -1 });
          } else {
            html +=
              '<option value="' +
              data[i]._id +
              '">' +
              data[i].name +
              "</option>";
          }
        }
      }
    },
  });
}

// function state_list() {
//   var code = $("#country").val();
//   // console.log(code);
//   jQuery.ajax({
//     type: "GET",
//     url: BASE_URL + "admin/allstate/" + code,
//     data: {},
//     success: function (response) {
//       // console.log("response >> ", response);
//       if (response.err == 0) {
//         var html = "<option value=''>Select State</option>";
//         data = response.data;
//         for (var i = 0; i <= data.length; i++) {
//           if (i == data.length) {
//             $("#state").html(html);
//             $("#state").select2({ minimumResultsForSearch: -1 });
//           } else {
//             html +=
//               '<option value="' +
//               data[i]._id +
//               '">' +
//               data[i].name +
//               "</option>";
//           }
//         }
//       }
//     },
//   });
// }

// function city_list() {
//   var code = $("#state").val();
//   jQuery.ajax({
//     type: "GET",
//     url: BASE_URL + "admin/allcity/" + code,
//     data: {},
//     success: function (response) {
//       // console.log("response >> ", response);
//       if (response.err == 0) {
//         var html = "<option value=''>Select City</option>";
//         data = response.data;
//         for (var i = 0; i <= data.length; i++) {
//           if (i == data.length) {
//             $("#city").html(html);
//             $("#city").select2({ minimumResultsForSearch: -1 });
//           } else {
//             html +=
//               '<option value="' +
//               data[i]._id +
//               '">' +
//               data[i].name +
//               "</option>";
//           }
//         }
//       }
//     },
//   });
// }

// function search() {
//   var title = $("#search").val();
//   jQuery.ajax({
//     type: "POST",
//     url: BASE_URL + "admin/",
//   });
// }

function Reset() {
  $("#select2-groomer-container").html("Select Groomer");
  $("#select2-product-container").html("Select Product");

  $("#groomer").val("");
  $("#product").val("");

  $("#quantity").val("");

  $("input:radio[name=status]")[0].checked = true;
  $("input:radio[name=status]")[1].checked = false;
}

//digit pagination called
function pagination(start) {
  jQuery.ajax({
    type: "POST",
    url: BASE_URL + "admin/groomer_tool_req/list/" + start + "/" + limit,
    data: {},
    success: function (response) {
      // console.log("response..", response);
      if (response.err == 0) {
        var data = response.data;
        $(".pagination").html(data.html);
        $(".pagination-text").html(data.text);
        // console.log(data.list);
        html(data.list);
      }
    },
  });
}

function html(list) {
  // console.log("list>",list)
  var htmlData = "";
  for (var i = 0; i <= list.length; i++) {
    if (i == list.length) {
      $(".table-data").html(htmlData);
    } else {
      // for formating the Date
      let date = new Date(list[i].created_at);
      let options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "UTC"
      };
      let formattedDate = date.toLocaleString("en-IN", options);
      formattedDate = formattedDate.replace("am", "am".toUpperCase()).replace("pm", "pm".toUpperCase());

      //for binding data in frontend
      htmlData += "<tr><td>" + list[i].groomer + "</td>";
      htmlData += "<td>" + list[i].product + "</td>";
      htmlData += "<td>" + list[i].quantity + "</td>";
      htmlData += "<td>" + list[i].status + "</td>";
      htmlData += "<td>" + formattedDate + "</td>";
      htmlData += "<td>";
      htmlData +=
        '<a href="javascript:;" onclick="view(\'' +
        list[i]._id +
        '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>';
      htmlData +=
        '<a href="javascript:;" onclick="remove(\'' +
        list[i]._id +
        '\');" id="deletebtn" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>';
      htmlData += "</td>";
      htmlData += "</tr>";
    }
  }
}

function view(id) {
  products_list();
  groomer_list();
  // state_list();

  setTimeout(() => {
    jQuery.ajax({
      type: "POST",
      url: BASE_URL + "admin/groomer_tool_req/view",
      data: {
        id: id,
      },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;

          $("#Id").val(data._id);
          $("#groomer").val(data.groomer);
          $("#select2-groomer-container").html(data.groomername);

          $("#product").val(data.product);
          $("#select2-product-container").html(data.productname);

          $("#quantity").val(data.quantity);

          if (data.status == "Pending") {
            $("input:radio[name=status]")[0].checked = true;
          } else {
            $("input:radio[name=status]")[1].checked = true;
          }

          $(".popup-title").html("<h2>Edit Groomer tool request</h2>");
          $("#edit-modal").modal("show");
        }
      },
    });
  }, 300);
}

function add_record() {
  Reset();
  $(".popup-title").html("<h2>Add Groomer tool request</h2>");
  //   $("#city").html("");
  //   $("#state").html("");
  $("#edit-modal").modal("show");
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
        url: BASE_URL + "admin/groomer_tool_req/delete",
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

jQuery(document).ready(function ($) {
  pagination(start);
  products_list();
  groomer_list();
  // state_list();

  $(document).on("hide.bs.modal", "#edit-modal", function () {
    $("#Id").val("");
    $("#groomer").val("");
    $("#product").val("");
    $("#quantity").val("");
    $("input:radio[name=status]")[0].checked = true;
    $("input:radio[name=status]")[1].checked = false;
  });

  $("#edit_users").on("submit", function (e) {
    e.preventDefault();
    $(".indicator-progress").css("display", "contents");

    if ($("#quantity").val() != "") {
      //ajax call for login
      $.ajax({
        type: "POST",
        url: BASE_URL + "admin/groomer_tool_req/save",
        data: {
          id: $("#Id").val(),
          groomer: $("#groomer").val(),
          product: $("#product").val(),
          quantity: $("#quantity").val(),
          status: $("input[type='radio'].form-check-input:checked").val(),
        },
        success: function (response) {
          // console.log("response");
          $(".indicator-progress").hide();

          // resetForm();
          if (response.err == 1) {
            $("#success_msg").hide();
            $("#error_msg").show();
            $(".error_msg").html(response.msg);
            // resetForm();
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
