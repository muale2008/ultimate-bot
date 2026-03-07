const axios = require('axios');
const fetch = require('node-fetch');

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a query after the command.\n\nExample: .gpt write a basic HTML code"
            }, { quoted: message });
        }

        const parts = text.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: `Please provide a question after ${command}`
            }, { quoted: message });
        }

        // Show processing reaction
        await sock.sendMessage(chatId, {
            react: { text: '🤖', key: message.key }
        });

        // Define APIs for each command
        const commandAPIs = {
            '.gpt': [
                `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`
            ],
            '.gemini': [
                `https://vapis.my.id/api/gemini?q=${encodeURIComponent(query)}`,
                `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`,
                `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}`,
                `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`,
                `https://api.giftedtech.my.id/api/ai/geminiai?apikey=${process.env.GIFTED_API_KEY}&q=${encodeURIComponent(query)}`,
                `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=${process.env.GIFTED_API_KEY}&q=${encodeURIComponent(query)}`
            ],
            '.imagine': [
                `https://api.imaginaryai.com/generate?prompt=${encodeURIComponent(query)}` // replace with real endpoint
            ],
            '.flux': [
                `https://api.fluxai.com/ask?query=${encodeURIComponent(query)}` // replace with real endpoint
            ],
            '.sora': [
                `https://api.soraai.com/query?text=${encodeURIComponent(query)}` // replace with real endpoint
            ]
        };

        const apis = commandAPIs[command];

        if (!apis) {
            return await sock.sendMessage(chatId, {
                text: "❌ Unknown AI command. Use .gpt, .gemini, .imagine, .flux, or .sora"
            }, { quoted: message });
        }

        let success = false;

        for (const api of apis) {
            try {
                const response = await fetch(api);
                const data = await response.json();

                // Normalize answer
                const answer = data.message || data.data || data.answer || data.result;

                if (answer) {
                    await sock.sendMessage(chatId, {
                        text: typeof answer === 'string' ? answer : JSON.stringify(answer, null, 2)
                    }, { quoted: message });

                    success = true;
                    break;
                }
            } catch (err) {
                console.warn(`API failed: ${api}`, err.message);
                continue;
            }
        }

        if (!success) {
            await sock.sendMessage(chatId, {
                text: "❌ Failed to get a response from all APIs. Please try again later.",
                quoted: message
            });
        }

    } catch (err) {
        console.error('AI Command Error:', err);
        await sock.sendMessage(chatId, {
            text: "❌ An unexpected error occurred. Please try again later.",
            quoted: message
        });
    }
}

module.exports = aiCommand;