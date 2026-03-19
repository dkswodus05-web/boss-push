const https = require('https');
const crypto = require('crypto');

// ===== FIREBASE CONFIG =====
const FB_URL = "https://boss-bd053-default-rtdb.asia-southeast1.firebasedatabase.app";
const PROJECT_ID = "boss-bd053";
const SERVICE_ACCOUNT = {
  client_email: "firebase-adminsdk-fbsvc@boss-bd053.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4uZF6OXotwZPd\n7M7bMKtj9sjFzi2W3kzSoU8v1Bbvs4XOAlYjQgZPSQrdTEQlhEJCMutxGxJMfrtn\no4KA5p2jgE+i4Vzs/MzCVxY0RktlNpgZPmqMyz9D6ghmxbL4Z8MV4rIKXC1ZLF3I\nANuJPLU+zpemV1FCPq61KDCLXCzr4tQc2K3YDt1b0mhU7VcHsF8Pn9y/8vmGhIVF\nqj1NXLaHwV1+Lt/fIKniGTl8sDZGw5TgJQOIMopFkWot5WOsurhF+JNDuTrR/BhH\nFLNAO8VBNqXkdEwQLtY3qwPNsyKPDku9PpQVIbqEqMFESzPhaXCf4NRfPX0v7LuW\n2MuwD5ofAgMBAAECggEAB5EOXPfSweIOiQYkuQTG2Hro4XVfF7F2ayBRao+g+uOb\nJQOifKI9OO0whT0VA4Zl4mlMjJ8Dwl9klMu1UktgBK0CVhUuJcT7LDC+B5kjiHtS\ngqI0Yh0HM+R3wKHzgUpayuA008jP0LnJA6LJW1dBw1daDeXAvdpsdJ43UtYNPwJD\nQgArfJZAHJmqjGEzP+VaDb+b2Hoaa4zjfTWMFM8g3bL2AGN2ou+XdSp8qBP1LbxO\nL3PyyA8mjeSVi8e54pkBgopDklUerGwXJnIvkK/2PrEFHIp5mjEuAe8avb1OpRfY\n+eSyHR/PNfDUONqtGAOn0PB16bglz8seX4City2VoQKBgQDjFEKsuaria23Lu+MW\nIxmx19oPNxZOtDXM65QKMLnLswaERBhQ2gzgp5pbod2AhixSi4oZPgsgAxfzwu33\npE5oSY2Yu0QuLP48cLthB+2vYI0uo7kSO9Lc4UpdtINAjCF1HK0LuxxSTPGTmQki\nE/Pq8x4yZ4ykdOokUTWR2V5dYQKBgQDQQGE4+fy7TIi9Zeb1Beh0X1Ufle52T1h9\nsd09nYvSrFASRJTQ4IgjXnPST0wU58lIviiNsTMJ2CHgzrCBH/C2csi1h3w/qMfs\nqk6juBZ+54zscoCQf3XAG/UcdTT+6mryyKbkob2pqPRWd3A61n6lOw/j5LU69ZG2\nuuJ6XnWnfwKBgH77TW2ZRd3nhTZwksRGTJAOzHnFrEvGqm81LUulg8BNFE/SZGaS\nCLF4B/FFyr+cSBzAuzDyaPY1xKcjUj8xOkdHGk9WKQJJVsIlqCLSdC+mJkz2cP+p\nRHkP4q4Ty3HE6tC6gGoW7/d134FSCrFrxvKTkUdOcG9mkahNYU915jcBAoGAKNkn\n+NwYNcj6XWQ6nD8vbHwyn0JyhuRjcCxOQELB5W4FOsAXDK2uJnnlcBA71THt6oXa\nQIjMgRbS9ly0hG92cOMs+WZ8+aOqq4JwcG6wgu36V3rSOwW1XBxfxNg8r+/dUIgJ\nLHmJUVkhrEA7VF80ckaWhFYdMlZu4Y/g0q3qmBMCgYAW9zyi3BKWcUYQ87jRqUU/\n+pZvKwQ83fclaa8xZCsMmOheoQifcRWt97lxAvLid6ncvD+HEAmcDcxqekkedgf3\n8vEZfs2uOVMw6SmI6lwY9pOmAQWdspwxYXkMhhDKyCtlmN4cP/JA6VWF0oZAIEKX\nhFYCHaU5spz6rKEOsUUpzA==\n-----END PRIVATE KEY-----\n"
};

const CHECK_INTERVAL = 30000; // 30s
const ALERT_BEFORE = 300; // 5 min

