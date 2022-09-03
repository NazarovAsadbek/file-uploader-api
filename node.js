const express = require("express")
const AWS = require("aws-sdk")
require("dotenv").config();
const fileUpload = require('express-fileupload')
const { v4 } = require('uuid');

const app = express()


const s3 = new AWS.S3({
    endpoint: process.env.ENDPOINT,
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    s3BucketEndpoint: true,
});


app.use(fileUpload({
    createParentPath: true
}))

app.post("/upload", function (request, response) {

    let encodeAuth = request.headers.authorization
    let buff = Buffer.from(encodeAuth, 'base64');
    let text = buff.toString('ascii');

    if (text == process.env.LOGIN + ":" + process.env.PASSWORD) {
        const file = request.files["fileToUpload"] || null
        const nameReq = request.header("nameReq")

        if (!file) return response.sendStatus(400)

        const { name, mimetype, size, data } = file
        const nameGen = v4()
        const fileContent = Buffer.from(data, ' ');

        s3.putObject({
            Body: fileContent,
            Bucket: process.env.BUCKET,
            Key: nameGen+"."+nameReq,
            ACL: 'public-read'
        }, function (err, data) {
            if (err) {
                response.send({status:"error","message":null})
            } else {
                response.send({status:"success","message":nameGen})
            }
        });
    } else {
        response.send({status:"unauthorized","message":null})
    }

})

app.get("/list", function (request, response) {

    s3.listObjects({
        Bucket: process.env.BUCKET,
    }, function (err, data) {
        if (err) {
            response.sendStatus(500)
        } else {
            response.json(data.Contents)
        }
    })
})

app.listen(process.env.PORT, function () {
    console.log("App is running on http://localhost:" + process.env.PORT)
})