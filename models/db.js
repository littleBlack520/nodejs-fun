var MongoClient = require(".././node_modules/mongodb").MongoClient,
    async = require(".././node_modules/async");
var database = "fun",
    host = "localhost",
    port = "27017",
    user = "root",
    pw = "1234",
    url = "mongodb://" + host + ":" + port + "/" + database;
var exportObject = null;
// 打开链接
function openDb(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            callback(err);
        } else {
            // db.authenticate(user, pw, function(err_auth, result) {
            //     if (err_auth) {
            //         callback(err);
            //     } else {
            callback(null, db);
            //     }
            // });
        }

    });
}
// 读取集合
function readCollection(db, docs, callback) {
    db.collection(docs, function(err, collection) {
        if (err) {

            callback(err);
        } else {
            callback(null, db, collection);
        }

    });
}
// 流程控制
function asyncControl(docs, callback, action) {
    async.waterfall([
        function(cb) {
            openDb(cb);
        },
        function(db, cb) {
            readCollection(db, docs, cb);
        },
        function(db, collection, cb) {
            action(db, collection, cb);
        }
    ], function(err, db, result,total) {

        db.close();
        if (err) {
            console.log(err);
        } else {
            callback(result,total);
        }
    });
}


module.exports  ={
    // 插入一条数据
    // docs:集合名（相当于表）
    // data:插入的数据，array | object
    // callback:回调函数
    insert: function(docs, data, callback) {
        callback = callback || function() {};
        asyncControl(docs, callback, function(db, collection, cb) {
            collection.insert(data, { safe: true }, function(err, result) {
                if (err) {
                    cb(err);
                }
                cb(null, db, result);
            });
        });
    },
    // 更新数据
    // docs:集合名（相当于表）
    // selector:修改的数据
    // data:更新的数据，$set:{gui:4,hong:5}
    // callback:回调函数
    update: function(docs, selector, data, callback) {
        callback = callback || function() {};
        asyncControl(docs, callback, function(db, collection, cb) {
            collection.update(selector, data, function(err, result) {
                if (err) {
                    cb(err);
                }
                cb(null, db, result);
            });
        });
    },
    // 删除数据
    // docs:集合名（相当于表）
    // selector:修改的数据
    // data:更新的数据，$set:{gui:4,hong:5}
    // callback:回调函数
    deleteOne: function(docs, selector, callback) {
        callback = callback || function() {};
        asyncControl(docs, callback, function(db, collection, cb) {
            collection.deleteOne(selector, function(err, result) {
                if (err) {
                    cb(err);
                }
                cb(null, db, result);
            });
        });
    },
    // 查找数据
    // docs:集合名（相当于表）
    // selector:查找的依据
    // callback:回调函数
    find: function(docs, selector, callback) {
        callback = callback || function() {};
        asyncControl(docs, callback, function(db, collection, cb) {
            collection.find(selector).toArray(function(err, result) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, db, result);
                }
            });
        });
    },
    findPage: function(docs, selector, page, count, callback) {
        callback = callback || function() {};
        asyncControl(docs, callback, function(db, collection, cb) {
            collection.count(selector, function(err, total) {
                collection.find(selector, {
                    skip: (page - 1) * count,
                    limit: count
                }).sort({ time: -1 }).toArray(function(err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, db, result,total);
                    }
                });

            });
        });
    }
};

//例子
//insert("choubai", [{ gui: 1, hong: 2 },{bai:1,hei:2}], function(result) {
//    console.log(result);
//});
// update("choubai", {gui:3},{ $set:{gui:4,hong:5}}, function(result) {
//     console.log(result);
// });
// deleteOne("choubai", {gui:4}, function(result) {
//     console.log(result);
// });
// find("choubai",{},function(result){
//    console.log(result);
// });
//
//exportObject.findPage("hoax",{},10,10,function(result,total){
//    console.log(result);
//    console.log(total);
//})
