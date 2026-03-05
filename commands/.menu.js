module.exports = async (sock, from) => {
    await sock.sendMessage(from, { text: `
🔥 ULTIMATE BOT MENU 🔥

📸 Profile & Info
.getpp
.whois
.jid
.status

👁️ Media & Message Tools
.vv
.quoted
.read

🧑‍🤝‍🧑 Group Management
.tagall
.admins
.promote
.demote
.kick
.add

⚙️ Bot System
.ping
.alive
.menu
.uptime
.restart (owner only)

🤖 Fun / Utility
.sticker
.toimg
.say
.quote

🔐 Owner Only
.block
.unblock
.setpp
.setbio
`});
};