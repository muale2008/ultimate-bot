module.exports = async (sock, from, args, msg) => {

    try {

        console.log("Executing .jid command");

        const isGroup = from.endsWith("@g.us");
        const sender = msg.key.participant || msg.key.remoteJid;

        let target;

        /* 1️⃣ Mention detection */

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {

            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

        }

        /* 2️⃣ Reply detection */

        else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

            target = msg.message.extendedTextMessage.contextInfo.participant;

        }

        /* 3️⃣ Number detection */

        else if (args[0]) {

            const number = args[0].replace(/[^0-9]/g, "");

            if (!number) {

                return await sock.sendMessage(from, {
                    text: "❌ Invalid number.\nExample: .jid 233XXXXXXXXX"
                }, { quoted: msg });

            }

            target = number + "@s.whatsapp.net";

        }

        /* 4️⃣ Default: sender */

        else {

            target = sender;

        }

        let text = "🆔 *JID Information*\n\n";

        text += `📌 Chat JID:\n${from}\n\n`;
        text += `👤 Sender JID:\n${sender}\n\n`;
        text += `🎯 Target JID:\n${target}\n\n`;

        /* Group extra info */

        if (isGroup) {

            const metadata = await sock.groupMetadata(from);

            text += `👥 Group Name:\n${metadata.subject}\n`;
            text += `👥 Members:\n${metadata.participants.length}\n`;

        }

        await sock.sendMessage(from, {

            text,
            mentions: [target]

        }, { quoted: msg });

        console.log("JID info sent");

    } catch (err) {

        console.log("jid error:", err);

        await sock.sendMessage(from, {

            text: "❌ Failed to retrieve JID information."

        }, { quoted: msg });

    }

};
