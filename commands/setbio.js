module.exports = async (sock, from, args, msg, isOwner) => {
    try {
        if (!isOwner) {
            return await sock.sendMessage(from, { text: "❌ Owner only command." });
        }

        if (!args || args.length === 0) {
            return await sock.sendMessage(from, { text: "❌ Please type a bio text to set." });
        }

        const bioText = args.join(" ");

        await sock.updateProfileStatus(bioText);

        await sock.sendMessage(from, { text: `✅ Bot bio updated to:\n"${bioText}"` });

    } catch (err) {
        console.error("Setbio command error:", err);
        await sock.sendMessage(from, { text: "❌ Failed to update bio." });
    }
};
