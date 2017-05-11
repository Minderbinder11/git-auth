// route-handler.js
'use strict';

//const request = require('request');
const querystring = require('querystring');
const config = require('../config.json');
import path from 'path';
import request from 'request';

// const jws = require('jws');
// const jwk2pem = require('pem-jwk').jwk2pem;

const handlers = module.exports = {};
const cachedJwks = {};

handlers.home = (req, res) => {

  res.sendFile(path.join(__dirname, '../client/index.html'));

};


handlers.login = (req, res) => {

  //console.log('redirect worked');
  
  var dataString = {
    'client_id': config.clientId,
    'redirect_uri': 'http://localhost:8000/callback/redirect',
    'X-OAuth-Scopes': 'user',
    'X-Accepted-OAuth-Scopes': 'user repo',
    'state': config.githubStateString
  };

  request({
    method: 'get',
    uri: 'https://github.com/login/oauth/authorize',
    qs: dataString
  }, function(err, response, body) {

    if (err) {
      res.send('errro');
    } else {
      console.log('##################################');
      console.log('respose: ', response.request.headers.referer);
      res.status(200).json({redirect: response.request.headers.referer});
    }
  });
};

handlers.callback = (req, res) => {

  console.log('!!!!!!!!!!!!!!!!! NEW REQUEST !!!!!!!!!!!!!!!!!!'); 
  console.log('!!!!!!!!!!!!!!!!! NEW REQUEST !!!!!!!!!!!!!!!!!!'); 
  console.log('COOKIES COOKEIS COOKIES COOKIES COOKIES COOKIES'); 

  var query = req.url.split('?');
  var reqUrl = querystring.parse(query[1]);

  // in here I want to get the State and Code from the reqUrl string and 
  // 1 compare that state is correct
  // 2 then grab the code and use that to get a token

  if (reqUrl.state === config.githubStateString ) {
    
    request({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      qs: {
        'client_id': config.clientId,
        'client_secret': config.clientSecret,
        'state': config.githubStateString,
        'code':  reqUrl.code,
        'redirect_uri': 'http://localhost:8000/callback/redirect',
      }
    }, function( err, response, body ) {

      if (err) {

        res.status(400).send('error');
      }
      var tokenObject = querystring.parse(response.body);
      console.log('response: ', tokenObject.access_token);
      res.send('welcome to access to GitHub');
    });
  }

};