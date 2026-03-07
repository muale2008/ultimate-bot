const axios = require('axios');

// 🔹 Hardcoded OpenAI API Key (for local testing ONLY)
// Do NOT push this to GitHub or public repos!
const OPENAI_API_KEY = "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";

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

        let responseText;

        if (['.gpt', '.gemini', '.flux', '.sora'].includes(command)) {
            // Chat completion
            const resp = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: query }],
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            responseText = resp.data.choices[0].message.content;

        } else if (command === '.imagine') {
            // Image generation
            const resp = await axios.post(
                'https://api.openai.com/v1/images/generations',
                {
                    prompt: query,
                    n: 1,
                    size: "1024x1024"
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            responseText = resp.data.data[0].url; // send the image URL

        } else {
            return await sock.sendMessage(chatId, {
                text: "❌ Unknown AI command. Use .gpt, .gemini, .imagine, .flux, or .sora"
            }, { quoted: message });
        }

        // Send the final response
        await sock.sendMessage(chatId, { text: responseText }, { quoted: message });

    } catch (err) {
        console.error('AI Command Error:', err);
        await sock.sendMessage(chatId, {
            text: "❌ Failed to get a response. Please try again later.",
            quoted: message
        });
    }
}

module.exports = aiCommand;
