/*------------------
  ASSIGN REMOVE
  @rota "[rotation]" staff remove "[@user]"
  remove users to specified staff rotation
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
    try {
      const pCmd = await utils.parseCmd('staff remove', event, context);
      const rotation = pCmd.rotation;
      const allStafMention = pCmd.staff;
      if (utils.rotationInList(rotation, ec.rotaList)) {
        const rotationObj = await store.getRotation(rotation);
        // Staff list exists and is not an empty array
        const lastStaff = rotationObj.staff;
        // filter user, if user is in allStafMention list, remove from assigned list & send message
        const newStaff = [];
        lastStaff.map(async (user) => {
            if(allStafMention.indexOf(user) === -1) {
                newStaff.push(user);
            } else {
                // Confirm assignment in channel
                const result = await app.client.chat.postEphemeral(
                    utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.staffRemoveConfirm(user, rotation))
                );
            }
        });
        // save Assign user in store
        const save = await store.saveStaff(rotation, newStaff);
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