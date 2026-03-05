module.exports = async (sock, from, args, msg) => {
    try {
        await sock.sendReadReceipt(from, msg.key.participant || from, [msg.key.id]);
    } catch { await sock.sendMessage(from, { text: "❌ Error marking as read." }); }
};