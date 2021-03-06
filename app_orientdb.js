var express = require('express');  //express 모듈을 가져와 변수에 선언

var app = express(); //express 모듈 함수를 실행하면 애플리케이션객체를 리턴한다.
var fs = require('fs'); //파일시스템 사용
app.locals.pretty = true; //코드가 자동으로 보기좋게 들여씌워짐
app.set('views', './views_orientdb'); //jade, 템플릿 파일 저장 기본디렉토리  지정
app.set('view engine', 'jade'); //뷰 엔진 jade 로 설정

var bodyParser = require('body-parser');//bodyparser 모듈 생성
app.use(bodyParser.urlencoded({ extended: false }))//post방식 사용시 bodyParser 모듈 사용

//orientjs 적용
var OrientDb = require('orientjs');

var server = OrientDb({  //orientdb 로컬서버 설정
  host : 'localhost',
  port : 2424,
  username : 'root',
  password : '1q2w3e4r5t'  //local 임으로 password 를 입력해놓은거지 실제 개발할때는 password 는 따로관래
});
var db = server.use('Node'); //orientdb 의 Node 의 데이터베이스를 제어할수있다.

app.listen(3000, function(){  //3000포트에 연결
  console.log('Conneted 3000 port!')
});

/*글쓰기*/
app.get('/topic/add', function(req, res){
  var sql = "SELECT FROM topic";
  db.query(sql).then(function(topics){
    if(topics.length == 0){
      console.log('No Data');
      res.status(500).send('데이터가 없습니다.');
    }
    res.render('add', {topics:topics});
  });
});

//CREATE
app.post('/topic/add' , function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  var param = {
    params:{
      title:title,
      description: description,
      author : author
    }
  }
  var sql = "INSERT INTO topic (title, description, author) VALUES(:title, :description, :athor)";
  db.query(sql , param).then(function(results){
    //res.send(results);
    res.redirect('/topic/'+encodeURIComponent(results[0]))
  });
});

//READ
app.get(['/topic', '/topic/:id'], function(req, res){ //2가지 routing 을 하나의 함수로
  var sql = "SELECT FROM topic";
  db.query(sql).then(function(topics){
    //res.render('view' , {topicList:topics}) //결과를 view.jade 로 전달

    var id = req.params.id;
    if(id){
      var sql = "SELECT FROM topic WHERE @rid=:rid";
      db.query(sql, {params:{rid:id}}).then(function(topic){
          res.render('view' , {topics:topics , topic:topic[0]});
      });
    }else{
        res.render('view' , {topics:topics});
    }

  });

});

//UPDATE 화면이동
app.get(['/topic/:id/edit'], function(req, res){
  var sql = "SELECT FROM topic";
  db.query(sql).then(function(topics){
    var id = req.params.id;
    if(id){
      var sql = "SELECT FROM topic where @rid=:rid";
      db.query(sql, {params:{rid:id}}).then(function(topic){
        //res.render('view' , {topicList:topics}) //결과를 view.jade 로 전달
        res.render('edit' , {topics:topics , topic:topic[0]});
      });
    }else{
        res.render('view' , {topics:topics});
    }
  });
});

//UPDATE 실행
app.post(['/topic/:id/edit'], function(req, res){
  var sql = "UPDATE topic SET title=:title , description=:description , author=:author WHERE @rid=:rid";
  var id = req.params.id;
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  var param = {
    params:{title:title , description:description , author : author , rid : id}
  }
  db.query(sql , param).then(function(topics){
      res.redirect('/topic/' + encodeURIComponent(id));
  });
});

//DELETE 화면
app.get(['/topic/:id/delete'], function(req, res){
  var sql = "SELECT FROM topic";
  db.query(sql).then(function(topics){
    var id = req.params.id;
    if(id){
      var sql = "SELECT FROM topic where @rid=:rid";
      db.query(sql, {params:{rid:id}}).then(function(topic){
        //res.render('view' , {topicList:topics}) //결과를 view.jade 로 전달
        res.render('delete' , {topics:topics , topic:topic[0]});
      });
    }else{
        res.render('view' , {topics:topics});
    }
  });
});

//DELETE 실행
app.post('/topic/:id/delete' , function(req,res){
  var sql = "DELETE FROM topic WHERE @rid=:rid";
  var id = req.params.id;
  var param = {
    params:{
      rid: id}
  }
  db.query(sql , param).then(function(results){
    //res.send(results);
    res.redirect('/topic/');
  });
});
