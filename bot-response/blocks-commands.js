/*------------------
  BLOCKS: COMMANDS
------------------*/
const commandsBlocks = [
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":wave: Hi there! I'm your friendly *Rotation Bot* :arrows_counterclockwise::robot_face: My role is to help track many different rotations across teams."
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':question: To get started, use `/rota help` to show how to interact with me.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":clipboard: Use `/rota list` to *display the list* of all current active rotations."
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':bust_in_silhouette: Use `/rota "[rotation-name]" who` to *reports the name* of the person who is on duty for a rotation.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':information_source: Use `/rota "[rotation-name]" about` to *display the description of a rotation*, including the list of of the current active staff list.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": '-------------------------------'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':speech_balloon: *If you need help, post a message to any channel I\'ve been added to and mention* `@rota "[rotation-name]" [your message]`. The person on duty for the rotation will be notified and follow up at their earliest convenience.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": '-------------------------------'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':male-office-worker::female-office-worker: *Maintaining Rotation*'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':sparkles: `@rota new "[rotation-name]" [rotation description]` *creates a new rotation*. rotation-name can contain _only_ lowercase letters, numbers, and hyphens.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':x: `@rota delete "[rotation-name]"` *wipes any record of a rotation\'s existence* from my memory. _Use with caution!_'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':writing_hand: `@rota "[rotation-name]" description [new description]` *updates the description* for a rotation.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':busts_in_silhouette: `@rota "[rotation-name]" staff add [@user1 @user2 @user3]` *add a staff list* for a rotation. It expects a space-separated list of user mentions. _(Duplicates will be removed)_'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':busts_in_silhouette: `@rota "[rotation-name]" staff remove [@user1 @user2 @user3]` *remove a staff* list for a rotation. It expects a space-separated list of user mentions.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':ghost: `@rota "[rotation-name]" reset staff` *removes all users* from a rotation staff list. _Use with caution!_'
    }
  },
];

module.exports = commandsBlocks;