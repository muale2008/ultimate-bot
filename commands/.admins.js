module.exports = async (sock, from, args, msg) => {
    try {

        console.log("Executing .admins command");

        // 1️⃣ Ensure command is used in group
        if (!from.endsWith("@g.us")) {
            return await sock.sendMessage(from, {
                text: "❌ This command works in groups only."
            });
        }

        // 2️⃣ Get group metadata
        const metadata = await sock.groupMetadata(from);

        // 3️⃣ Filter admins
        const admins = metadata.participants
            .filter(p => p.admin)
            .map(p => p.id.replace("@s.whatsapp.net", ""));

        if (admins.length === 0) {
            return await sock.sendMessage(from, {
                text: "❌ No admins found."
            });
        }

        // 4️⃣ Format admin list
        let adminList = "👑 *Group Admins:*\n\n";

        admins.forEach((admin, i) => {
            adminList += `${i + 1}. ${admin}\n`;
        });

        // 5️⃣ Send message
        await sock.sendMessage(from, {
            text: adminList
        });

        console.log("Admins list sent");

    } catch (err) {

        console.log("Admins command error:", err);

        await sock.sendMessage(from, {
            text: "❌ Failed to fetch admins."
        });

    }
};