/*------------------
  HELP
  @rota help
  Provides instructions on how to use Rota
------------------*/
module.exports = async (app, ec, utils, helpBlocks, msgText, errHandler) => {
  try {
    const result = await app.client.chat.postEphemeral({
      token: ec.botToken,
      channel: ec.channelID,
      user: ec.sentByUserID,
      text: '',
      blocks: helpBlocks()
    });
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};