const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔═══════════════════╗
   *🤖 ${settings.botName || 'SaintsEvil-Bot'}*  
   Version: *${settings.version || '3.0.0'}*
   by ${settings.botOwner || 'Mr Unique Hacker'}
   YT : ${global.ytch}
╚═══════════════════╝

*Available Commands:*

╔═══════════════════╗
🌐 *General Commands*:
║ ➤ .help or .menu — Shows the full command menu
║ ➤ .ping — Checks bot response speed
║ ➤ .alive — Confirms the bot is running
║ ➤ .tts <text> — Converts text into voice
║ ➤ .owner — Shows bot owner contact
║ ➤ .joke — Sends a random joke
║ ➤ .quote — Sends a random inspirational quote
║ ➤ .fact — Shows a random fact
║ ➤ .weather <city> — Shows weather of a city
║ ➤ .news — Displays latest news headlines
║ ➤ .attp <text> — Converts text to animated sticker
║ ➤ .lyrics <song_title> — Gets lyrics of a song
║ ➤ .8ball <question> — Magic 8ball random answer
║ ➤ .groupinfo — Shows group details
║ ➤ .staff or .admins — Lists group admins
║ ➤ .vv — View once media bypass
║ ➤ .trt <text> <lang> — Translate text to another language
║ ➤ .ss <link> — Takes screenshot of a website
║ ➤ .jid — Shows user JID
║ ➤ .url — Shortens or processes URLs
╚═══════════════════╝ 

╔═══════════════════╗
👮‍♂️ *Admin Commands*:
║ ➤ .ban @user — Ban a user from using bot
║ ➤ .promote @user — Promote user to admin
║ ➤ .demote @user — Remove admin privileges
║ ➤ .mute <minutes> — Mute group temporarily
║ ➤ .unmute — Unmute the group
║ ➤ .delete or .del — Delete a bot message
║ ➤ .kick @user — Remove user from group
║ ➤ .warnings @user — Show user warnings
║ ➤ .warn @user — Give a warning to a user
║ ➤ .antilink — Enable/disable link protection
║ ➤ .antibadword — Block offensive words
║ ➤ .clear — Clear group chat messages
║ ➤ .tag <message> — Tag all users with a message
║ ➤ .tagall — Mention all members
║ ➤ .tagnotadmin — Mention only non-admin members
║ ➤ .hidetag <message> — Tag everyone secretly
║ ➤ .chatbot — Enable group chatbot
║ ➤ .resetlink — Reset group invite link
║ ➤ .antitag <on/off> — Prevent excessive tagging
║ ➤ .welcome <on/off> — Welcome new members
║ ➤ .goodbye <on/off> — Send goodbye message when someone leaves
║ ➤ .setgdesc <description> — Change group description
║ ➤ .setgname <new name> — Change group name
║ ➤ .setgpp (reply to image) — Set group profile picture
╚═══════════════════╝

╔═══════════════════╗
🔒 *Owner Commands*:
║ ➤ .mode <public/private> — Switch bot mode
║ ➤ .clearsession — Clear WhatsApp session
║ ➤ .antidelete — Show deleted messages
║ ➤ .cleartmp — Clear temporary files
║ ➤ .update — Update bot system
║ ➤ .settings — View bot settings
║ ➤ .setpp <reply to image> — Change bot profile picture
║ ➤ .autoreact <on/off> — Auto react to messages
║ ➤ .autostatus <on/off> — Auto view status updates
║ ➤ .autostatus react <on/off> — Auto react to status
║ ➤ .autotyping <on/off> — Show typing indicator automatically
║ ➤ .autoread <on/off> — Auto read messages
║ ➤ .anticall <on/off> — Block WhatsApp calls
║ ➤ .pmblocker <on/off/status> — Block private messages
║ ➤ .pmblocker setmsg <text> — Set PM blocker message
║ ➤ .setmention <reply to msg> — Set mention message
║ ➤ .mention <on/off> — Enable mention response
╚═══════════════════╝

╔═══════════════════╗
🎨 *Image/Sticker Commands*:
║ ➤ .blur <image> — Blur an image
║ ➤ .simage <reply to sticker> — Convert sticker to image
║ ➤ .sticker <reply to image> — Convert image to sticker
║ ➤ .removebg — Remove image background
║ ➤ .remini — Enhance image quality
║ ➤ .crop <reply to image> — Crop an image
║ ➤ .tgsticker <Link> — Download Telegram sticker pack
║ ➤ .meme — Generate random meme
║ ➤ .take <packname> — Rename sticker pack
║ ➤ .emojimix <emj1>+<emj2> — Combine emojis
║ ➤ .igs <insta link> — Download Instagram story
║ ➤ .igsc <insta link> — Download Instagram carousel
╚═══════════════════╝  

╔═══════════════════╗
🖼️ *Pies Commands*:
║ ➤ .pies <country> — Get random image from country category
║ ➤ .china — Random Chinese images
║ ➤ .indonesia — Random Indonesian images
║ ➤ .japan — Random Japanese images
║ ➤ .korea — Random Korean images
║ ➤ .hijab — Random hijab style images
╚═══════════════════╝

