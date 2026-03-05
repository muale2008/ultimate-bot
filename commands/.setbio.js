module.exports = async (sock, from, args, msg, isOwner) => {
    if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner only." });
    if (!args.length) return sock.sendMessage(from, { text: "❌ Type a bio text." });
    await sock.updateProfileStatus(args.join(" "));
    await sock.sendMessage(from, { text: "✅ Bot bio updated." });
};