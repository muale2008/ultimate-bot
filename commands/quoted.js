module.exports = async (sock, from, args, msg) => {
    try {
        // ✅ Ensure the user replied to a message
        const context = msg?.message?.extendedTextMessage?.contextInfo;
        if (!context?.quotedMessage) {
            return await sock.sendMessage(from, {
                text: "❌ Please reply to a message first to get its content."
            }, { quoted: msg });
        }

        const quoted = context.quotedMessage;

        // ✅ Convert to readable JSON
        const quotedText = JSON.stringify(quoted, null, 2);

        // ✅ Send JSON back to user
        await sock.sendMessage(from, {
            text: `📄 Quoted Message Content:\n\n${quotedText}`
        }, { quoted: msg });

        console.log("Quoted message retrieved:", quotedText);

    } catch (err) {
        console.error("Quoted command error:", err);
        await sock.sendMessage(from, {
            text: "❌ Failed to get quoted message."
        }, { quoted: msg });
    }
};