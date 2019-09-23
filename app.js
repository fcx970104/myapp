var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
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