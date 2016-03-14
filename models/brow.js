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


var limit = 100,
    count = 1000 / limit,
    max = 590908535,
    url = "",
    data = [];

function formatTime(time) {
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

async.whilst(function() {
    return count > 0;
}, function(cb) {
    url = "http://huaban.com/boards/16886057/?md=newbn&funny=&ilhmamsy&max=" + max + "&limit=" + limit + "&wfl=1";
    superagent.get(url).set({
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
        'X-Request': 'JSON',
        'X-Requested-With': 'XMLHttpRequest'
    }).end(function(req, res) {


        var result = JSON.parse(res.text),
            picarray = result.board.pins,
            host = "http://img.hb.aicdn.com/";
        if (picarray.length > 0) {

            picarray.map(function(dom) {
                data.push({
                    width:dom.file.width,
                    height:dom.file.height,
                    imagePath: host + dom.file.key,   
                    imageid: dom.pin_id,
                    createTime: formatTime(new Date())
                });

            });
            max = data[data.length - 1].imageid;
        }
        count--;
        cb();

    });

}, function(err) {
    if (err) {
        console.log(err);
    } else {
        mongodb.insert("brow", data, function(result) {
            console.log("success");
        });
        //fs.writeFile("fun.json", JSON.stringify(data), function(err, result) { console.log("success"); });
    }

});
