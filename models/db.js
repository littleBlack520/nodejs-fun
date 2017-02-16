var mysql = require(".././node_modules/mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'a1417789619',
    database: 'fun',
    multipleStatements: true
});
//���ò������
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
//ִ�в�ѯ
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
    //���뵥������
    insert:function(table,obj,callback){
        var sql =   setInsertSql(table,obj);
        query(sql,callback);

    },
    //�����������
    multInsert:function(table,arr,callback){
        var sql = "";
        for(var i =0;i<arr.length;i++){
             sql = sql +  setInsertSql(table,arr[i]) + ";"
        }
        sql = sql.substring(0,sql.length-1);
        query(sql,callback);
    },
    //��ѯ
    select:function(sql,callback){
        query(sql,callback);
    },
    //��ȡ�ܵ�����
    getCount:function(table,callback){
        query("select count(id) num from "+table, callback);
    },
    //��ҳ��ѯ
    selectPage:function(table, page,limit,callback){
        var start = (page-1)*limit,
            end = limit;
      var   sql = "select * from "+ table + ("  limit "+start+","+end);
        query(sql,callback);

    }
};