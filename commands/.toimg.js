module.exports = async (sock, from, args, msg) => {
    await sock.sendMessage(from, { text: "❌ ToImg command requires additional implementation with image decoding library." });
};