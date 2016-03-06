/**
 * Created by xiaohei on 2016/2/28.
 */
var http = require("http");
var url = require('url');
var fs = require("fs");
var superagent = require('../node_modules/superagent');
var cheerio = require('../node_modules/cheerio');
var async = require('../node_modules/async');
var mongodb = require("./db");
var getDataArr = [];

function formatTime(time) {
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

function getData(callback, link) {

    superagent.get(link).set({
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }).end(function(req, res) {
        var $ = cheerio.load(res.text);
        var data = [];

        $(".article").each(function(index, dom) {
            var json = {
                author: "", //作者
                authorPic:"",//作者图片
                content: "",//内容
                support:"",//好笑数
                createTime: ""//创建时间
            };
            json.author = $(dom).find(".author a").eq(1).find("h2").text();
            json.authorPic = $(dom).find(".author a img").attr("src");
            json.content = $(dom).find(".content").text() + "<img src='" + $(dom).find("img").attr("src") + "' />";
            json.support = parseInt( $(dom).find(".stats-vote i").text());
            json.createTime = formatTime(new Date());
            console.log(json.support);
            if(json.support >=200){
                data.push(json);
            }

        });
        callback(null, data);
    });
}
for (var i = 1; i < 6; i++) {
    var link = "http://www.qiushibaike.com/8hr/page/" + i + "/";
    (function (link) {
        getDataArr.push(function (callback) {
            getData(callback, link);
        });
    })(link);
}
async.parallel(getDataArr, function(err, result) {
    var data = [];
    result.map(function(elem) {

        elem.map(function( child_ele) {
            data.push(child_ele);
        });
    });
    mongodb.insert("hoax",data,function(result){
        console.log("success");
    });
   // fs.writeFile("fun.json", JSON.stringify(result), function(err, result) { console.log("success"); });
})
