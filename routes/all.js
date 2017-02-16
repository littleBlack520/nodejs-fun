/**
 * Created by xiaohei on 2016/3/3.
 */
var db = require("../models/db");

module.exports = function(app) {
    app.get('/', function(req, res) {
        var page = req.query.page ? parseInt(req.query.page) : 1,
            count = req.query.count ? parseInt(req.query.count) : 10,
            ajax = req.query.ajax,
            allCount = 0;
        db.getCount("hoax",function(result){
            allCount = result[0]['num'];
            db.selectPage("hoax", page, count, function(result) {
                if (ajax) {
                    res.send({ list: result, total: allCount });
                } else {
                    res.render('index', {
                        list: result,
                        total: allCount
                    });
                }
            });
        });

    });
    app.get("/waterfall", function(req, res) {
        var page = req.query.page ? parseInt(req.query.page) : 1,
            count = req.query.count ? parseInt(req.query.count) : 20,
            ajax = req.query.ajax,
            allCount = 0;
        db.getCount("brow",function(result){
            allCount = result[0]['num'];
            db.selectPage("brow",  page, count, function(result) {
                if (ajax) {
                    res.send({ list: result, total: allCount });
                } else {
                    res.render('waterfall', {
                        list: result,
                        total: allCount
                    });
                }
            });
        });

    });
};
