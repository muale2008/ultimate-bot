module.exports = async (sock, from, args, msg, isOwner) => {

    try {

        console.log("Executing .block command");

        if (!isOwner) {
            return await sock.sendMessage(from, {
                text: "❌ This is an *owner only* command."
            }, { quoted: msg });
        }

        let user;

        /* 1️⃣ Detect mentioned user */

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        /* 2️⃣ Detect replied user */

        else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            user = msg.message.extendedTextMessage.contextInfo.participant;
        }

        /* 3️⃣ Detect number argument */

        else if (args[0]) {
            const number = args[0].replace(/[^0-9]/g, "");
            user = number + "@s.whatsapp.net";
        }

        /* 4️⃣ If no user found */

        if (!user) {
            return await sock.sendMessage(from, {
                text:
`❌ Please specify a user to block.

Examples:
.block 233XXXXXXXXX
.block @user
(Reply to someone's message with .block)`
            }, { quoted: msg });
        }

        /* 5️⃣ Block user */

        await sock.updateBlockStatus(user, "block");

        /* 6️⃣ Success message */

        await sock.sendMessage(from, {
            text: `🚫 Successfully blocked @${user.split("@")[0]}`,
            mentions: [user]
        }, { quoted: msg });

        console.log("Blocked:", user);

    } catch (err) {

        console.log("Block command error:", err);

        await sock.sendMessage(from, {
            text: "❌ Failed to block user."
        }, { quoted: msg });

    }

};