module.exports = async (sock, from, args) => {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Type something to say." });
    await sock.sendMessage(from, { text: args.join(" ") });
};