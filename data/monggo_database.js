let MongoClient = require('mongodb').MongoClient;
let dbUrl = "mongodb://localhost:portNumber/dbName";
module.exports = {

  connect : function() {
    return new Promise(function (resolve, reject) {
      let con = MongoClient.connect(dbUrl);
      resolve(con);
    });
  },


  /**
   * @class   DB 검색 함수
   * @see     Mongo Database connect  
   * @param   connect | object
   *          table   | string
   *          where   | object
   *          callback| funcion
   */
  select : function(connect, table, where, callback)
  {
    let collection_table = connect.collection(table);
    collection_table.find(where).toArray(function (err, reult)
    {
        if (err)
        {
            console.log("Select Error :!!!!" + err);
            callback(err, null);
        }
        else
        {
            console.log('Ok, Documents Select ' + table + ' collection.');
            callback(err, reult);
        }
    });
  },


  /**
   * @class   DB 검색 함수 (검색옵션)
   * @see     Mongo Database connect  
   * @param   connect | object
   *          table   | string
   *          where   | object
   *          sort    | object
   *          callback| funcion
   */
  selectSort : function(connect, table, where, sort, callback)
  {
    let collection_table = connect.collection(table);
    collection_table.find(where).sort(sort).toArray(function (err, reult)
    {
        if (err)
        {
            console.log("Select Error :!!!!" + err);
            callback(err, null);
        }
        else
        {
            console.log('Ok, Documents Select ' + table + ' collection.');
            callback(err, reult);
        }
    });
  },


  /**
   * @class   DB DATA 삽입 함수
   * @see     Mongo Database connect  
   * @param   connect | object
   *          table   | string
   *          datas   | jsonobject
   *          callback| funcion
   */
  insert : function(connect, table, datas, callback){
    let collection_table = connect.collection(table);
    collection_table.insert(datas, function (err, result)
    {
      if (err)
      {
          console.log("Insert Error :!!!!" + err);
          callback(err, null);
      }
      else
      {
        console.log('Ok, Documents Insert ' + table + ' collection.');
        callback(err, result);
      }
    });
  },


  /**
   * @class   DB DATA 수정 함수
   * @see     Mongo Database connect  
   * @param   connect | object
   *          table   | string
   *          datas   | jsonobject
   *          where   | object
   *          callback| funcion
   */
  update : function(connect, table, datas, where, callback) {
    let collection_table = connect.collection(table);
    collection_table.update(where, datas, function (err, result)
    {
      if (err)
      {
          console.log("Update Error :!!!!" + err);
          callback(err, null);
      }
      else
      {
        console.log('Ok, Documents Update  ' + table + ' collection.');
        callback(err, result);
      }
    });
  },


  /**
   * @class   DB DATA 삭제 함수
   * @see     Mongo Database connect  
   * @param   connect | object
   *          table   | string
   *          datas   | jsonobject
   *          where   | object
   *          callback| funcion
   */
  delete : function(connect, table, where, callback){
    let collection_table = connect.collection(table);
    collection_table.remove(where, function (err, result)
    {
      if (err)
      {
          console.log("Delete Error :!!!!" + err);
          callback(err, null);
      }
      else
      {
        console.log('Ok, Documents Delete ' + table + ' collection.');
        callback(err, result);
      }
    });
  },
};