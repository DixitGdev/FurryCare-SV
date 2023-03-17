// ...rest of the initial code omitted for simplicity.
const { body, header, validationResult } = require('express-validator');

module.exports = {
    BindUrl: function () {
        /*
         * @REGISTER APIs
         * @Params
         *  - email
         *  - mobile_number
         *  - password
         *  - country_code
        **/
        app.post('/api/register',
            body('mobile_number').trim().optional({ checkFalsy: true }).isNumeric().withMessage('Only Numbers allowed'), //mobile number validation
            body('password').isLength({ min: 5 }).withMessage('Password not allowed'),  //password validation
            body('country_code').not().isEmpty().trim(), // country_code empty validation
            body('email').not().isEmpty().trim(), // email empty validation
            async (req, res) => {
                try {
                    // Finds the validation errors in this request and wraps them in an object with handy functions
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        var respData = commonController.errorValidationResponse(errors);
                        res.status(respData.ReturnCode).send(respData);
                    } else {
                        //calling controller function
                        var data = await req.body;
                        usersApiController.REGISTER(data, function (respData) {
                            res.status(respData.ReturnCode).send(respData);
                        });
                    }
                } catch (err) {
                    var respData = commonController.errorValidationResponse(err);
                    res.status(respData.ReturnCode).send(respData);
                }
            });
        /*
         * @Send Email OTP APIs
         * @Params
         *  - header - token
         *  - email
        **/
        app.post('/api/send-email-otp',
            body('email').not().isEmpty().trim(), // email empty validation
            async (req, res) => {
                try {
                    // Finds the validation errors in this request and wraps them in an object with handy functions
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        var respData = commonController.errorValidationResponse(errors);
                        res.status(respData.ReturnCode).send(respData);
                    } else {
                            //calling controller function
                            var data = req.body;
                            usersApiController.SEND_EMAIL_OTP(data, function (respData) {
                                if (typeof respData.StatusCode != "undefined") {
                                    res.status(respData.StatusCode).send(respData);
                                } else {
                                    res.status(respData.ReturnCode).send(respData);
                                }
                            });
                    }
                } catch (err) {
                    var respData = commonController.errorValidationResponse(err);
                    res.status(respData.ReturnCode).send(respData);
                }
            });
        /*
         * @Login APIs 
         * @Params
         *  - mobile_number
         *  - password
        **/
        app.post('/api/login',
            body('mobile_number').trim().optional({ checkFalsy: true }).isNumeric().withMessage('Only Numbers allowed'), //mobile number validation
            body('password').isLength({ min: 5 }).withMessage('Password not allowed'),  //password validation
            body('country_code').not().isEmpty().trim(), // country_code empty validation
            async (req, res) => {
                try {
                    // Finds the validation errors in this request and wraps them in an object with handy functions
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        var respData = commonController.errorValidationResponse(errors);
                        res.status(respData.ReturnCode).send(respData);
                    } else {
                        //calling controller function
                        var data = await req.body;
                        usersApiController.LOGIN(data, function (respData) {
                            res.status(respData.ReturnCode).send(respData);
                        })
                    }
                } catch (err) {
                    var respData = commonController.errorValidationResponse(err);
                    res.status(respData.ReturnCode).send(respData);
                }
            });
        /*
         * @LogoutAPIs 
         * @Params
         *  - header - token
        **/
        app.get('/api/logout',
        header('authorization').not().isEmpty().trim(), // header authorization token validation
        (req,res)=> {
            try {
                // Finds the validation errors in this request and wraps them in an object with handy functions
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    var respData = commonController.errorValidationResponse(errors);
                    res.status(respData.ReturnCode).send(respData);
                } else {
                    apiJwtController.DECODE(req, function (respData) {
                        if (respData.ReturnCode !== 200) {
                            res.status(respData.ReturnCode).send(respData);
                        } else {
                            //calling controller function
                            var data = req.body;
                            var token = req.headers['authorization'];
                            data.token = token
                            data.userData = respData.Data;
                            usersApiController.LOGOUT(data, function (respData) {
                                res.status(respData.ReturnCode).send(respData);
                            });
                        }
                    });
                }
            } catch (err) {
                var respData = commonController.errorValidationResponse(err);
                res.status(respData.ReturnCode).send(respData);
            }
        })

        /*
         * @Change Password APIs
         * @Params
         *  - old_password
         *  - new_password
         *  - confirm_password
        **/
        app.post('/api/change-password',
            body('old_password').isLength({ min: 5 }).withMessage('Old Password not allowed'), // old_password empty validation
            body('new_password').isLength({ min: 5 }).withMessage('New Password not allowed'), // new_password empty validation
            body('confirm_password').isLength({ min: 5 }).withMessage('Confirm Password not allowed'), // confirm_password empty validation
            header('authorization').not().isEmpty().trim(), // header authorization token validation
            (req, res) => {
                try {
                    // Finds the validation errors in this request and wraps them in an object with handy functions
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        var respData = commonController.errorValidationResponse(errors);
                        res.status(respData.ReturnCode).send(respData);
                    } else {
                        apiJwtController.DECODE(req, function (respData) {
                            if (respData.ReturnCode !== 200) {
                                res.status(respData.ReturnCode).send(respData);
                            } else {
                                //calling controller function
                                var data = req.body;
                                data.userData = respData.Data;
                                usersApiController.CHANGE_PASSWORD(data, function (respData) {
                                    res.status(respData.ReturnCode).send(respData);
                                });
                            }
                        });
                    }
                } catch (err) {
                    var respData = commonController.errorValidationResponse(err);
                    res.status(respData.ReturnCode).send(respData);
                }
            });

        /*
         * @Forgot Password APIs
         * @Params
         *  - email
        **/
        app.post('/api/forgot-password',
            body('type').isIn(['0','1']), // in type select valid value validation
            (req, res) => {
                try {
                    //Find the validation errors in this request and wraps them in an object with handy functions
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        var respData = commonController.errorValidationResponse(errors);
                        res.status(respData.ReturnCode).send(respData);
                    } else {
                        // calling controller function
                        var data = req.body;
                        usersApiController.FORGOT_PASSWORD(data, function (respData) {
                            res.status(respData.ReturnCode).send(respData);
                        });
                    }
                } catch (err) {
                    var respData = commonController.errorValidationResponse(err);
                    res.status(respData.ReturnCode).send(respData)
                }
            });

        /*
          * @Verify Forgot Password APIs
          * @Params
          *  - email
          *  - otp 
         **/
        app.post('/api/verify-forgot-password',
            body('type').isIn(['0','1', 0, 1]), // in tpye select valid value validation
            body('otp').not().isEmpty().trim(), // otp empty validation
            (req, res) => {
                console.log("req>>",req.body);
                try {
                    //Find the validation errors in this request and wraps them in an object with handy functions
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        var respData = commonController.errorValidationResponse(errors);
                        res.status(respData.ReturnCode).send(respData);
                    } else {
                        //calling controller function
                        var data = req.body;
                        console.log("psd>>",data);
                        usersApiController.VERIFY_FORGOT_PASSWORD(data, function (respData) {
                            res.status(respData.ReturnCode).send(respData)
                        });
                    }
                } catch (err) {
                    console.log("err>>",err);
                    var respData = commonController.errorValidationResponse(err);
                    res.status(respData.ReturnCode).send(respData)
                }
            });

        /*
         * @Reset Forgot Password APIs
         * @Params
         *  - email
         *  - otp   
         *  - new password 
        **/
        app.post('/api/reset-forgot-password',
        body('type').isIn(['0','1']), // in type select valid value validation
        (req, res) => {
            try {
                //Find the validation errors in this request and wraps them in an object with handy functions
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    var respData = commonController.errorValidationResponse(errors);
                    res.status(respData.ReturnCode).send(respData);
                } else {
                    //calling controller function
                    var data = req.body;
                    usersApiController.RESET_FORGOT_PASSWORD(data, function (respData) {
                        res.status(respData.ReturnCode).send(respData)
                    })
                }
            } catch (err) {
                var respData = commonController.errorValidationResponse(err);
                res.status(respData.ReturnCode).send(respData)
            }
        });
    }
}