// ===== MONSTER DATA (same IDs as frontend) =====
let _id = 0;
function mid() { return "m" + (_id++); }
const D = [
  {map:"우디위디/워디 숲",m:[{id:mid(),n:"불도저",t:"mini",s:900},{id:mid(),n:"불도저형님",t:"boss",s:900}]},
  {map:"버섯늪지",m:[{id:mid(),n:"검투사거미",t:"mini",s:290},{id:mid(),n:"대왕버섯돌이",t:"boss",s:1100}]},
  {map:"머쉬룸스포어",m:[{id:mid(),n:"백금박쥐",t:"mini",s:300},{id:mid(),n:"독왕버섯돌이",t:"boss",s:2880}]},
  {map:"윙프릴섬의 해변",m:[{id:mid(),n:"안졸려도자라",t:"mini",s:19980},{id:mid(),n:"졸리면자라",t:"boss",s:214200}]},
  {map:"해적선",m:[{id:mid(),n:"청소부깔끄미",t:"mini",s:300},{id:mid(),n:"갑판장블랑카",t:"boss",s:1500}]},
  {map:"빛이 들지않는 신전",m:[{id:mid(),n:"블랙주노",t:"mini",s:1980},{id:mid(),n:"블랙스카이",t:"mini",s:1980},{id:mid(),n:"와당카더엘더",t:"boss",s:9600}]},
  {map:"등대던전 1F",m:[{id:mid(),n:"회색회골",t:"mini",s:900},{id:mid(),n:"매드가",t:"mini",s:3000},{id:mid(),n:"은둔자",t:"boss",s:40980},{id:mid(),n:"블랙스컬",t:"boss",s:3410}]},
  {map:"등대던전 2F",m:[{id:mid(),n:"졸린쿠이",t:"mini",s:1200},{id:mid(),n:"잠깬쿠이",t:"boss",s:3820},{id:mid(),n:"화이트스컬",t:"mini",s:54000}]},
  {map:"등대던전 3F",m:[{id:mid(),n:"이히히",t:"boss",s:3920},{id:mid(),n:"우헤헤",t:"boss",s:4000},{id:mid(),n:"우히힉",t:"boss",s:4100},{id:mid(),n:"스네이크자드",t:"mini",s:30780}]},
  {map:"등대던전 4F",m:[{id:mid(),n:"딩딩",t:"mini",s:290},{id:mid(),n:"동동",t:"mini",s:290},{id:mid(),n:"단단",t:"mini",s:290},{id:mid(),n:"가디언임프",t:"boss",s:3920}]},
  {map:"등대던전 5F",m:[{id:mid(),n:"전투미이라",t:"mini",s:290},{id:mid(),n:"데블랑",t:"boss",s:19980}]},
  {map:"해지는 노을 숲",m:[{id:mid(),n:"불여우",t:"mini",s:1200},{id:mid(),n:"칠미호",t:"mini",s:1200},{id:mid(),n:"노을에지는꽃",t:"mini",s:1200},{id:mid(),n:"칠칠칠미호",t:"boss",s:1800}]},
  {map:"라노스 평원",m:[{id:mid(),n:"블래스터",t:"mini",s:1200},{id:mid(),n:"레이븐",t:"mini",s:1200},{id:mid(),n:"혈고",t:"mini",s:1200},{id:mid(),n:"백마귀",t:"boss",s:1200}]},
  {map:"폐허가 있는 숲",m:[{id:mid(),n:"폭주고슴이",t:"mini",s:1200},{id:mid(),n:"스파이디",t:"mini",s:1200},{id:mid(),n:"와일드보어",t:"mini",s:1200},{id:mid(),n:"귀모사",t:"boss",s:1800}]},
  {map:"카타르 산맥",m:[{id:mid(),n:"불타는돌",t:"mini",s:1200},{id:mid(),n:"삐닉죠",t:"mini",s:1200},{id:mid(),n:"용암도적반장",t:"mini",s:1200},{id:mid(),n:"용암도적두목",t:"boss",s:1800}]},
  {map:"오염된 숲",m:[{id:mid(),n:"쩌어억",t:"mini",s:1680},{id:mid(),n:"독부리꽃",t:"mini",s:1680},{id:mid(),n:"감연된여왕벌",t:"mini",s:1680},{id:mid(),n:"타락한숲지킴이",t:"boss",s:3500}]},
  {map:"죽음의 늪",m:[{id:mid(),n:"개구르르",t:"mini",s:1200},{id:mid(),n:"늪지꽃괴수",t:"mini",s:1720},{id:mid(),n:"썪은푸딩",t:"mini",s:1720},{id:mid(),n:"우크파나",t:"boss",s:172800}]},
  {map:"숲의 미궁",m:[{id:mid(),n:"헬하운드",t:"mini",s:1200},{id:mid(),n:"데스스토커",t:"mini",s:1200},{id:mid(),n:"암흑골렘",t:"mini",s:1200},{id:mid(),n:"마녀딜린",t:"boss",s:259200}]},
  {map:"고대의 누각",m:[{id:mid(),n:"은박쥐",t:"mini",s:3500},{id:mid(),n:"검은폭풍",t:"mini",s:3500},{id:mid(),n:"꼭두각시",t:"boss",s:10200}]},
  {map:"하늘성채 동부",m:[{id:mid(),n:"탱크",t:"mini",s:3500},{id:mid(),n:"화염선회",t:"mini",s:3500},{id:mid(),n:"소용돌이",t:"mini",s:3500},{id:mid(),n:"회오리",t:"mini",s:3500},{id:mid(),n:"정령여왕",t:"boss",s:9600}]},
  {map:"하늘성채 서부",m:[{id:mid(),n:"고블린용사",t:"mini",s:3500},{id:mid(),n:"맹신자",t:"mini",s:3500},{id:mid(),n:"노움",t:"mini",s:3500},{id:mid(),n:"폭군",t:"boss",s:9600}]},
  {map:"돌무더기 요새",m:[{id:mid(),n:"괴조",t:"mini",s:3500},{id:mid(),n:"조각상",t:"mini",s:3500}]},
  {map:"알수없는 미로",m:[{id:mid(),n:"지뢰",t:"mini",s:3500},{id:mid(),n:"티타늄골렘",t:"mini",s:3500},{id:mid(),n:"스팀펑크",t:"boss",s:9600}]},
  {map:"타락한 신전",m:[{id:mid(),n:"어둠의공포",t:"mini",s:3500},{id:mid(),n:"감독관",t:"mini",s:3500},{id:mid(),n:"수문장",t:"mini",s:3500},{id:mid(),n:"칼리고",t:"boss",s:604800}]},
  {map:"건조한 초원",m:[{id:mid(),n:"비지지",t:"mini",s:1200},{id:mid(),n:"부즈즈",t:"mini",s:1200},{id:mid(),n:"스텔스",t:"mini",s:1200},{id:mid(),n:"사막의암살자",t:"mini",s:1200},{id:mid(),n:"브스스즈스",t:"boss",s:1800}]},
  {map:"모래무덤 골짜기",m:[{id:mid(),n:"모래무덤",t:"mini",s:1200},{id:mid(),n:"엘더비홀더",t:"mini",s:1200},{id:mid(),n:"스스슥",t:"mini",s:1200},{id:mid(),n:"스으윽",t:"mini",s:1200},{id:mid(),n:"샤아악",t:"boss",s:1800}]},
  {map:"뜨거운 모래사막",m:[{id:mid(),n:"마음의소리",t:"mini",s:1200},{id:mid(),n:"약간미치광이",t:"mini",s:1200},{id:mid(),n:"빅마우스",t:"mini",s:1200},{id:mid(),n:"빅마마",t:"boss",s:172800}]},
  {map:"이슬롯의 실험실",m:[{id:mid(),n:"스누위",t:"mini",s:1800},{id:mid(),n:"우르푸스",t:"mini",s:1800},{id:mid(),n:"돌연변이 샤쿤",t:"mini",s:2100}]},
  {map:"이슬롯의 신전",m:[{id:mid(),n:"우르투스",t:"mini",s:2100},{id:mid(),n:"샤쿠투스",t:"mini",s:1800},{id:mid(),n:"샤쿠루스",t:"mini",s:1800},{id:mid(),n:"돌연변이 슈룬",t:"mini",s:1800},{id:mid(),n:"바슬라프",t:"boss",s:172800}]},
  {map:"모르포시즈 뿌리",m:[{id:mid(),n:"아르케",t:"mini",s:3585},{id:mid(),n:"모티",t:"mini",s:3585},{id:mid(),n:"머쉬룸불도저",t:"mini",s:3585},{id:mid(),n:"플라워불도저",t:"mini",s:3585},{id:mid(),n:"악타이몬",t:"boss",s:21600},{id:mid(),n:"아이요의수호병",t:"boss",s:259200}]},
  {map:"모르포시즈 정원",m:[{id:mid(),n:"글루코스",t:"mini",s:1800},{id:mid(),n:"오버로드",t:"mini",s:1800},{id:mid(),n:"소울리치",t:"boss",s:87300},{id:mid(),n:"플라타니스타",t:"boss",s:604800}]},
  {map:"모르포시즈 금서고",m:[{id:mid(),n:"정당화된 신념",t:"mini",s:1800},{id:mid(),n:"라줄리",t:"mini",s:1800},{id:mid(),n:"부크샤",t:"boss",s:0,ft:["11:00","23:00"]},{id:mid(),n:"셸",t:"boss",s:0,ft:["11:00","23:00"]},{id:mid(),n:"태초의 지식",t:"boss",s:0,ft:["11:00","23:00"]}]},
  {map:"비탄의 제단",m:[{id:mid(),n:"아파파",t:"mini",s:900},{id:mid(),n:"페이쓰",t:"boss",s:21300},{id:mid(),n:"일루스트",t:"boss",s:259200}]},
  {map:"루나프",m:[{id:mid(),n:"빅풋",t:"mini",s:1790},{id:mid(),n:"빌리어드",t:"mini",s:28500},{id:mid(),n:"세피아",t:"boss",s:259200}]},
];

