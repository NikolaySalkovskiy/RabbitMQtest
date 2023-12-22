const amqplib = require("amqplib");

(async () => {
    const listenQueue = 'questions';
    const sendQueue = 'answers'
    const conn = await amqplib.connect('amqp://localhost');
  
    const ch1 = await conn.createChannel();
    await ch1.assertQueue(listenQueue);

    const ch2 = await conn.createChannel();
    await ch2.assertQueue(sendQueue);

    ch1.consume(listenQueue, async (msg) => {
        if (msg !== null) {
          const current_num = parseInt(msg.content.toString());
          console.log('Recieved:', current_num);
          ch1.ack(msg);
          setTimeout(() => {
              ch2.sendToQueue(sendQueue, Buffer.from((current_num*2).toString()));
              console.log("M2 have sent its msg")
          }, 5000);
        } else {
          console.log('Consumer cancelled by server');
        }
      });
})();
