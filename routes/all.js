/**
 * Created by xiaohei on 2016/3/3.
 */
var mongodb = require("../models/db");
module.exports = function (app) {
    app.get('/', function (req, res) {
    mongodb.find("hoax",{},function(result){
        res.render('index', {
            list: result
        });
    })
    });
};