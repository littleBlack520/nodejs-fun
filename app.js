var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/all');
//生成实例
var app = express();
//设置视图p
app.set('views', path.join(__dirname, 'views'));//设置路径
app.set('view engine', 'ejs');//设置模版为ejs

//加载中间件
app.use(logger('dev'));//加载日志中间件。
app.use(bodyParser.json());//加载解析json的中间件。
app.use(bodyParser.urlencoded({ extended: false }));//加载解析urlencoded请求体的中间件。
app.use(cookieParser());//加载解析cookie的中间件。
app.use(require('less-middleware')(path.join(__dirname, 'public')));

//设置路径
app.use(express.static(path.join(__dirname, 'public/bulid')));//置public文件夹为存放静态文件的目录。
//app.use(favicon(__dirname+'/public/images/favicon.ico'));//设置/public/favicon.ico为favicon图标。
//路由控制器。
routes(app);

// 捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// 开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
//生产环境下的错误处理器，不会将错误信息泄露给用户。
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
