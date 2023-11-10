const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const Result = require('./server/pojo/Result.js')
const upload = multer({dest: "static/temp/tempfile"})
const port = 3000;

const app = express()

app.use(express.static(path.join(__dirname, 'static')))

app.post('/api/image/posts', upload.single('image'), function(req, res, next){
    const { file } = req
    if(file){
        console.log("Get file, Name: " + `${file.originalname}`)
        fs.readFile(file.path, (err, data)=> {
            if(err) return console.err(err)

            fs.writeFile(`./static/temp/${file.originalname}`, data, () => {
                const response = Result.success(`./temp/${file.originalname}`)
                console.log("Return path: " + `${response.data}`)
                return res.json(response);
            })
        })
    }
})

app.listen(port, () => {
    console.log(`Express server is running at http://localhost:${port}`);
});