// Build monster lookup
const allMons = {};
D.forEach(d => d.m.forEach(m => { allMons[m.id] = { ...m, map: d.map }; }));

const alertsSent = {};

// ===== FCM V1 AUTH =====
let accessToken = null;
let tokenExpiry = 0;

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry - 60000) return accessToken;
  
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64url(Buffer.from(JSON.stringify({
    iss: SERVICE_ACCOUNT.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  })));
  
  const signInput = header + "." + payload;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = base64url(sign.sign(SERVICE_ACCOUNT.private_key));
  const jwt = signInput + "." + signature;
  
  return new Promise((resolve, reject) => {
    const postData = "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + jwt;
    const req = https.request({
      hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          accessToken = j.access_token;
          tokenExpiry = Date.now() + (j.expires_in || 3600) * 1000;
          resolve(accessToken);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ===== FCM V1 SEND =====
async function sendPush(token, title, body) {
  const at = await getAccessToken();
  const payload = JSON.stringify({
    message: {
      token: token,
      data: { title, body, icon: "/icon-192x192.png" },
      android: { priority: "high" },
      webpush: { headers: { Urgency: "high" } }
    }
  });
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'fcm.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/messages:send`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + at, 'Content-Length': Buffer.byteLength(payload) }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          console.log(`  !! FCM HTTP ${res.statusCode}: ${data.substring(0, 200)}`);
        }
        resolve({ status: res.statusCode, body: data });
      });
    });
    req.on('error', e => { console.log("  !! FCM request error:", e.message); reject(e); });
    req.write(payload);
    req.end();
  });
}