╔═══════════════════╗
🎮 *Game Commands*:
║ ➤ .tictactoe @user — Play Tic Tac Toe
║ ➤ .hangman — Start Hangman game
║ ➤ .guess <letter> — Guess letter in Hangman
║ ➤ .trivia — Start trivia quiz
║ ➤ .answer <answer> — Answer trivia question
║ ➤ .truth — Random truth question
║ ➤ .dare — Random dare challenge
╚═══════════════════╝

╔═══════════════════╗
🤖 *AI Commands*:
║ ➤ .gpt <question> — Ask ChatGPT
║ ➤ .gemini <question> — Ask Google Gemini AI
║ ➤ .imagine <prompt> — Generate AI image
║ ➤ .flux <prompt> — Create AI generated art
║ ➤ .sora <prompt> — Generate AI video or scene
╚═══════════════════╝

╔═══════════════════╗
🎯 *Fun Commands*:
║ ➤ .compliment @user — Send compliment
║ ➤ .insult @user — Send playful insult
║ ➤ .flirt — Random flirting message
║ ➤ .shayari — Romantic poetry
║ ➤ .goodnight — Send goodnight message
║ ➤ .roseday — Send rose day message
║ ➤ .character @user — Analyze user's character
║ ➤ .wasted @user — Generate wasted meme
║ ➤ .ship @user — Ship two users
║ ➤ .simp @user — Check simp level
║ ➤ .stupid @user [text] — Funny stupid meme
╚═══════════════════╝

╔═══════════════════╗
🔤 *Textmaker*:
║ ➤ .metallic <text> — Metallic text effect
║ ➤ .ice <text> — Ice text effect
║ ➤ .snow <text> — Snow text design
║ ➤ .impressive <text> — Impressive text logo
║ ➤ .matrix <text> — Matrix style text
║ ➤ .light <text> — Light glowing text
║ ➤ .neon <text> — Neon text effect
║ ➤ .devil <text> — Devil themed text
║ ➤ .purple <text> — Purple style text
║ ➤ .thunder <text> — Thunder effect text
║ ➤ .leaves <text> — Nature leaves text
║ ➤ .1917 <text> — 1917 movie style text
║ ➤ .arena <text> — Arena battle text
║ ➤ .hacker <text> — Hacker themed text
║ ➤ .sand <text> — Sand writing text
║ ➤ .blackpink <text> — Blackpink style logo
║ ➤ .glitch <text> — Glitch text effect
║ ➤ .fire <text> — Fire text effect
╚═══════════════════╝

╔═══════════════════╗
📥 *Downloader*:
║ ➤ .play <song_name> — Download music from YouTube
║ ➤ .song <song_name> — Get audio song
║ ➤ .spotify <query> — Search Spotify song
║ ➤ .instagram <link> — Download Instagram video
║ ➤ .facebook <link> — Download Facebook video
║ ➤ .tiktok <link> — Download TikTok video
║ ➤ .video <song name> — Download YouTube video
║ ➤ .ytmp4 <Link> — Download YouTube video MP4
╚═══════════════════╝

╔═══════════════════╗
🧩 *MISC*:
║ ➤ .heart — Heart overlay effect
║ ➤ .horny — Funny horny meme
║ ➤ .circle — Circle profile effect
║ ➤ .lgbt — LGBT flag overlay
║ ➤ .lolice — Fake police meme
║ ➤ .its-so-stupid — Funny meme template
║ ➤ .namecard — Create name card image
║ ➤ .oogway — Master Oogway quote meme
║ ➤ .tweet — Fake tweet generator
║ ➤ .ytcomment — Fake YouTube comment
║ ➤ .comrade — Communist style meme
║ ➤ .gay — Rainbow overlay meme
║ ➤ .glass — Glass breaking effect
║ ➤ .jail — Jail meme frame
║ ➤ .passed — Passed away meme
║ ➤ .triggered — Triggered meme GIF
╚═══════════════════╝

╔═══════════════════╗
🖼️ *ANIME*:
║ ➤ .nom — Anime eating reaction
║ ➤ .poke — Anime poke reaction
║ ➤ .cry — Anime crying GIF
║ ➤ .kiss — Anime kiss reaction
║ ➤ .pat — Anime head pat
║ ➤ .hug — Anime hug GIF
║ ➤ .wink — Anime wink reaction
║ ➤ .facepalm — Anime facepalm reaction
╚═══════════════════╝

╔═══════════════════╗
💻 *Github Commands:*
║ ➤ .git — Show GitHub link
║ ➤ .github — Open GitHub repository
║ ➤ .sc — Show script source code
║ ➤ .script — Display bot script info
║ ➤ .repo — Show repository details
╚═══════════════════╝
Join our channel for updates:`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'KnightBot MD',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'KnightBot MD by Mr Unique Hacker',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
