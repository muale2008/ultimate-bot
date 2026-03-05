module.exports = async (sock, from, args, msg, isOwner) => {
    if (!isOwner) return sock.sendMessage(from, { text: "❌ Restricted: Owner only" });
    await sock.sendMessage(from, { text: "🔄 Restarting..." });
    process.exit(0);
};