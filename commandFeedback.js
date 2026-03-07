const commandFeedback = {
    usage: {},
    feedback: {},

    recordUsage(command) {
        if (!this.usage[command]) {
            this.usage[command] = 0;
        }
        this.usage[command]++;
    },

    collectFeedback(command, userFeedback) {
        if (!this.feedback[command]) {
            this.feedback[command] = [];
        }
        this.feedback[command].push(userFeedback);
    },

    rateCommand(command) {
        if (!this.feedback[command]) return 0;
        const totalFeedback = this.feedback[command].length;
        const positiveFeedback = this.feedback[command].filter(f => f === 'positive').length;
        return (positiveFeedback / totalFeedback) * 100;
    },

    generateReport() {
        const report = {};
        for (let command in this.usage) {
            report[command] = {
                usageCount: this.usage[command],
                rating: this.rateCommand(command),
            };
        }
        return report;
    }
};

module.exports = commandFeedback;