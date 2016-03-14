var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/all');
//����ʵ��
var app = express();
//������ͼp
app.set('views', path.join(__dirname, 'views'));//����·��
app.set('view engine', 'ejs');//����ģ��Ϊejs

//�����м��
app.use(logger('dev'));//������־�м����
app.use(bodyParser.json());//���ؽ���json���м����
app.use(bodyParser.urlencoded({ extended: false }));//���ؽ���urlencoded��������м����
app.use(cookieParser());//���ؽ���cookie���м����
app.use(require('less-middleware')(path.join(__dirname, 'public')));

//����·��
app.use(express.static(path.join(__dirname, 'public/bulid')));//��public�ļ���Ϊ��ž�̬�ļ���Ŀ¼��
//app.use(favicon(__dirname+'/public/images/favicon.ico'));//����/public/favicon.icoΪfaviconͼ�ꡣ
//·�ɿ�������
routes(app);

// ����404���󣬲�ת��������������
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// ���������µĴ�����������������Ϣ��Ⱦerrorģ�沢��ʾ��������С�
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
//���������µĴ������������Ὣ������Ϣй¶���û���
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
