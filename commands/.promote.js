module.exports = async (sock, from, args) => {
    try {
        if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." });
        const user = args[0]?.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        if (!user) return sock.sendMessage(from, { text: "❌ Mention user to promote." });
        await sock.groupParticipantsUpdate(from, [user], "promote");
        await sock.sendMessage(from, { text: `✅ ${user} promoted to admin.` });
    } catch { await sock.sendMessage(from, { text: "❌ Error promoting member." }); }
};