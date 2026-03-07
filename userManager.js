// userManager.js

class UserManager {
    constructor() {
        this.users = [];
    }

    registerUser(username, password, permissions = []) {
        const user = { 
            id: this.users.length + 1,
            username,
            password, // In a real application, don't store plain passwords!
            permissions,
            registrationDate: new Date().toUTCString(),
            lastLogin: null,
            analytics: {
                loginCount: 0,
                activityLog: []
            }
        };
        this.users.push(user);
        return user;
    }

    loginUser(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            user.lastLogin = new Date().toUTCString();
            user.analytics.loginCount++;
            this.trackActivity(username, 'User logged in');
            return user;
        }
        return null;
    }

    trackActivity(username, activity) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.analytics.activityLog.push({
                activity,
                date: new Date().toUTCString()
            });
        }
    }

    grantPermissions(username, newPermissions) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.permissions = [...new Set([...user.permissions, ...newPermissions])];
        }
    }

    revokePermissions(username, permissionsToRevoke) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.permissions = user.permissions.filter(p => !permissionsToRevoke.includes(p));
        }
    }

    getUserAnalytics(username) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            return user.analytics;
        }
        return null;
    }
}

// Usage example
const userManager = new UserManager();

// Registering users
userManager.registerUser('john_doe', 'securepassword', ['user']);
userManager.registerUser('admin_user', 'adminpassword', ['admin']);

// User login
const loggedInUser = userManager.loginUser('john_doe', 'securepassword');
console.log(loggedInUser);

// Granting permissions
userManager.grantPermissions('john_doe', ['admin']);

// Getting user analytics
const analytics = userManager.getUserAnalytics('john_doe');
console.log(analytics);
