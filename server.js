console.log('Hello')
const express = require('express')
const request = require('request')
require('dotenv').config()

const app = express();

app.get('/getLocation',(req, res)=>{
    console.log("req headers:"+JSON.stringify(req.headers))
    console.log(req.headers['x-forwarded-for']||'105.41.38.132')
    var ip = req.headers['x-forwarded-for']||'104.41.38.132';
    callIPStack(ip,(result)=>{
        res.send(result)
    })
   // res.send('Ok')
})

app.listen(process.env.PORT || 3000)

function callIPStack(ip,callback){
    var user_ip=ip
    var access_key=process.env.IP_APIKEY
    request(`http://api.ipstack.com/${user_ip}?access_key=${access_key}&format=1`,(req,res)=>{
        console.log("IP response :"+res)
        callback(res)
    })
}