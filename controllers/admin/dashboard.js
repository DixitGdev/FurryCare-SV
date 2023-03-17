const userModel = require('../../models/users/users');
const settingModel = require('../../models/setting/setting.js');

module.exports = {
    //get setting
    GET_SETTING: async function (data, callback) {
        //send data
        var sendData = {
            status: 200,
            err: 0,
            data: data.body,
            msg: ""
        };
        //condition
        var condition = {};
        var settingData = await settingModel.find(condition);
        if (settingData.length < 0) {
            sendData['status'] = 406;
            sendData['err'] = 1;
            sendData['data'] = err;
            sendData['msg'] = "Something is wrong. Try again!";
            callback(sendData);
        } else {
            var settingArr = {};
            for (var i = 0; i <= settingData.length; i++) {
                if (i == settingData.length) {
                    sendData['data'] = settingArr;
                    callback(sendData);
                } else {
                    settingArr[settingData[i].key] = settingData[i].value;
                }
            }
        }
    },

    GET_DASHBOARD_COUNT: async function(data, callback){
        var sendData = {
            status: 200,
            err: 0,
            data: data.body,
            msg: ""
        };
        var today=new Date().toISOString()
        today=today.split("T")[0]

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday=new Date(yesterday).toISOString().split("T")[0]
        //condition
        var total_count_condition = {};
        var totalUser = await userModel.find(total_count_condition).count();
        var today_count_condition = {
            $expr: {
                $eq: [
                    {
                    $dateToString: {
                        date: "$created_at",
                        format: "%Y-%m-%d",
                    },
                    },
                    today,
                ],
            }
        };
        var todaysUser = await userModel.find(today_count_condition).count();
        var yest_count_condition = {
            $expr: {
                $eq: [
                    {
                    $dateToString: {
                        date: "$created_at",
                        format: "%Y-%m-%d",
                    },
                    },
                    yesterday,
                ],
            }
        };
        var yesterdayUser = await userModel.find(yest_count_condition).count();
        
        var respData={
            totalUser:totalUser,
            todaysUser:todaysUser,
            yesterdayUser:yesterdayUser
        }
            sendData['status'] = 200;
            sendData['err'] = 0;
            sendData['data'] = respData;
            callback(sendData);
    }
}