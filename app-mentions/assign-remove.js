/*------------------
  ASSIGN REMOVE
  @rota "[rotation]" assign remove "[@user]"
  remove users to specified assignment
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
    try {
      const pCmd = await utils.parseCmd('assign remove', event, context);
      const rotation = pCmd.rotation;
      const allStafMention = pCmd.staff;
      if (utils.rotationInList(rotation, ec.rotaList)) {
        const rotationObj = await store.getRotation(rotation);
        // Staff list exists and is not an empty array
        const lastAssigned = rotationObj.assigned;
        // filter user, if user is in allStafMention list, remove from assigned list & send message
        const newAssigned = [];
        lastAssigned.map(async (user) => {
            if(allStafMention.indexOf(user) === -1) {
                newAssigned.push(user);
            } else {
                // Confirm assignment in channel
                const result = await app.client.chat.postEphemeral(
                    utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.assignRemoveConfirm(user, rotation))
                );
            }
        });
        // save Assign user in store
        const save = await store.saveAssignment(rotation, newAssigned);
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