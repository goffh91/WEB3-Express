let fs = require('fs');
let path = require('path');
//let qs = require('querystring');
let template = require('./lib/template.js');
let bodyParser = require('body-parser');

let sanitizeHTML = require('sanitize-html');
let Nightmare = require('nightmare');
let nightmare = Nightmare({ show: true }); //electron으로 화면을 띄운다

let express = require('express');
let app = express();
app.use(bodyParser.urlencoded({extended: false}));



app.get('/', (req, res) => {
    fs.readdir('./data', 'utf8', (error, fileList) => {
        title = 'Hello';
        let description = 'This is Node.js App';
        let nav = template.nav(fileList);
        let html = template.html(title, nav, `<h2>${title}</h2><hr>${description}`, `<a href="/create" class="btn btn-default">create</a>`);
        res.send(html);
    });
});


app.get('/page/:pageId', (req, res) => {
    fs.readdir('./data', 'utf8', (error, fileList) => {
        let filteredId = path.parse(req.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (error, description)=>{
            let title = req.params.pageId;
            let nav = template.nav(fileList);
            let html = template.html(title, nav, `<h2>${title}</h2><hr>${description}`, 
                `<form method="POST" action="/processDelete" onsubmit="
                    if(confirm('Really wanna delete ${title}?'))
                        this.submit();
                    else
                        return false;
                ">
                    <a href="/create" class="btn btn-default">create</a> 
                    <a href="/update/${title}" class="btn btn-default">update</a> 
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" class="btn btn-default" value="delete">
                </form>`);
            res.send(html);
        });
    });
});


app.get('/create', (req, res) => {
    fs.readdir('./data', 'utf8', (error, fileList) => {
        title = 'Create';
        let nav = template.nav(fileList);
        let html = template.html(title, nav, 
            `<form method="POST" action="/processCreate">
                <div class="form-group">
                    <p><input type="text" class="form-control" name="title" placeholder="title"></p>
                    <p><textarea name="description" class="form-control" rows="10" placeholder="description"></textarea></p>
                    <p class="pull-right"><input type="submit" class="btn btn-default" value="submit">
                    <button type="button" class="btn btn-default" onclick="history.go(-1)">Cancel</button></p>
                </div>
            </form>`,'');
        res.send(html);
    });
});
app.post('/processCreate', (req, res) => {
    let post = req.body
    let title = post.title;
    let description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8',(error)=>{
        res.redirect(`/page/${title}`);
    });
});


app.get('/update/:pageId', (req, res) => {
    fs.readdir('./data', 'utf8', (error, fileList) => {
        let filteredId = path.parse(req.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (error, description)=>{
            title = req.params.pageId;
            let nav = template.nav(fileList);
            let html = template.html(title, nav, 
                `<form method="POST" action="/processUpdate">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" class="form-control" name="title" placeholder="title" value="${title}"></p>
                    <p><textarea name="description" class="form-control" rows="10" placeholder="description">${description}</textarea></p>
                    <p><input type="submit" class="btn btn-default" value="submit">
                    <button type="button" class="btn btn-default" onclick="history.go(-1)">Cancel</button></p>
                </form>`,'');
            res.send(html);
        });
    });
});
app.post('/processUpdate', (req, res) => {
    let post = req.body
    let filteredId = path.parse(post.id).base;
    let title = post.title;
    let description = post.description;
    fs.rename(`data/${filteredId}`, `data/${title}`, (error) => {
        fs.writeFile(`data/${title}`, description, 'utf8', (error)=>{
            res.redirect(`/page/${title}`);
        });
    });
});


app.post('/processDelete', (req, res) => {
    let post = req.body;
    let filteredId = path.parse(post.id).base;
    fs.unlink(`data/${filteredId}`, (error) => {
        res.redirect('/');
    });
});


app.get('/nightmareForm', (req, res) => {
    fs.readdir('./data', 'utf8', (error, fileList) => {    
        title = "Nightmare Form Data 생성";
        let nav = template.nav(fileList);
        let form = template.ntmrForm();
        let html = template.html(title, nav, form, '');
        res.send(html);
    });
});
app.post('/ntmrProcess' , (req, res) => {
    let post = req.body;
    console.log(post);
    nightmare
        .goto('http://www.daum.net')    //daum 포털 접속
        .type('#q', 'blueng.tistory.com')   //blueng.tistory.com 검색어 입력
        .click('.btn_search')   //검색 버튼을 클릭
        .wait('#siteColl')  //#siteColl 레이어를 기다린다
        .end()  //프로세스를 종료한다.
        .evaluate(() => {
            return document.querySelector('.wrap_tit a').innerHTML; //첫번째 검색 결과의 제목을 가져온다
        })
        .then(res => {
            console.log(res);   //검색 결과 제목을 콘솔에 출력한다
        })
        .catch(err => {
            console.log('err : ', err);
        })
        
    /*nightmare
        .goto('http://www.naver.com/')
        .type('#query', 'phpschool')
        .click('#search_btn')
        .wait('#main_pack')
        // 사이트 검색 결과의 첫 번째 링크 주소를 가져온다.
        .evaluate(() => document.querySelector('#main_pack div.nsite > ul > li a').href)
        .then(result => nightmare
        .goto(result) // 링크 주소로 이동한다.
        .click('#contentWrap div.main_talkbox a') // 게시판 링크를 클릭한다.
        .wait('form[name="fboardlist"]') // 게시판 목록을 기다린다.
        // 목록에서 첫 번째 글 제목을 가져온다.
        .evaluate(() => document.querySelector('form[name="fboardlist"] > table.board_table > tbody > tr[class=""] > td.subject a').innerHTML)
        .end())
        .then(result => console.log(result)) // 결과를 콘솔에 출력한다.
        .catch(error => console.error(error));*/

        res.redirect('/nightmareForm');
});       

app.listen(3000);