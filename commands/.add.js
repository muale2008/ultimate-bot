module.exports = async (sock, from, args, msg, isOwner) => {
    try {

        console.log("Executing .add command");

        // 1️⃣ Check if group
        if (!from.endsWith("@g.us")) {
            return await sock.sendMessage(from, { text: "❌ This command works in groups only." });
        }

        // 2️⃣ Check number
        if (!args[0]) {
            return await sock.sendMessage(from, { text: "❌ Please provide a number.\nExample: .add 233XXXXXXXXX" });
        }

        // 3️⃣ Clean number
        let number = args[0].replace(/[^0-9]/g, "");

        if (number.length < 8) {
            return await sock.sendMessage(from, { text: "❌ Invalid phone number." });
        }

        const user = number + "@s.whatsapp.net";

        // 4️⃣ Try to add
        await sock.groupParticipantsUpdate(from, [user], "add");

        // 5️⃣ Success message
        await sock.sendMessage(from, {
            text: `✅ Successfully added:\n${number}`
        });

        console.log("User added:", number);

    } catch (err) {

        console.log("Add command error:", err);

        await sock.sendMessage(from, {
            text: "❌ Failed to add user.\nMake sure:\n• Bot is admin\n• Number exists on WhatsApp"
        });

    }
};