const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const pino = require("pino");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let sock;
let startTime = Date.now();

// Keep Railway alive
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const WA_VERSION = [2, 2320, 10];

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState("./sessions");

        sock = makeWASocket({
            version: WA_VERSION,
            logger: pino({ level: "silent" }),
            auth: state,
            printQRInTerminal: false
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
            if (qr) {
                const qrDataURL = await QRCode.toDataURL(qr);
                io.emit("qr", qrDataURL);
                console.log("QR code generated — open / to scan!");
            }

            if (connection === "open") console.log("✅ Bot connected");

            if (connection === "close") {
                const shouldReconnect =
                    (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
                console.log("Connection closed");

                if (shouldReconnect) {
                    console.log("Reconnecting...");
                    startBot();
                } else {
                    console.log("Logged out. Delete sessions folder to start again.");
                }
            }
        });

        // Listen to messages
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

            console.log("Command:", command, "From:", from);

            try {
                require("./bot")(sock, startTime, msg, from, body, command, args, isOwner);
            } catch (err) {
                console.error("Command error:", err);
            }
        });
    } catch (err) {
        console.error("Fatal bot error:", err);
        setTimeout(startBot, 5000);
    }
}

startBot();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));