module.exports = async (sock, from, args, msg) => {
    try {
        if (!msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage)
            return sock.sendMessage(from, { text: "❌ Reply to a message first." });
        const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        await sock.sendMessage(from, { text: JSON.stringify(quoted, null, 2) });
    } catch { await sock.sendMessage(from, { text: "❌ Error getting quoted message." }); }
};