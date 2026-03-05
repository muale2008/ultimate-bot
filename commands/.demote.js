module.exports = async (sock, from, args, msg) => {

    try {

        if (!from.endsWith("@g.us")) {
            return await sock.sendMessage(from, {
                text: "❌ This command only works in groups."
            });
        }

        if (!args[0]) {
            return await sock.sendMessage(from, {
                text: "❌ Provide the number to demote.\nExample: .demote 233XXXXXXXXX"
            });
        }

        const number = args[0].replace(/[^0-9]/g, "");

        if (!number) {
            return await sock.sendMessage(from, {
                text: "❌ Invalid number."
            });
        }

        const user = number + "@s.whatsapp.net";

        await sock.groupParticipantsUpdate(from, [user], "demote");

        await sock.sendMessage(from, {
            text: `⬇️ Successfully demoted ${number}`
        });

    } catch (err) {

        console.log("Demote command error:", err);

        await sock.sendMessage(from, {
            text: "❌ Failed to demote member."
        });

    }

};