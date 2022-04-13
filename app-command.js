const utils = require('./utils/utils');
const msgText = require('./bot-response/message-text');
const errHandler = require('./utils/error');

/*------------------
    APP COMMAND
------------------*/

const app_command = (app, store) => {
    app.command('/rota', async(param) => {
        const { payload, context, ack } = param;
        console.log("ABC = ", param);
        // Event and context data
        const ec = {
            text: payload.text,                           // raw text from the mention
            sentByUserID: payload.user_id,                   // ID of user who sent the message
            channelID: payload.channel_id,                   // channel ID
            botToken: context.botToken,                 // bot access token
            rotaList: await store.getRotations()        // rotations in db
        }
        try {
            // console.log('Event: ', event, 'Clean Text: ', utils.cleanText(ec.text));
            const result = await app.client.chat.postMessage(
                utils.msgConfig(ec.botToken, ec.channelID, msgText.didntUnderstand(ec, msgText))
            );
        }
        catch (err) {
            errHandler(app, ec, utils, err, msgText);
        }
        ack();
    })
}
module.exports = app_command;