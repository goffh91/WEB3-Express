let fs = require('fs');
let path = require('path');
let template = require('../lib/template');
let myFunction = require('../lib/customFunction');

let express = require('express');
let router = express.Router();

router.get('/create', (req, res) => {
    title = 'Create';
    let nav = template.nav(req.fileList);
    let html = template.html(title, nav, 
        `<form method="POST" action="/page/processCreate">
            <div class="form-group">
                <p><input type="text" class="form-control" name="title" placeholder="title"></p>
                <p><textarea name="description" class="form-control" rows="10" placeholder="description"></textarea></p>
                <p class="pull-right"><input type="submit" class="btn btn-default" value="submit">
                <button type="button" class="btn btn-default" onclick="history.go(-1)">Cancel</button></p>
            </div>
        </form>`,'',template.footer());
    res.send(html);
});
router.post('/processCreate', (req, res) => {
    let post = req.body
    let title = post.title;
    let description = post.description;
    fs.writeFile(`data/docs/${title}`, description, 'utf8',(err)=>{
        res.redirect(`/page/view/${title}`);
    });
});


router.get('/update/:pageId', (req, res) => {
    let filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/docs/${filteredId}`, 'utf8', (err, description)=>{
        title = req.params.pageId;
        let nav = template.nav(req.fileList);
        let html = template.html(title, nav, 
            `<form method="POST" action="/page/processUpdate">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" class="form-control" name="title" placeholder="title" value="${title}"></p>
                <p><textarea name="description" class="form-control" rows="10" placeholder="description">${description}</textarea></p>
                <p><input type="submit" class="btn btn-default" value="submit">
                <button type="button" class="btn btn-default" onclick="history.go(-1)">Cancel</button></p>
            </form>`,'',template.footer());
        res.send(html);
    });
});
router.post('/processUpdate', (req, res) => {
    let post = req.body
    let filteredId = path.parse(post.id).base;
    let title = post.title;
    let description = post.description;
    fs.rename(`data/docs/${filteredId}`, `data/docs/${title}`, (err) => {
        fs.writeFile(`data/docs/${title}`, description, 'utf8', (err)=>{
            res.redirect(`/page/view/${title}`);
        });
    });
});


router.post('/processDelete', (req, res) => {
    let post = req.body;
    let filteredId = path.parse(post.id).base;
    fs.unlink(`data/docs/${filteredId}`, (err) => {
        res.redirect('/');
    });
});

router.get('/view/:pageId', (req, res) => {
    let filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/docs/${filteredId}`, 'utf8', (err, description)=>{
        let title = req.params.pageId;
        let nav = template.nav(req.fileList);
        //description = sanitizeHTML(description,{
        //    allowedTags: [/* 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        //        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        //        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe' */],
        //    allowedAttributes: {/*
        //        a: [ 'href', 'name', 'target' ],
        //            // We don't currently allow img itself by default, but this
        //            // would make sense if we did
        //        img: [ 'src' ]*/
        //    },
        //    // Lots of these won't come up by default because we don't allow them
        //    selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
        //    // URL schemes we permit
        //    allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
        //    allowedSchemesByTag: {},
        //    allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
        //    allowProtocolRelative: true,
        //    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
        //});
        description = myFunction.htmlspecialchars(description);
        let html = template.html(title, nav, `<h2>${title}</h2><hr>${description}`, 
            `<form method="POST" action="/page/processDelete" onsubmit="
                if(confirm('Really wanna delete ${title}?')) this.submit();
                else return false;
            ">
                <a href="/page/create" class="btn btn-default">create</a> 
                <a href="/page/update/${title}" class="btn btn-default">update</a> 
                <input type="hidden" name="id" value="${title}">
                <input type="submit" class="btn btn-default" value="delete">
            </form>`, template.footer());
        res.send(html);
    });
});




module.exports = router;