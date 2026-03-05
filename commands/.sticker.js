const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
const fs = require("fs");
module.exports = async (sock, from, args, msg) => {
    try {
        const media = msg.message.imageMessage || msg.message.videoMessage;
        if (!media) return sock.sendMessage(from, { text: "❌ Reply to an image or video." });
        const buffer = media.message?.imageMessage?.imageData || media.message?.videoMessage?.videoData;
        if (!buffer) return sock.sendMessage(from, { text: "❌ Cannot process media." });
        await sock.sendMessage(from, { sticker: buffer });
    } catch { await sock.sendMessage(from, { text: "❌ Error creating sticker." }); }
};