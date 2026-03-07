module.exports = async (sock, from, args, msg) => {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(from, { text: "❌ Type something to say." });
        }

        // If replying to a message, quote it
        const quoted = msg?.message ? { quoted: msg } : undefined;

        await sock.sendMessage(from, { text: args.join(" "), ...quoted });

    } catch (err) {
        console.error("Say command error:", err);
        await sock.sendMessage(from, { text: "❌ Error sending message." });
    }
};
