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

    

})

app.get('/getWeather',(req, res)=>{
    
    var ip = req.headers['x-forwarded-for']||'104.41.38.132';
        callIPStack(ip,(result)=>{
            //var jsonRes=JSON.parse(result)
            checkWeather(result.latitude,result.longitude,(result)=>{
                //var jsonRes=JSON.parse(result)
               // console.log(result.weather[0].main)
                var weatherResult={
                    temperature: result.main.temp,
                    description:result.weather[0].description,
                    city:result.name,
                    country:result.sys.country
                    
                }
                
                res.json(weatherResult)
            })   
        })

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

function checkWeather(lat,long,callback){
    
    var weather_app_key=process.env.WEATHER_APIKEY

    const options = {
        url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weather_app_key}&units=metric`,
        headers: {
          'content-type': 'application/json'
        }
      };

    request(options ,(req,res)=>{
        
        //console.log(res)
            callback(JSON.parse(res.body))
       
    })
}