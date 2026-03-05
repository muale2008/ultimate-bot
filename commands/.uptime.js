module.exports = async (sock, from, args, msg, isOwner, startTime) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    await sock.sendMessage(from, { text: `⏳ Uptime: ${uptime} seconds` });
};