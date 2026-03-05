module.exports = async (sock, from, args, msg) => {
    try {
        // Check if the message is a reply to a view-once message
        const quoted = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) return sock.sendMessage(from, { text: "❌ Reply to a view-once image or video first." });

        // Extract view-once image or video
        let type, buffer;
        if (quoted.imageMessage?.viewOnce) {
            type = "image";
            buffer = await sock.downloadMediaMessage({ message: { imageMessage: quoted.imageMessage }, type: "buffer" });
        } else if (quoted.videoMessage?.viewOnce) {
            type = "video";
            buffer = await sock.downloadMediaMessage({ message: { videoMessage: quoted.videoMessage }, type: "buffer" });
        } else {
            return sock.sendMessage(from, { text: "❌ That message is not a view-once image or video." });
        }

        // Send media back normally
        if (type === "image") {
            await sock.sendMessage(from, { image: buffer, caption: "📸 View-once → Normal Image" });
        } else if (type === "video") {
            await sock.sendMessage(from, { video: buffer, caption: "🎥 View-once → Normal Video" });
        }
    } catch (err) {
        console.error(err);
        await sock.sendMessage(from, { text: "❌ Error converting view-once media." });
    }
};