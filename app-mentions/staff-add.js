/*------------------
  STAFF ADD
  @rota "[rotation]" staff add [@user]
  add users to staff list
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
    try {
      const pCmd = await utils.parseCmd('staff add', event, context);
      const rotation = pCmd.rotation;
      const allStafMention = pCmd.staff;
      if (utils.rotationInList(rotation, ec.rotaList)) {
        const rotationObj = await store.getRotation(rotation);
        // Staff list exists and is not an empty array
        const lastStaff = rotationObj.staff;

        allStafMention.map(async (user) => {
            if (lastStaff.indexOf(user) === -1) {
                lastStaff.push(user);
                // Confirm staff in channel
                const result = await app.client.chat.postEphemeral(
                    utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.staffAddConfirm(user, rotation))
                );
            }
        });
        // save Assign user in store
        const save = await store.saveStaff(rotation, lastStaff);
      } else {
        // If rotation doesn't exist, send message saying so
        const result = await app.client.chat.postEphemeral(
          utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.staffError(rotation))
        );
      }
    }
    catch (err) {
      errHandler(app, ec, utils, err, msgText);
    }
  };