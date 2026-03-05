const fs = require("fs");
const path = require("path");

// 1️⃣ Load all commands from commands/ folder
const commands = {};
fs.readdirSync(path.join(__dirname, "commands")).forEach(file => {
    if (file.endsWith(".js")) {
        const cmdName = "." + path.basename(file, ".js"); // command like ".getpp"
        commands[cmdName] = require(`./commands/${file}`);
    }
});

module.exports = (sock, startTime, msgParam, fromParam, bodyParam, commandParam, argsParam, isOwnerParam) => {
    const ownerNumber = "233206777968@s.whatsapp.net";

    const msg = msgParam || null;
    const from = fromParam || msg?.key.remoteJid;
    const body = bodyParam || (
        msg?.message?.conversation ||
        msg?.message?.extendedTextMessage?.text ||
        msg?.message?.imageMessage?.caption ||
        msg?.message?.videoMessage?.caption ||
        ""
    );
    const command = commandParam || body.split(" ")[0].toLowerCase();
    const args = argsParam || body.split(" ").slice(1);
    const isOwner = isOwnerParam ?? (() => {
        if (from === ownerNumber) return true;
        if (msg?.key.participant && msg.key.participant === ownerNumber) return true;
        return false;
    })();

    // 2️⃣ Redirect command dynamically
    if (commands[command]) {
        try {
            // Call the particular command module
            // Pass sock, from, args, msg, isOwner, startTime (for uptime)
            commands[command](sock, from, args, msg, isOwner, startTime);
        } catch (err) {
            console.error(`Error executing ${command}:`, err);
            sock.sendMessage(from, { text: `❌ Error executing ${command}` });
        }
    } else {
        // Optional: unknown command feedback
        // sock.sendMessage(from, { text: "❌ Unknown command." });
    }
};