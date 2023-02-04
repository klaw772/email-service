// top of file
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

'use strict';

module.exports.sendEmail = async (event) => {
  const queryParams = event.queryStringParameters || {};
  // select from the query parameters
  let { email, message, subject } = queryParams;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Email is required',
      }),
    };
  }
  message = message || 'This is a message generated automatically from a Lambda function.';
  subject = subject || 'Hello from Lambda';
  const params = {
    Destination: {
      ToAddresses: ['kathleen.law@multiverse.io'], // This should be your email address
    },
    Message: {
      Body: {
        Text: {
          Data: 'This is a message generated automatically from a Lambda function.',
        },
      },
      Subject: {
        Data: 'Hello from Lambda',
      },
    },
    Source: 'kathleen.law@multiverse.io', // This can be any email address, the email you want to show as the "sender" when the email is received
  };
  await ses.sendEmail(params).promise();
  
  // in the object that is `return`ed, replace the `body.message` property with `Email sent to ${queryParams.email}`
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Email sent to ${email} with subject ${subject} and message ${message}`,
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
