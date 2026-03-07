module.exports = async (sock, from, args, msg, isOwner) => {

    try {

        const sender =
            msg.key.participant ||
            msg.key.remoteJid;

        const pushName = msg.pushName || "User";

        /* 1️⃣ Ensure command is used in a group */

        if (!from.endsWith("@g.us")) {
            return await sock.sendMessage(from, {
                text: "❌ This command can only be used in groups."
            }, { quoted: msg });
        }

        /* 2️⃣ Check if bot is admin */

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;

        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";

        const botAdmin = participants.find(
            p => p.id === botNumber && p.admin
        );

        if (!botAdmin) {
            return await sock.sendMessage(from, {
                text: "❌ I must be an admin to add members."
            }, { quoted: msg });
        }

        /* 3️⃣ Get target user */

        let target = null;

        // Mention
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        // Reply
        else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            target = msg.message.extendedTextMessage.contextInfo.participant;
        }

        // Number typed
        else if (args[0]) {

            let number = args[0].replace(/[^0-9]/g, "");

            if (number.length < 8) {
                return await sock.sendMessage(from, {
                    text: "❌ Invalid number.\nExample: `.add 233XXXXXXXXX`"
                }, { quoted: msg });
            }

            target = number + "@s.whatsapp.net";
        }

        if (!target) {
            return await sock.sendMessage(from, {
                text:
`❌ Please specify a user.

You can use:

• Reply to a user
• Mention a user
• Provide a number

Example:
.add 233XXXXXXXXX`
            }, { quoted: msg });
        }

        /* 4️⃣ Attempt to add user */

        const result = await sock.groupParticipantsUpdate(
            from,
            [target],
            "add"
        );

        /* 5️⃣ Success feedback */

        await sock.sendMessage(from, {
            text:
`✅ *User Added Successfully*

👤 Added: @${target.split("@")[0]}
⚡ Action by: @${sender.split("@")[0]}`,
            mentions: [target, sender]
        }, { quoted: msg });

        console.log("ADD SUCCESS:", target);

    } catch (err) {

        console.error("ADD COMMAND ERROR:", err);

        await sock.sendMessage(from, {
            text:
`❌ Failed to add user.

Possible reasons:
• User privacy settings
• User not on WhatsApp
• Bot not admin
• User already in group`
        }, { quoted: msg });

    }

};
