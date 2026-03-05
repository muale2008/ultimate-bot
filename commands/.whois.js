module.exports = async (sock, from, args, msg) => {
    try {
        const user = args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : msg?.key.participant || from;
        const contact = sock.store.contacts[user] || { notify: "Unknown", jid: user };
        await sock.sendMessage(from, { text: `🧑 Name: ${contact.notify}\nJID: ${contact.jid}` });
    } catch {
        await sock.sendMessage(from, { text: "❌ Error fetching user info" });
    }
};