let fs = require('fs');
let path = require('path');
//let qs = require('querystring');
let template = require('./lib/template');
let myFunction = require('./lib/customFunction');
let bodyParser = require('body-parser');
let sanitizeHTML = require('sanitize-html');
let compression = require('compression');
let pageRouter = require('./routes/page');
let helmet = require('helmet');

//let db = require('./data/monggo_database');
let db = require('./data/mysql_database');

const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

let express = require('express');
let app = express();

app.use('/static', express.static(__dirname+'/public'));
// ex) localhost:3000/static/css/style.css
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

app.use('*', (req, res, next) => {
    fs.readdir('./data/docs', 'utf8', (err, fileList) => {
        req.fileList = fileList;
        next(); //next('route');
    });
});
app.use('/page', pageRouter);

app.get('/', (req, res) => {
    let post = req.body;
    console.log(post);
    fs.readdir('./data/docs', 'utf8', (err, fileList) => {
        title = 'Hello';
        let description = 'This is Node.js App';
        let nav = template.nav(fileList);
        let html = template.html(
            title, nav, `<h2>${title}</h2><hr>${description}`, 
            `<a href="/page/create" class="btn btn-default">create</a>`,template.footer());
        res.send(html);
    });
});

app.get('/test1', (req, res) => {
    nightmare
    .viewport(375, 667)
    .useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/45.0.2454.68 Mobile/12H321 Safari/600.1.4')
    .goto('https://www.instagram.com/accounts/login/?hl=ko&source=auth_switcher')
    .wait('input[name=username]')
    .type('input[name=username]', 'userName')
    .type('input[name=password]', 'password')
    .click('button[type=submit]')
    .wait('#a')
    .end()
    .evaluate(() => { return null; })
    .then((res) => { console.log(res); })
    .catch((err) => { console.log('err : ', err); })
    res.redirect('/');
});

app.get('/test2', (req, res) => {
    let nav = template.nav(req.fileList);
    let form = template.addForm();
    let html = template.html(title, nav, form, '', template.footer());
    res.send(html);
});

/**
 * Error Area
 */
app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000);