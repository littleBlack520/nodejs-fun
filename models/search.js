/**
 * Created by xiaohei on 2016/2/28.
 */
var http = require("http");
var url = require('url');
var superagent = require('../node_modules/superagent');
var cheerio = require('../node_modules/cheerio');
var async = require('../node_modules/async');
var db = require("./db");
var getDataArr = [], //��ȡ������
    href ="http://www.qiushibaike.com/8hr/page/", //Ҫ��ȡ����ַ
    startPage=1, //��ʼ��ҳ��
    endPage=3; //������ҳ��

//��ʽ��ʱ��
function formatTime(time) {
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}
//��ȡ����
function getData(callback, link) {

    superagent.get(link).set({
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }).end(function(req, res) {
        var $ = cheerio.load(res.text);
        var data = [];

        $(".article").each(function(index, dom) {
            var json = {
                author: "", //����
                authorPic:"",//����ͼƬ
                content: "",//����
                support:"",//��Ц��
                createTime: ""//����ʱ��
            };
            json.author = $(dom).find(".author a").eq(1).find("h2").text();
            json.authorPic = $(dom).find(".author a img").attr("src");
            json.content = $(dom).find(".content").text() + "<img src='" + $(dom).find("img").attr("src") + "' />";
            json.support = parseInt( $(dom).find(".stats-vote i").text());
            json.createTime = formatTime(new Date());
            console.log( json.support);
            if(json.support >=200){
                data.push(json);
            }

        });
        callback(null, data);
    });
}
//ѭ����ȡ
for (var i = startPage; i < endPage; i++) {
   var link = href + i +"/" ;
    (function (link) {
        getDataArr.push(function (callback) {
            getData(callback, link);
        });
    })(link);
}
//�������ݿ�
async.parallel(getDataArr, function(err, result) {
    var data = [];
    result.map(function(elem) {

        elem.map(function( child_ele) {
            data.push(child_ele);
        });
    });
    db.multInsert("hoax",data,function(result, fields){
        console.log(result.length);
    });

})
