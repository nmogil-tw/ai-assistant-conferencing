// This is the main function that will be executed when the handler is triggered
exports.handler = function(context, event, callback) {
    // Create a new instance of Twilio's VoiceResponse. This will be used to generate TwiML, which is a set of instructions that tell Twilio what to do when you receive an incoming call or SMS.
    const twiml = new Twilio.twiml.VoiceResponse();

    // Use CallSid as a unique conference name
    const conferenceName = event.CallSid;

    twiml.dial({timeLimit: 180})
        .conference(
            {
                statusCallback: `https://${context.FUNCTIONS_DOMAIN}/channels/voice/conference-status-callback?fullToken=${encodeURIComponent(event.CallToken)}`,
                statusCallbackEvent: 'start join',
                participantLabel: 'customer',
                record: 'record-from-start',
                endConferenceOnExit: true
            },
            conferenceName
        );

    // End the function and return the generated TwiML
    return callback(null, twiml);
};