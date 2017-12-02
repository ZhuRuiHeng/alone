//app.js
App({
  onLaunch: function () {
      var that = this;
      wx.checkSession({
          success: function(){
              var session_id = wx.getStorageSync(
                  'session_id'
              )
              if(!session_id){
                  that.login();
                  return;
              }
              wx.request({
                  url: that.globalData.baseUrl + "?r=site/user-info-by-sid", //
                  data: {
                      session_id:session_id,
                  },
                  header: {
                      'content-type': 'application/json' // 默认值
                  },
                  success: function(res) {
                      if(res.data.status){
                          that.globalData.userInfo = res.data.data;
                          if(that.globalData.userInfo.played) {
                              wx.redirectTo({
                                  url:'/pages/q-9/index'
                              })
                          }
                      }

                  }
              })
          },
          fail: function(){
              that.login() //重新登录
          }
      })

  },
  login:function () {
      let that = this;
      // 登录
      wx.login({
          success: resLogin => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if(resLogin.code)
              {
                  wx.getUserInfo({
                      withCredentials:true,
                      success:function(resUser){
                          wx.request({
                              url: that.globalData.baseUrl + "?r=site/user-info", //
                              data: {
                                  code:resLogin.code,
                                  encrypted_data:resUser.encryptedData,
                                  iv:resUser.iv
                              },
                              header: {
                                  'content-type': 'application/json' // 默认值
                              },
                              success: function(res) {
                                  if(res.data.status){
                                      that.globalData.userInfo = res.data.data;
                                      wx.setStorageSync('session_id',that.globalData.userInfo.id);
                                      if(that.globalData.userInfo.played) {
                                          wx.redirectTo({
                                              url:'/pages/q-9/index'
                                          })
                                      }
                                  }

                              }
                          })
                      },
                      fail:function () {
                          wx.showModal({
                              title: '警告',
                              content: '小程序没有得到您授权，部分功能无法使用，请开启授权!',
                              showCancel:false,
                              success: function(modelRes) {
                                  if (modelRes.confirm) {
                                      wx.openSetting({
                                          success: (res) => {
                                              that.login();
                                      }
                                  })
                                  }
                              }
                          })
                      }
                  })
              }
      }
  })
 },
  globalData: {
      userInfo:null,
      getUserInfoFail:false,
      testAgain:false,
      baseUrl:'https://192.168.100.101/single-day-game-b/web/index.php',
      qaList:[
          {
              toast:'',
              qTitle:'一个人吃麦当劳，吃到一半，想上厕所的时候怎么办？',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'把包放在座位上',
                      toast:'出来发现钱包不见了'

                  },
                  {
                      liOrderNum:'B',
                      liContent:'憋着吃完再去',
                      toast:'忍忍忍！'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'端去厕所',
                      toast:'万无一失'
                  },
                  {
                      liOrderNum:'D',
                      liContent:'用薯条摆出“还有人”字样',
                      toast:'这真不是段子！',
                      isTwoline:true
                  }
              ]
          },
          {
              toast:'',
              qTitle:'出门倒垃圾没带钥匙，门被风吹关上了，怎么办？',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'使劲敲门',
                      toast:'妈！开门'

                  },
                  {
                      liOrderNum:'B',
                      liContent:'爬窗',
                      toast:'要注意安全哦！'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'打电话给开锁公司',
                      toast:'宝宝心里苦~~'
                  },
                  {
                      liOrderNum:'D',
                      liContent:'淡定的拿出藏在附近的备用钥匙',
                      toast:'早就料到了！',
                      isTwoline:true
                  }
              ],
          },
          {
              toast:'',
              qTitle:'在网上买单人座电影票的时候，哪种不能购买成功？',
              listType:1,
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'https://192.168.100.101/single-day-game/images/q1-a.png',
                      toast:'从不一个人看电影'
                  },
                  {
                      liOrderNum:'B',
                      liContent:'https://192.168.100.101/single-day-game/images/q1-b.png',
                      toast:'单身的人都懂'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'https://192.168.100.101/single-day-game/images/q1-c.png',
                      toast:'从不一个人看电影~~'
                  }
              ],
          },
          {
              toast:'',
              qTitle:'你会因为什么原因不吃巧克力？',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'吃了会变胖',
                      toast:'单身也要注重身材'

                  },
                  {
                      liOrderNum:'B',
                      liContent:'爱吃多少吃多少',
                      toast:'单身也要注重身材'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'狗吃巧克力会死',
                      toast:'所以你从不吃'
                  },
                  {
                      liOrderNum:'D',
                      liContent:'没人送',
                      toast:'自己挣钱买'
                  }
              ],
          },
          {
              toast:'',
              qTitle:'关煤气应该顺时针拧还是逆时针拧？',
              listType:2,
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'顺时针',
                      toast:'还不错嘛！'

                  },
                  {
                      liOrderNum:'B',
                      liContent:'逆时针',
                      toast:'煤气要漏完了~~'
                  }
              ],
          },
          {
              toast:'',
              qTitle:'晚上10:05，手机响起了微信消息提示音，最可能是谁的消息？',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'老板',
                      toast:'苦逼的打工仔！'

                  },
                  {
                      liOrderNum:'B',
                      liContent:'暧昧对象',
                      toast:'???'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'微信运动',
                      toast:'周末步数不超50~~'
                  },
                  {
                      liOrderNum:'D',
                      liContent:'幻听',
                      toast:'只有10086找我'
                  }
              ]
          },
          {
              toast:'',
              qTitle:'下列哪个王者荣耀英雄你玩得最厉害？',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'韩信',
                      toast:'手速不赖呀！'
                  },
                  {
                      liOrderNum:'B',
                      liContent:'不知火舞',
                      toast:'手速不赖呀！'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'鲁班七号',
                      toast:'手速不赖呀！'
                  },
                  {
                      liOrderNum:'D',
                      liContent:'都没玩过',
                      toast:'多加练习'
                  }
              ]
          },
          {
              toast:'',
              qTitle:'一个人的你一般怎么过情人节？',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'卖花挣钱买护手霜',
                      toast:'勤劳致富'

                  },
                  {
                      liOrderNum:'B',
                      liContent:'跟手一起过',
                      toast:'最好的伴侣'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'加班加班加班',
                      toast:'我爱工作！'
                  },
                  {
                      liOrderNum:'D',
                      liContent:'和不过情人节的人一起过情人节',
                      toast:'祝早日脱光',
                      isTwoline:true
                  }
              ]
          },
          {
              toast:'',
              qTitle:'你喜欢的妹子主动约你看电影并叮嘱你带身份证，你会',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'问妹子想看什么电影，发给她下载好的枪版',
                      toast:'去看啥电影，费钱！',
                      isTwoline:true
                  },
                  {
                      liOrderNum:'B',
                      liContent:'耐心地跟妹子说看电影是不需要身份证的',
                      toast:'苦口婆心',
                      isTwoline:true
                  },
                  {
                      liOrderNum:'C',
                      liContent:'带上身份证并预订好电影院附近的一家很有情调的餐厅',
                      toast:'懂事乖巧',
                      isTwoline:true
                  },
                  {
                      liOrderNum:'D',
                      liContent:'反复追问带身份证的原因，担心被妹子带入非法传销的陷阱',
                      toast:'谨慎力 Max',
                      isTwoline:true
                  }
              ]
          },
          {
              index:10,
              toast:'',
              qTitle:'一个人吃麦当劳，吃到一半，想上厕所的时候怎么办？',
              list:[
                  {
                      liOrderNum:'A',
                      liContent:'把包放在座位上',
                      toast:'出来发现钱包不见了'

                  },
                  {
                      liOrderNum:'B',
                      liContent:'憋着吃完再去',
                      toast:'忍忍忍！'
                  },
                  {
                      liOrderNum:'C',
                      liContent:'端去厕所',
                      toast:'万无一失'
                  },
                  {
                      liOrderNum:'D',
                      liContent:'用薯条摆出“还有人”字样',
                      toast:'这真不是段子！',
                      isTwoline:true
                  }
              ]
          }
      ]
  },
  showLoading:function (title) {
      if(!title){
          title='正在加载图片中';
      }
      wx.showLoading({
          title:title
      });
  },
  hideLoading:function () {
      wx.hideLoading();
  },
    answerSelect:function (e,pageObj,next) {
        var index = e.currentTarget.dataset.index
        pageObj.setData({
            'content.toast':pageObj.data.content.list[index].toast
        })
       setTimeout(function () {
            wx.redirectTo({
                url: `../q-${next}/index`
            });
        },1000)

    }
})