// ===== TIMER CALC =====
function calc(mon, base, now) {
  if (mon.ft) {
    const y = now.getFullYear(), mo = now.getMonth(), da = now.getDate();
    let best = null;
    for (let o = 0; o < 2; o++)
      for (const t of mon.ft) {
        const [hh, mm] = t.split(":").map(Number);
        const c = new Date(y, mo, da + o, hh, mm, 0);
        if (c > now && (!best || c < best)) best = c;
      }
    return best ? Math.max(0, Math.floor((best - now) / 1000)) : null;
  }
  if (!base || mon.s <= 0) return null;
  const b = new Date(base), el = (now - b) / 1000;
  const nc = Math.floor(el / mon.s) + 1;
  const nx = new Date(b.getTime() + nc * mon.s * 1000);
  return Math.max(0, Math.floor((nx - now) / 1000));
}

// ===== FIREBASE FETCH =====
function fbFetch(path) {
  return new Promise((resolve, reject) => {
    https.get(FB_URL + "/" + path + ".json", res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { resolve(null); } });
    }).on('error', reject);
  });
}

// ===== MAIN CHECK LOOP =====
async function checkAndAlert() {
  try {
    const data = await fbFetch("");
    if (!data) return;
    
    const settings = data.settings || {};
    const kills = data.kills || {};
    const subscribers = data.fcm_tokens || {};
    
    const now = new Date();
    // Settings are in KST (UTC+9), but server runs in UTC
    // Create mEnd in KST then convert: subtract 9 hours to get UTC timestamp
    const KST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in ms
    const mEndKST = new Date(now.getFullYear(), (settings.mo || now.getMonth() + 1) - 1, settings.da || now.getDate(), settings.hr || 6, settings.mn || 0, 0, 0);
    const mEnd = mEndKST.getTime() - KST_OFFSET;
    
    // For each monster, check if alert needed
    for (const monId of Object.keys(allMons)) {
      const mon = allMons[monId];
      const base = kills[monId] != null ? kills[monId] : mEnd;
      const rm = calc(mon, base, now);
      if (rm === null) continue;
      
      // Send alerts at 5min, 3min, 1min before spawn
      const spawnMinute = Math.floor((now.getTime() + rm * 1000) / 60000);
      const ALERT_TIMES = [330, 210, 90]; // 5분30초, 3분30초, 1분30초
      const ALERT_LABELS = [5, 3, 1]; // 표시는 5분, 3분, 1분
      
      for (let ai = 0; ai < ALERT_TIMES.length; ai++) {
        const alertAt = ALERT_TIMES[ai];
        const alertMin = ALERT_LABELS[ai];
        const alertKey = monId + "_" + spawnMinute + "_" + alertAt;
        if (rm <= alertAt && rm > alertAt - 30 && !alertsSent[alertKey]) {
          alertsSent[alertKey] = true;
          const title = `${mon.map} — ${mon.n}`;
          const body = `${mon.n} ${alertMin}분 후 출현!`;
          
          console.log(`[ALERT] ${title}`);
          
          // Send to each subscriber who watches this monster
          for (const subKey of Object.keys(subscribers)) {
            const sub = subscribers[subKey];
            if (!sub || !sub.token) continue;
            
            // Check watchList - only send if monster is in user's watchList
            const watchList = sub.watchList;
            if (!watchList || !watchList[monId]) continue;
            
            try {
              await sendPush(sub.token, title, body);
              console.log(`  → Sent to ${subKey.substring(0, 8)}...`);
            } catch (e) {
              console.log(`  → Error: ${e.message}`);
            }
          }
        }
      } // end ALERT_TIMES loop
    }
    
    // Clean old alert keys
    const keys = Object.keys(alertsSent);
    if (keys.length > 2000) keys.slice(0, 1000).forEach(k => delete alertsSent[k]);
    
  } catch (e) {
    console.log("Check error:", e.message);
  }
}

