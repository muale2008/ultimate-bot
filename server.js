const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const pino = require("pino");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let sock;
let startTime = Date.now();

// Hardcode WhatsApp version to avoid fetch delay
const WA_VERSION = [2, 2320, 10]; // replace with latest Baileys version if needed

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState("./sessions");

        sock = makeWASocket({
            version: WA_VERSION,
            logger: pino({ level: "silent" }),
            auth: state,
        });

        sock.ev.on("creds.update", saveCreds);

        // Connection updates
        sock.ev.on("connection.update", async ({ connection, qr }) => {
            if (qr) {
                const qrImage = await QRCode.toDataURL(qr);
                io.emit("qr", qrImage);
                console.log("QR code generated. Scan it!");
            }
            if (connection === "open") console.log("Bot Connected");
        });

        // Message listener
        sock.ev.on("messages.upsert", async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const from = msg.key.remoteJid;
            const sender = msg.key.participant || from;

            const body =
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                msg.message?.imageMessage?.caption ||
                msg.message?.videoMessage?.caption ||
                "";

            if (!body.startsWith(".")) return;

            const command = body.split(" ")[0].toLowerCase();
            const args = body.split(" ").slice(1);

            const ownerNumber = "233206777968@s.whatsapp.net";
            const isOwner = sender === ownerNumber || from === ownerNumber;

            console.log("Message detected:", body, "From:", from, "Sender:", sender, "Command:", command);

            try {
                require("./bot")(sock, startTime, msg, from, body, command, args, isOwner);
            } catch (err) {
                console.error("Error executing command:", err);
            }
        });
    } catch (err) {
        console.error("Fatal error in startBot:", err);
        setTimeout(startBot, 5000);
    }
}

startBot();

// Use cloud-friendly port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});