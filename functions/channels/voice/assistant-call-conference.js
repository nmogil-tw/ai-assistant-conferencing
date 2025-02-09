/**
 * @param {import('@twilio-labs/serverless-runtime-types').Context} context
 * @param {{}} event
 * @param {import('@twilio-labs/serverless-runtime-types').ServerlessCallback} callback
 */
exports.handler = async function(context, event, callback) {
  console.log('=== Starting Assistant Call Conference ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context keys:', Object.keys(context));
  
  try {
    // Validate required configuration
    if (!context.ASSISTANT_ID) {
      console.error('Configuration error: Missing ASSISTANT_ID');
      throw new Error('Missing required configuration');
    }
    console.log('Assistant ID configured:', context.ASSISTANT_ID);

    // Set customer name
    const customer_name = 'Demo';
    console.log('Setting up conference for customer:', customer_name);

    // Generate TwiML response
    console.log('Generating TwiML response...');
    let twiml = '<Response>';
    
    twiml += `
      <Connect>
        <Assistant 
          id="${context.ASSISTANT_ID}"
          welcomeGreeting="Hi ${customer_name}, thanks for calling Owl Bank. I'm Alice a virtual agent, how can I help you?">
        </Assistant>
      </Connect>`;

    twiml += '</Response>';
    console.log('Generated TwiML:', twiml);
    
    // Return the TwiML response
    console.log('=== Completed Assistant Call Conference Successfully ===');
    return callback(null, twiml);
  } catch (err) {
    console.error('=== Error in Assistant Call Conference ===');
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });

    // Return a generic TwiML response in case of errors
    const errorTwiml = `
      <Response>
        <Connect>
          <Assistant 
            id="${context.ASSISTANT_ID}"
            welcomeGreeting="Thanks for calling Owl Bank, I'm Alice a virtual agent, how can I help you?">
          </Assistant>
        </Connect>
      </Response>`;

    console.log('Returning fallback TwiML due to error');
    return callback(null, errorTwiml);
  }
};