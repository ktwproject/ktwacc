'use strict';
require('dotenv').config()
const line = require('@line/bot-sdk');
const express = require('express')
// const cors = require('cors')
var axios = require("axios").default;

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();
// app.use(cors());

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  console.log(event)

  // axios.request(getProfile).then(function (response) {
  //   console.log(response.data);
  // }).catch(function (error) {
  //   console.error(error);
  // });

  if (event.type === 'message') {
    if (event.message.type === 'text') {
      if (event.message.text === 'push') {
        return client.pushMessage('U62b1a1d59c92a556ae03c52e63de6b3d', messageAction(event.message.text));
      }
      else if (event.message.text === 'multicast') {
        return client.multicast(["U829438ae79a8afd36252dcaedf042f93","Ucced97cf8e897a8c737b105b541265ca"],messageAction(event.message.text));
      }
      else if (event.message.text === 'broadcast') {
        return client.broadcast(messageAction(event.message.text));
      }
      else if (event.message.text === 'postback') {
        return client.replyMessage(event.replyToken, stickerMessage());
      }
      else if (event.message.text === 'image') {
        return client.replyMessage(event.replyToken, imageMessage());
      }
      else if (event.message.text === 'template') {
        return client.replyMessage(event.replyToken, templateMessage());
      }
      else {
        return client.replyMessage(event.replyToken, messageAction(event.message.type));
      }
    }
    else if (event.message.type === 'image') {
      // axios.get('https://api-data.line.me/v2/bot/message/' + event.message.id + '/content/preview', { headers: { 'Authorization': 'Bearer ' + config.channelAccessToken } })
      //   .then(function (response) {
      //     // handle success
      //     console.log(response.data);
      //   })
      //   .catch(function (error) {
      //     // handle error
      //     console.log(error);
      //   })
      //   .finally(function () {
      //     // always executed
      //   });
      // axios.request(getContent).then(function (response) {
      //   console.log(response.data);
      // }).catch(function (error) {
      //   console.error(error);
      // });
      return client.replyMessage(event.replyToken, messageAction(event.message.type));
    }
  }
  else if (event.type === 'follow') {
    var getProfile = {
      method: 'GET',
      url: 'https://api.line.me/v2/bot/profile/' + event.source.userId,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + config.channelAccessToken
      }
    };

    var userId = "";
    var displayName = "";
    var text = "";
    var pictureUrl = "";
    axios.request(getProfile).then(function (response) {
      console.log(response.data);
      userId = response.data.userId;
      displayName = response.data.displayName;
      text = response.data.statusMessage;
      pictureUrl = response.data.pictureUrl;
      return client.pushMessage('U62b1a1d59c92a556ae03c52e63de6b3d', profileMessage(userId, displayName, text, pictureUrl));
    }).catch(function (error) {
      console.error(error);
    });

  }
  else if (event.type === 'unfollow') {

  }
  else if (event.type === 'postback') {

  }
  else {

  }

  return Promise.resolve(null);
  // if (event.type === 'message') {
  //   if (event.message.type !== 'text') {
  //     const echo = { type: 'text', text: event.message.text };
  //     return client.replyMessage(event.replyToken, echo);
  //   }
  //   else if (event.message.type === 'image') {
  //     // const image = { type: 'text', text: "image" };
  //     // return client.replyMessage(event.replyToken, image);
  //     return Promise.resolve(null);
  //   }
  //   else {
  //     return Promise.resolve(null);
  //   }
  // }
  // else if (event.type === 'follow') {
  //   const follow = { type: 'text', text: "follow" };
  //   return client.replyMessage(event.replyToken, follow);
  // }
  // else if (event.type === 'unfollow') {
  //   const unfollow = { type: 'text', text: "unfollow" };
  //   return client.replyMessage(event.replyToken, unfollow);
  // }
  // else if (event.type === 'join') {
  //   const join = { type: 'text', text: "join" };
  //   return client.replyMessage(event.replyToken, join);
  // }
  // else if (event.type === 'leave') {
  //   const leave = { type: 'text', text: "leave" };
  //   return client.replyMessage(event.replyToken, leave);
  // }
  // else {
  //   return Promise.resolve(null);
  // }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

