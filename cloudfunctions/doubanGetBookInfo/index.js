// 云函数入口文件

var debug = require('debug')('doubanGetBookInfo')
const doubanbook = require("doubanbook")
const cloud = require('wx-server-sdk')
const axios = require('axios');
const cheerio = require('cheerio');



cloud.init()


async function getBookAddr(isbn) {
  //根据 isbn 获取 书的信息
  //通过axios获取页面数据
  let response = await axios.get(`https://search.douban.com/book/subject_search?search_text=${isbn}`);
  // debug("获取搜索页面返回的数据",response.data)

  let secretData;
  let detailInfo;
  let regExp = /window\.__DATA__ = "(\S*)"/;
  if (regExp.exec(response.data) != null) {
    secretData = RegExp.$1;
    detailInfo = doubanbook(secretData)[0]

    // debug("解密后书本搜索页的数据:", detailInfo)
    return detailInfo
  }

  return null;
}


async function getBookinfo(isbn) {

  let detailInfo = await getBookAddr(isbn); //注意：因为 getBookAddr（）函数有用async定义，
  //因此调用时要用await，否则，返回的就是一个promise 


  let tags = [];
  let author;
  let publisher;
  let price;
  let $;

  if (detailInfo.url != null) {
    let ret = await axios.get(detailInfo.url);
    // debug("获取详情页面返回的数据:",ret.data)
    $ = cheerio.load(ret.data);

    // debug($("h1 span").text());
    // debug($("#info")
    //   .text()
    //   .split('\n')
    //   .map(item => item.trim())
    //   .filter(item => item != '')
    // );


    $("#info")
      .text()
      .split('\n')
      .map(item => item.trim())
      .filter(item => item != '')
      .forEach(item => {
        if (item.split(":")[0] == '出版社') {
          publisher = item.split(":")[1]
        }

        if (item.split(":")[0] == '定价') {
          price = item.split(":")[1]
        }
      })

    // debug($("#db-tags-section .indent")
    //         .text()
    //         .split('\n')
    //         .map(item=>item.trim())
    //         .filter(item=>item!= ''));



    // debug($("#link-report .intro").text());

    author = $("h1 span").text();
    tags = $("#db-tags-section .indent")
      .text()
      .split('\n')
      .map(item => item.trim())
      .filter(item => item != '')

  }


  /*
  const ret = {
    create_time: new Date().getTime(),
    tags,       // 分类
    author,     //作者
    publisher,  //出版社
    price,      //价格
    image: detailInfo.cover_url,
    rate:detailInfo.rating.value,
    alt: detailInfo.url,
    title:detailInfo.title,
    summary: $('#link-report .intro').text()
  }
  */
  return {
    create_time: new Date().getTime(),
    tags,
    author,
    publisher,
    price,
    image: detailInfo.cover_url,
    rate: detailInfo.rating.value,
    alt: detailInfo.rating.url,
    title: detailInfo.title,
    summary: $("#link-report .intro").text()

  }
}

getBookinfo("9787010009148").then(ret => {
  debug("通过爬虫从douban获取的数据", JSON.stringify(ret, null, 2))
})


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let bookinfo = await getBookinfo(event.isbn);

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    bookinfo
  }
}