// This is the main function that will be executed when the handler is triggered
exports.handler = function(context, event, callback) {
    // Create a new instance of Twilio's VoiceResponse. This will be used to generate TwiML, which is a set of instructions that tell Twilio what to do when you receive an incoming call or SMS.
    let twiml = new Twilio.twiml.VoiceResponse();

    // Create a shortened conference name but keep full token for callback
    let conferenceName = event.CallSid; // Use CallSid as a unique conference name
    const fullCallToken = event.CallToken; // Keep the full token

    // Create a new Dial verb. This verb is used to connect the current call to another phone. The timeLimit attribute sets the maximum duration of the call in seconds.
    const dial = twiml.dial({
            timeLimit: 180,
        });

    // Add a Conference noun to the Dial verb. This is used to connect the current call to a conference call. The conference name is set to the CallSid from the event.
    dial.conference({
        // The URL that Twilio will send information to when the conference starts and when a participant joins the conference.
        statusCallback: `https://${context.FUNCTIONS_DOMAIN}/channels/voice/conference-status-callback?fullToken=${encodeURIComponent(fullCallToken)}`,
        // The events that Twilio will send information about to the statusCallback URL.
        statusCallbackEvent: 'start join',
        // The label of the participant. In this case, the participant is labeled as 'customer'.
        participantLabel: 'customer',
        // The conference call will be recorded from the start.
        record: 'record-from-start',
        // The conference will end when the participant who initiated the conference leaves.
        endConferenceOnExit: true
    }, conferenceName);

    // End the function and return the generated TwiML
    return callback(null, twiml);
};