module.exports = async (sock, from, args, msg) => {
    try {
        let user;

        // 1️⃣ Check if a user is mentioned
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // 2️⃣ Check if it's a number argument
        else if (args[0]) {
            const number = args[0].replace(/[^0-9]/g, "");
            user = number + "@s.whatsapp.net";
        }
        // 3️⃣ Default to sender
        else {
            user = msg.key.participant || from;
        }

        // Fetch status
        const status = await sock.fetchStatus(user).catch(() => null);

        if (!status || !status.status) {
            return await sock.sendMessage(from, { text: `❌ No status found for @${user.split("@")[0]}`, mentions: [user] });
        }

        await sock.sendMessage(from, { text: `💬 Status of @${user.split("@")[0]}:\n\n${status.status}`, mentions: [user] });

    } catch (err) {
        console.error("Status command error:", err);
        await sock.sendMessage(from, { text: "❌ Error fetching status." });
    }
};
