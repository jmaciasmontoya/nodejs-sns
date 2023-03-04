const express = require('express');
const app = express();

const AWS = require('aws-sdk');

const sns = new AWS.SNS({
    profile: 'sns_profile',
    aws_access_key_id: 'REEMPLAZA-ID',
    aws_secret_access_key: 'REEMPLAZA-KEY',
    region: 'us-east-1',
});

const port = 3000;

app.use(express.json());

app.get('/status', (req, res) => res.json({status: "ok", sns: sns}));

app.listen(port, () => console.log(`SNS App en el puerto: ${port}!`));

app.post('/subscribe', (req, res) => {
    let params = {
        Protocol: 'EMAIL', 
        TopicArn: 'reemplaza-arn',
        Endpoint: req.body.email
    };

    sns.subscribe(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send(data);
        }
    });
});

app.post('/send', (req, res) => {
    let now = new Date().toString();
    let email = `${req.body.message} \n \n Enviado: ${now}`;
    let params = {
        Message: email,
        Subject: req.body.subject,
        TopicArn: 'reemplaza-arn'
    };

    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); 
        else console.log(data);
    });
});

