// ✅ Function to check if user is an admin
async function isAdmin(ctx) {
    const adminIds = [5212197608, 1685470205]; // Apni admin Telegram IDs daalo
    return adminIds.includes(ctx.from.id);
}

// ✅ Start Command (New User Notification to Admins)
bot.start(async (ctx) => {
    try {
        const userId = ctx.from.id;
        const firstName = ctx.from.first_name;
        const username = ctx.from.username ? @${ctx.from.username} : "N/A";

        // Check if user already exists in database
        const existingUser = await db.operation.findOne("users", { userId });

        // If user doesn't exist, insert into database and notify admins
        if (!existingUser) {
            await db.operation.insertOne("users", { userId, firstName, username });

            // Fetch total users count
            const totalUsers = await db.operation.findAll("users");

            // Send notification to admins
            const adminMessage = <b>👤 New User Joined!</b>\n\n
                + 🆔 User ID: <code>${userId}</code>\n
                + 👤 Name: <b>${firstName}</b>\n
                + 📛 Username: ${username}\n
                + 📊 Total Users: <b>${totalUsers.length}</b>;

            for (const adminId of [5212197608, 1685470205]) {
                await ctx.telegram.sendMessage(adminId, adminMessage, { parse_mode: "HTML" });
            }
        }

        // ✅ Send Start Message with Image
        const imageUrl = "https://envs.sh/EM8.jpg"; // Yahan apni image ka URL daalo
        const caption = <b>👋 ʜᴇʏ, ${firstName} ♡ !!\n\n<blockquote expandable>ɪ ᴀᴍ sɪᴍᴘʟᴇ ʙᴜᴛ ᴘᴏᴡᴇʀꜰᴜʟʟ \nᴀᴜᴛᴏ ʀᴇᴀᴄᴛɪᴏɴ ʙᴏᴛ ғᴏʀ ᴛᴇʟᴇɢʀᴀᴍ ᴄʜᴀɴɴᴇʟs!.
        \n
            + ᴊᴜsᴛ ᴀᴅᴅ ᴍᴇ ᴀs ᴀ ᴀᴅᴍɪɴ ɪɴ ʏᴏᴜʀ ᴄʜᴀɴɴᴇʟ ᴛʜᴇɴ sᴇᴇ ᴍʏ ᴘᴏᴡᴇʀ.</blockquote>\n\n
            + <blockquote>ᴍᴀɪɴᴛᴀɪɴᴇᴅ ʙʏ : <a href='https://t.me/anime_donghuo'> ayu Botz 🐍</a></blockquote></b>;

        const sentMessage = await ctx.telegram.sendPhoto(ctx.chat.id, imageUrl, {
            caption: caption,
            parse_mode: "HTML",
            disable_web_page_preview: "true",
            message_effect_id: "5104841245755180586",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "⇆ ᴀᴅᴅ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ᴄʜᴀɴɴᴇʟs ⇆", url: "https://t.me/Dream_maker1_bot?startchannel=true" }],
                    [{ text: "• ᴜᴘᴅᴀᴛᴇs •", url: "https://t.me/anime_donghuo" }, { text: " • sᴜᴘᴘᴏʀᴛ •", url: "https://t.me/ayu_bots" }]
                ]
            }
        });

        // ✅ React to Bot's Own Start Message
        await ctx.telegram.setMessageReaction(ctx.chat.id, sentMessage.message_id, [{ type: "emoji", emoji: "💘" }]);

    } catch (error) {
        console.error("Error sending start message:", error);
    }
});

// ✅ Auto Reaction System for Channel Posts
bot.on('channel_post', async (ctx) => {
    try {
        const messageId = ctx.channelPost.message_id;
        const emojis = ['👍', '🔥', '🥰', '❤', '👏', '😁', '🤔', '🤯', '😱', '🎉', '🤩', '🙏', '👌', '🕊', '🥱', '🥴', '😍', '🐳', '❤️‍🔥', '🌚', '💯', '🤣', '⚡', '🏆', '🍓', "🍾", "💋", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", '🎃', '🙈', '😇', '😨', '🤝', '🤗', '🫡', '🎅', '✍', '🎄', "💅", "🤪", "🗿", "☃", "🆒", "💘", "🙉", "🦄", "😘"];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        await ctx.telegram.setMessageReaction(ctx.chat.id, messageId, [{ type: 'emoji', emoji: randomEmoji }]);
    } catch (error) {
        console.error("Error setting reaction:", error);
    }
});

// ✅ Broadcast System (Only Admins)
bot.command("broadcast", async (ctx) => {
    if (!(await isAdmin(ctx))) {
        return ctx.reply("🚫 You are not authorized to use this command.");
    }
    await ctx.reply("📢 Send me the message you want to broadcast.");
    ctx.scene.enter("broadcast");
});

// ✅ Forward-Based Broadcast System (Only Admins) - /fcast
bot.command("fcast", async (ctx) => {
    if (!(await isAdmin(ctx))) {
        return ctx.reply("🚫 You are not authorized to use this command.");
    }
    await ctx.reply("📢 Forward me the message you want to broadcast.");
    ctx.scene.enter("fcast");
});

// ✅ Normal Broadcast Scene (Message will be sent, pinned & reacted)
const broadcastScene = answerHandler("broadcast");
broadcastScene.on("text", async (ctx) => {
    try {
        if (!(await isAdmin(ctx))) {
            return ctx.reply("🚫 You are not authorized to use this command.");
        }

        const message = ctx.message.text;
        const users = await db.operation.findAll("users");

        let count = 0;
        for (const user of users) {
            try {
                const sentMessage = await ctx.telegram.sendMessage(user.userId, message, { parse_mode: "HTML" });

                // ✅ Pin & React to Broadcast Message
                await ctx.telegram.pinChatMessage(user.userId, sentMessage.message_id, { disable_notification: false });
                await ctx.telegram.setMessageReaction(user.userId, sentMessage.message_id, [{ type: "emoji", emoji: "🔥" }]);
                
                count++;
            } catch (error) {
                console.error(Error sending to ${user.userId}:, error);
            }
        }

        ctx.reply(✅ Broadcast sent, pinned & reacted in ${count} users' chats.);
    } catch (error) {
        console.error("Broadcast error:", error);
        ctx.reply("❌ Failed to send broadcast.");
    } finally {
        ctx.scene.leave();
    }
});

// ✅ Forward-Based Broadcast Scene (Message will be forwarded, pinned & reacted)
const fcastScene = answerHandler("fcast");
fcastScene.on("message", async (ctx) => {
    try {
        if (!(await isAdmin(ctx))) {
            return ctx.reply("🚫 You are not authorized to use this command.");
        }

        const users = await db.operation.findAll("users");
        let count = 0;

        for (const user of users) {
            try {
                const sentMessage = await ctx.telegram.forwardMessage(user.userId, ctx.chat.id, ctx.message.message_id);

                // ✅ Pin & React to Forwarded Message
                await ctx.telegram.pinChatMessage(user.userId, sentMessage.message_id, { disable_notification: false });
                await ctx.telegram.setMessageReaction(user.userId, sentMessage.message_id, [{ type: "emoji", emoji: "🔥" }]);

                count++;
            } catch (error) {
                console.error(Error forwarding to ${user.userId}:, error);
            }
        }

        ctx.reply(✅ Forwarded message, pinned & reacted in ${count} users' chats.);
    } catch (error) {
        console.error("Forward Broadcast error:", error);
        ctx.reply("❌ Failed to forward message.");
    } finally {
        ctx.scene.leave();
    }
});
﻿
