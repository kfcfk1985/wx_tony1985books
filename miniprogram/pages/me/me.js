// miniprogram/pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo')||{},
    unLogImg: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2258616609,4181715650&fm=26&gp=0.jpg",

  },
  async handleGetuserinfo(e) {
    console.log("获取用户信息返回的数据", e.detail.userInfo)
    let userInfo = e.detail.userInfo

    let ret = await wx.cloud.callFunction({
      name: "login",
      data: {
        msg: 'please give me the open id'
      }
    })

    console.log("调用云函数 login 的返回值", ret)

    userInfo.openid = ret.result.openid;
    this.setData({
      userInfo
    })

    console.log("用户最终的信息", this.data.userInfo)
    wx.setStorage({
      key:"userInfo", 
      data:this.data.userInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})