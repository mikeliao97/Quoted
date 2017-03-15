var express = require('express');
var bodyParser = require('body-parser');
var items = require('../database-mongo');

var Business = require('../database-mongo/index').Business;
var handler = require('./request-handler');
//Twillio Requirements
var twilioKeys = require('../twilio_api');


var app = express();

// Twilio Credentials Move somewhere else later
var accountSid = twilioKeys.accountSid; 
var authToken = twilioKeys.authToken;
//require the Twilio module and create a REST client

var client = require('twilio')(accountSid, authToken);
app.use(express.static(__dirname + '/../react-client/dist'));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());

app.post('/messages', function(req, res) {
  console.log('getting response from client'); 
  console.log('req body', req.body);
  var textInput = req.body.textInput
  console.log('textInput', textInput);

  Business.find({Category: "test"}, function(err, businesses){
    if (err) {
      console.log(err);
    } else {
      // console.log('test businesses', businesses);
      businesses.forEach(function(biz) {
        console.log('business phone', biz.BusinessPhone);
        client.messages.create({
          to: biz.BusinessPhone,
          from: '4152001619',
          body: 'Hey ' + biz.BusinessName +  'I want to let you know that :' + textInput
        }, function (err, message) {
          if (err) {
            console.log('err', err);
            res.status(404).end();
          } else {
            console.log('message sid', message.sid);
            res.status(200).send();
          }
        });
      });
    }
  });
  
  // This is how to do a basic send message from twilio 
  // where the 770 num is a verified number that is like a biz number 
  // and the 415 number is a twilio number

  // client.messages.create({
  //     to: '7703357571',
  //     from: '4152001619',
  //     body: 'This is a test message, hello how are you',
  // }, function (err, message) {
  //     if (err) {
  //       console.log('err', err);
  //       res.status(404).end();
  //     } else {
  //       console.log('message sid', message.sid);
  //       res.status(200).send();
  //     }
  // });
});


app.post('/call', function(req, res) {
  console.log('trying to send out text messages'); 
  Business.find({Category: "test"}, function(err, businesses){
    if (err) {
      console.log(err);
    } else {
      console.log('test businesses', businesses);
      businesses.forEach(function(biz) {
        client.calls.create({
          url: 'http://demo.twilio.com/docs/voice.xml',
          to: biz.BusinessCell,
          from: '4152001619',
          // body: 'Test message, hello ' + biz.BusinessName +  ' Han wants to spam you',
        }, function (err, message) {
          if (err) {
            console.log('err', err);
            res.status(404).end();
          } else {
            // console.log('message sid', message.sid);
            process.stdout.write(calls.sid);
            res.status(200).send();
          }
        });
      });
    }
  });
});

app.get('/businesses', handler.checkBusinessData); 

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

