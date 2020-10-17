console.log('Hello')
const express = require('express')
const request = require('request')
require('dotenv').config()

const app = express();

app.get('/getLocation',(req, res)=>{
    console.log("req headers:"+JSON.stringify(req.headers))
    var ip = req.headers['x-forwarded-for']||'104.41.38.132';
    callIPStack(ip,(result)=>{
        //var jsonRes=JSON.parse(result)
        res.json(result)
    })
   // res.send('Ok')
})

app.listen(process.env.PORT || 3000)

function callIPStack(ip,callback){
    var user_ip=ip
    var access_key=process.env.IP_APIKEY

    const options = {
        url: `http://api.ipstack.com/${user_ip}?access_key=${access_key}&format=1&output=json&language=en`,
        headers: {
          'content-type': 'application/json'
        }
      };

    request(options ,(req,res)=>{
        
        console.log(res.statusCode)
        if(res.statusCode){
            console.log(JSON.parse(res.body))

            callback(JSON.parse(res.body))
        }
        else
        callback(new Error('IP Call failed'))
    })
}