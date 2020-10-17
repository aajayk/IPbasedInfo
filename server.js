console.log('Hello')
const express = require('express')
const request = require('request')
require('dotenv').config()

const app = express();
var userDetails;

app.get('/',(req, res)=>{
    console.log("req headers:"+JSON.stringify(req.headers))
    var ip = req.headers['x-forwarded-for']||'104.41.38.132';
    callIPStack(ip,(result)=>{
        //var jsonRes=JSON.parse(result)
        res.json(result)
    })
   // res.send('Ok')
})

app.get('/getLocation',(req, res)=>{
    console.log("req headers:"+JSON.stringify(req.headers))
    var ip = req.headers['x-forwarded-for']||'104.41.38.132';
    if(!userDetails){
        callIPStack(ip,(result)=>{
            //var jsonRes=JSON.parse(result)
            var locationDetails={
                ip:result.ip,
                continent_name:result.continent_name ,
                country_name:result.country_name,
                region_name:result.region_name,
                city:result.city,
                latitude:result.latitude,
                longitude:result.longitude,
            }
            res.json(locationDetails)
        })

    }else{
        console.log("user details found")
        var locationDetails={
            ip:userDetails.ip,
            continent_name:userDetails.continent_name ,
            country_name:userDetails.country_name,
            region_name:userDetails.region_name,
            city:userDetails.city,
            latitude:userDetails.latitude,
            longitude:userDetails.longitude,
        }
        res.json(locationDetails)
    }

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
            userDetails= JSON.parse(res.body)
            callback(userDetails)
        }
        else
        callback(new Error('IP Call failed'))
    })
}