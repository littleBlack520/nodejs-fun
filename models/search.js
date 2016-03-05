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
                author: "",
                content: "",
                createTime: ""
            };
            json.author = $(dom).find(".author a").eq(1).find("h2").text();
            json.content = $(dom).find(".content").text() + "<img src='" + $(dom).find("img").attr("src") + "' />";
            json.createTime = formatTime(new Date());
            data.push(json);
        });
        callback(null, data);
    });
}
for (var i = 1; i < 11; i++) {
    var link = "http://www.qiushibaike.com/8hr/page/" + i + "/";
    (function(link) {
        getDataArr.push(function(callback) {
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
    mongodb.insert("test",data,function(result){
        console.log("success");
    });
   // fs.writeFile("fun.json", JSON.stringify(result), function(err, result) { console.log("success"); });
});
