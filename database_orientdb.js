var OrientDb = require('orientjs');

var server = OrientDb({  //orientdb 로컬서버 설정
  host : 'localhost',
  port : 2424,
  username : 'root',
  password : '1q2w3e4r5t'
});

var db = server.use('Node'); //orientdb 의 Node 의 데이터베이스를 제어할수있다.
/*
db.record.get('#18:0').then(function (record){    //orinedb 에 있는 선택한 행의 레코드를 get
    console.log('Loaded Record:' , record.title);
});
*/

/*
 * CRUD 예제
*/
/*
//CREATE
var sql = 'SELECT * FROM topic';
db.query(sql).then(function(results){
  console.log(results)
});

//OrientDB 에서의 SELECT
var sql = 'SELECT FROM topic WHERE @rid=:rid' //조회조건 파라미터추가
var param = {
  params:{  //params는 약속된 문법
    rid:'#18:0'
  }
};
db.query(sql, param).then(function(results){ //조건으로 param 전달
  console.log(results)
});


//OrientDB 에서의 INSERT
var sql = "INSERT INTO topic (title, description) VALUES(:title, :desc)"
var param = {
    params:{
      title:'Express',
      desc : 'Express Node FrameWork!!'
    }
}
db.query(sql , param).then(function(results){
  console.log(results);
});


//OrientDB 에서의 UPDATE
var sql = "UPDATE topic SET title=:title WHERE @rid=:rid";
var param = {
  params:{
    title:"Express Change",
    rid: '#19:1'
  }
}
db.query(sql, param).then(function(results){ //수정후 결과값은 몇개의 행이 수정됬는지 return
  console.log(results);
});
*/

var sql = "DELETE FROM topic WHERE @rid=:rid";
var param = {
  params:{
    rid : '#18:1'
  }
}
db.query(sql, param).then(function(results){ //수정후 결과값은 몇개의 행이 수정됬는지 return
  console.log(results);
});
