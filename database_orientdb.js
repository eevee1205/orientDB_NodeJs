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
//CREATE
var sql = 'SELECT * FROM topic';
db.query(sql).then(function(results){
  console.log(results)
});
*/
var sql = 'SELECT FROM topic WHERE @rid=:rid' //조회조건 파라미터추가
var param = {
  params:{  //params는 약속된 문법
    rid:'#18:0'
  }
};
db.query(sql, param).then(function(results){ //조건으로 param 전달
  console.log(results)
});
