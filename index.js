import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: 'Y9zCxBmVqtr/pqTFap3ZIv6oPklzoVFWq1lwWW3WkXk5tnwNNoPtE3pAX0K45Ysy0wb0jM70kquurOLcs05OqQF+G94JnYgrnmENKZykNT6YP3bVE9uSZ+744s9kd4AMEUkWCjD+rL76cJCxbmXGfQdB04t89/1O/w1cDnyilFU='
});

const message = {
  type: 'text',
  text: 'Hello World!'
};

client.replyMessage('<replyToken>', message)
  .then(() => {
  })
  .catch((err) => {
    // error handling
  });