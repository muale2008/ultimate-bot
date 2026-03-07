'use strict';

const commandRegistry = {
    commands: [],
    addCommand: function(command) {
        this.commands.push(command);
    },
    getCommand: function(commandName) {
        return this.commands.find(cmd => cmd.name === commandName);
    },
    listCommands: function() {
        return this.commands;
    },
    rateCommand: function(commandName, rating) {
        const command = this.getCommand(commandName);
        if (command) {
            command.ratings.push(rating);
        }
    },
    addFeedback: function(commandName, feedback) {
        const command = this.getCommand(commandName);
        if (command) {
            command.feedback.push(feedback);
        }
    }
};

module.exports = commandRegistry;