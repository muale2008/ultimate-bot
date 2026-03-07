module.exports = async (sock, from, args, msg, isOwner) => {
    try {
        if (!isOwner) {
            return await sock.sendMessage(from, { text: "❌ Restricted: Owner only" });
        }

        let user;

        // 1️⃣ If user mentioned someone
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // 2️⃣ If replying to someone's message
        else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            user = msg.message.extendedTextMessage.contextInfo.participant;
        }
        // 3️⃣ If number provided as argument
        else if (args[0]) {
            const number = args[0].replace(/[^0-9]/g, "");
            user = number + "@s.whatsapp.net";
        }

        // 4️⃣ If no user detected
        if (!user) {
            return await sock.sendMessage(from, {
                text: "❌ Please specify a user to unblock.\n\nExamples:\n.unblock 233XXXXXXXXX\n.unblock @user\n(Reply to someone's message with .unblock)",
                mentions: msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [],
            });
        }

        // 5️⃣ Unblock the user
        await sock.updateBlockStatus(user, "unblock");

        // 6️⃣ Success message
        await sock.sendMessage(from, {
            text: `✅ Successfully unblocked @${user.split("@")[0]}`,
            mentions: [user],
        });

        console.log("Unblocked:", user);
    } catch (err) {
        console.error("Unblock command error:", err);
        await sock.sendMessage(from, { text: "❌ Failed to unblock user." });
    }
};
