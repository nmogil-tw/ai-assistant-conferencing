// This is the main function that will be executed when the handler is triggered
exports.handler = async function(context, event, callback) {
    // Create a new instance of Twilio's VoiceResponse. This will be used to generate TwiML, which is a set of instructions that tell Twilio what to do when you receive an incoming call or SMS.
    let twiml = new Twilio.twiml.VoiceResponse();
    console.log('twiml:', twiml);

    // Get the Twilio client from the context. This client allows you to interact with the Twilio API.
    const client = context.getTwilioClient();
    console.log('client:', client);

    // Get the ConferenceSid from the event. This is the unique identifier of the conference call.
    const conferenceSid = event.ConferenceSid;
    console.log('conferenceSid:', conferenceSid);
    
    // Get the full token from the URL parameter instead of FriendlyName
    const callToken = event.fullToken;
    console.log('callToken from URL:', callToken);

    // Start of try block. If any error occurs within this block, it will be caught and handled by the catch block.
    try {
        // Check if the participant label is 'customer'
        if (event.ParticipantLabel === 'customer') {
            console.log('ParticipantLabel is customer');
            
            // Log the entire event object to inspect available properties
            console.log('Event object:', event);

            // Check if CallToken exists
            if (!callToken) {
                console.warn('No CallToken found in event object');
            }
            
            const callSid = event.CallSid;
            console.log('callSid:', callSid);

            // Fetch the details of the call using the callSid
            const callDetails = await client.calls(callSid).fetch();
            const customerPhoneNumber = callDetails.from;
            const agentNumber = context.AI_ASSISTANT_PHONE_NUMBER;
            console.log('customerPhoneNumber:', customerPhoneNumber);
            console.log('agentNumber:', agentNumber);

            // Create participant options object
            const participantOptions = {
                from: customerPhoneNumber,
                to: agentNumber,
                label: 'agent',
                statusCallback: `https://${context.FUNCTIONS_DOMAIN}/channels/voice/conference-status-callback`,
            };

            // Add the full CallToken if it exists
            if (callToken) {
                participantOptions.callToken = callToken;
                console.log('Using full CallToken from URL:', callToken);
            }

            // Create a new participant in the conference call
            const agent = await client.conferences(conferenceSid).participants.create(participantOptions);
            console.log('agent created:', agent);
        } 
        // Check if the participant label is 'agent'
        else if (event.ParticipantLabel === 'agent') {
            console.log('ParticipantLabel is agent');

            // Get the CallSid of the agent from the event
            const agentCallSid = event.CallSid;
            console.log('agentCallSid:', agentCallSid);
        }

        // End the function and return the generated TwiML
        return callback(null, twiml);
    // If any error occurred in the try block, it will be caught here
    } catch (error) {
        // Log the error and end the function
        console.error('Error occurred:', error);
        return callback(error);
    }
}