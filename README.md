This demo app is set up to receive a phone call, offer an optional survey, and text the survey to the caller if it is not declined.

There are several values a user will have to populate to get the application running.

1. The Vonage dashboard will need to be configured by creating a new Voice application and providing endpoints to your application. You will also need to configure the your default behavior upon receiving a text message which is also in the dashboard.

Images of configured dashboards are included for your convenience. Yours will differ slightly.

![Dashboard 1](dashboard_1.png?raw=true)
![Dashboard 2](dashboard_2.png?raw=true)

Information about ngrok (This application defaults to running on port 8000, but that can be changed on line 104): https://developer.nexmo.com/tools/ngrok

Creating a new application (I used the dashboard): https://developer.nexmo.com/application/overview

Configuring to receive calls: https://developer.nexmo.com/voice/voice-api/code-snippets/before-you-begin

https://developer.nexmo.com/voice/voice-api/code-snippets/handle-user-input-with-dtmf

Configuring to receive text messages: https://developer.nexmo.com/messaging/sms/code-snippets/receiving-an-sms


2. The packages in lines 1-5 will have to be installed into your local npm environment.

3. The values in lines 8-11 will also have to be filled in with your credentials and a path to your private key. Those artifacts were created in Step 1.

4. You will also need to set the number from which text messages will be sent. That is on line 63.

Once everything is configured, you can run the application with `npm start server.js` and calling the number you configured in your dashboard for this application.

You can uncomment lines 91-92 to get some event information printed to your terminal.