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


app.get('/topic/new', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      res.status(500).send('Server Error!!!');
    }
    res.render('new', {topicList:files});
  });
});

app.get(['/topic', '/topic/:id'], function(req, res){ //2가지 routing 을 하나의 함수로
  var sql = "SELECT FROM topic";
  db.query(sql).then(function(topics){
    res.render('view' , {topicList:topics}) //결과를 view.jade 로 전달
  });
  /*
  fs.readdir('data', function(err, files){
    if(err){
      res.status(500).send('Server Error!!!');
    }

    var id = req.params.id; //id값을 가져와 분기처리
    if(id){
    //id 값이 있을때
    fs.readFile('data/'+id, 'utf-8', function(err , data){//파일읽기 성공 후 클릭한 파일을 읽는다.
      if(err){
        res.status(500).send('FileRead Error!!!');
      }
      res.render('view', {topicList:files, title:id, description:data}); //파일을 읽은 후 view경로에 있는 jade 파일을 읽는다. 객체로 데이터 전송
    });
  }else {
      //id 값이 없을때
      res.render('view',{topicList:files, title:'Welcome', description:'Hello, JavaScript Server'});
    }
  })
  */
});

/*
  app.get('/topic/:id' ,function(req, res){
    var id = req.params.id;

    fs.readdir('data', function(err, files){  ///topic/:id 경로로 접근시 data 경로에 있는 파일을 읽는다.
      if(err){
        res.status(500).send('Server Error!!!');
      }

      fs.readFile('data/'+id, 'utf-8', function(err , data){//파일읽기 성공 후 클릭한 파일을 읽는다.
        if(err){
          res.status(500).send('FileRead Error!!!');
        }
        res.render('view', {topicList:files, title:id, description:data}); //파일을 읽은 후 view경로에 있는 jade 파일을 읽는다. 객체로 데이터 전송
      });
    });


  });
*/
app.post('/topic' , function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Server Error');
    }else{
      res.redirect('/topic');
    }

  });

});
