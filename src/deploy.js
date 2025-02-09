// src/deploy.js
require('dotenv').config();
const { TwilioServerlessApiClient } = require('@twilio-labs/serverless-api');
const fs = require('fs');
const deployFunctions = require('./lib/deployFunctions');

// Helper function to update .env file
const updateEnvFile = (key, value) => {
  const envFilePath = '.env';
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  const envLines = envContent.split('\n');

  // Check if key already exists
  const keyIndex = envLines.findIndex((line) => line.startsWith(`${key}=`));

  if (keyIndex !== -1) {
    // Update existing key
    envLines[keyIndex] = `${key}=${value}`;
  } else {
    // Add new key
    envLines.push(`${key}=${value}`);
  }

  fs.writeFileSync(envFilePath, envLines.join('\n'));
  console.log(`✓ Updated .env file with ${key}`);
};

/**
 * Main deployment script that deploys Twilio Functions
 */
async function deploy() {
  // Validate environment variables
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error(
      'Missing required environment variables. Please check .env file.'
    );
  }

  console.log('Starting Twilio Functions deployment...\n');

  const serverlessClient = new TwilioServerlessApiClient({
    username: process.env.TWILIO_ACCOUNT_SID,
    password: process.env.TWILIO_AUTH_TOKEN,
  });

  try {
    // Deploy Twilio Functions backend
    console.log('Deploying Twilio Functions backend...');
    const result = await deployFunctions(serverlessClient);
    console.log('✓ Twilio Functions backend deployed successfully\n');

    // Save Functions domain to .env
    updateEnvFile('FUNCTIONS_DOMAIN', result.domain);

    // Deployment summary
    console.log('\n=== Deployment Summary ===');
    console.log('Functions Domain:', result.domain);
    console.log('Service SID:', result.serviceSid);
    console.log('Environment SID:', result.environmentSid);
    console.log('\nDeployment completed successfully! 🎉');
    console.log('\nNext steps:');
    console.log('1. Visit the Twilio Console to view your functions');
    console.log('2. Test the deployed functions');
    console.log('3. Update webhook URLs if needed');

    return result;
  } catch (error) {
    console.error('\n❌ Deployment failed:');
    console.error('Error:', error.message);

    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.status) {
      console.error('Status Code:', error.status);
    }

    console.log('\nTroubleshooting suggestions:');
    console.log('1. Check your Twilio credentials');
    console.log('2. Verify your account permissions');
    console.log('3. Ensure all function code is valid');

    throw error;
  }
}

// Add cleanup function for handling interruptions
process.on('SIGINT', async () => {
  console.log('\n\nReceived interrupt signal. Cleaning up...');
  process.exit(0);
});

// Run the deployment if this script is executed directly
if (require.main === module) {
  deploy()
    .then((result) => {
      console.log('\nYou can now find your functions in the Twilio Console:');
      console.log(
        `https://console.twilio.com/us1/develop/functions/services/${result.serviceSid}`
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nDeployment failed. See error details above.');
      process.exit(1);
    });
}

module.exports = deploy;
