/*------------------
  LIST
  @rota list
  Lists all rotations, descriptions, and assignments
------------------*/
module.exports = async (app, ec, utils, msgText, errHandler) => {
  try {
    // If the store is not empty
    if (ec.rotaList && ec.rotaList.length) {
      const result = await app.client.chat.postEphemeral(
        utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.listReport(ec.rotaList))
      );
    } else {
      // If store is empty
      const result = await app.client.chat.postEphemeral(
        utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.listEmpty())
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};