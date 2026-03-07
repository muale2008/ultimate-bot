const fs = require("fs");
const { writeFile } = require("fs/promises");
const { Webp } = require("node-webpmux");

module.exports = async (sock, from, args, msg) => {
    try {
        // 1️⃣ Ensure the command is used on a sticker
        const sticker = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage || msg.message?.stickerMessage;
        if (!sticker) {
            return await sock.sendMessage(from, { text: "❌ Reply to a sticker or send a sticker to convert to image." });
        }

        // 2️⃣ Download the sticker
        const buffer = await sock.downloadMediaMessage({ message: { stickerMessage: sticker } }, "buffer");

        // 3️⃣ Convert WebP sticker to PNG
        const webpFile = "./temp.webp";
        const pngFile = "./temp.png";

        await writeFile(webpFile, buffer);

        const webpmux = new Webp();
        await webpmux.load(webpFile);
        const pngBuffer = await webpmux.toBuffer("png");

        await writeFile(pngFile, pngBuffer);

        // 4️⃣ Send the converted PNG
        await sock.sendMessage(from, { image: { url: pngFile }, caption: "🖼 Sticker converted to image!" });

        // 5️⃣ Clean up temporary files
        fs.unlinkSync(webpFile);
        fs.unlinkSync(pngFile);

    } catch (err) {
        console.error("ToImg command error:", err);
        await sock.sendMessage(from, { text: "❌ Failed to convert sticker to image." });
    }
};