const axios = require('axios');
const PLACE_ID = "11329095118545";
const WEBHOOK_URL = "https://discord.com/api/webhooks/1556644256259768415/et3uqlEaFlVvTez4HwjXHZLozYcjP8DBXmyoHsMjeUu37Y51Gwul3YrA_sC-b343aWye";
const sentServers = new Set();

async function checkRobloxServers() {
    try {
        let cursor = "";
        do {
            const url = `https://games.roblox.com/v1/games/${PLACE_ID}/servers/Public?limit=100${cursor ? `&cursor=${cursor}` : ""}`;
            const response = await axios.get(url);
            const servers = response.data.data;

            for (const server of servers) {
                if (!sentServers.has(server.id)) {
                    sentServers.add(server.id);
                    await sendDiscordNotification(server.id, server.playing);
                }
            }
            cursor = response.data.nextPageCursor;
        } while (cursor);
    } catch (error) {
        console.error("Error checking servers:", error.message);
    }
}

async function sendDiscordNotification(jobId, playerCounts) {
    const joinUrl = `https://www.roblox.com/games/start?placeId=${PLACE_ID}&jobId=${jobId}`;
    const payload = {
        embeds: [{
            title: "✨ Anime Dice Event · ตรวจพบอีเวนต์จากระบบหลังบ้าน!",
            description: `⏳ สถานะ: ห้องนี้มีอีเวนต์โชค!\n👤 คนในห้อง: ${playerCounts}/9\n\n[🔗 คลิกที่นี่เพื่อเข้าห้องทันที](${joinUrl})`,
            color: 5763719
        }]
    };
    await axios.post(WEBHOOK_URL, payload);
}

setInterval(checkRobloxServers, 15000);
console.log("🤖 บอทหลังบ้านเริ่มทำงานสแกน 24 ชม...");
