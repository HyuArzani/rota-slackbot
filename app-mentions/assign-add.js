/*------------------
  ASSIGN ADD
  @rota "[rotation]" assign add "[@user]"
  add users to specified assignment
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
    try {
      const pCmd = await utils.parseCmd('assign add', event, context);
      const rotation = pCmd.rotation;
      const allStafMention = pCmd.staff;
      if (utils.rotationInList(rotation, ec.rotaList)) {
        const rotationObj = await store.getRotation(rotation);
        // Staff list exists and is not an empty array
        const lastAssigned = rotationObj.assigned;

        allStafMention.map(async (user) => {
            if (lastAssigned.indexOf(user) === -1) {
                lastAssigned.push(user);
                // Confirm assignment in channel
                const result = await app.client.chat.postMessage(
                    utils.msgConfig(ec.botToken, ec.channelID, msgText.assignConfirm(user, rotation))
                );
                const oncallUserDMChannel = utils.getUserID(user);
                // Send DM to on-call user notifying them of the message that needs their attention
                const sendDM = await app.client.chat.postMessage(
                    utils.msgConfigBlocks(ec.botToken, oncallUserDMChannel, msgText.assignDMHandoffBlocks(rotation, '', ec.sentByUserID, ec.channelID, ''))
                );
            }
        });
        // save Assign user in store
        const save = await store.saveAssignment(rotation, lastAssigned);
      } else {
        // If rotation doesn't exist, send message saying so
        const result = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.assignError(rotation))
        );
      }
    }
    catch (err) {
      errHandler(app, ec, utils, err, msgText);
    }
  };