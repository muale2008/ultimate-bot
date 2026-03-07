module.exports = async (sock, from, args, msg, isOwner, startTime) => {
    try {
        const totalSeconds = Math.floor((Date.now() - startTime) / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

        await sock.sendMessage(from, { text: `⏳ Bot Uptime: ${formattedTime}` });
    } catch (err) {
        console.error("Uptime command error:", err);
        await sock.sendMessage(from, { text: "❌ Failed to retrieve uptime." });
    }
};