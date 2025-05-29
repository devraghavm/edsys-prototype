exports.handler = async (event) => {
    // Log the incoming event
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Process the event and perform your logic here
    const responseMessage = "Hello from Lambda!";

    // Return a response
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: responseMessage,
            input: event,
        }),
    };
};