// ===== START =====
console.log("🔔 Boss timer push server started (FCM V1)");
console.log(`Monitoring ${Object.keys(allMons).length} monsters every ${CHECK_INTERVAL/1000}s`);
setInterval(checkAndAlert, CHECK_INTERVAL);
checkAndAlert();

// Health check server for Render.com
const http = require('http');
http.createServer(async (req, res) => {
  if (req.url === '/status') {
    try {
      const data = await fbFetch("fcm_tokens");
      if (!data) { res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'}); res.end("등록된 사용자 없음"); return; }
      const keys = Object.keys(data);
      let out = `👑 킹덤길드 보스 타이머 - 알림 현황\n`;
      out += `총 ${keys.length}명 등록\n\n`;
      for (let i = 0; i < keys.length; i++) {
        const sub = data[keys[i]];
        const wl = sub.watchList;
        const monNames = [];
        if (wl) {
          for (const mid of Object.keys(wl)) {
            if (allMons[mid]) monNames.push(allMons[mid].n + " (" + allMons[mid].map + ")");
            else monNames.push(mid);
          }
        }
        out += `#${i+1} ${keys[i].substring(0,8)}...\n`;
        out += `   알림: ${monNames.length > 0 ? monNames.join(", ") : "설정 안 함"}\n\n`;
      }
      res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
      res.end(out);
    } catch(e) { res.writeHead(500); res.end("Error: "+e.message); }
    return;
  }
  if (req.url === '/test') {
    // Manually send a test push to all registered tokens
    try {
      const data = await fbFetch("fcm_tokens");
      if (!data) { res.writeHead(200); res.end("No tokens"); return; }
      let results = [];
      for (const key of Object.keys(data)) {
        const sub = data[key];
        if (!sub || !sub.token) continue;
        try {
          const r = await sendPush(sub.token, "👑 테스트 알림!", "보스 타이머 알림이 정상 작동합니다!");
          results.push(key.substring(0, 8) + ": " + (r.status || "?") + " " + (r.body || "").substring(0, 100));
        } catch (e) {
          results.push(key.substring(0, 8) + ": ERROR " + e.message);
        }
      }
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end("Test results:\n" + results.join("\n"));
    } catch (e) {
      res.writeHead(500); res.end("Error: " + e.message);
    }
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Boss push server running. Monitoring ${Object.keys(allMons).length} monsters. Token: ${accessToken ? 'OK' : 'pending'}`);
}).listen(process.env.PORT || 3000, () => {
  console.log("Health check server on port " + (process.env.PORT || 3000));
});
