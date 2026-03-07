module.exports = async (sock, from, args, msg, isOwner) => {
    try {
        if (!sock || !from) return console.log("Restart command: invalid context");

        if (!isOwner) {
            return await sock.sendMessage(from, { text: "❌ Restricted: Owner only" });
        }

        await sock.sendMessage(from, { text: "🔄 Restarting bot..." });

        console.log("Owner triggered bot restart. Exiting process...");

        // Delay a bit so the message gets sent before exit
        setTimeout(() => process.exit(0), 1000);
    } catch (err) {
        console.error("Restart command error:", err);
        if (sock && from) {
            await sock.sendMessage(from, { text: "❌ Failed to restart bot." });
        }
    }
};
