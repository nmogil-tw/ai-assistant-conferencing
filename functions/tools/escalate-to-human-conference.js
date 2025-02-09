// This function handles escalating an AI conference call to include a human agent
exports.handler = async function(context, event, callback) {
    // Create a TwiML response object
    const twiml = new Twilio.twiml.VoiceResponse();
    
    // Get the Twilio client
    const client = context.getTwilioClient();
    
    try {
        // Extract the Call SID from the x-session-id header
        // Example format: voice:CAfa8d9ac9fd82c6259e695fd5b3167ead/VX9b71d8dc18b70066327e1af8e55d9896
        const sessionHeader = event.request.headers["x-session-id"];
        console.log('sessionHeader:', sessionHeader);
        if (!sessionHeader) {
            throw new Error('x-session-id header is required');
        }

        // Extract the Call SID using regex
        const callSidMatch = sessionHeader.match(/CA[a-f0-9]{32}/);
        if (!callSidMatch) {
            throw new Error('Could not extract Call SID from x-session-id header');
        }
        const sessionCallSid = callSidMatch[0];
        console.log('Extracted Session Call SID:', sessionCallSid);

        // Get the call details for the session call to get the customer's phone number
        const sessionCall = await client.calls(sessionCallSid).fetch();
        const customerPhoneNumber = sessionCall.from;
        console.log('Customer phone number:', customerPhoneNumber);

        // First, let's check the session call's conference status
        console.log('Session Call Conference SID:', sessionCall.conferenceSid);
        console.log('Session Call Status:', sessionCall.status);

        // Fetch all recent calls from the customer's phone number, including completed ones
        const calls = await client.calls.list({
            from: customerPhoneNumber,
            status: 'in-progress',
            limit: 3
        });

        console.log('Found total calls:', calls.length);
        calls.forEach(call => {
            console.log(`Call SID: ${call.sid}, Status: ${call.status}, Parent Call SID: ${call.parent_call_sid}`);
        });

        // Find any call with an active conference
        const conferenceCall = calls.find(call => call.sid !== sessionCallSid);
        if (!conferenceCall) {
            throw new Error('No active conference call found for this customer. Call details logged above.');
        }

        console.log('Found Conference Call SID:', conferenceCall.sid);
        
        // Get the third call which contains the conference friendly name
        const thirdCall = calls[2];
        if (!thirdCall) {
            throw new Error('Third call not found - required for conference friendly name');
        }
        
        console.log('Using Conference Friendly Name:', thirdCall.sid);

        // Get the human agent's phone number from environment variables
        const humanAgentPhone = context.HUMAN_AGENT_PHONE;
        if (!humanAgentPhone) {
            throw new Error('Human agent phone number not configured');
        }

        // Add the human agent to the conference
        const participantOptions = {
            from: customerPhoneNumber,
            to: humanAgentPhone,
            label: 'human_agent',
        };

        // Create the new participant using the third call SID as the friendly name
        const humanAgent = await client.conferences(thirdCall.sid)
            .participants
            .create(participantOptions);
        
        console.log('Human agent added to conference:', humanAgent.sid);

        // End the original session call
        await client.calls(sessionCallSid)
            .update({status: 'completed'});
        
        console.log('Original session call ended:', sessionCallSid);

        // Return success response
        return callback(null, twiml);
    } catch (error) {
        console.error('Error in escalate-to-human-conference:', error);
        return callback(error);
    }
} 