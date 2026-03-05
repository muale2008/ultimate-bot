module.exports = async (sock, from, args, msg, isOwner) => {
    if (!isOwner) return sock.sendMessage(from, { text: "❌ Restricted: Owner only" });
    const user = args[0]?.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!user) return sock.sendMessage(from, { text: "❌ Provide number to unblock." });
    await sock.updateBlockStatus(user, "unblock");
    await sock.sendMessage(from, { text: `✅ ${user} unblocked.` });
};