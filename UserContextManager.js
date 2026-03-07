class UserContextManager {
    constructor() {
        this.userContexts = {};
    }

    load(userId) {
        return this.userContexts[userId] || {};
    }

    save(userId, context) {
        this.userContexts[userId] = context;
    }

    set(userId, key, value) {
        if (!this.userContexts[userId]) {
            this.userContexts[userId] = {};
        }
        this.userContexts[userId][key] = value;
    }

    get(userId, key) {
        if (this.userContexts[userId]) {
            return this.userContexts[userId][key];
        }
        return undefined;
    }

    update(userId, key, value) {
        if (this.userContexts[userId]) {
            this.userContexts[userId][key] = value;
        }
    }

    addHistory(userId, historyItem) {
        if (!this.userContexts[userId]) {
            this.userContexts[userId] = { history: [] };
        }
        this.userContexts[userId].history.push(historyItem);
    }

    delete(userId) {
        delete this.userContexts[userId];
    }
}

export default UserContextManager;