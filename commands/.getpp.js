module.exports = async (sock, from, args, msg) => {

    try {

        let user;

        // If user mentioned someone
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        // If number provided
        else if (args[0]) {
            const number = args[0].replace(/[^0-9]/g, "");
            user = number + "@s.whatsapp.net";
        }

        // Default: sender
        else {
            user = msg.key.participant || msg.key.remoteJid;
        }

        const url = await sock.profilePictureUrl(user, "image").catch(() => null);

        if (!url) {
            return await sock.sendMessage(from, {
                text: "❌ No profile picture found."
            });
        }

        await sock.sendMessage(from, {
            image: { url: url },
            caption: `📸 Profile picture`
        });

    } catch (err) {

        console.log("getpp error:", err);

        await sock.sendMessage(from, {
            text: "❌ Error fetching profile picture."
        });

    }

};