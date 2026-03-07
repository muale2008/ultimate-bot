module.exports = async (sock, from, args, msg) => {

    try {

        console.log("Executing .admins command");

        const sender =
            msg.key.participant ||
            msg.key.remoteJid;

        /* 1️⃣ Ensure command is used in group */

        if (!from.endsWith("@g.us")) {
            return await sock.sendMessage(from, {
                text: "❌ This command works in groups only."
            }, { quoted: msg });
        }

        /* 2️⃣ Get group metadata */

        const metadata = await sock.groupMetadata(from);

        const groupName = metadata.subject;

        /* 3️⃣ Filter admins */

        const admins = metadata.participants.filter(p => p.admin);

        if (admins.length === 0) {
            return await sock.sendMessage(from, {
                text: "❌ No admins found in this group."
            }, { quoted: msg });
        }

        /* 4️⃣ Format admin list */

        let text = `👑 *${groupName} Admins*\n\n`;

        const mentions = [];

        admins.forEach((admin, i) => {

            const number = admin.id.split("@")[0];

            text += `${i + 1}. @${number}\n`;

            mentions.push(admin.id);

        });

        text += `\n📊 Total Admins: ${admins.length}`;
        text += `\n\n⚡ Requested by: @${sender.split("@")[0]}`;

        mentions.push(sender);

        /* 5️⃣ Send message */

        await sock.sendMessage(from, {
            text: text,
            mentions: mentions
        }, { quoted: msg });

        console.log("Admins list sent");

    } catch (err) {

        console.log("Admins command error:", err);

        await sock.sendMessage(from, {
            text: "❌ Failed to fetch admin list."
        }, { quoted: msg });

    }

};