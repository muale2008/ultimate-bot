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

/* Keep Railway service alive */
app.get("/", (req, res) => {
    res.send("Ultimate WhatsApp Bot Running 🚀");
});

/* Hardcoded WhatsApp version */
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

        sock.ev.on("connection.update", async (update) => {

            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                const qrImage = await QRCode.toDataURL(qr);
                io.emit("qr", qrImage);
                console.log("Scan this QR with WhatsApp");
            }

            if (connection === "open") {
                console.log("✅ Bot Connected Successfully");
            }

            if (connection === "close") {

                const shouldReconnect =
                    (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);

                console.log("Connection closed");

                if (shouldReconnect) {
                    console.log("Reconnecting...");
                    startBot();
                } else {
                    console.log("Logged out. Delete sessions folder.");
                }
            }

        });

        /* MESSAGE HANDLER */

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

                require("./bot")(
                    sock,
                    startTime,
                    msg,
                    from,
                    body,
                    command,
                    args,
                    isOwner
                );

            } catch (err) {

                console.error("Command Error:", err);

            }

        });

    } catch (err) {

        console.error("Fatal Bot Error:", err);

        setTimeout(() => {
            console.log("Restarting bot...");
            startBot();
        }, 5000);

    }
}

startBot();

/* Railway port */

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});