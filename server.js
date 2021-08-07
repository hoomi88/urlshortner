require('dotenv').config();
const express = require('express');
const cors = require('cors');
//const urlExist = require('url-exist');
const app = express();
const router = express.Router()
var validUrl = require('valid-url');
let myShortUrl = [{original_url:"https://www.google.com",
                      short_url:1},
                  {original_url:"https://www.facebook.com",
                      short_url:2}];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


// URL
app.get('/api/shorturl/:myurl?', function(req, res){
  console.log(req.params);
  let urlFound = false;
  let resObj = {};
  let shortUrl = req.params.myurl;
  if (isNaN(shortUrl)){
    resObj = {error : "Wrong format"};

  } else {
    for (let x in myShortUrl){
      console.log(myShortUrl[x]);
      if (myShortUrl[x].short_url === Number(shortUrl)){
        urlFound = true;
        resObj = myShortUrl[x];
        break;
      }
    }
    if (!urlFound) {
      resObj = {error : "No short URL found for the given input"};
    } 
  }
  console.log(resObj);
  if (!urlFound) {
    res.json(resObj); } else {
      res.redirect(resObj.original_url)
    }
});


app.use(express.urlencoded({extended: false}));
app.post('/api/shorturl/', function(req, res) {  
  let testUrl = req.body.url;
  let urlFound = false;
  let resObj = {};
  console.log(testUrl);
  
  
  if (validUrl.isUri(testUrl)){
    console.log(testUrl + ' - looks like an URI');
    for (let x in myShortUrl){
      console.log(myShortUrl[x]);
      if (myShortUrl[x].original_url === testUrl){
        urlFound = true;
        resObj = myShortUrl[x];
        break;
      }
    }
    if (!urlFound){
      resObj = {error: "URL not found"};
      // add URL
      let newObj = {original_url:testUrl,
                    short_url:myShortUrl.length+1};
      myShortUrl.push(newObj);
      resObj = newObj;
      console.log(myShortUrl);
    }


  } 
  else {    
      console.log(testUrl + ' - not a URI');
      resObj = {error: "Invalid URL"};
  }

  res.json(resObj);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
