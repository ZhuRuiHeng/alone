//index.js

const util = require('../../utils/util.js')
//获取应用实例
const app = getApp();


Page({
    data: {
        descList:[
            '有时候还是想找个人在一起。',//59
            '单身也没啥不好的，你也这么想的吧？'
        ],
        desc:'',
        score:47,
        noMore:false,
        isStart:true,
        shakeTotal:0,
        shakeTime:5,
        showResult:false
    },

    onLoad: function () {
        var that = this;
        if(!app.globalData.testAgain && app.globalData.userInfo.played) {

            that.setData({showResult:true});
            that.setData({score:app.globalData.userInfo.score});
            var des = that.data.descList[1];
            if(60 > app.globalData.userInfo.score){
                des = that.data.descList[0];
            }
            that.setData({desc:des});
            that.setData({shakeTime:0});
        }
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                    scrollHeight:res.windowHeight
                });
            }
        });
    },
    start:function () {
        let that = this;
        that.setData({isStart:false});
        wx.onAccelerometerChange(function (e) {
            var shakeTotal =  that.data.shakeTotal;
           if (e.x > 1 && e.y > 1) {
                shakeTotal++;
                that.setData({shakeTotal:shakeTotal});
            }
        })
        var countdown= setInterval(function () {
            var shakeTime = that.data.shakeTime;
            shakeTime--;
            that.setData({shakeTime:shakeTime});
            if(shakeTime == 0){
                wx.stopAccelerometer();
                clearInterval(countdown);
                wx.vibrateShort({

                });
                var score = that.data.shakeTotal * 5 + that.data.score;
                var des = that.data.descList[1];
                if(60 > score){
                    des = that.data.descList[0];
                }
                that.setData({showResult:true});
                that.setData({score:score});
                that.setData({desc:des});
                wx.request({
                    url: app.globalData.baseUrl + "?r=site/save-result",
                    method:'POST',
                    header:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        'score':score,
                        'id':app.globalData.userInfo.id
                    },
                    success: function(res) {
                        if(res.data.status){
                            app.globalData.userInfo = res.data.data;
                            app.globalData.testAgain = false;
                        }
                    }
                })
            }
        },1000);
    },
    testAgain:function (e) {
        app.globalData.testAgain = true;
        wx.redirectTo({
            url:'../home/index'
        })
    }

})
