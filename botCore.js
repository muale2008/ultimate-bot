// botCore.js

const userManagement = require('./userManagement');
const commandRegistry = require('./commandRegistry');
const feedbackSystem = require('./feedbackSystem');

const BotCore = () => {
    this.init = () => {
        userManagement.init();
        commandRegistry.init();
        feedbackSystem.init();
    };

    this.handleCommand = (command, user) => {
        const authenticatedUser = userManagement.authenticate(user);
        if (authenticatedUser) {
            const response = commandRegistry.executeCommand(command);
            feedbackSystem.recordFeedback(user, response);
            return response;
        }
        return 'User authentication failed.';
    };
};

module.exports = new BotCore();