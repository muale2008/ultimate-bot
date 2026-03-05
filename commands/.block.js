module.exports = async (sock, msg, args, isOwner) => {

    const from = msg.key.remoteJid;

    try {

        if (!isOwner) {
            return await sock.sendMessage(from, {
                text: "❌ Owner only command."
            });
        }

        if (!args[0]) {
            return await sock.sendMessage(from, {
                text: "❌ Provide a number to block.\nExample: .block 233XXXXXXXXX"
            });
        }

        const number = args[0].replace(/[^0-9]/g, "");

        const user = number + "@s.whatsapp.net";

        await sock.updateBlockStatus(user, "block");

        await sock.sendMessage(from, {
            text: `✅ Successfully blocked ${number}`
        });

    } catch (err) {

        console.log("Block command error:", err);

        await sock.sendMessage(from, {
            text: "❌ Failed to block user."
        });

    }

};