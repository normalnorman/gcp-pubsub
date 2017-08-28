'use strict';

// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');

// Your Google Cloud Platform project ID
const projectId = 'google.com:container-pubsub';

// Instantiates a client
const pubsubClient = PubSub({
    projectId: projectId
});

// The name for the new topic
const topicName = 'myTopic';
const topic = pubsubClient.topic(topicName);
const express = require('express');
const PORT = 8080;
// App
const app = express();

if (topic) {
    topic.publish('containerized app started')
        .then((results) => {
            const messageIds = results[0];

            console.log(`Message ${messageIds[0]} published.`);

            return messageIds;
        });
}

app.get('/', function(req, res) {
    res.send('Hello, brave new containerized world\n');

    topic.publish('message received' + req)
        .then((results) => {
            const messageIds = results[0];

            console.log(`Message ${messageIds[0]} published.`);

            return messageIds;
        });
});

app.get('/create', function(req, res) {
    res.send('Hello, brave new containerized world\n');

    pubsubClient.createTopic(topicName)
        .then((results) => {
            const topic = results[0];
            console.log(`Topic ${topic.name} created.`);
        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);