// multiUserManager.js

class MultiUserManager {
    constructor() {
        this.users = {};
        this.sessions = {};
        this.activityLogs = {};
    }

    addUser(userId, permissions) {
        if (!this.users[userId]) {
            this.users[userId] = { permissions, activity: [] };
        } else {
            console.log('User already exists.');
        }
    }

    startSession(userId) {
        if (this.users[userId]) {
            this.sessions[userId] = new Date();
            this.logActivity(userId, 'Session started');
        } else {
            console.log('User not found.');
        }
    }

    endSession(userId) {
        if (this.sessions[userId]) {
            delete this.sessions[userId];
            this.logActivity(userId, 'Session ended');
        } else {
            console.log('No active session found.');
        }
    }

    logActivity(userId, activity) {
        if (this.users[userId]) {
            if (!this.activityLogs[userId]) {
                this.activityLogs[userId] = [];
            }
            this.activityLogs[userId].push({ activity, timestamp: new Date().toISOString() });
            this.users[userId].activity.push({ activity, timestamp: new Date().toISOString() });
        } else {
            console.log('User not found.');
        }
    }

    getPermissions(userId) {
        return this.users[userId] ? this.users[userId].permissions : null;
    }

    getActivityLogs(userId) {
        return this.activityLogs[userId] || [];
    }
}

module.exports = MultiUserManager;