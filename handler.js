const { SQS, DynamoDB } = require("aws-sdk");

const sqs = new SQS();

const sendMessage = () => {
 return sqs
  .sendMessage({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: event.body,
    MessageAttributes: {
      AttributeName: {
        StringValue: "Attribute Value",
        DataType: "String",
      },
    },
  })
  .promise(); 
}

const producer = async (event) => {
  let statusCode = 200;
  let message;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    const results = await Promise.all(
     [sendMessage(), sendMessage(), sendMessage(), sendMessage(), sendMessage(), sendMessage()]
    );

    console.log(results);

    message = "Messages accepted!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

const consumer = async (event) => {
  for (const record of event.Records) {
    const messageAttributes = record.messageAttributes;
    console.log(
      "Message Attribute: ",
      messageAttributes.AttributeName.stringValue
    );
    console.log("Message Body: ", record.body);
  }
};

module.exports = {
  producer,
  consumer,
};
