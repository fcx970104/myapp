var express = require('express');
var app = express();

var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');

var ep = new eventproxy();
var cnodeUrl = 'https://cnodejs.org/';

//使用 superagent 与 cheerio 完成简单爬虫
app.get('/getTitle', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get(cnodeUrl)
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        $element.attr('title'),
          // console.log(element, $element);
          items.push({
            title: $(this).attr('title'),
            href: $(this).attr('href')
          });
      });

      res.send(items);
    });
});

//使用 eventproxy 控制并发
app.get('/', function (req, res, next) {
  superagent.get(cnodeUrl).end(function (err, sres) {
    if (err) {
      return console.log(err);
    }
    var toppicUrls = [];
    var $ = cheerio.load(sres.text);
    $('#topic_list .topic_title').each(function (index, e) {
      var $e = $(e);
      var href = url.resolve(cnodeUrl, $e.attr('href'));
      if (toppicUrls.length <= 5) {
        toppicUrls.push(href);
      }
    });

    ep.after('topic_html', toppicUrls.length, function (topics) {
      topics = topics.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        return ({
          title: $('.topic_full_title').text().trim(),
          href: topicUrl,
          comment: $('.reply_content').eq(0).text().trim(),
        });
      });
      console.log('final:');
      console.log(topics);
      res.send(topics);
    });

    toppicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {
          console.log('fetch:' + topicUrl + 'success!');
          var aa = [topicUrl, res.text];
          ep.emit('topic_html', aa);
        })
    });

  });
});



app.post('/a', function (req, res) {
  res.send('POST request to the homepage');
});
//app.all() 是一个特殊的路由方法，没有任何 HTTP 方法与其对应，它的作用是对于一个路径上的所有请求加载中间件。
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // pass control to the next handler
});
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});