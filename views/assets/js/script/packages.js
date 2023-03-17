var limit = 10;
var start = 1;

//digit pagination called
function pagination(start) {
  var search = $("#search").val();
  jQuery.ajax({
    type: "POST",
    url: BASE_URL + "admin/packages/list/" + start + "/" + limit,
    data: {
      search: search
    },
    success: function (response) {
      if (response.err == 0) {
        var data = response.data;
        $(".pagination").html(data.html);
        $(".pagination-text").html(data.text);
        html(data.list);
      }
    }
  });
}



function html(list) {
  // console.log("list>",list)
  var htmlData = "";
  for (var i = 0; i <= list.length; i++) {
    if (i == list.length) {
      $(".table-data").html(htmlData);
    } else {
      htmlData += "<tr><td>" + list[i].category_name + "</td>";
      htmlData += "<td>" + list[i].subcategory_name + "</td>";
      htmlData += "<td>" + list[i].title + "</td>";
      htmlData += "<td>" + list[i].description + "</td>";
      htmlData += "<td>" + list[i].price + "</td>";
      htmlData += "<td>" + list[i].city_name + "</td>";
      htmlData += "<td>" + list[i].state_name + "</td>";
      htmlData += "<td>" + list[i].country_name + "</td>";
      htmlData += "<td>" + list[i].pet + "</td>";
      htmlData += "<td>";
      htmlData +=
        '<a href="javascript:;" onclick="view(\'' +
        list[i]._id +
        '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>';
      htmlData +=
        '<a href="javascript:;" onclick="remove(\'' +
        list[i]._id +
        '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>';
      htmlData += "</td>";
      htmlData += "</tr>";
    }
  }
}
function category_list() {
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/packages/category",
    data: {},
    success: function (response) {
      console.log("response >> ", response);
      if (response.err == 0) {
        var html = "<option value=''>Select category_id</option>";
        data = response.data;
        console.log("data", data);
        for (var i = 0; i <= data.length; i++) {
          if (i == data.length) {
            $("#category").html(html);
            $("#category").select2({ minimumResultsForSearch: -1 });
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

function subcategory_list() {
  var _id = $("#category").val();
  console.log("_id", _id);
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/packages/subcategory/" + _id,
    data: {},
    success: function (response) {
      console.log("response >> ", response);
      if (response.err == 0) {
        var html = "<option value=''>Select subcategory_id</option>";
        data = response.data;
        console.log("data", data);
        for (var i = 0; i <= data.length; i++) {
          if (i == data.length) {
            $("#subcategory").html(html);
            $("#subcategory").select2({ minimumResultsForSearch: -1 });
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

function country_list() {
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/country/listall",
    data: {},
    success: function (response) {
      console.log("response >> ", response);
      if (response.err == 0) {
        var html = "<option value=''>Select Country</option>";
        data = response.data;
        console.log("data", data);
        for (var i = 0; i <= data.length; i++) {
          if (i == data.length) {
            $("#country").html(html);
            $("#country").select2({ minimumResultsForSearch: -1 });
          } else {
            html +=
              '<option value="' +
              data[i].country_code +
              '">' +
              data[i].name +
              "</option>";
          }
        }
      }
    },
  });
}

function state_list() {
  var code = $("#country").val();
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/allstate/" + code,
    data: {},
    success: function (response) {
      console.log("response >> ", response);
      if (response.err == 0) {
        var html = "<option value=''>Select State</option>";
        data = response.data;
        for (var i = 0; i <= data.length; i++) {
          if (i == data.length) {
            $("#state").html(html);
            $("#state").select2({ minimumResultsForSearch: -1 });
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


function city_list() {
  var state_id = $("#state").val();
  jQuery.ajax({
    type: "GET",
    url: BASE_URL + "admin/allcity/" + state_id,
    data: {},
    success: function (response) {
      console.log("response >> ", response);
      if (response.err == 0) {
        var html = "<option value=''>Select city</option>";
        data = response.data;
        for (var i = 0; i <= data.length; i++) {
          if (i == data.length) {
            $("#city").html(html);
            $("#city").select2({ minimumResultsForSearch: -1 });
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

function view(id) {

  country_list()

  // Reset()
  jQuery.ajax({
    type: "POST",
    url: BASE_URL + "admin/packages/view",
    data: {
      id: id,
    },

    success: function (response) {
      if (response.err == 0) {
        var data = response.data;
        $("#Id").val(data._id);
        $("#category").val(data.category_id)
        $("#subcategory").val(data.subcategory_id)
        $("#title").val(data.title);
        $("#descreption").val(data.description);
        $("#price").val(data.price);
        $("#category").val(data.category_id);
        $("#select2-category-container").html(data.category_name);
        
        subcategory_list();

        setTimeout(() => {
          $("#subcategory").val(data.subcategory_id);
          $("#select2-subcategory-container").html(data.subcategory_name);
        }, 300);


        $("#country").val(data.country);
        $("#select2-country-container").html(data.country_name);
        state_list();

        setTimeout(() => {
          $("#state").val(data.state);
          $("#select2-state-container").html(data.state_name);
        }, 300);

        setTimeout(() => {
          city_list();
        }, 300);

        setTimeout(() => {
          $("#city").val(data.city);
          $("#select2-city-container").html(data.city_name);
        }, 500);

        if (data.pet == "dog") {
          $("input:radio[name=pet_type]")[0].checked = true;
        } else {
          $("input:radio[name=pet_type]")[1].checked = true;
        }

        $("#edit-modal").modal("show");
      }
    },
  });
}


function Reset() {
  $("#select2-category-container").html("Category");
  $("#select2-subcategory-container").html("No Category Selected");
  $("#title").val("");
  $("#description").val("");
  $("#price").val("");
  $("#select2-country-container").html("Country");
  $("#select2-state-container").html("No Country Selected");
  $("#select2-city-container").html("No State Selected");
  $("#country").val("");
  $("#state").val("");
  $("#city").val("");
  $("input:radio[name=pet_type]")[0].checked = true;
  $("input:radio[name=pet_type]")[1].checked = false;
}

function add_record() {
  Reset();
  $("#edit-modal").modal("show");
}


// $('#kt_modal_new_target_submit').click(function() {
//   location.reload();
// });

// $('#close').click(function() {
//   location.reload();
// });




// $("#addNew").click(function () {
//   $("#category").val('');
//   $("#subcategory").val('');
//   $("#title").val('');
//   $("#descreption").val('');
//   $("#price").val('');
//   $("#country").val('');
//   $("#state").val('');
//   $("#city").val('');
// });




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
        url: BASE_URL + "admin/packages/delete",
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
  category_list()
  country_list();

  $("#country").on("change", function (e) {
    state_list();
    $("#city").html("");
  });

  $("#state").on("change", function (e) {
    city_list();
  });

  $("#category").on("change", function (e) {
    console.log("ssss");
    subcategory_list();
  });


  $(document).on("hide.bs.modal", "#edit-modal", function () {
    $("#Id").val("");
    $("#category").val("");
    $("#subcategory").val("");
    $("#title").val("");
    $("#descreption").val("");
    $("#price").val("");
    $("#country").val("");
    $("#state").val("");
    $("#city").val("");
    $("input:radio[name=pet_type]")[0].checked = true;
    $("input:radio[name=pet_type]")[1].checked = false;
  });

  $("#edit_users").on("submit", function (e) {
    e.preventDefault();
    $(".indicator-progress").css("display", "contents");

    if ($("#title").val() != "") {
      //ajax call for login
      $.ajax({
        type: "POST",
        url: BASE_URL + "admin/packages/save",
        data: {
          id: $("#Id").val(),
          category_id: $("#category").val(),
          subcategory_id: $("#subcategory").val(),
          title: $("#title").val(),
          description: $("#descreption").val(),
          price: $("#price").val(),
          country: $("#country").val(),
          state: $("#state").val(),
          city: $("#city").val(),
          pet: $("input[type='radio'].form-check-input:checked").val(),
        },
        success: function (response) {
          console.log("data", response);
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



