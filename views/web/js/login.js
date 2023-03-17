jQuery(document).ready(function($) {
    console.log('====================================');
    console.log("login form js");
    console.log('====================================');
    $('#kt_login_form').on('submit', function(e) {
        e.preventDefault();
        $(".indicator-progress").css("display", "contents");
        //get data in variable
        var username = $("#username").val();
        var password = $("#password").val();
        //ajax call for login
        // $.ajax({
        //     type : "POST",
        //     url  : BASE_URL+"admin/login",
        //     data : {
        //         username : username,
        //         password : password
        //     },
        //     success:function(response){
        //         $(".indicator-progress").hide();
        //         if(response.err == 1) {
        //             $("#success_msg").hide();
        //             $("#error_msg").show();
        //             $(".error_msg").html(response.msg);
        //             Swal.fire({
        //                 text: response.msg,
        //                 icon: "error",
        //                 buttonsStyling: !1,
        //                 confirmButtonText: "Ok, got it!",
        //                 customClass: {
        //                     confirmButton: "btn btn-primary"
        //                 }
        //             })
        //         } else {
        //             Swal.fire({
        //                 text: "You have successfully logged in!",
        //                 icon: "success",
        //                 buttonsStyling: !1,
        //                 confirmButtonText: "Ok, got it!",
        //                 customClass: {
        //                     confirmButton: "btn btn-primary"
        //                 }
        //             });
        //             $("#success_msg").show();
        //             $("#error_msg").hide();
        //             $(".success_msg").html(response.msg);
        //             window.location = BASE_URL+"admin/dashboard";
        //         }
        //     }
        // });
    });
});
