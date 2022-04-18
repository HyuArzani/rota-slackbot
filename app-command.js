const utils = require('./utils/utils');
const msgText = require('./bot-response/message-text');
const errHandler = require('./utils/error');
const helpBlocks = require('./bot-response/blocks-help');

const cmdAbout = require('./app-commands/about');
const cmdWho = require('./app-commands/who');
const cmdList = require('./app-commands/list');
const cmdHelp = require('./app-commands/help');

/*------------------
    APP COMMAND
------------------*/

const app_command = (app, store) => {
    app.command('/rota', async(param) => {
        const { payload, context, ack } = param;
        // Event and context data
        const ec = {
            text: payload.text,                           // raw text from the mention
            sentByUserID: payload.user_id,                   // ID of user who sent the message
            channelID: payload.channel_id,                   // channel ID
            botToken: context.botToken,                 // bot access token
            rotaList: await store.getRotations()        // rotations in db
        }
        // Decision logic establishing how to respond to mentions
        const isWho = await utils.isCmd('who', ec.text, true);
        const isAbout = await utils.isCmd('about', ec.text, true);
        const isHelp = await utils.isCmd('help', ec.text, true);
        const isList = await utils.isCmd('list', ec.text, true);

        // /rota "[rotation]" about
        if (isAbout) {
            cmdAbout(app, payload, context, ec, utils, store, msgText, errHandler);
        }
        // /rota "[rotation]" who
        else if (isWho) {
            cmdWho(app, payload, context, ec, utils, store, msgText, errHandler);
        }
        // /rota list
        else if (isList) {
            cmdList(app, ec, utils, msgText, errHandler);
        }
        // /rota help
        else if (isHelp) {
            cmdHelp(app, ec, utils, helpBlocks, msgText, errHandler);
        }
        // /rota anything else
        else {
            try {
                // console.log('Event: ', event, 'Clean Text: ', utils.cleanText(ec.text));
                const result = await app.client.chat.postEphemeral(
                    utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.didntUnderstand(ec, msgText))
                );
            }
            catch (err) {
                errHandler(app, ec, utils, err, msgText);
            }
        }
        ack();
    })
}
module.exports = app_command;