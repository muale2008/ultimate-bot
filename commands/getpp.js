module.exports = async (sock, from, args, msg) => {

    try {

        console.log("Executing .getpp command");

        let user;

        /* 1️⃣ Mention */

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {

            user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

        }

        /* 2️⃣ Reply */

        else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

            user = msg.message.extendedTextMessage.contextInfo.participant;

        }

        /* 3️⃣ Number */

        else if (args[0]) {

            const number = args[0].replace(/[^0-9]/g, "");

            if (!number) {

                return await sock.sendMessage(from, {
                    text: "❌ Invalid number.\nExample: .getpp 233XXXXXXXXX"
                }, { quoted: msg });

            }

            user = number + "@s.whatsapp.net";

        }

        /* 4️⃣ Default = sender */

        else {

            user = msg.key.participant || msg.key.remoteJid;

        }

        /* 5️⃣ Get profile picture */

        const url = await sock.profilePictureUrl(user, "image").catch(() => null);

        if (!url) {

            return await sock.sendMessage(from, {
                text: "❌ This user has no profile picture."
            }, { quoted: msg });

        }

        /* 6️⃣ Send picture */

        await sock.sendMessage(from, {

            image: { url: url },

            caption: `📸 Profile Picture\n\n👤 User: @${user.split("@")[0]}`,

            mentions: [user]

        }, { quoted: msg });

        console.log("Profile picture sent:", user);

    } catch (err) {

        console.log("getpp error:", err);

        await sock.sendMessage(from, {

            text: "❌ Failed to fetch profile picture."

        }, { quoted: msg });

    }

};