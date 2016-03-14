/**
 * Created by xiaohei on 2016/3/3.
 */
var mongodb = require("../models/db");

module.exports = function(app) {
    app.get('/', function(req, res) {
        var page = req.query.page ? parseInt(req.query.page) : 1,
            count = req.query.count ? parseInt(req.query.count) : 10,
            ajax = req.query.ajax;
        mongodb.findPage("hoax", {}, page, count, function(result, total) {
            if (ajax) {
                res.send({ list: result, total: total });
            } else {
                res.render('index', {
                    list: result,
                    total: total
                });
            }
        });
    });
    app.get("/waterfall", function(req, res) {
        var page = req.query.page ? parseInt(req.query.page) : 1,
            count = req.query.count ? parseInt(req.query.count) : 20,
            ajax = req.query.ajax;
        mongodb.findPage("brow", {}, page, count, function(result, total) {
            if (ajax) {
                res.send({ list: result, total: total });
            } else {

                res.render('waterfall', {
                    list: result,
                    total: total
                });
            }
        });
    });
};
