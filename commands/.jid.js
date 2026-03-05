module.exports = async (sock, from, args, msg) => {

    try {

        const isGroup = from.endsWith("@g.us");
        const sender = msg.key.participant || msg.key.remoteJid;

        let text = "🆔 *JID Information*\n\n";

        // Chat JID
        text += `📌 Chat JID:\n${from}\n\n`;

        // Sender JID
        text += `👤 Sender JID:\n${sender}\n\n`;

        // If group show extra info
        if (isGroup) {
            const metadata = await sock.groupMetadata(from);
            text += `👥 Group Name:\n${metadata.subject}\n`;
        }

        await sock.sendMessage(from, { text });

    } catch (err) {

        console.log("jid error:", err);

        await sock.sendMessage(from, {
            text: "❌ Error retrieving JID information."
        });

    }

};