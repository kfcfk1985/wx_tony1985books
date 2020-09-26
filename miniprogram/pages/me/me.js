const myDB = wx.cloud.database({
  env: 'kfcfk1985-1gzt5yq98b147fd7'
})


// miniprogram/pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo') || {},
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
      key: "userInfo",
      data: this.data.userInfo
    })
  },
   sacnAddBook(){
    console.log("you press sacnAddBook")

  
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode','barCode','datamatrix','pdf417'],
      success: async (ret)=>{

        let bookinfo;
        let isbn;
        wx.showLoading({
          title: '识别中',
        })
    
        console.log("扫描书本信息的结果:",ret)
        isbn = ret.result;

        ret = await wx.cloud.callFunction({
          name:"doubanGetBookInfo",
          data:{
            isbn
          }
        })
        console.log("获取图书信息，返回的数据",ret)  
        bookinfo = ret.result.bookinfo

        wx.hideLoading()

        ret = await myDB.collection('doubanbooks').add({             
          data:bookinfo      // data 字段表示需新增的 JSON 数据
        })

        console.log("图书数据入数据库返回的数据：",ret)
        wx.showModal({
          title:`添加成功`,     
          content:  `${bookinfo.title}`
        })

      },
      fail: ()=>{},
      complete: ()=>{
        // wx.hideLoading()
      }
    });
  },
  handleContact(e) {

    console.log("here is contact")
    console.log(e.detail.path)
    console.log(e.detail.query)
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