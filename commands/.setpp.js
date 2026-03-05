module.exports = async (sock, from, args, msg, isOwner) => {
    if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner only." });
    const media = msg.message.imageMessage;
    if (!media) return sock.sendMessage(from, { text: "❌ Reply with an image." });
    const buffer = media.message?.imageMessage?.imageData;
    await sock.updateProfilePicture(sock.user.id, buffer);
    await sock.sendMessage(from, { text: "✅ Bot profile picture updated." });
};