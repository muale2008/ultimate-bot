const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async (sock, from, args, msg) => {
    try {
        // ✅ Get the quoted message
        const quoted = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) {
            return await sock.sendMessage(from, {
                text: "❌ Please reply to a view-once image or video."
            });
        }

        // ✅ Determine type and prepare download
        let type, buffer;
        if (quoted.imageMessage?.viewOnce) {
            type = "image";
            buffer = await downloadMediaMessage({ message: { imageMessage: quoted.imageMessage }, type: "buffer" });
        } else if (quoted.videoMessage?.viewOnce) {
            type = "video";
            buffer = await downloadMediaMessage({ message: { videoMessage: quoted.videoMessage }, type: "buffer" });
        } else {
            return await sock.sendMessage(from, {
                text: "❌ That message is not a view-once image or video."
            });
        }

        // ✅ Send media back as normal
        if (type === "image") {
            await sock.sendMessage(from, { image: buffer, caption: "📸 View-once → Normal Image" });
        } else if (type === "video") {
            await sock.sendMessage(from, { video: buffer, caption: "🎥 View-once → Normal Video" });
        }

        console.log(`View-once media converted: ${type} | From: ${from}`);
    } catch (err) {
        console.error("View-once command error:", err);
        await sock.sendMessage(from, { text: "❌ Failed to convert view-once media." });
    }
};
