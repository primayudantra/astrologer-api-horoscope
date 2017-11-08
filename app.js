var request = require('request');
var cheerio = require('cheerio');
var config = require('./config')
var app = require('express')();

var url = 'https://new.theastrologer.com/'
var horoscope = config.sunsign;

var arr = [];

app.get('/', (req,res)=>{
  var text = {
    "GET_ALL": "http://__url__/horoscope",
    "GET_BY_SUNSIGN": "http://__url__/horoscope/:sunsign",
    "LIST_OF_SUNSIGN": horoscope,
    "WRITTEN_BY": "Prima Yudantra // prima.yudantra@gmail.com // http://github.com/primayudantra"
  }
  res.json(text)
})

app.get('/horoscope', (req,res)=>{
  horoscope.map(item =>{
    request(url + item, (err, resp, html)=> {
      if(!err){
        var $ = cheerio.load(html)
        let content = $('#today').find('p').html()
        var payload = { sunsign:item, content: content, date: new Date().toISOString().substring(0,10)}
        arr.push(payload)
        --horoscope.length;
        if(horoscope.length<=0){
          let data = { data: arr}
          res.json(data)
        }
      }
    })
  })
})

app.get('/horoscope/:sunsign', (req,res) => {
  var sunsign = req.params.sunsign;
  request(url + sunsign, (err, resp, html)=> {
    if(!err){
      var $ = cheerio.load(html)
      let content = $('#today').find('p').html()
      var payload = { sunsign:req.params.sunsign, content: content, date: new Date().toISOString().substring(0,10)}
      let data = { data: payload}
      res.json(data)
    }
  })
})
app.listen(config.url.port)

console.log("-------------------------------")
console.log("PRIMA YUDANTRA - ASTROLOGER API TODAY")
console.log("SERVER RUNNING ON PORT : " + config.url.port)
console.log("-------------------------------")
