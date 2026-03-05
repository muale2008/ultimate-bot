module.exports = async (sock, from, args) => {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Type a message to quote." });
    await sock.sendMessage(from, { text: `"${args.join(" ")}"` });
};