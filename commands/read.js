module.exports = async (sock, from, args, msg) => {
    try {
        if (!msg || !msg.key) {
            return await sock.sendMessage(from, { text: "❌ No message to mark as read." });
        }

        const participant = msg.key.participant || from;
        const messageId = [msg.key.id];

        await sock.sendReadReceipt(from, participant, messageId);

        console.log(`Marked message as read in chat ${from}`);
    } catch (err) {
        console.error("Read command error:", err);
        await sock.sendMessage(from, { text: "❌ Error marking message as read." });
    }
};
