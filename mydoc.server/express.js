/*
  *
  *******  part1.환경설정 *******
  *
*/
//1.1.설정-모듈 라이브러리
var express = require("express");//express
var app = express();
var request = require('request');//request
var port = process.env.PORT || 3000;
var cors = require('cors');//cross-browsing
var mysql = require('mysql');//mysql
// ***********************************************************
// mysql-booster 관리
// var MysqlPoolBooster = require('mysql-pool-booster');
// mysql = MysqlPoolBooster(mysql);
// // db-configuration 적용
// mysql.createPool(db_config);
// ***********************************************************
//1.2.설정-연동
var connection = mysql.createConnection(//mysql
{
  host     : '127.0.0.1',//localhost로 하면 에러남
  user     : 'root',
  password : 'Flower5wantnight',
  database : 'mydoc'
});
connection.connect();

app.use(express.static(__dirname + '/public'));//express
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('views', __dirname + '/views');//ejs
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());//cross-browsing
//1.3. 변수 설정
const tb_disease = "tb_disease_list";
const tb_body = "tb_bodypart_list";
/*
  *
  *******  part2.프론트-화면 렌더링 *******
  *
*/
//2-1. health check
//express_ref : http://expressjs.com/en/5x/api.html
app.get('/health', function (req, res) {
    // res.sendStatus(200);// equivalent to res.status(200).send('OK')
    res.status(200).send('OK');
})
//2-2. 메인
app.get('/', function (req, res) {
    res.render('index')
})
app.get('/searchAll', function (req, res) {
    res.render('search')
})
/*
  *
  ******* part4.서버-동작 선언 *******
  *
*/
//3-1. 액션_검색(API)
/*
  * 손목 건초염이면 손이 아파?
  * 신체 리스트 = {bid, bname} : tb_bodypart_list
  * 질병 리스트 = {did, bid, dname, dinfo} : tb_disease_list
  * 질병 = {관련 신체 부위}
*/
//크롤링 : http://www.amc.seoul.kr/asan/healthinfo/disease/diseaseSubmain.do#
/*
  Requeset Body
{
    "version": "2.0",
    "action": {
        "actionName": "{{string}}",
        "parameters": {
            KEY: {
                "type": "{{string}}",
                "value": VALUE
            }
        }
    },
    "event": {
        "type": "{{string}}"
    },
    "context": {
        "session": {
            "accessToken": "{{string}}"
        },
        "device": {
            "type": "{{string}}",
            "state": {
                KEY: VALUE
            }
        },
        "supportedInterfaces": {
            "AudioPlayer": {
                "playerActivity": "PLAYING",
                "token": "string value",
                "offsetInMilliseconds": 100000
            }
        },
        "privatePlay" : { } // reserved
    }
}
*/
/*
  * Action category
  * 1. MYDOC.ACTION.answer.diagnosis
      - MYDOC.ACTION.answer.diagnosis.all
      - MYDOC.ACTION.answer.diagnosis.disease
      - MYDOC.ACTION.answer.diagnosis.bodyparts
      - MYDOC.ACTION.answer.diagnosis.default

  * 2. MYDOC.ACTION.answer.search
      - MYDOC.ACTION.answer.search.all
      - MYDOC.ACTION.answer.search.disease
      - MYDOC.ACTION.answer.search.bodyparts
      - MYDOC.ACTION.answer.search.stretch
      - MYDOC.ACTION.answer.search.taping
      - MYDOC.ACTION.answer.search.default

  * 3. MYDOC.ACTION.answer.manage
      - MYDOC.ACTION.answer.mange.history
*/
//3.1.Main -> ok
app.post('/', function (req, res) {
  console.log("\n>> API_main from SK 누구 ##### ");
  var action_name = req.body.action.actionName;
  var nugu_version = req.body.version;
  var action_params = req.body.action.parameters;
  console.log(action_name);
  console.log(nugu_version);
  console.log(action_params);

  //결과 코드 설정
  //존재하는 액션이라면 && 액션 내 허용된 검색이라면
  var mresultCode = 'OK';
  var body = {
      version : nugu_version,
      resultCode : mresultCode,
      output : {
          bodyparts : '손목',
          disease : '건초염',
          resultCode : 'OK',
          resultDesc : '손목 건초염에 걸리면 손목이 아플 수도 있어요.'
      },
      directives : []
  };
  //
  // console.log(JSON.parse(body));
  res.json(body);
})
/*
  *
  ******* part4.서버-함수 선언 *******
  *
*/
//4-1. 질병 검색
function searchDisease(_dname)
{
    console.log(" > func_searchDisease + " + _dname);
    var sql_s_d = 'SELECT `dinfo` FROM `tb_disease_list` WHERE `' + tb_disease +'`+ WHERE `bname`=?;';
    connection.query(sql_s_d, [_dname], function (err, results) {
        if (error) {
            console.log(" >> cannot find +" + dname);
            throw error;
        }
        else {
            for (i = 0; results.length; ++i) {
                if(results[i].indexOf(dname) != -1) {
                    console.log(dinfo);
                }
            }
        }
    })
}
//4.$. 서버처리-대기
app.listen(3000);
console.log("Listening on port", port);