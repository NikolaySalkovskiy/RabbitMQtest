# Microservices with RabbitMQ
## How to deploy a project locally
1. git clone this repo to your local pc
2. run ```npm i``` to install all packages
3. Make two terminals and run
```node m1.js``` in first and
```node m2.js``` in second
4. Then open postman or curl and make post request to path 
```http://localhost:3000/``` with one body parametr named ```number```
5. After 5 seconds you will recieve json answer: your number multiplied by two.


