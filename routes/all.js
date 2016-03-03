/**
 * Created by xiaohei on 2016/3/3.
 */
var Client = require('../node_modules/mongodb').MongoClient;
module.exports = function(app){
    app.get('/',function(req,res){
        Client.connect("mongodb://localhost:27017/fun",function(err,db){
            db.authenticate('xiaohei', '1234', function(err, result) {
                if(err){
                    console.log(err);
                }else{
                    db.collection('hoax',function(err,collection){
                        if(err){
                            console.log(err);
                        }else{
                            collection.find().toArray(function(err,result){
                                db.close();
                                if(err){
                                    console.log(err);
                                }else{
                                    res.render('index',{
                                        list:result
                                    });
                                }
                            })

                        }
                    });
                }
            });

            });

    });
};