//index.js
//获取应用实例
const app = getApp();
Page({
    data: {

    },
    onLoad: function (options) {
        var that = this;
        /*if(!app.globalData.testAgain && app.globalData.userInfo.played) {
            wx.redirectTo({
                url:'../q-9/index'
            })
        }*/
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                    scrollHeight:res.windowHeight
                });
            }
        });
    }
})

