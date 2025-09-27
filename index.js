const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs')


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static('public'));




app.get('/', function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", { files: files });
    })
})

app.get('/files/:filename', (req, res) => {
    const fname = req.params.filename;   // no extra .txt, val already has it
    fs.readFile(`./files/${fname}`, 'utf8', (err, filedata) => {
        if (err) return res.status(404).send('File not found');
        res.render('show', { filename: fname, filedata });
    });
});

app.get('/edit/:filename',function(req,res){
    res.render("edit",{filename: req.params.filename})
})

app.post("/edit",function(req,res){
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.New}`,function(err){
        res.redirect('/')
    })
})

app.post('/create', function (req, res) {
        const safeTitle = req.body.title.trim().replace(/\s+/g, '_');

     fs.writeFile(`./files/${safeTitle}.txt`, req.body.details, function (err){
        res.redirect("/")
    } )
})

app.listen(3000, () => { console.log('Server is listening on port 3000'); })