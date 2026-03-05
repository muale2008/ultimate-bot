module.exports = async (sock, from, args, msg) => {

    try {

        if (!from.endsWith("@g.us")) {
            return sock.sendMessage(from, { text: "❌ This command only works in groups." });
        }

        const metadata = await sock.groupMetadata(from);
        const sender = msg.key.participant;

        const groupAdmins = metadata.participants
            .filter(p => p.admin)
            .map(p => p.id);

        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";

        // Check if sender is admin
        if (!groupAdmins.includes(sender)) {
            return sock.sendMessage(from, { text: "❌ Only group admins can use this command." });
        }

        // Check if bot is admin
        if (!groupAdmins.includes(botNumber)) {
            return sock.sendMessage(from, { text: "❌ Bot must be admin to kick members." });
        }

        // Get mentioned user
        let user;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            user = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        }

        if (!user) {
            return sock.sendMessage(from, { text: "❌ Mention a user or provide a number to kick." });
        }

        await sock.groupParticipantsUpdate(from, [user], "remove");

        await sock.sendMessage(from, {
            text: `👢 User removed from group.\n\n📌 User: ${user}`
        });

    } catch (err) {

        console.log("kick error:", err);

        await sock.sendMessage(from, {
            text: "❌ Failed to kick user."
        });

    }

};