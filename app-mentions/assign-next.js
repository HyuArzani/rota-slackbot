/*------------------
  ASSIGN NEXT
  @rota "[rotation]" assign next [handoff message]
  Assigns next user in staff list to rotation
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('assign next', event, context);
    const rotation = pCmd.rotation;
    const handoffMsg = pCmd.handoff;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // Rotation exists; get rotation and staff list
      const rotationObj = await store.getRotation(rotation);
      const staffList = rotationObj.staff;
      if (staffList && staffList.length) {
        // Staff list exists and is not an empty array
        const lastAssigned = rotationObj.assigned;
        // change logic single to multi
        // const lastAssignedIndex = staffList.indexOf(lastAssigned);
        // const lastIndex = staffList.length - 1; // last available position in staff list
        // const firstUser = staffList[0];
        let unassigned = staffList.filter((user) => lastAssigned.indexOf(user) === -1);
        // change logic single to multi
        /* let usermention;
        if (lastAssigned) {
          // There's a user currently assigned
          if (lastAssignedIndex > -1 && lastAssignedIndex < lastIndex) {
            // The last assigned user is in the staff list and is NOT last
            // Set assignment to next user in staff list
            usermention = staffList[lastAssignedIndex + 1];
          } else {
            // Either last user isn't in staff list or we're at the end of the list
            usermention = firstUser;
          }
        } else {
          // No previous assignment; start at beginning of staff list
          usermention = firstUser;
        } */
        // if all users are assigned, assign again
        if(unassigned.length === 0) {
          unassigned = lastAssigned;
        }
        // Save assignment
        const save = await store.saveAssignment(rotation, unassigned);
        unassigned.map(async (user) => {
          // Send message to the channel about updated assignment
          const result = await app.client.chat.postEphemeral(
            utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.assignConfirm(user, rotation))
          );
          if (!!handoffMsg) {
            // There is a handoff message
            // Send DM to newly assigned user notifying them of handoff message
            const oncallUserDMChannel = utils.getUserID(user);
            const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${ec.channelID}/p${event.ts.replace('.', '')}`;
            // Send DM to on-call user notifying them of the message that needs their attention
            const sendDM = await app.client.chat.postMessage(
              utils.msgConfigBlocks(ec.botToken, oncallUserDMChannel, msgText.assignDMHandoffBlocks(rotation, link, ec.sentByUserID, ec.channelID, handoffMsg))
            );
            if (!!ec.sentByUserID && ec.sentByUserID !== 'USLACKBOT') {
              // Send ephemeral message notifying assigner their handoff message was delivered via DM
              const result = await app.client.chat.postEphemeral(
                utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.assignHandoffConfirm(usermention, rotation))
              );
            }
          }
        });
      } else {
        // No staff list; cannot use "next"
        const result = await app.client.chat.postEphemeral(
          utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.assignNextError(rotation))
        );
      }
    } else {
      // If rotation doesn't exist, send message in channel
      const result = await app.client.chat.postEphemeral(
        utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.assignError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};