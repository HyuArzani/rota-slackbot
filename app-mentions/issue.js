/*------------------
  ISSUE
  @rota "[rotation]" issue [message]
  Notify all staff in rotation to specified message
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
    try {
      const pCmd = await utils.parseCmd('issue', event, context);
      const rotation = pCmd.rotation;
      const rotationObj = await store.getRotation(rotation);
      const allStafMention = rotationObj.staff;
      const handoffMsg = pCmd.issue;
      if (utils.rotationInList(rotation, ec.rotaList)) {
        // Send message to the channel where help was requested notifying that assigned user was contacted
        const sendChannelMsg = await app.client.chat.postEphemeral(
            utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.confirmChannelIssue(rotation, ec.sentByUserID))
        );
        if (!!ec.sentByUserID && ec.sentByUserID !== 'USLACKBOT') {
            // Send ephemeral message (only visible to sender) telling them what to do if urgent
            // Do nothing if coming from a slackbot
            const sendEphemeralMsg = await app.client.chat.postEphemeral(
                utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.confirmEphemeralMsg(rotation))
            );
        }
        // map staff 1 by 1 to send message to each user
        allStafMention.map(async (usermention) => {
          // If someone is assigned to concierge...
          const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${ec.channelID}/p${event.ts.replace('.', '')}`;
          const oncallUserDMChannel = utils.getUserID(usermention);
          // Send DM to on-call user notifying them of the message that needs their attention
          const sendDM = await app.client.chat.postMessage(
            utils.msgConfig(ec.botToken, oncallUserDMChannel, msgText.dmToAssigned(rotation, ec.sentByUserID, ec.channelID, link))
          );
        })
      } else {
        // If rotation doesn't exist, send message saying so
        const result = await app.client.chat.postEphemeral(
          utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.assignError(rotation))
        );
      }
    }
    catch (err) {
      errHandler(app, ec, utils, err, msgText);
    }
  };