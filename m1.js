const amqplib = require("amqplib");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

var answer;
var conn;
var recieved = false;

(async () => {
  conn = await amqplib.connect('amqp://localhost');
  const listenQueue = 'answers';

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(listenQueue);

  console.log("M1 Consume is working now")
  ch1.consume(listenQueue, (msg) => {
    if (msg !== null) {
      answer = msg.content.toString();
      console.log('Recieved:', answer);
      ch1.ack(msg);
      recieved = true;
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();

async function rabbitConnect(sendMessage) {
    const sendQueue = 'questions';

    const ch2 = await conn.createChannel();
    await ch2.assertQueue(sendQueue);

    await ch2.sendToQueue(sendQueue, Buffer.from(sendMessage));

    console.log("Msg from M1 sent")
};

app.post("/", async (req, res) => {
  const inputNumber = req.body.number;
  await rabbitConnect(inputNumber);
  const interval = setInterval(() => {
    if(recieved) {
      console.log(`Result of m2 work is: ${answer}`);
      res.json(answer);
      recieved = false;
      clearInterval(interval)
    } 
  }, 500)
})

app.listen(PORT, () => {
  console.log(`App is now listening on port ${PORT}`);
})
