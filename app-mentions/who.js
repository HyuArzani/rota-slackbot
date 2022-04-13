/*------------------
  WHO
  @rota "[rotation]" who
  Reports who the assigned user is for a rotation
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('who', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, display its information
      const rotationObj = await store.getRotation(rotation);
      if (!!rotationObj.assigned) {
        // If someone is currently assigned, report who
        const result = await app.client.chat.postEphemeral(
          utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.whoReport(rotationObj.assigned, rotation))
        );
      } else {
        // If nobody is assigned
        const result = await app.client.chat.postEphemeral(
          utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.nobodyAssigned(rotation))
        );
      }
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      const result = await app.client.chat.postEphemeral(
        utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.whoError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};