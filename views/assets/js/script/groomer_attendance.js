var limit = 10;
var start = 1;
let selectedGroomerId = "";
let selectedGroomerName = "";
var break_count = 0;

function pagination(start) {
  var search = $("#search").val();
  jQuery.ajax({
    type: "POST",
    url: BASE_URL + "admin/groomer_attendance/list/" + start + "/" + limit,
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

function html(list) {
  console.log("list>", list);
  var htmlData = "";

  for (var i = 0; i <= list.length; i++) {
    if (i == list.length) {
      $(".table-data").html(htmlData);
    } else {
      let date = new Date(list[i].date);
      let stime = new Date(list[i].start_time);
      let etime = new Date(list[i].end_time);
      let options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: true,
        timeZone: "UTC",
      };
      let options2 = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "IST",
      };

      let formattedDate = date.toLocaleString("en-IN", options);
      let stimeformat = stime.toLocaleString("en-IN", options2);
      let etimeformat = etime.toLocaleString("en-IN", options2);

      htmlData += "<tr><td>" + list[i].groomern + "</td>";
      htmlData += "<td >" + formattedDate + "</td>";
      htmlData += "<td >" + stimeformat + "</td>";
      htmlData += "<td >" + etimeformat + "</td>";
      htmlData += "<td >" + list[i].total_hours + "</td>";
      htmlData += "<td >" + list[i].break_hours + "</td>";
      htmlData += "<td >" + list[i].working_hours + "</td>";
      htmlData += "<td >" + list[i].early_reason + "</td>";

      htmlData += "<td>";
      htmlData += `<a  onclick="view('${list[i]._id}', '${list[i].groomer_id}','${list[i].groomern}')"
        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" ><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path></svg></span></a>`;
      htmlData +=
        "<a  onclick=\"remove('" +
        list[i]._id +
        '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"><span class="svg-icon svg-icon-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path></svg></span></a>';
      htmlData += "</td>";
      htmlData += "</tr>";
    }
  }
}

var res;

function view(id, groomer_id, groomer_n) {
  console.log("id", id, "groomer", groomer);
  selectedGroomerName = groomer_n;
  selectedGroomerId = groomer_id;
  var html = "";
  setTimeout(() => {
    jQuery.ajax({
      type: "POST",
      url: BASE_URL + "admin/groomer_attendance/view",
      data: {
        id: id,
      },
      success: function (response) {
        if (response.err == 0) {
          var data = response.data;
          $("#Id").val(data._id);
          $("#groomer").val(data.groomer_id);
          //$("#select2-groomer-container").html(data.groomername);
          $("#reason").val(data.early_reason);

          function formathour(time) {
            var stimedatehour = new Date(time).getHours().toString();
            let formattedHours = String(stimedatehour).padStart(2, "0");
            var stimedatemin = new Date(time).getMinutes().toString();
            let formattedmin = String(stimedatemin).padStart(2, "0");

            let startval = formattedHours.concat(":", formattedmin);
            return startval;
          }

          $("#date").val(data.date);
          $("#date1").val(formathour(data.start_time));
          $("#date2").val(formathour(data.end_time));

          res = data.break_data;
          break_count = res.break_ins.length;
          if (res) {
            for (i = 0; i < res.break_ins.length; i++) {
              html += `<div class="row g-9 mb-5 extra-break-div-${i} break_item" style="margin-top: auto;">
              <div class="col-md-4 fv-row">
              <label class="required fs-6 fw-bold mb-2"> Break In</label>
              <input type="time" class="form-control form-control-solid" name="break_in[]" id="break_in${i}" value="${formathour(
                res.break_ins[i]
              )}" required />
            </div>
            <div class="col-md-4 fv-row">
              <label class="required fs-6 fw-bold mb-2"> Break out</label>
              <input type="time" class="form-control form-control-solid" name="break_out[]" id="break_out${i}" value="${formathour(
                res.break_outs[i]
              )}" required />
            </div>
            <div class="col-md-4 fv-row">
            <label class=" fs-6 fw-bold mb-2"></label>
            <button type="button" id="add_break_information" onclick="add_break()" class="btn btn-primary mt-2">
              <span class="indicator-label">+</span>
            </button>
            ${
              res.break_ins.length > 1
                ? `
              <button type="button" id="remove_break_information" onclick="remove_extra_break(${i})" class="btn btn-warning mt-2">
              <span class="indicator-label">-</span>
              </button>     
            `
                : ``
            }
            </div>
                 
        </div>`;
            }
          }

          $("#break").html(html);
          $("#totaltime").html(data.total_hours);
          $(".popup-title").html("<h2>Edit Groomer Attendance</h2>");
          $("#edit-modal").modal("show");
          setSelectedOption();
        }
      },
    });
  }, 0);
}

console.log("res>>>>", res);

function Reset() {
  $("#select2-groomer-container").html("Select Groomer");
  $("#groomer").val("");
  $("#date").val("");
  $("#totaltime").html("");
  $("#date1").val("");
  $("#date2").val("");
  // $(".extra-break").html("");
  $("#break").html(`
    <div class="col-md-4 fv-row">
      <label class="required fs-6 fw-bold mb-2"> Break In</label>
      <input type="time" class="form-control form-control-solid" name="break_in[]" id="break_in"  />
    </div>
    <div class="col-md-4 fv-row">
      <label class="required fs-6 fw-bold mb-2"> Break out</label>
      <input type="time" class="form-control form-control-solid" name="break_out[]" id="break_out"  />
    </div>
    <div class="col-md-1 fv-row">
      <label class=" fs-6 fw-bold mb-2"></label>
       <button type="button" id="add_break_information" onclick="add_break()" class="btn btn-primary mt-2">
      <span class="indicator-label">+</span>
    </button>
    </div>
    `);

  $("#totalbreaktime").html("");

  $("#reason").val("");
}

function add_record() {
  Reset();

  // groomer_list();
  //$("#groomer").select2();
  $("#edit-modal").modal("show");
  $(".popup-title").html("<h2>Add Groomer Attendance</h2>");
}

jQuery(document).ready(function ($) {
  pagination(start);
  // groomer_list();

  console.log("code runn");
  $("#groomer").select2({
    dropdownParent: $("#edit-modal"),
    ajax: {
      type: "POST",
      url: BASE_URL + "admin/groomer_leave/list_groomer",
      dataType: "json",
      data: (params) => {
        console.log("params", params);
        return {
          search: params.term,
          type: "public",
        };
      },
      processResults: (data, params) => {
        console.log("data", data);
        const results = data.data.map((item) => {
          return {
            id: item._id,
            text: item.name,
          };
        });
        console.log("results", results);
        return {
          results,
        };
      },
    },
  });

  $(document).on("hide.bs.modal", "#edit-modal", function () {
    $("#Id").val("");
    // $("#groomer").val("");
    // $("#date1").val("");
    // $("#date2").val("");
    // $("#reason").val("");
    Reset();
  });

  function getBreakData(break_els) {
    let break_data = break_els
      .map(function () {
        return $(this).val();
      })
      .get()
      .filter((x) => x !== "00:00" || x !== "");
    if (break_data.length === 0) break_data = ["00:00"];
    return break_data;
  }

  $("#edit_users").on("submit", function (e) {
    e.preventDefault();
    // const break_in = getBreakData($("input[name='break_in[]']"));
    // const break_out = getBreakData($("input[name='break_out[]']"));

    var break_in = $("input[name='break_in[]']")
      .map(function () {
        return $(this).val();
      })
      .get()
      .filter((x) => x !== "00:00" && x !== "");
      
    var break_out = $("input[name='break_out[]']")
      .map(function () {
        return $(this).val();
      })
      .get()
      .filter((x) => x !== "00:00" && x !== "");

    if (break_in.length == 0) break_in = ["00:00"];
    if (break_out.length == 0) break_out = ["00:00"];

    console.log("break in", break_in);
    console.log("break out", break_out);

    $(".indicator-progress").css("display", "contents");

    if ($("#groomer").val() != "") {
      //ajax call for login
      $.ajax({
        type: "POST",
        url: BASE_URL + "admin/groomer_attendance/save",
        data: {
          id: $("#Id").val(),
          groomer_id: $("#groomer").val(),
          date: $("#date").val(),
          start_time: $("#date1").val(),
          end_time: $("#date2").val(),
          break_in: break_in,
          break_out: break_out,
          early_reason: $("#reason").val(),
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

function add_break() {
  console.log("nmxoppopopopopoppopo");
  var html = "";
  (html =
    '<div class="row g-9 mb-5 extra-break-div-' +
    break_count +
    ' break_item"><div class="col-md-4 fv-row">'),
    (html += '<label class="required fs-6 fw-bold mb-2"> Break In</label>'),
    (html +=
      ' <input type="time" class="form-control form-control-solid" name="break_in[]" id="break_in"  />');
  html += "</div>";
  html += ' <div class="col-md-4 fv-row">';
  html += '<label class="required fs-6 fw-bold mb-2"> Break out</label>';
  html +=
    '<input type="time" class="form-control form-control-solid" name="break_out[]" id="break_out"  />';
  html += "  </div>";

  html +=
    '<div class="col-md-1 fv-row"><button type="button" class="btn btn-warning remove-extra-month"  onclick="remove_extra_break(' +
    break_count +
    ')"><span class="indicator-label">-</span></button></div>';
  html += "</div>";

  //$(".extra-break").append(html);
  $("#break").append(html);

  break_count++;
}
function remove_extra_break(id) {
  console.log("idd>>", id);

  $(".extra-break-div-" + id).html("");
  $(".extra-break-div-" + id).removeClass("g-9 mb-5");

  console.log('$("#break").children().length', $("#break").children().length);

  if ($("#break").children().length === 2) {
    $(".break_item").find("#remove_break_information").remove();
  }
}

function setSelectedOption() {
  var data = {
    id: selectedGroomerId,
    text: selectedGroomerName,
  };
  console.log("data", data);
  var newOption = new Option(data.text, data.id, true, true);
  $("#groomer").append(newOption).trigger("change");
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
        url: BASE_URL + "admin/groomer_attendance/delete",
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
