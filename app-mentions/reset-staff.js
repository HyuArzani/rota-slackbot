/*------------------
  RESET STAFF
  @rota "[rotation]" reset staff
  Removes rotation staff
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('reset staff', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, set staff to an empty array
      const save = await store.saveStaff(rotation, []);
      // Send message to confirm staff has been reset
      const result = await app.client.chat.postEphemeral(
        utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.resetStaffConfirm(rotation))
      );
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      const result = await app.client.chat.postEphemeral(
        utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.resetStaffError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};