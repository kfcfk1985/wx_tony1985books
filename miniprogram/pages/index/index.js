//index.js
const app = getApp()
const myDB = wx.cloud.database({
  env: 'kfcfk1985-1gzt5yq98b147fd7'
})

const pageHeight = wx.getSystemInfoSync().windowHeight; //获取页面的高度
const BOOK_NUMBER_PER_PAGE = 3;

Page({
  data: {
    books: [],
    bookItemHeight: Math.floor(pageHeight / BOOK_NUMBER_PER_PAGE),
    page: 0,
  },
  onLoad: function () {
 
    this.getBookItem(true)
  },
  onReachBottom() {

    this.getBookItem();
  },
  onPullDownRefresh(){
    console.log(`这是下拉刷新`)

    this.getBookItem(true)

  },
  getBookItem(init = false) {
    let collection = myDB.collection("doubanbooks").orderBy("create_time", "desc")

    if (init == false) {
      collection = collection.skip((this.data.page) * BOOK_NUMBER_PER_PAGE)
    }else{
      this.setData({
        books:[],
        page:0,
      })
    }

    wx.showLoading();
    wx.showNavigationBarLoading();


    collection.limit(BOOK_NUMBER_PER_PAGE).get().then(ret => {
      console.log(`获取第${this.data.page}页数据库返回的数据`, ret)


      if (ret.data.length > 0) {
        this.setData({
          page: this.data.page + 1
        })

        this.setData({
            books: [...this.data.books, ...ret.data],
          },
          () => {

            console.log("图书数组信息", this.data.books)
          }
        )
      } else {
        console.log("我是有底线的")
      }


      wx.hideLoading();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  }
})