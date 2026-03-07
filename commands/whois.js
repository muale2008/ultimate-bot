module.exports = async (sock, from, args, msg) => {
    try {
        // ✅ Determine target user
        let user;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            user = msg.message.extendedTextMessage.contextInfo.participant;
        } else if (args[0]) {
            user = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        } else {
            user = msg.key.participant || from;
        }

        // ✅ Fetch contact from store
        const contact = sock.store.contacts[user] || { notify: "Unknown", jid: user };

        // ✅ Send contact info
        await sock.sendMessage(from, {
            text: `🧑 Name: ${contact.notify}\n📌 JID: ${contact.jid}`
        });

        console.log(`User info sent: ${user} | From: ${from}`);
    } catch (err) {
        console.error("Vcard command error:", err);
        await sock.sendMessage(from, { text: "❌ Error fetching user info." });
    }
};