var mysql = require(".././node_modules/mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'fun',
    multipleStatements: true
});
//设置插入语句
function setInsertSql(table,obj){
    var key = "",
        value = "";
    for( var k in obj ){
        key= key+k+",";
        value= value+ connection.escape(obj[k])+",";
    }
    key = key.substring(0,key.length-1);
    value = value.substring(0,value.length-1);
    return    "INSERT INTO "+table+" ( "+key+") VALUES ("+value+")";
}
//执行查询
function query(sql,callback){

    connection.query(sql, function (error, results, fields) {
        if (error){
            throw error;
        }else{
            callback( results, fields);
        }
    });

}
module.exports =  {
    //插入单条数据
    insert:function(table,obj,callback){
        var sql =   setInsertSql(table,obj);
        query(sql,callback);

    },
    //插入多条数据
    multInsert:function(table,arr,callback){
        var sql = "";
        for(var i =0;i<arr.length;i++){
             sql = sql +  setInsertSql(table,arr[i]) + ";"
        }
        sql = sql.substring(0,sql.length-1);
        query(sql,callback);
    },
    //查询
    select:function(sql,callback){
        query(sql,callback);
    },
    //获取总的数量
    getCount:function(table,callback){
        query("select count(id) num from "+table, callback);
    },
    //分页查询
    selectPage:function(table, page,limit,callback){
        var start = (page-1)*limit,
            end = limit;
      var   sql = "select * from "+ table + ("  limit "+start+","+end);
        query(sql,callback);

    }
};
