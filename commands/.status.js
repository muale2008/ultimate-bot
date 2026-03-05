module.exports = async (sock, from, args, msg) => {
    try {
        const user = args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : msg?.key.participant || from;
        const status = await sock.fetchStatus(user).catch(() => null);
        if (!status || !status.status) return sock.sendMessage(from, { text: "❌ No status found!" });
        await sock.sendMessage(from, { text: `💬 Status: ${status.status}` });
    } catch {
        await sock.sendMessage(from, { text: "❌ Error fetching status" });
    }
};