app.get('/', (req, res) => {
  res.send("ktwacc Working")
})

var getContent = {
  method: 'GET',
  url: 'https://api.line.me/v2/bot/message/17891627102543/content',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + config.channelAccessToken
  }
};

function messageAction(text) {
  return { type: 'text', label: text, text: text }
}

function postbackAction() {
  return {
    type: "postback",
    label: "Buy",
    data: "action=buy&itemid=111",
    displayText: "Buy",
    fillInText: "asdasdasdasd"
  }
}

function uriAction() {
  return {
    type: "uri",
    label: "Menu",
    uri: "https://line.me/R/nv/recommendOA/@linedevelopers",
  }
}

function dateAction() {
  return {
    type: "datetimepicker",
    label: "Select date",
    data: "storeId=12345",
    mode: "datetime",
    initial: "2017-12-25t00:00",
    max: "2018-01-24t23:59",
    min: "2017-12-25t00:00"
  }
}

function stickerMessage() {
  return {
    type: "sticker",
    packageId: "446",
    stickerId: "1988"
  }
}

function imageMessage() {
  return {
    type: "image",
    originalContentUrl: "https://shop.ktw.co.th/medias/sys_master/SAP-L01/SAP-L01/ha5/h53/8801987690526/-ABAC-5-ABAC-B5900B200CT55.jpg",
    previewImageUrl: "https://shop.ktw.co.th/medias/sys_master/SAP-L01/SAP-L01/ha5/h53/8801987690526/-ABAC-5-ABAC-B5900B200CT55.jpg"
  }
}

function templateMessage() {
  return {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
      "type": "buttons",
      "thumbnailImageUrl": "https://shop.ktw.co.th/medias/sys_master/SAP-L01/SAP-L01/ha5/h53/8801987690526/-ABAC-5-ABAC-B5900B200CT55.jpg",
      "imageAspectRatio": "rectangle",
      "imageSize": "cover",
      "imageBackgroundColor": "#FFFFFF",
      "title": "Menu",
      "text": "Please select",
      "defaultAction": {
        "type": "uri",
        "label": "View detail",
        "uri": "https://shop.ktw.co.th/medias/sys_master/SAP-L01/SAP-L01/ha5/h53/8801987690526/-ABAC-5-ABAC-B5900B200CT55.jpg"
      },
      "actions": [
        {
          "type": "postback",
          "label": "Buy",
          "data": "action=buy&itemid=123"
        },
        {
          "type": "postback",
          "label": "Add to cart",
          "data": "action=add&itemid=123"
        },
        {
          "type": "uri",
          "label": "View detail",
          "uri": "https://shop.ktw.co.th/medias/sys_master/SAP-L01/SAP-L01/ha5/h53/8801987690526/-ABAC-5-ABAC-B5900B200CT55.jpg"
        }
      ]
    }
  }
}

function profileMessage(userId, title, text, thumbnailImageUrl) {
  return {
    "type": "template",
    "altText": "User Profile",
    "template": {
      "type": "buttons",
      "thumbnailImageUrl": thumbnailImageUrl,
      "imageAspectRatio": "rectangle",
      "imageSize": "cover",
      "imageBackgroundColor": "#FFFFFF",
      "title": title,
      "text": text,
      "actions": [
        {
          "type": "postback",
          "label": "OK",
          "data": "action=ok&userId=" + userId
        },
      ]
    }
  }
}

// var getFollowers = {
//   method: 'GET',
//   url: 'https://api.line.me/v2/bot/followers/ids',
//   headers: {
//     Authorization: 'Bearer ' + config.channelAccessToken
//   }
// };