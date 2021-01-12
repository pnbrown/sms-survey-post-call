const app = require('express')()
const bodyParser = require('body-parser')
var Promise = require('promise')
const Vonage = require('@vonage/server-sdk')
const { get } = require('https')

const vonage = new Vonage({
    apiKey: '',
    apiSecret: '',
    applicationId: '',
    privateKey: ''
})

app.use(bodyParser.json())

function getTextRecipient(request) {
    // Request does not include caller from information if dtmf times out. 
    // This function retrieves the from number by matching the conversation_uuid
    return new Promise((resolve, reject) => {
        vonage.calls.get({ conversation_uuid: `${request.body.conversation_uuid}` }, (err, res) => {
            if (err) {
                console.error(err);
                reject()
            }
            // Pulls the data from the first call returned.
            var to = res._embedded.calls[0].from.number
            resolve(to);
        })
    }
    )
}

const onInboundCall = (request, response) => {
    const ncco = [
        {
            action: 'talk',
            text: 'If you would like to opt out of an sms survey after this call, please press 1.'
        },
        {
            action: 'input',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/dtmf`],
        }
    ]
    response.json(ncco)
}

const onInput = async (request, response) => {
    const dtmf = request.body.dtmf
    if (dtmf === '1') {
        const ncco = [{
            action: 'talk',
            text: `You declined the survey. Goodbye.`
        }]

        response.json(ncco)
    } else {
        const ncco = [{
            action: 'talk',
            text: `The survey will be sent to you shortly. Thank you.`
        }]
        response.json(ncco)

        const from = ''     // <-- TEXT SENDER NUMBER GOES HERE
        const to = await getTextRecipient(request)
        console.log("After fetching number: " + to)

        const text = 'On a scale of 1 to 10, how satisfied were you with this call? '

        vonage.message.sendSms(from, to, text, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    }

}

function handleInboundSms(request, response) {
    const params = Object.assign(request.query, request.body)
    console.log(params)
    response.status(204).send()
}

const onEvents = (request, response) => {
    // console.log(request.query)
    // console.log(request.body)
    response.sendStatus(200)
}

app
    .get('/webhooks/answer', onInboundCall)
    .post('/webhooks/dtmf', onInput)
    .post('/webhooks/events', onEvents)
    .route('/webhooks/inbound-sms')
    .get(handleInboundSms)
    .post(handleInboundSms)

app.listen(8000)