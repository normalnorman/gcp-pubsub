'use strict';

// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');

// Google Cloud Platform project ID
const projectId = 'google.com:container-pubsub';

// Pubsub subscription id
const subscriptionId = 'projects/google.com:container-pubsub/subscriptions/all';

// Subscription timeout in seconds
const timeout = 100;

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

listenForMessages(subscriptionId, timeout)

// [START pubsub_listen_messages]
function listenForMessages(subscriptionName, timeout) {
    // Instantiates a client

    // References an existing subscription, e.g. "my-subscription"
    const subscription = pubsubClient.subscription(subscriptionName);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message) => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);
        messageCount += 1;

        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on(`message`, messageHandler);
    setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
}
// [END pubsub_listen_messages]


app.get('/topics', function(req, res) {

    pubsubClient.getTopics()
        .then((results) => {
            const topics = results[0];

            console.log('Topics:');
            topics.forEach((topic) => console.log(topic.name));

            return res.send(topics);
        });
});

app.get('/', function(req, res) {
    res.send('Hello, brave new containerized world\n');

    topic.publish('message received' + req)
        .then((results) => {
            const messageIds = results[0];

            console.log(`Message ${messageIds[0]} published.`);

            return messageIds;
        });
});

app.get('/create/:message', function(req, res) {
    res.send('Received message: ' + req.params.message);

    topic.publish(req.params.message)
        .then((results) => {
            const messageIds = results[0];

            console.log(`Message ${messageIds[0]} published.`);

            return messageIds;
        });
});

app.get('/messages', function(req, res) {

    //projects/google.com:container-pubsub/subscriptions/all
    const subscription = pubsubClient.subscription(subscriptionId);
    var messageText = '';

    let messageCount = 0;
    const messageHandler = (message) => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);

        messageText += 'Received message: ' + message.data + '\n';
        messageCount += 1;

        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on(`message`, messageHandler);
    setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log(`${messageCount} message(s) received.`);
        res.send(messageText);
    }, timeout * 1000);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);