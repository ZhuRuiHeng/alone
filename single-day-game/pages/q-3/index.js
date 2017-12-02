//index.js
//获取应用实例
const app = getApp();
const currentQa=3;
var  qaList = app.globalData.qaList[currentQa];
qaList.qIndex = currentQa+1;
Page({
    data: {
        content:qaList,
        noMore:false
    },
    answerSelect:function (e) {
        app.answerSelect(e,this,currentQa+1);
    },

    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                    scrollHeight:res.windowHeight
                });
            }
        });
    }

})
