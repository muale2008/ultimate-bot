module.exports = async (sock, from, args, msg) => {
    try {
        if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ This command only works in groups." });
        const metadata = await sock.groupMetadata(from);
        const participants = metadata.participants.map(p => p.id);
        const text = args.join(" ") || "👋 Hello everyone!";
        await sock.sendMessage(from, { text, mentions: participants });
    } catch { await sock.sendMessage(from, { text: "❌ Error tagging all." }); }
};