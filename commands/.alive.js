module.exports = async (sock, from) => {
    await sock.sendMessage(from, { text: "✅ Bot is alive!" });
};