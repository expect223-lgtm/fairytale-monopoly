/* ==========================================
   歡樂童話大富翁 - 遊戲邏輯與交互引擎
   ========================================== */

// ==================== Web Audio API 音效合成引擎 ====================
const SoundEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    // 擲骰子沙沙滾動聲
    playRoll() {
        this.init();
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 秒
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 3.0;

        // 隨機頻率掃描模擬撞擊滾動
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1500, this.ctx.currentTime + 0.1);
        filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.3);
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    },
    // 金幣叮噹聲
    playCoin() {
        this.init();
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1174.66, now); // D6
        osc2.frequency.setValueAtTime(1567.98, now + 0.08); // G6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
    },
    // 勝利大三和弦喇叭音效
    playCheer() {
        this.init();
        const now = this.ctx.currentTime;
        const notes = [
            [261.63, 329.63, 392.00], // C4, E4, G4
            [349.23, 440.00, 523.25], // F4, A4, C5
            [392.00, 493.88, 587.33], // G4, B4, D5
            [523.25, 659.25, 783.99]  // C5, E5, G5
        ];

        notes.forEach((chord, step) => {
            const time = now + step * 0.15;
            chord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, time);
                
                gain.gain.setValueAtTime(0.1, time);
                gain.gain.exponentialRampToValueAtTime(0.005, time + 0.25);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(time);
                osc.stop(time + 0.3);
            });
        });
    },
    // 懲罰/錯誤鋸齒波滑音
    playBuzzer() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.4);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
    },
    // 棋子行走踏步聲
    playMove() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    },
    // 卡片翻牌音效
    playFlip() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
    }
};

// ==================== Canvas 煙火粒子特效系統 ====================
const ConfettiEffect = {
    canvas: null,
    ctx: null,
    particles: [],
    active: false,
    init() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    },
    spawn(count = 100) {
        this.init();
        const colors = ['#FFD214', '#FF4343', '#1A8CFF', '#2CD63C', '#9F3BFF', '#FF69B4'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10 - Math.random() * 20,
                r: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: Math.random() * 4 - 2,
                dy: Math.random() * 5 + 3,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 4 - 2
            });
        }
        if (!this.active) {
            this.active = true;
            this.loop();
        }
    },
    loop() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        let alive = false;
        this.particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.rotation += p.rotationSpeed;
            
            if (p.y < this.canvas.height + 20) {
                alive = true;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
                this.ctx.restore();
            }
        });
        
        if (alive) {
            requestAnimationFrame(() => this.loop());
        } else {
            this.active = false;
            this.particles = [];
        }
    }
};

// ==================== 兒童趣味 30 張命運卡庫 ====================
const DestinyCards = [
    { id: 1, title: "拾金不昧", type: "cash", value: 500, emoji: "👛", desc: "在路上撿到錢包送交警察局，獲得好心市民獎勵金 500 元！" },
    { id: 2, title: "環保小尖兵", type: "item", value: "shield", emoji: "🛡️", desc: "主動做好垃圾分類與回收，保護地球，獲得『免過路費護盾』一個！" },
    { id: 3, title: "遲到處分", type: "cash", value: -200, emoji: "⏰", desc: "早上賴床錯過鬧鐘，上學遲到囉！被扣除零用錢 200 元以示警惕。" },
    { id: 4, title: "小小閱讀王", type: "cash", value: 300, emoji: "📚", desc: "這個月認真閱讀了 10 本童話故事書，獲得圖書館頒發獎勵金 300 元！" },
    { id: 5, title: "糖果屋派對", type: "distribute", value: -100, emoji: "🍬", desc: "買了超級好吃的彩虹糖分享給所有冒險家，支付每位玩家 100 元。" },
    { id: 6, title: "魔法風暴", type: "teleport", value: -1, emoji: "🌀", desc: "突然颳起一陣神奇的童話旋風，隨機將你傳送到地圖的任意位置！" },
    { id: 7, title: "長輩紅包", type: "cash", value: 500, emoji: "🧧", desc: "過年跟長輩拜年，說了超級貼心的吉祥話，獲得大紅包 500 元！" },
    { id: 8, title: "保護牙齒", type: "cash", value: 120, emoji: "🪥", desc: "每天認真用貝氏刷牙法刷牙，檢查牙齒完全沒有蛀牙！獲得健康獎金 120 元。" },
    { id: 9, title: "幫忙做家事", type: "cash", value: 100, emoji: "🧹", desc: "主動幫爸爸媽媽拖地與倒垃圾，領到乖巧勞動零用錢 100 元！" },
    { id: 10, title: "偏食小懲罰", type: "cash", value: -100, emoji: "🥦", desc: "吃晚餐時偷偷把青椒和花椰菜丟掉，被媽媽扣罰 100 元用來買健康水果。" },
    { id: 11, title: "好朋友分享", type: "item", value: "speed", emoji: "🚀", desc: "慷慨地把玩具借給鄰居小朋友玩，得到善意回饋：獲得『雙倍加速卡』一張！" },
    { id: 12, title: "跌倒受傷", type: "rest", value: 1, emoji: "🩹", desc: "走路一邊玩手機不看路，不小心摔倒擦傷！送去保健室包紮，暫停行動一回合。" },
    { id: 13, title: "熱心助人", type: "cash", value: 200, emoji: "🧭", desc: "在路上遇到老奶奶迷路，熱心帶她到公車站，獲得老奶奶感謝紅包 200 元！" },
    { id: 14, title: "上課講話", type: "cash", value: -100, emoji: "🗣️", desc: "上課時一直跟旁邊同學聊天，被老師罰站，並扣除日常表現點數折合 100 元。" },
    { id: 15, title: "路邊撿到寶", type: "item", value: "remote", emoji: "🎲", desc: "在魔法森林的草叢裡，幸運撿到一個神奇的『遙控骰子』！" },
    { id: 16, title: "垃圾分類小達人", type: "cash", value: 300, emoji: "♻️", desc: "配合班級大掃除認真分類塑膠與紙類，獲得學校環保榮譽獎金 300 元！" },
    { id: 17, title: "提早完成功課", type: "item", value: "shield", emoji: "📝", desc: "放學一回家立刻認真把作業寫完，得到自由時間並獲得『免過路費護盾』防身！" },
    { id: 18, title: "文具遺失", type: "cash", value: -120, emoji: "✏️", desc: "把自己的文具盒忘在公園長椅上弄丟了，花費 120 元重新購買文具。" },
    { id: 19, title: "童話神仙棒", type: "swap_prop", value: 0, emoji: "🪄", desc: "揮舞魔法神仙棒，你可以與目前擁有最高價值土地的對手交換一格土地！" },
    { id: 20, title: "發票幸運中獎", type: "cash", value: 200, emoji: "🎫", desc: "幫忙整理發票時，意外對中一張六獎發票，獲得幸運獎金 200 元！" },
    { id: 21, title: "惡魔搗蛋", type: "cash", value: -100, emoji: "😈", desc: "淘氣小惡魔趁你睡覺時偷走了你的錢包，損失 100 元！" },
    { id: 22, title: "迷失森林", type: "backstep", value: 5, emoji: "🌲", desc: "在濃霧森林中迷路了，緊張地往回走了 5 步！" },
    { id: 23, title: "拯救流浪幼犬", type: "cash", value: 150, emoji: "🐶", desc: "拯救受困在雨中的流浪狗，聯絡動保協會，獲得善行表揚金 150 元！" },
    { id: 24, title: "錯過校車", type: "cash", value: -150, emoji: "🚌", desc: "出門磨磨蹭蹭，校車開走了！只好自費 150 元坐計程車去學校。" },
    { id: 25, title: "溫馨生日派對", type: "collect", value: 80, emoji: "🎂", desc: "今天是你的生日！大家都為你送上溫馨祝福，每位玩家送你 80 元禮金。" },
    { id: 26, title: "看電視太近", type: "cash", value: -70, emoji: "📺", desc: "看電視靠得太近，眼睛酸痛，花費 70 元眼科檢查與購買葉黃素護眼。" },
    { id: 27, title: "香蕉皮滑倒", type: "teleport_p", value: 0, emoji: "🍌", desc: "踩到路上的香蕉皮！咻地一聲摔到了隨機一位其他玩家所在的格子上！" },
    { id: 28, title: "整理個人房間", type: "cash", value: 120, emoji: "🛏️", desc: "把玩具歸類放好、棉被摺好，房間煥然一新！爸爸媽媽獎勵 120 元。" },
    { id: 29, title: "貪玩忘記時間", type: "rest", value: 1, emoji: "🎠", desc: "在兒童樂園玩旋轉木馬忘記了上課時間，被留在校門口休息反省一回合。" },
    { id: 30, title: "智慧之星", type: "item", value: "trap", emoji: "💥", desc: "答對了最難的謎題，智慧之神賜予你一張『陷阱卡』！" }
];

// ==================== 預設小學生多學科題庫 ====================
const DefaultQuestions = [
    // 低年級 (low) - 數學
    { grade: "low", subject: "math", text: "小兔有 5 個冰淇淋，小熊又給了牠 7 個，小兔現在一共有幾個冰淇淋？", options: ["10個", "11個", "12個", "13個"], answer: "C" },
    { grade: "low", subject: "math", text: "三角形有幾條邊和幾個角？", options: ["2條邊，2個角", "3條邊，3個角", "4條邊，4個角", "5條邊，5個角"], answer: "B" },
    { grade: "low", subject: "math", text: "一隻手有 5 根手指頭，兩隻手一共有幾根手指頭？", options: ["8根", "9根", "10根", "12根"], answer: "C" },
    // 低年級 (low) - 國語
    { grade: "low", subject: "chinese", text: "請問『太陽』的『陽』注音是什麼？", options: ["ㄧㄤˊ", "ㄧㄤ", "ㄧㄢˊ", "ㄤˊ"], answer: "A" },
    { grade: "low", subject: "chinese", text: "下面哪一個字用來形容鳥叫的聲音？", options: ["咚咚", "嘰嘰喳喳", "嘩啦啦", "呼呼"], answer: "B" },
    // 低年級 (low) - 英文
    { grade: "low", subject: "english", text: "英文單字中，『蘋果』的正確拼法是什麼？", options: ["Aple", "Apple", "Appel", "Apel"], answer: "B" },
    { grade: "low", subject: "english", text: "黃色在英文中叫做什麼？", options: ["Red", "Blue", "Green", "Yellow"], answer: "D" },
    // 低年級 (low) - 自然
    { grade: "low", subject: "science", text: "以下哪一種動物會生蛋，而且不會飛？", options: ["蝴蝶", "企鵝", "小狗", "蝙蝠"], answer: "B" },
    { grade: "low", subject: "science", text: "西瓜是長在什麼地方的植物？", options: ["高大的大樹上", "地面的藤蔓上", "水池裡面的泥土中", "石頭縫隙裡"], answer: "B" },
    // 低年級 (low) - 社會
    { grade: "low", subject: "social", text: "看到紅綠燈的『綠燈』閃爍並變成『紅燈』時，我們應該怎麼辦？", options: ["快點跑過去", "停在路口安全處等待", "不管它直接走", "在馬路中間玩遊戲"], answer: "B" },
    { grade: "low", subject: "social", text: "吃完便當後的紙盒與吃剩的骨頭，應該怎麼分類？", options: ["全部丟一般垃圾", "紙盒回收，骨頭丟廚餘", "全部拿去燒掉", "隨便丟在路邊"], answer: "B" },
    // 低年級 (low) - 新增 10 題
    { grade: "low", subject: "math", text: "媽媽買了 8 顆蘋果，小明吃了 3 顆，還剩下幾顆蘋果？", options: ["3顆", "4顆", "5顆", "6顆"], answer: "C" },
    { grade: "low", subject: "math", text: "請問 15 減去 7 等於多少？", options: ["6", "7", "8", "9"], answer: "C" },
    { grade: "low", subject: "math", text: "一個星期共有幾天？", options: ["5天", "6天", "7天", "8天"], answer: "C" },
    { grade: "low", subject: "chinese", text: "請問『月亮』的『亮』注音第一個聲母是什麼？", options: ["ㄌ", "ㄋ", "ㄇ", "ㄉ"], answer: "A" },
    { grade: "low", subject: "chinese", text: "『小鳥在樹上＿＿歌』，空格裡填哪一個字最合適？", options: ["唱", "喝", "跑", "跳"], answer: "A" },
    { grade: "low", subject: "english", text: "英文單字中，『貓咪』的英文怎麼寫？", options: ["Dog", "Cat", "Pig", "Duck"], answer: "B" },
    { grade: "low", subject: "english", text: "請問數字『3』的英文單字是什麼？", options: ["One", "Two", "Three", "Four"], answer: "C" },
    { grade: "low", subject: "science", text: "白天的天空主要靠什麼發光照亮大地？", options: ["月亮", "星星", "太陽", "手電筒"], answer: "C" },
    { grade: "low", subject: "science", text: "下列哪一種動物是在水裡用鰓呼吸游泳的？", options: ["小狗", "小魚", "小貓", "小雞"], answer: "B" },
    { grade: "low", subject: "social", text: "搭乘公車或捷運時，看到座位有老人或孕婦，我們應該怎麼做？", options: ["假裝沒看到", "主動讓座", "大聲喊叫", "搶著坐下"], answer: "B" },

    // 中高年級 (mid-high) - 數學
    { grade: "mid-high", subject: "math", text: "算算看： 120 乘以 5 再除以 6 等於多少？", options: ["80", "100", "120", "150"], answer: "B" },
    { grade: "mid-high", subject: "math", text: "一個正方形的周長是 36 公分，請問它的面積是多少平方公分？", options: ["36平方公分", "81平方公分", "72平方公分", "144平方公分"], answer: "B" },
    { grade: "mid-high", subject: "math", text: "若一個圓形的直徑是 10 公分，圓周率約為 3.14，則圓周長是多少公分？", options: ["31.4公分", "15.7公分", "78.5公分", "62.8公分"], answer: "A" },
    // 中高年級 (mid-high) - 國語
    { grade: "mid-high", subject: "chinese", text: "『□□補牢』這句成語中，空格內填入什麼動物最合適？", options: ["守株", "亡羊", "畫蛇", "騎虎"], answer: "B" },
    { grade: "mid-high", subject: "chinese", text: "『買櫝還珠』常用來比喻什麼意思？", options: ["買東西很划算", "捨本逐末，取捨失當", "珠寶非常名貴", "誠實信用"], answer: "B" },
    // 中高年級 (mid-high) - 英文
    { grade: "mid-high", subject: "english", text: "Yesterday, I (go) to the park with my family. 空格應填入什麼時態？", options: ["go", "goes", "went", "going"], answer: "C" },
    { grade: "mid-high", subject: "english", text: "下列哪一個字用來表示『科學家』？", options: ["Artist", "Scientist", "Teacher", "Doctor"], answer: "B" },
    // 中高年級 (mid-high) - 自然
    { grade: "mid-high", subject: "science", text: "水在受熱沸騰時，會轉化為何種狀態？", options: ["固態（冰）", "液態（水）", "氣態（水蒸氣）", "電漿態"], answer: "C" },
    { grade: "mid-high", subject: "science", text: "太陽系中，體積最大的行星是哪一顆？", options: ["地球", "火星", "木星", "土星"], answer: "C" },
    // 中高年級 (mid-high) - 社會
    { grade: "mid-high", subject: "social", text: "台灣最高的山峰是哪一座？海拔大約是多少公尺？", options: ["阿里山，約2600公尺", "雪山，約3886公尺", "玉山，約3952公尺", "陽明山，約1120公尺"], answer: "C" },
    { grade: "mid-high", subject: "social", text: "在台灣歷史上，安平古堡是哪一個國家最早建立的城堡（熱蘭遮城）？", options: ["西班牙", "荷蘭", "日本", "英國"], answer: "B" }
   // 中高年級 (mid-high) - 新增 10 題
    { grade: "mid-high", subject: "math", text: "算算看：9 乘以 8 再加上 12 等於多少？", options: ["72", "80", "84", "90"], answer: "C" },
    { grade: "mid-high", subject: "math", text: "長方形的長是 8 公分，寬是 5 公分，請問它的周長是多少公分？", options: ["13公分", "26公分", "40公分", "80公分"], answer: "B" },
    { grade: "mid-high", subject: "math", text: "將三分之二（2/3）化成以 6 為分母的分數，分子應該是多少？", options: ["2", "3", "4", "5"], answer: "C" },
    { grade: "mid-high", subject: "chinese", text: "『井底之＿＿』常用來比喻見識狹小的人，空格應填入什麼？", options: ["魚", "蛙", "鳥", "龜"], answer: "B" },
    { grade: "mid-high", subject: "chinese", text: "下列哪一個成語用來形容『做事非常認真專注，連吃飯睡覺都忘了』？", options: ["廢寢忘食", "走馬看花", "畫蛇添足", "三心二意"], answer: "A" },
    { grade: "mid-high", subject: "english", text: "英文單字中，『Bookstore』的意思是什麼？", options: ["麵包店", "花店", "書店", "水果店"], answer: "C" },
    { grade: "mid-high", subject: "english", text: "『Water』是指水，那『Ice』是指什麼？", options: ["蒸氣", "冰塊", "果汁", "牛奶"], answer: "B" },
    { grade: "mid-high", subject: "science", text: "植物進行光合作用時，主要是吸收哪一種氣體並釋放氧氣？", options: ["氮氣", "氫氣", "二氧化碳", "氦氣"], answer: "C" },
    { grade: "mid-high", subject: "science", text: "請問地球繞著什麼天體公轉一圈需要約 365 天（一年）？", options: ["月球", "太陽", "火星", "木星"], answer: "B" },
    { grade: "mid-high", subject: "social", text: "台灣位於哪一個大洋的西邊？", options: ["太平洋", "印度洋", "大西洋", "北極海"], answer: "A" },
];

// ==================== IndexedDB 個人照片資料庫輔助器 ====================
const DbHelper = {
    dbName: "FairyTaleMonopolyDB",
    dbVersion: 1,
    db: null,
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = (event) => reject("DB 開啟失敗: " + event.target.errorCode);
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("player_avatars")) {
                    db.createObjectStore("player_avatars", { keyPath: "playerId" });
                }
            };
        });
    },
    saveAvatar(playerId, base64Data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject("DB 未初始化");
                return;
            }
            const transaction = this.db.transaction(["player_avatars"], "readwrite");
            const store = transaction.objectStore("player_avatars");
            const request = store.put({ playerId: playerId, data: base64Data });
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject("儲存頭像失敗");
        });
    },
    getAvatar(playerId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve(null);
                return;
            }
            const transaction = this.db.transaction(["player_avatars"], "readonly");
            const store = transaction.objectStore("player_avatars");
            const request = store.get(playerId);
            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.data : null);
            };
            request.onerror = () => resolve(null);
        });
    }
};

// ==================== 遊戲狀態與變數 ====================
let GameState = {
    players: [],
    activePlayerIdx: 0,
    round: 1,
    diceMode: 'double', // single or double
    gradeMode: 'all', // low, mid-high, all
    timeLimitEnabled: true,
    timeLimitMin: 15,
    timeLeftSec: 900,
    bankruptcyEnabled: true,
    gameStarted: false,
    boardCells: [],
    customQuestions: [],
    gameTimerInterval: null,
    // 被放置的陷阱卡，Key: 格子編號, Value: 放置者玩家 ID
    placedTraps: {},
    // 連線 Firebase 的自訂 Config (若啟用)
    firebaseEnabled: false,
    firebaseConfig: null
};

// 棋盤格子的靜態資料 (36格)
const CellDataTemplates = [
{ name: "起點", type: "start", emoji: "🚩", price: 0, color: "#CCCCCC" },
    { name: "草莓屋", type: "property", emoji: "🍦", price: 100, rent: 10, color: "#FFB7B2" },
    { name: "巧克力屋", type: "property", emoji: "🍦", price: 120, rent: 15, color: "#FFB7B2" },
    { name: "薄荷屋", type: "property", emoji: "🍦", price: 130, rent: 18, color: "#FFB7B2" },
    { name: "傳送門", type: "portal", emoji: "🌀", price: 0, color: "#E8AEFF" },
    { name: "綜合挑戰", type: "all_quiz", emoji: "❓", price: 0, color: "#A7F3D0" }, // 綜合挑戰 1
    { name: "棉花糖屋", type: "property", emoji: "🍬", price: 140, rent: 20, color: "#FFDAC1" },
    { name: "糖果屋", type: "property", emoji: "🍬", price: 160, rent: 25, color: "#FFDAC1" },
    { name: "棒棒糖屋", type: "property", emoji: "🍬", price: 180, rent: 30, color: "#FFDAC1" },
    { name: "大轉盤", type: "wheel", emoji: "🎡", price: 0, color: "#F472B6" },      // 大轉盤 1
    { name: "暴龍園", type: "property", emoji: "🦕", price: 200, rent: 40, color: "#E2F0CB" },
    { name: "三角龍園", type: "property", emoji: "🦕", price: 220, rent: 45, color: "#E2F0CB" },
    { name: "翼龍園", type: "property", emoji: "🦕", price: 240, rent: 50, color: "#E2F0CB" },
    { name: "數學挑戰", type: "math_quiz", emoji: "📐", price: 0, color: "#93C5FD" }, // 數學挑戰 1
    { name: "滑水道", type: "property", emoji: "🏊", price: 280, rent: 60, color: "#BFFCC6" },
    { name: "漂漂河", type: "property", emoji: "🏊", price: 300, rent: 70, color: "#BFFCC6" },
    { name: "巨浪池", type: "property", emoji: "🏊", price: 320, rent: 80, color: "#BFFCC6" },
    { name: "綜合挑戰", type: "all_quiz", emoji: "❓", price: 0, color: "#A7F3D0" }, // 綜合挑戰 2
    { name: "粉紅堡", type: "property", emoji: "🏰", price: 350, rent: 100, color: "#FFC6FF" },
    { name: "星空堡", type: "property", emoji: "🏰", price: 380, rent: 120, color: "#FFC6FF" },
    { name: "水晶堡", type: "property", emoji: "🏰", price: 420, rent: 140, color: "#FFC6FF" },
    { name: "數學挑戰", type: "math_quiz", emoji: "📐", price: 0, color: "#93C5FD" }, // 數學挑戰 2
    { name: "黃金堡", type: "property", emoji: "🏰", price: 450, rent: 160, color: "#FFC6FF" },
    { name: "魔法商店", type: "shop", emoji: "🧹", price: 0, color: "#FDE047" },
    { name: "探險號", type: "property", emoji: "🚀", price: 340, rent: 90, color: "#D6E4FF" },
    { name: "追夢號", type: "property", emoji: "🚀", price: 360, rent: 100, color: "#D6E4FF" },
    { name: "大轉盤", type: "wheel", emoji: "🎡", price: 0, color: "#F472B6" },      // 大轉盤 2
    { name: "松木屋", type: "property", emoji: "🏡", price: 220, rent: 45, color: "#D1FAE5" },
    { name: "橡木屋", type: "property", emoji: "🏡", price: 240, rent: 50, color: "#D1FAE5" },
    { name: "小紅屋", type: "property", emoji: "🏡", price: 260, rent: 55, color: "#D1FAE5" },
    { name: "數學挑戰", type: "math_quiz", emoji: "📐", price: 0, color: "#93C5FD" }, // 數學挑戰 3
    { name: "綜合挑戰", type: "all_quiz", emoji: "❓", price: 0, color: "#A7F3D0" }, // 綜合挑戰 3
    { name: "機器人工廠", type: "property", emoji: "🤖", price: 120, rent: 20, color: "#E2E8F0" },
    { name: "發條汽車", type: "property", emoji: "🚗", price: 140, rent: 25, color: "#E2E8F0" },
    { name: "毛絨小熊", type: "property", emoji: "🧸", price: 160, rent: 30, color: "#E2E8F0" },
    { name: "小惡魔", type: "imp", emoji: "😈", price: 0, color: "#FCA5A5" }
];

// 可用動物棋子清單
const CharacterAvatars = ["🐰", "🐶", "🐻", "🐱", "🦊", "🦁", "🐒", "🐼"];
const CharacterColors = ["#FF4343", "#1A8CFF", "#2CD63C", "#FFD214", "#9F3BFF", "#FF69B4", "#FF8800", "#14B8A6"];

// 預設 4 位玩家設定模板
const DefaultPlayersSetup = [
    { name: "小兔兔", avatar: "🐰", isAi: false, color: CharacterColors[0] },
    { name: "小狗狗", avatar: "🐶", isAi: false, color: CharacterColors[1] },
    { name: "熊嘟嘟", avatar: "🐻", isAi: true, color: CharacterColors[2] },
    { name: "喵咪咪", avatar: "🐱", isAi: true, color: CharacterColors[3] }
];

// ==================== 兒童專用大字體彈窗系統 (代替 native alert/confirm/prompt) ====================
function showCustomDialog({ title, message, type = 'alert', defaultInput = '' }) {
    return new Promise((resolve) => {
        const modal = document.getElementById("modal-custom-dialog");
        const titleEl = document.getElementById("dialog-title");
        const messageEl = document.getElementById("dialog-message");
        const inputContainer = document.getElementById("dialog-input-container");
        const inputEl = document.getElementById("dialog-input");
        const btnConfirm = document.getElementById("btn-dialog-confirm");
        const btnCancel = document.getElementById("btn-dialog-cancel");

        titleEl.textContent = title || "💡 提示";
        messageEl.innerHTML = message;
        
        if (type === 'prompt') {
            inputContainer.style.display = "block";
            inputEl.value = defaultInput;
        } else {
            inputContainer.style.display = "none";
        }

        if (type === 'alert') {
            btnCancel.style.display = "none";
            btnConfirm.style.width = "100%";
        } else {
            btnCancel.style.display = "block";
            btnConfirm.style.width = "auto";
        }

        modal.classList.add("active");

        function cleanup() {
            modal.classList.remove("active");
            btnConfirm.removeEventListener("click", onConfirmClick);
            btnCancel.removeEventListener("click", onCancelClick);
        }

        function onConfirmClick() {
            cleanup();
            if (type === 'prompt') {
                resolve(inputEl.value);
            } else {
                resolve(true);
            }
        }

        function onCancelClick() {
            cleanup();
            resolve(false);
        }

        btnConfirm.addEventListener("click", onConfirmClick);
        btnCancel.addEventListener("click", onCancelClick);
    });
}

// ==================== 初始化事件與載入 ====================
document.addEventListener("DOMContentLoaded", async () => {
    // 1. 先渲染玩家設定選單（確保角色一定會出現）
    renderSetupPlayers();

    // 2. 初始化 IndexedDB
    try {
        await DbHelper.init();
        // 初始化成功後重新渲染一次（若有已存照片可帶入）
        renderSetupPlayers();
    } catch (e) {
        console.error("IndexedDB 初始化失敗，採用預設模式：", e);
    }

    // 3. 初始化 Canvas 粒子與題庫
    if (typeof ConfettiEffect !== 'undefined') ConfettiEffect.init();
    loadCustomQuestions();

    // 4. 綁定按鈕事件
    document.getElementById("btn-add-player")?.addEventListener("click", addNewPlayer);
    document.getElementById("btn-start-game")?.addEventListener("click", startGame);
    document.getElementById("btn-roll-dice")?.addEventListener("click", rollDiceAction);
    document.getElementById("btn-save-question")?.addEventListener("click", saveCustomQuestion);
    document.getElementById("btn-reset-questions")?.addEventListener("click", resetQuestionsToDefault);
    document.getElementById("btn-quiz-manager")?.addEventListener("click", () => openModal("modal-quiz"));
    document.getElementById("btn-settings")?.addEventListener("click", () => openModal("modal-settings"));
    document.getElementById("btn-save-game")?.addEventListener("click", saveGameData);
    document.getElementById("btn-load-game")?.addEventListener("click", () => loadGameData());
    document.getElementById("btn-restart")?.addEventListener("click", restartGame);
    document.getElementById("btn-confirm-avatar")?.addEventListener("click", useSelectedPhoto);
    document.getElementById("chk-enable-firebase")?.addEventListener("change", toggleFirebaseFields);
    document.getElementById("btn-save-firebase")?.addEventListener("click", saveFirebaseConfig);

    // 頭像上傳預覽
    document.getElementById("avatar-input")?.addEventListener("change", previewUploadedPhoto);
    
    // 初始化幸運大轉盤畫布
    drawLuckyWheelCanvas();
});

// ==================== 玩家頭像與 IndexedDB 相片上傳管理 ====================
let activeAvatarUploadPlayerId = null;

function triggerAvatarUpload(playerId) {
    activeAvatarUploadPlayerId = playerId;
    openModal("modal-avatar");
    document.getElementById("avatar-input").value = "";
    document.getElementById("avatar-preview").style.display = "none";
    document.getElementById("avatar-preview").src = "";
    document.getElementById("avatar-placeholder").style.display = "block";
}

function previewUploadedPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById("avatar-preview");
            preview.src = e.target.result;
            preview.style.display = "block";
            document.getElementById("avatar-placeholder").style.display = "none";
        };
        reader.readAsDataURL(file);
    }
}

async function useSelectedPhoto() {
    const preview = document.getElementById("avatar-preview");
    if (preview.src && activeAvatarUploadPlayerId) {
        const base64Data = preview.src;
        // 儲存至 IndexedDB
        await DbHelper.saveAvatar(activeAvatarUploadPlayerId, base64Data);
        // 更新設定 UI 面板
        renderSetupPlayers();
        closeModal("modal-avatar");
    } else {
        await showCustomDialog({ message: "請先選取一張照片！" });
    }
}

// ==================== 玩家資料管理與 UI 生成 ====================
// 預設 4 位玩家設定模板
const DefaultPlayersSetup = [
    { name: "小兔兔", avatar: "🐰", isAi: false, color: "#FF4343" },
    { name: "小狗狗", avatar: "🐶", isAi: false, color: "#1A8CFF" },
    { name: "熊嘟嘟", avatar: "🐻", isAi: true, color: "#2CD63C" },
    { name: "喵咪咪", avatar: "🐱", isAi: true, color: "#FFD214" }
];

// 本地玩家設定暫存陣列
let localPlayersSetup = JSON.parse(JSON.stringify(DefaultPlayersSetup));

function renderSetupPlayers() {
    const container = document.getElementById("setup-players-list");
    if (!container) {
        console.error("找不到 setup-players-list 容器！");
        return;
    }
    
    container.innerHTML = "";

    // 若陣列空了，強制還原預設值
    if (!localPlayersSetup || localPlayersSetup.length === 0) {
        localPlayersSetup = JSON.parse(JSON.stringify(DefaultPlayersSetup));
    }

    localPlayersSetup.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = `setup-player-card ${p.isAi ? 'ai-card' : ''}`;
        card.style.borderColor = p.color || '#000';

        // 刪除按鈕 (至少保留 2 位)
        let removeBtnHtml = "";
        if (localPlayersSetup.length > 2) {
            removeBtnHtml = `<span class="remove-player-btn" onclick="removePlayerSetup(${i})">&times;</span>`;
        }

        card.innerHTML = `
            ${removeBtnHtml}
            <div class="setup-avatar-wrapper" onclick="triggerAvatarUpload('setup_player_${i}')">
                <span class="avatar-emoji">${p.avatar}</span>
                <div class="camera-icon">📸 更換照片</div>
            </div>
            <input type="text" value="${p.name}" onchange="updateSetupPlayerName(${i}, this.value)">
            <select onchange="updateSetupPlayerType(${i}, this.value)">
                <option value="human" ${!p.isAi ? 'selected' : ''}>🙋 真人玩家</option>
                <option value="ai" ${p.isAi ? 'selected' : ''}>🤖 AI 電腦</option>
            </select>
        `;
        container.appendChild(card);
    });
}

function updateSetupPlayerName(idx, val) {
    if (val.trim()) {
        localPlayersSetup[idx].name = val.trim();
    }
}

function updateSetupPlayerType(idx, val) {
    localPlayersSetup[idx].isAi = (val === 'ai');
    renderSetupPlayers();
}

function removePlayerSetup(idx) {
    localPlayersSetup.splice(idx, 1);
    renderSetupPlayers();
}

async function addNewPlayer() {
    if (localPlayersSetup.length >= 8) {
        await showCustomDialog({ message: "最多只能有 8 位玩家同樂喔！" });
        return;
    }
    const idx = localPlayersSetup.length;
    const emoji = CharacterAvatars[idx % CharacterAvatars.length];
    const color = CharacterColors[idx % CharacterColors.length];
    localPlayersSetup.push({
        name: `玩家 ${idx + 1}`,
        avatar: emoji,
        isAi: false,
        color: color
    });
    renderSetupPlayers();
}

// ==================== 題庫系統管理 (自訂題庫) ====================
function loadCustomQuestions() {
    const saved = localStorage.getItem("custom_questions");
    if (saved) {
        GameState.customQuestions = JSON.parse(saved);
    } else {
        GameState.customQuestions = [];
    }
    renderQuestionList();
}

function renderQuestionList() {
    const qList = document.getElementById("quiz-list");
    qList.innerHTML = "";
    
    const filterGrade = document.getElementById("filter-grade").value;
    const filterSubject = document.getElementById("filter-subject").value;

    const allQuestions = [...DefaultQuestions, ...GameState.customQuestions];
    let count = 0;

    allQuestions.forEach((q, idx) => {
        if (filterGrade !== "all" && q.grade !== filterGrade) return;
        if (filterSubject !== "all" && q.subject !== filterSubject) return;

        count++;
        const row = document.createElement("div");
        row.className = "quiz-item-row";
        
        let subText = "";
        switch (q.subject) {
            case "math": subText = "數學"; break;
            case "chinese": subText = "國語"; break;
            case "english": subText = "英文"; break;
            case "science": subText = "自然"; break;
            case "social": subText = "社會"; break;
        }

        const gradeText = q.grade === "low" ? "低年級" : "中高年級";
        const isCustom = idx >= DefaultQuestions.length;

        row.innerHTML = `
            <div>
                <div class="q-details">
                    <span>${gradeText}</span>
                    <span>${subText}</span>
                    ${isCustom ? '<span style="background: #FEF08A; border: 1.5px solid #000;">自訂</span>' : ''}
                </div>
                <div style="font-weight: bold; margin-top: 4px;">${q.text}</div>
            </div>
            ${isCustom ? `<span class="delete-q-btn" onclick="deleteCustomQuestion(${idx - DefaultQuestions.length})">&times;</span>` : ''}
        `;
        qList.appendChild(row);
    });

    document.getElementById("total-questions-count").textContent = count;
}

async function saveCustomQuestion() {
    const grade = document.getElementById("q-grade").value;
    const subject = document.getElementById("q-subject").value;
    const text = document.getElementById("q-text").value.trim();
    const optA = document.getElementById("q-optA").value.trim();
    const optB = document.getElementById("q-optB").value.trim();
    const optC = document.getElementById("q-optC").value.trim();
    const optD = document.getElementById("q-optD").value.trim();
    const answer = document.getElementById("q-answer").value;

    if (!text || !optA || !optB || !optC || !optD) {
        await showCustomDialog({ message: "請完整輸入題目與四個選項內容！" });
        return;
    }

    const newQ = {
        grade, subject, text,
        options: [optA, optB, optC, optD],
        answer
    };

    GameState.customQuestions.push(newQ);
    localStorage.setItem("custom_questions", JSON.stringify(GameState.customQuestions));
    
    // 清空表單
    document.getElementById("q-text").value = "";
    document.getElementById("q-optA").value = "";
    document.getElementById("q-optB").value = "";
    document.getElementById("q-optC").value = "";
    document.getElementById("q-optD").value = "";

    renderQuestionList();
    syncToFirebaseCloud();
}

async function deleteCustomQuestion(customIdx) {
    if (await showCustomDialog({ message: "確定要刪除這題自訂題目嗎？", type: "confirm" })) {
        GameState.customQuestions.splice(customIdx, 1);
        localStorage.setItem("custom_questions", JSON.stringify(GameState.customQuestions));
        renderQuestionList();
        syncToFirebaseCloud();
    }
}

async function resetQuestionsToDefault() {
    if (await showCustomDialog({ message: "警告！這將清除您所有的自訂題目，確定嗎？", type: "confirm" })) {
        GameState.customQuestions = [];
        localStorage.removeItem("custom_questions");
        renderQuestionList();
        syncToFirebaseCloud();
    }
}

// ==================== 遊戲開始與主介面渲染 ====================
async function startGame() {
    // 檢查真人玩家數量
    const humanCount = localPlayersSetup.filter(p => !p.isAi).length;
    if (humanCount < 2) {
        await showCustomDialog({ message: "為了增加互動樂趣，必須至少有 2 位真人玩家喔！" });
        return;
    }

    GameState.players = [];
    for (let i = 0; i < localPlayersSetup.length; i++) {
        const setup = localPlayersSetup[i];
        // 讀取頭像照片
        const customAvatar = await DbHelper.getAvatar(`setup_player_${i}`);
        GameState.players.push({
            id: `player_${i}`,
            name: setup.name,
            avatarEmoji: setup.avatar,
            avatarImg: customAvatar || null,
            isAi: setup.isAi,
            color: setup.color,
            cash: 2500, // 初始資金
            position: 0,
            bankrupt: false,
            items: {
                remote: 1, // 預設贈送遙控骰子1個
                shield: 1, // 預設贈送盾牌1個
                speed: 0,
                trap: 0
            },
            shieldsActive: 0 // 剩餘護盾抵消次數
        });
    }

    // 讀取模式
    GameState.gradeMode = document.getElementById("select-grade").value;
    GameState.diceMode = document.getElementById("select-dice-mode").value;
    GameState.timeLimitEnabled = document.getElementById("chk-time-limit").checked;
    GameState.timeLimitMin = parseInt(document.getElementById("num-time-limit").value) || 15;
    GameState.timeLeftSec = GameState.timeLimitMin * 60;
    GameState.bankruptcyEnabled = document.getElementById("chk-bankruptcy-limit").checked;

    GameState.activePlayerIdx = 0;
    GameState.round = 1;
    GameState.placedTraps = {};
    GameState.gameStarted = true;

    // 建立 36 格地圖格
    setupBoardCells();

    // 更新介面
    document.getElementById("setup-view").classList.remove("active");
    document.getElementById("play-view").classList.add("active");
    
    if (GameState.timeLimitEnabled) {
        document.getElementById("time-limit-badge").style.display = "flex";
        document.getElementById("time-left").textContent = formatTime(GameState.timeLeftSec);
        startCountdownTimer();
    } else {
        document.getElementById("time-limit-badge").style.display = "none";
    }

    // 隱藏不必要的骰子 (若是單骰子模式)
    if (GameState.diceMode === 'single') {
        document.getElementById("dice-container-2").style.display = "none";
    } else {
        document.getElementById("dice-container-2").style.display = "block";
    }

    updatePlayDashboard();
    renderPlayerTokens();
    
    SoundEngine.playCheer();
    ConfettiEffect.spawn(50);

    // 開始目前玩家回合
    startTurn();
}

function setupBoardCells() {
    const board = document.getElementById("board");
    // 清除舊格子
    const oldCells = board.querySelectorAll('.board-cell');
    oldCells.forEach(c => c.remove());

    GameState.boardCells = [];
    CellDataTemplates.forEach((data, index) => {
        const cell = document.createElement("div");
        cell.className = "board-cell";
        cell.id = `cell-${index}`;

        // 判斷是否為角落格
        if (index === 0 || index === 9 || index === 18 || index === 27) {
            cell.classList.add("corner-cell");
        }

        // 計算 CSS Grid 位置 (10x10 格子外圍)
        let row = 1;
        let col = 1;
        if (index >= 0 && index <= 9) {
            row = 1;
            col = index + 1;
        } else if (index > 9 && index <= 18) {
            row = index - 9 + 1;
            col = 10;
        } else if (index > 18 && index <= 27) {
            row = 10;
            col = 10 - (index - 18);
        } else if (index > 27 && index <= 35) {
            row = 10 - (index - 27);
            col = 1;
        }

        cell.style.gridRow = row;
        cell.style.gridColumn = col;

        // 房屋星等欄位與地產顏色欄位
        let starContainerHtml = "";
        let colorHeaderHtml = "";
        if (data.type === "property") {
            colorHeaderHtml = `<div class="cell-header-color" style="background: ${data.color}"></div>`;
            starContainerHtml = `<div class="cell-stars" id="stars-${index}"></div>`;
        }

        cell.innerHTML = `
            ${colorHeaderHtml}
            ${starContainerHtml}
            <div class="cell-main-row">
                <div class="cell-left-icon">${data.emoji}</div>
                <div class="cell-right-info">
                    <div class="cell-name">${data.name}</div>
                    <div class="cell-price">${data.price > 0 ? '💰' + data.price : '事件'}</div>
                </div>
            </div>
            <div class="cell-owner-indicator" id="owner-ind-${index}"></div>
            <div class="cell-tokens-container" id="cell-tokens-${index}"></div>
        `;
        board.appendChild(cell);

        GameState.boardCells.push({
            id: index,
            name: data.name,
            type: data.type,
            price: data.price,
            baseRent: data.rent || 0,
            owner: null,  // 玩家物件
            level: 0,     // 土地等級 (0~3星)
            color: data.color
        });
    });
}

function renderPlayerTokens() {
    // 清空所有格子內的棋子容器
    for (let i = 0; i < 36; i++) {
        document.getElementById(`cell-tokens-${i}`).innerHTML = "";
    }

    // 渲染所有存活玩家棋子
    GameState.players.forEach(p => {
        if (p.bankrupt) return;
        const container = document.getElementById(`cell-tokens-${p.position}`);
        if (container) {
            const token = document.createElement("div");
            token.className = "token";
            token.style.borderColor = p.color;
            
            if (p.avatarImg) {
                token.classList.add("has-img");
                token.innerHTML = `<img src="${p.avatarImg}" alt="${p.name}">`;
            } else {
                token.innerHTML = p.avatarEmoji;
            }
            container.appendChild(token);
        }
    });
}

function updatePlayDashboard() {
    const dashboard = document.getElementById("players-dashboard");
    dashboard.innerHTML = "";

    GameState.players.forEach((p, idx) => {
        const card = document.createElement("div");
        card.className = "dashboard-card";
        if (idx === GameState.activePlayerIdx && GameState.gameStarted) {
            card.classList.add("active-turn");
        }
        if (p.bankrupt) {
            card.classList.add("bankrupt-card");
        }

        // 頭像內容
        let avatarContent = "";
        if (p.avatarImg) {
            avatarContent = `<img src="${p.avatarImg}" alt="${p.name}">`;
        } else {
            avatarContent = `<span class="avatar-emoji">${p.avatarEmoji}</span>`;
        }

        // 房屋數量計數
        const propertiesCount = GameState.boardCells.filter(c => c.owner && c.owner.id === p.id).length;

        // 護盾數量圖示
        let shieldsHtml = "";
        for (let s = 0; s < p.shieldsActive; s++) {
            shieldsHtml += "🛡️";
        }

        card.innerHTML = `
            <div class="card-border-line" style="background: ${p.color}"></div>
            <div class="dashboard-avatar">
                ${avatarContent}
            </div>
            <div class="dashboard-info">
                <span class="p-name">${p.name}${p.isAi ? ' (AI)' : ''}</span>
                <span class="p-cash">💰 ${p.cash}</span>
                <span class="p-props">🏡 地產: ${propertiesCount} | 護盾: ${p.items.shield}</span>
            </div>
            <div class="p-shields-row">${shieldsHtml}</div>
        `;
        dashboard.appendChild(card);
    });

    // 更新目前玩家道具欄
    renderCurrentPlayerItems();
}

function renderCurrentPlayerItems() {
    const container = document.getElementById("current-player-items");
    container.innerHTML = "";

    const activePlayer = GameState.players[GameState.activePlayerIdx];
    if (activePlayer.bankrupt) return;

    const itemsList = [
        { key: "remote", name: "遙控骰子", icon: "🎲", desc: "自訂步數" },
        { key: "shield", name: "盾牌保險", icon: "🛡️", desc: "擋過路費" },
        { key: "speed", name: "雙倍加速", icon: "🚀", desc: "步數加倍" },
        { key: "trap", name: "香蕉陷阱", icon: "💥", desc: "絆倒對手" }
    ];

    itemsList.forEach(item => {
        const count = activePlayer.items[item.key] || 0;
        if (count > 0) {
            const itemBtn = document.createElement("div");
            itemBtn.className = "item-card-mini";
            itemBtn.innerHTML = `
                <span>${item.icon} ${item.name}</span>
                <span class="badge-count">${count}</span>
            `;
            if (!activePlayer.isAi) {
                itemBtn.addEventListener("click", () => useItemAction(item.key));
            }
            container.appendChild(itemBtn);
        }
    });

    if (container.children.length === 0) {
        container.innerHTML = `<span class="text-muted" style="font-weight: bold;">目前沒有魔法道具卡，可以去「魔法商店」購買喔！</span>`;
    }
}

// ==================== 倒數計時器 ====================
function startCountdownTimer() {
    if (GameState.gameTimerInterval) clearInterval(GameState.gameTimerInterval);
    GameState.gameTimerInterval = setInterval(() => {
        if (!GameState.gameStarted) return;
        GameState.timeLeftSec--;
        document.getElementById("time-left").textContent = formatTime(GameState.timeLeftSec);

        if (GameState.timeLeftSec <= 0) {
            clearInterval(GameState.gameTimerInterval);
            endGameDueToTime();
        }
    }, 1000);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ==================== 道具使用邏輯 ====================
let isRemoteDiceActive = false;
let isSpeedActive = false;

async function useItemAction(itemKey) {
    const player = GameState.players[GameState.activePlayerIdx];
    if (player.isAi) return; // AI 自行使用

    if (itemKey === "remote") {
        if (isRemoteDiceActive) return;
        // 開啟遙控骰子選擇
        const steps = await showCustomDialog({ title: "🎲 遙控骰子", message: "✨ 請輸入遙控骰子想要前進的步數 (1 ~ 6 步)：", type: "prompt", defaultInput: "3" });
        const stepsNum = parseInt(steps);
        if (stepsNum >= 1 && stepsNum <= 6) {
            player.items.remote--;
            isRemoteDiceActive = stepsNum;
            document.getElementById("turn-instruction").innerHTML = `🔮 遙控骰子已啟動！下一擲將前進 <b style="color: var(--primary-red); font-size:1.3rem;">${stepsNum}</b> 步！`;
            renderCurrentPlayerItems();
            SoundEngine.playCheer();
        } else {
            await showCustomDialog({ message: "輸入無效！請輸入 1 到 6 的數字。" });
        }
    } else if (itemKey === "shield") {
        // 主動啟用免過路費護盾 (最多累積三次盾牌抵消)
        player.items.shield--;
        player.shieldsActive++;
        document.getElementById("turn-instruction").innerHTML = `🛡️ 護盾已開啟！可自動抵消一次高額過路費！`;
        updatePlayDashboard();
        SoundEngine.playCheer();
    } else if (itemKey === "speed") {
        // 下一次擲骰點數乘二
        player.items.speed--;
        isSpeedActive = true;
        document.getElementById("turn-instruction").innerHTML = `🚀 加速卡啟用！下一次擲骰前進步數將翻倍！`;
        renderCurrentPlayerItems();
        SoundEngine.playCheer();
    } else if (itemKey === "trap") {
        // 在當前格子放置陷阱
        player.items.trap--;
        GameState.placedTraps[player.position] = player.id;
        document.getElementById("turn-instruction").innerHTML = `💥 陷阱已設置於此格！下一個踩到的人會滑倒暫停一回合！`;
        renderCurrentPlayerItems();
        SoundEngine.playBuzzer();
    }
}

const EducationalTips = [
    "儲蓄可以賺取利息，累積一筆緊急備用金最安全！",
    "蓋房子升級城堡可以向對手收取過路費，是很好的資產投資！",
    "手頭一定要保留足夠的現金，避免踩到別人的城堡時沒錢付而破產！",
    "多回答益智問答，答對就能賺取豐厚的獎金，這是靠智慧累積財富！",
    "魔法商店的『免稅盾牌』是很好的風險管理工具，能幫你省下大筆租金！",
    "遇到納稅格時，選擇捐款給愛心基金，不但能做善事，還能獲得好人標章！",
    "量入為出，隨時注意自己的現金餘額，做個聰明的童話理財小達人！"
];

function updateEducationalTip() {
    const tipEl = document.getElementById("edu-tips-text");
    if (!tipEl) return;
    const randomTip = EducationalTips[Math.floor(Math.random() * EducationalTips.length)];
    tipEl.textContent = randomTip;
}

// ==================== 遊戲主回合循環與 AI 控制 ====================
function startTurn() {
    const player = GameState.players[GameState.activePlayerIdx];
    
    // 檢查是否因破產或陷阱暫停
    if (player.bankrupt) {
        nextTurn();
        return;
    }

    if (player.restTurn && player.restTurn > 0) {
        player.restTurn--;
        document.getElementById("turn-instruction").innerHTML = `🩹 <b>${player.name}</b> 還在包紮休息中，暫停本回合！`;
        SoundEngine.playBuzzer();
        setTimeout(nextTurn, 2500);
        return;
    }

    updatePlayDashboard();
    updateEducationalTip(); // 更新理財教育小知識看板內容
    document.getElementById("active-player-badge").style.background = player.color;
    document.getElementById("turn-avatar").textContent = player.avatarEmoji;
    document.getElementById("turn-name").textContent = player.name;
    document.getElementById("turn-instruction").textContent = player.isAi ? "電腦思考中..." : "點擊擲骰子按鈕開始前進！";
    
    // 確保骰子顯示狀態與當前骰子設定同步 (重設遙控骰子產生的隱藏)
    if (GameState.diceMode === 'double') {
        document.getElementById("dice-container-2").style.display = "block";
    } else {
        document.getElementById("dice-container-2").style.display = "none";
    }

    // 重設單次擲骰狀態
    document.getElementById("btn-roll-dice").disabled = false;

    // 自動執行存檔
    saveGameAuto();

    // 如果是 AI 電腦玩家，啟動決策邏輯
    if (player.isAi) {
        setTimeout(aiDecisionLogic, 1500);
    }
}

function nextTurn() {
    if (!GameState.gameStarted) return;
    
    GameState.activePlayerIdx = (GameState.activePlayerIdx + 1) % GameState.players.length;
    
    // 回合數增加
    if (GameState.activePlayerIdx === 0) {
        GameState.round++;
        document.getElementById("current-round").textContent = GameState.round;
    }

    startTurn();
}

// AI 電腦的思考決策邏輯
function aiDecisionLogic() {
    const player = GameState.players[GameState.activePlayerIdx];
    if (!GameState.gameStarted || player.bankrupt) return;

    // AI 決定是否使用盾牌卡
    if (player.items.shield > 0 && player.shieldsActive === 0 && Math.random() > 0.5) {
        player.items.shield--;
        player.shieldsActive++;
        SoundEngine.playCheer();
        updatePlayDashboard();
    }

    // AI 決定是否使用遙控骰子 landing on 自己的地產或起點
    if (player.items.remote > 0 && Math.random() > 0.6) {
        // 尋找前方 1~6 步是否有好地方
        for (let steps = 1; steps <= 6; steps++) {
            const targetPos = (player.position + steps) % 36;
            const targetCell = GameState.boardCells[targetPos];
            // 優先踩到起點 (0) 或是自己的地產 (升級) 或是空地 (購買)
            if (targetPos === 0 || (targetCell.type === 'property' && (!targetCell.owner || targetCell.owner.id === player.id))) {
                player.items.remote--;
                isRemoteDiceActive = steps;
                SoundEngine.playCheer();
                break;
            }
        }
    }

    // AI 決定是否使用加速卡
    if (player.items.speed > 0 && Math.random() > 0.7 && !isRemoteDiceActive) {
        player.items.speed--;
        isSpeedActive = true;
        SoundEngine.playCheer();
    }

    // 擲骰子
    rollDiceAction();
}

// ==================== 骰子擲出與動畫控制 ====================
let isRolling = false;

function rollDiceAction() {
    if (isRolling || !GameState.gameStarted) return;
    isRolling = true;
    document.getElementById("btn-roll-dice").disabled = true;

    SoundEngine.playRoll();

    // 決定點數
    let roll1 = 1;
    let roll2 = 0;
    
    if (isRemoteDiceActive) {
        // 使用遙控骰子
        roll1 = isRemoteDiceActive;
        isRemoteDiceActive = false;
    } else {
        roll1 = Math.floor(Math.random() * 6) + 1;
        if (GameState.diceMode === 'double') {
            roll2 = Math.floor(Math.random() * 6) + 1;
        }
    }

    // 播放 3D 骰子旋轉動畫
    const diceElement1 = document.getElementById("dice1");
    const diceElement2 = document.getElementById("dice2");

    // 施加隨機的高角度翻轉，最後精準定位到對應點數面上
    // + (360 * 3) 確保快速翻轉好幾圈
    const xRand1 = (Math.floor(Math.random() * 3) + 3) * 360;
    const yRand1 = (Math.floor(Math.random() * 3) + 3) * 360;

    let targetRotations = {
        1: {x: 0, y: 0},
        2: {x: -90, y: 0},
        3: {x: 0, y: -90},
        4: {x: 0, y: 90},
        5: {x: 90, y: 0},
        6: {x: 180, y: 0,z: 180}
    };

    diceElement1.style.transform = `rotateX(${targetRotations[roll1].x + xRand1}deg) rotateY(${targetRotations[roll1].y + yRand1}deg)`;
    
    if (GameState.diceMode === 'double' && roll2 > 0) {
        document.getElementById("dice-container-2").style.display = "block";
        const xRand2 = (Math.floor(Math.random() * 3) + 3) * 360;
        const yRand2 = (Math.floor(Math.random() * 3) + 3) * 360;
        diceElement2.style.transform = `rotateX(${targetRotations[roll2].x + xRand2}deg) rotateY(${targetRotations[roll2].y + yRand2}deg)`;
    } else {
        document.getElementById("dice-container-2").style.display = "none";
    }

    setTimeout(() => {
        // 動畫結束，重設實際的 CSS dataset (確保角度歸位不破壞後續計算)
        diceElement1.setAttribute("data-roll", roll1);
        diceElement1.style.transform = "";
        
        if (GameState.diceMode === 'double' && roll2 > 0) {
            diceElement2.setAttribute("data-roll", roll2);
            diceElement2.style.transform = "";
        }

        // 計算走步數
        let totalSteps = roll1 + roll2;
        if (isSpeedActive) {
            totalSteps *= 2;
            isSpeedActive = false;
        }

        const player = GameState.players[GameState.activePlayerIdx];
        document.getElementById("turn-instruction").innerHTML = `🎲 <b>${player.name}</b> 擲出了 <span style="font-size:1.5rem; color:var(--primary-red); font-weight:900;">${totalSteps}</span> 點！開始前進！`;
        
        // 執行逐步前進動畫
        movePlayerStepByStep(player, totalSteps);

    }, 1250); // 動畫完成時間
}

function movePlayerStepByStep(player, steps) {
    let currentStep = 0;
    
    function step() {
        if (currentStep >= steps) {
            // 行動結束，踩入格子觸發事件
            isRolling = false;
            landOnCellAction(player);
            return;
        }

        player.position = (player.position + 1) % 36;
        currentStep++;

        // 經過起點 (不包含停在起點，停在起點也在 landOn 判斷)
        if (player.position === 0 && currentStep < steps) {
            player.cash += 200;
            SoundEngine.playCoin();
            ConfettiEffect.spawn(10);
            updatePlayDashboard();
        }

        SoundEngine.playMove();
        renderPlayerTokens();
        
        setTimeout(step, 250); // 每步間隔 0.25 秒
    }
    
    step();
}

// ==================== 格子降落事件處理 ====================
async function landOnCellAction(player) {
    const pos = player.position;
    const cell = GameState.boardCells[pos];

    // 檢查是否有他人設置的陷阱卡
    if (GameState.placedTraps[pos] && GameState.placedTraps[pos] !== player.id) {
        delete GameState.placedTraps[pos]; // 清除陷阱
        player.restTurn = 1; // 暫停一回合
        document.getElementById("turn-instruction").innerHTML = `💥 滑倒了！<b>${player.name}</b> 踩到別人的香蕉陷阱，暫停一回合！`;
        SoundEngine.playBuzzer();
        setTimeout(nextTurn, 2500);
        return;
    }

    switch (cell.type) {
        case "start":
            // 停在起點，加倍獎勵
            player.cash += 400;
            document.getElementById("turn-instruction").innerHTML = `🚩 停在起點起跑線！特別獎勵 400 元！`;
            SoundEngine.playCoin();
            ConfettiEffect.spawn(20);
            updatePlayDashboard();
            setTimeout(nextTurn, 2500);
            break;

        case "property":
            await handleLandOnProperty(player, cell);
            break;

        case "portal":
            // 傳送門：傳送到隨機格 (排除傳送門本身，避免無限傳送)
            SoundEngine.playBuzzer();
            let newPos = pos;
            while (newPos === pos || GameState.boardCells[newPos].type === "portal") {
                newPos = Math.floor(Math.random() * 36);
            }
            document.getElementById("turn-instruction").innerHTML = `🌀 進入魔法傳送門！被傳送到 <b>${GameState.boardCells[newPos].name}</b> 格子！`;
            setTimeout(() => {
                player.position = newPos;
                renderPlayerTokens();
                landOnCellAction(player); // 觸發傳送目標格的效果！
            }, 1800);
            break;

        case "tax":
            // 捐款納稅
            await handleLandOnTax(player);
            break;

        case "math_quiz":
        case "all_quiz":
            // 問答挑戰
            await handleLandOnQuiz(player, cell.type);
            break;

        case "imp":
            // 小惡魔
            handleLandOnImp(player);
            break;

        case "shop":
            // 魔法商店
            handleLandOnShop(player);
            break;

        case "wheel":
            // 幸運大轉盤
            handleLandOnWheel(player);
            break;
    }
}

// 1. 地產處理
async function handleLandOnProperty(player, cell) {
    // 土地無人擁有
    if (!cell.owner) {
        if (player.isAi) {
            // AI 電腦自動決策：現金多於地產價格의 1.5 倍就購買
            if (player.cash >= cell.price * 1.5) {
                buyProperty(player, cell);
            } else {
                document.getElementById("turn-instruction").innerHTML = `🏡 電腦 <b>${player.name}</b> 錢不夠或決定不買 <b>${cell.name}</b>。`;
            }
            setTimeout(nextTurn, 2000);
        } else {
            // 真人玩家詢問購買
            const buy = await showCustomDialog({ title: "🏡 購買土地", message: `是否要花費 💰 ${cell.price} 元購買這塊可愛的土地 【${cell.name}】？<br>(您的現金: ${player.cash} 元)`, type: "confirm" });
            if (buy) {
                if (player.cash >= cell.price) {
                    buyProperty(player, cell);
                } else {
                    await showCustomDialog({ message: "您的現金不足，買不起這塊地呢！" });
                }
            }
            nextTurn();
        }
    }
    // 土地自己擁有：升級 (最高3星)
    else if (cell.owner.id === player.id) {
        const upgradeCost = Math.floor(cell.price * 0.6);
        if (cell.level >= 3) {
            document.getElementById("turn-instruction").innerHTML = `🏰 您的 <b>${cell.name}</b> 已經是最高級 3 星城堡囉！`;
            setTimeout(nextTurn, 2000);
            return;
        }

        if (player.isAi) {
            if (player.cash >= upgradeCost * 1.5) {
                upgradeProperty(player, cell, upgradeCost);
            } else {
                document.getElementById("turn-instruction").innerHTML = `🏡 電腦 <b>${player.name}</b> 決定不升級 <b>${cell.name}</b>。`;
            }
            setTimeout(nextTurn, 2000);
        } else {
            const upgrade = await showCustomDialog({ title: "🏰 升級城堡", message: `這塊地是您的！是否要花費 💰 ${upgradeCost} 元將 【${cell.name}】 升級為 ${cell.level + 1} 星城堡？<br>(提升星等會大幅增加過路費喔！)`, type: "confirm" });
            if (upgrade) {
                if (player.cash >= upgradeCost) {
                    upgradeProperty(player, cell, upgradeCost);
                } else {
                    await showCustomDialog({ message: "現金不足以升級城堡！" });
                }
            }
            nextTurn();
        }
    }
    // 土地別人擁有：支付過路費
    else {
        const owner = cell.owner;
        if (owner.bankrupt) {
            nextTurn();
            return;
        }

        // 計算過路費 (星級加成)
        let rent = cell.baseRent;
        if (cell.level === 1) rent = Math.floor(rent * 1.8);
        else if (cell.level === 2) rent = Math.floor(rent * 3.0);
        else if (cell.level === 3) rent = Math.floor(rent * 5.0);

        // 檢查護盾狀態
        if (player.shieldsActive > 0) {
            player.shieldsActive--;
            document.getElementById("turn-instruction").innerHTML = `🛡️ 魔法護盾自動生效！成功幫 <b>${player.name}</b> 抵擋了支付給 <b>${owner.name}</b> 的 💰 ${rent} 元過路費！`;
            SoundEngine.playCheer();
            updatePlayDashboard();
            setTimeout(nextTurn, 3000);
            return;
        }

        // 扣除並支付過路費
        player.cash -= rent;
        owner.cash += rent;
        document.getElementById("turn-instruction").innerHTML = `💸 踩到 <b>${owner.name}</b> 的地盤！支付了過路費 💰 ${rent} 元！`;
        SoundEngine.playBuzzer();
        
        updatePlayDashboard();
        
        // 檢查是否破產
        if (player.cash < 0) {
            await handleBankruptcy(player, owner);
        } else {
            setTimeout(nextTurn, 2500);
        }
    }
}

function buyProperty(player, cell) {
    player.cash -= cell.price;
    cell.owner = player;
    cell.level = 0;
    
    // 更新棋盤格標示
    const indicator = document.getElementById(`owner-ind-${cell.id}`);
    indicator.style.display = "block";
    indicator.style.backgroundColor = player.color;

    document.getElementById("turn-instruction").innerHTML = `🎉 恭喜 <b>${player.name}</b> 成功購得地產 <b>${cell.name}</b>！`;
    SoundEngine.playCoin();
    updatePlayDashboard();
}

function upgradeProperty(player, cell, cost) {
    player.cash -= cost;
    cell.level++;
    
    // 在格子加上星星
    const starContainer = document.getElementById(`stars-${cell.id}`);
    starContainer.innerHTML = "";
    for (let s = 0; s < cell.level; s++) {
        starContainer.innerHTML += "⭐";
    }

    document.getElementById("turn-instruction").innerHTML = `🏰 <b>${player.name}</b> 將 <b>${cell.name}</b> 升級為 ${cell.level} 星城堡！`;
    SoundEngine.playCheer();
    updatePlayDashboard();
}

// 2. 納稅捐款處理
async function handleLandOnTax(player) {
    const taxAmount = Math.floor(player.cash * 0.1); // 資金10%
    if (player.isAi) {
        // AI 隨機決定捐款或納稅
        if (Math.random() > 0.5) {
            player.cash -= 150;
            document.getElementById("turn-instruction").innerHTML = `🏛️ 電腦 <b>${player.name}</b> 選擇了向慈善愛心基金捐贈 💰 150 元！`;
            SoundEngine.playCheer();
        } else {
            player.cash -= taxAmount;
            document.getElementById("turn-instruction").innerHTML = `🏛️ 電腦 <b>${player.name}</b> 乖乖依法繳交所得稅 💰 ${taxAmount} 元！`;
            SoundEngine.playBuzzer();
        }
        updatePlayDashboard();
        // 檢查破產
        if (player.cash < 0) await handleBankruptcy(player, null);
        else setTimeout(nextTurn, 2500);
    } else {
        const choice = await showCustomDialog({ title: "🏛️ 納稅捐款處", message: `您來到了理財納稅處，請選擇：<br>【確定】 捐款 150 元做公益慈善（可獲得好人標章，未來免稅一次）<br>【取消】 依法繳納當前現金 10% 的稅金（應繳 💰 ${taxAmount} 元）`, type: "confirm" });
        if (choice) {
            player.cash -= 150;
            await showCustomDialog({ message: "謝謝您的善心捐款！社會因您而更美麗！" });
            SoundEngine.playCheer();
        } else {
            player.cash -= taxAmount;
            await showCustomDialog({ message: `您已繳交 💰 ${taxAmount} 元的稅金！` });
            SoundEngine.playBuzzer();
        }
        updatePlayDashboard();
        if (player.cash < 0) {
            await handleBankruptcy(player, null);
        } else {
            nextTurn();
        }
    }
}

// 3. 益智問答格處理
let activeQuizQuestion = null;
let quizTimerInterval = null;
let quizTimeLeft = 100; // 百分比

async function handleLandOnQuiz(player, type) {
    // 獲取適用題庫
    const allQuestions = [...DefaultQuestions, ...GameState.customQuestions];
    let pool = allQuestions;

    if (GameState.gradeMode !== "all") {
        pool = allQuestions.filter(q => q.grade === GameState.gradeMode);
    }
    
    // 如果是數學挑戰格，優先過濾數學題
    if (type === "math_quiz") {
        const mathPool = pool.filter(q => q.subject === "math");
        if (mathPool.length > 0) pool = mathPool;
    }

    if (pool.length === 0) pool = allQuestions; // 保底

    // 隨機抽一題
    activeQuizQuestion = pool[Math.floor(Math.random() * pool.length)];

    // 題目標籤與獎勵金額
    const reward = type === "all_quiz" ? 300 : 150;
    let subjectName = "全科綜合挑戰";
    if (activeQuizQuestion.subject === "math") subjectName = "數學大挑戰 📐";
    else if (activeQuizQuestion.subject === "chinese") subjectName = "國語字音成語 ✍️";
    else if (activeQuizQuestion.subject === "english") subjectName = "英文單字考驗 🔠";
    else if (activeQuizQuestion.subject === "science") subjectName = "自然科學大驚奇 🔬";
    else if (activeQuizQuestion.subject === "social") subjectName = "生活社會常識 🌍";

    document.getElementById("challenge-subject").textContent = subjectName;
    document.getElementById("challenge-text").textContent = activeQuizQuestion.text;
    document.getElementById("challenge-reward").textContent = reward;

    const optContainer = document.getElementById("challenge-options");
    optContainer.innerHTML = "";

    const optionLabels = ["A", "B", "C", "D"];
    activeQuizQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<b style="font-size:1.2rem; color:var(--primary-blue);">${optionLabels[idx]}.</b> ${opt}`;
        
        if (!player.isAi) {
            btn.addEventListener("click", async () => await checkQuizAnswer(optionLabels[idx], player, reward));
        }
        optContainer.appendChild(btn);
    });

    openModal("modal-challenge");

    // 啟動時間條 (小學生思考時間 20 秒)
    quizTimeLeft = 100;
    document.getElementById("challenge-timer-bar").style.width = "100%";
    
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    
    quizTimerInterval = setInterval(async () => {
        quizTimeLeft -= 1.0; // 每 200ms 降 1% (共 20 秒)
        document.getElementById("challenge-timer-bar").style.width = `${quizTimeLeft}%`;

        if (quizTimeLeft <= 0) {
            clearInterval(quizTimerInterval);
            // 時間到，未答視同答錯
            if (player.isAi) {
                // AI 自動回答
                aiQuizSolve(player, reward);
            } else {
                closeModal("modal-challenge");
                await showCustomDialog({ message: "超時啦！很遺憾沒有拿到獎金喔！" });
                nextTurn();
            }
        }
    }, 200);

    // 如果是 AI，讓它隨機在 2~4 秒後做出作答
    if (player.isAi) {
        const aiSolveTime = 2000 + Math.random() * 2000;
        setTimeout(() => {
            clearInterval(quizTimerInterval);
            aiQuizSolve(player, reward);
        }, aiSolveTime);
    }
}

function aiQuizSolve(player, reward) {
    // 電腦答對機率 70%
    const isCorrect = Math.random() < 0.7;
    const correctAns = activeQuizQuestion.answer;
    
    let chosen = correctAns;
    if (!isCorrect) {
        // 選個錯的
        const wrongOpts = ["A", "B", "C", "D"].filter(o => o !== correctAns);
        chosen = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
    }

    // 標記 UI 選項
    const btns = document.querySelectorAll(".option-btn");
    const optionLabels = ["A", "B", "C", "D"];
    const chosenIdx = optionLabels.indexOf(chosen);
    
    if (isCorrect) {
        btns[chosenIdx].classList.add("correct");
        player.cash += reward;
        SoundEngine.playCheer();
        ConfettiEffect.spawn(20);
    } else {
        btns[chosenIdx].classList.add("wrong");
        SoundEngine.playBuzzer();
    }

    updatePlayDashboard();

    setTimeout(() => {
        closeModal("modal-challenge");
        nextTurn();
    }, 1500);
}

async function checkQuizAnswer(selectedLetter, player, reward) {
    clearInterval(quizTimerInterval);
    const btns = document.querySelectorAll(".option-btn");
    const optionLabels = ["A", "B", "C", "D"];
    const selectedIdx = optionLabels.indexOf(selectedLetter);
    const correctIdx = optionLabels.indexOf(activeQuizQuestion.answer);

    if (selectedLetter === activeQuizQuestion.answer) {
        btns[selectedIdx].classList.add("correct");
        player.cash += reward;
        SoundEngine.playCheer();
        ConfettiEffect.spawn(30);
        triggerCoinRain(); // 啟動金幣雨互動小活動！
        updatePlayDashboard();
        setTimeout(() => {
            closeModal("modal-challenge");
            nextTurn();
        }, 1500);
    } else {
        btns[selectedIdx].classList.add("wrong");
        btns[correctIdx].classList.add("correct"); // 顯示正確答案
        SoundEngine.playBuzzer();
        setTimeout(async () => {
            closeModal("modal-challenge");
            await showCustomDialog({ message: `答錯囉！正確答案是：${activeQuizQuestion.answer}` });
            nextTurn();
        }, 2000);
    }
}

// 4. 淘氣小惡魔事件
function handleLandOnImp(player) {
    SoundEngine.playBuzzer();
    
    const penaltyTypes = [
        { desc: "踩到香蕉皮，被迫往後退了 3 步！", action: () => movePlayerBackstep(player, 3) },
        { desc: "小惡魔偷偷把你的 1 張魔法道具卡拿去變賣，痛失寶物！", action: () => confiscateItem(player) },
        { desc: "小惡魔對你做鬼臉，你嚇了一跳跌倒，暫停一回合！", action: () => { player.restTurn = 1; setTimeout(nextTurn, 2500); } },
        { desc: "小惡魔強行向你收取保護費 💰 150 元！", action: () => { player.cash -= 150; updatePlayDashboard(); if (player.cash < 0) handleBankruptcy(player, null); else setTimeout(nextTurn, 2500); } }
    ];

    const penalty = penaltyTypes[Math.floor(Math.random() * penaltyTypes.length)];
    document.getElementById("turn-instruction").innerHTML = `😈 遇上了淘氣小惡魔！<br><span style="color:var(--primary-red); font-weight:900;">${penalty.desc}</span>`;
    
    setTimeout(() => {
        penalty.action();
    }, 1800);
}

function movePlayerBackstep(player, steps) {
    let currentStep = 0;
    function backStep() {
        if (currentStep >= steps) {
            landOnCellAction(player); // 重新觸發退回格子的效果
            return;
        }
        player.position = (player.position - 1 + 36) % 36;
        currentStep++;
        SoundEngine.playMove();
        renderPlayerTokens();
        setTimeout(backStep, 250);
    }
    backStep();
}

function confiscateItem(player) {
    const itemKeys = Object.keys(player.items).filter(k => player.items[k] > 0);
    if (itemKeys.length > 0) {
        const randKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        player.items[randKey]--;
        updatePlayDashboard();
    }
    setTimeout(nextTurn, 2000);
}

// 5. 魔法商店
function handleLandOnShop(player) {
    document.getElementById("shop-player-cash").textContent = player.cash;
    
    if (player.isAi) {
        // AI 自動購買 (如果金幣足夠，有 70% 機率隨機買 1-2 個道具)
        const possibleItems = ["remote", "shield", "speed", "trap"];
        const buyCount = Math.floor(Math.random() * 2) + 1; // 買1-2個
        for (let i = 0; i < buyCount; i++) {
            const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            const price = getItemPrice(item);
            if (player.cash >= price + 200) { // 留點保險金
                player.cash -= price;
                player.items[item] = (player.items[item] || 0) + 1;
            }
        }
        updatePlayDashboard();
        document.getElementById("turn-instruction").innerHTML = `🧹 電腦 <b>${player.name}</b> 悄悄進入魔法商店採購完成！`;
        setTimeout(nextTurn, 2000);
    } else {
        openModal("modal-shop");
        // 玩家購物由彈窗手動按鈕處理，按鈕內關閉彈窗後手動點擊 nextTurn 即可
        // 為了確保流暢性，魔法商店格在關閉時才進行下一回合
        const shopModal = document.getElementById("modal-shop");
        const closeHandler = () => {
            shopModal.querySelector(".close-btn").removeEventListener("click", closeHandler);
            nextTurn();
        };
        shopModal.querySelector(".close-btn").addEventListener("click", closeHandler);
    }
}

function getItemPrice(itemKey) {
    if (itemKey === "remote") return 150;
    if (itemKey === "shield") return 200;
    if (itemKey === "speed") return 100;
    if (itemKey === "trap") return 120;
    return 999;
}

async function buyItem(itemKey) {
    const player = GameState.players[GameState.activePlayerIdx];
    const price = getItemPrice(itemKey);
    
    if (player.cash >= price) {
        player.cash -= price;
        player.items[itemKey] = (player.items[itemKey] || 0) + 1;
        document.getElementById("shop-player-cash").textContent = player.cash;
        updatePlayDashboard();
        SoundEngine.playCoin();
        ConfettiEffect.spawn(10);
        await showCustomDialog({ message: `成功購買了一張 【${itemKey === 'remote' ? '遙控骰子' : itemKey === 'shield' ? '免稅盾牌' : itemKey === 'speed' ? '雙倍加速' : '陷阱卡'}】 魔法卡！` });
    } else {
        await showCustomDialog({ message: "金幣不夠了！快去答題挑戰賺金幣吧！" });
    }
}

// 6. 幸運大轉盤
const WheelSlices = [
    { text: "金幣 +300", effect: (p) => { p.cash += 300; SoundEngine.playCheer(); ConfettiEffect.spawn(20); triggerCoinRain(); } },
    { text: "獲得遙控骰子", effect: (p) => { p.items.remote++; SoundEngine.playCheer(); } },
    { text: "金幣 -150", effect: (p) => { p.cash -= 150; SoundEngine.playBuzzer(); if (p.cash < 0) handleBankruptcy(p, null); } },
    { text: "獲得免稅盾牌", effect: (p) => { p.items.shield++; SoundEngine.playCheer(); } },
    { text: "抽取命運卡", effect: (p) => { triggerDestinyCardDraw(p); } },
    { text: "前進 3 步", effect: (p) => { movePlayerStepByStep(p, 3); } },
    { text: "金幣 +100", effect: (p) => { p.cash += 100; SoundEngine.playCoin(); triggerCoinRain(); } },
    { text: "獲得加速卡", effect: (p) => { p.items.speed++; SoundEngine.playCheer(); } }
];

function drawLuckyWheelCanvas() {
    const canvas = document.getElementById("wheel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const colors = ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#BFFCC6", "#FFC6FF", "#D6E4FF", "#FFF9E6", "#C7CEEA"];
    const arc = Math.PI / 4; // 8等份
    
    const size = canvas.width; // 420
    const center = size / 2;   // 210
    const radius = center - 15; // 195
    
    ctx.clearRect(0, 0, size, size);
    
    ctx.save();
    ctx.translate(center, center);
    
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(0, 0, radius, i * arc, (i + 1) * arc, false);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        
        // 寫文字
        ctx.save();
        ctx.fillStyle = "#000000";
        ctx.font = "bold 19px 'Microsoft JhengHei', '微軟正黑體', sans-serif";
        ctx.rotate(i * arc + arc / 2);
        ctx.textAlign = "right";
        ctx.fillText(WheelSlices[i].text, radius - 20, 6);
        ctx.restore();
    }
    ctx.restore();
}

function handleLandOnWheel(player) {
    openModal("modal-wheel");
    document.getElementById("wheel-result").textContent = "";
    document.getElementById("btn-spin-wheel").style.display = "block";
    document.getElementById("btn-close-wheel").style.display = "none";
    
    // 如果是 AI 玩家，2 秒後自動點擊旋轉
    if (player.isAi) {
        setTimeout(spinWheelAction, 1500);
    } else {
        document.getElementById("btn-spin-wheel").onclick = spinWheelAction;
    }
}

function spinWheelAction() {
    document.getElementById("btn-spin-wheel").style.display = "none";
    const wheel = document.getElementById("lucky-wheel");
    
    // 旋轉圈數
    const randomSlice = Math.floor(Math.random() * 8);
    // 計算角度使得指針（上方 90度/-90度對齊）
    // 指針在上方(12點鐘)，即 -90 度。Canvas 畫 0 度在 3 點鐘。
    // 指針對應 slice 需要計算對應偏移
    const sliceAngle = 360 / 8;
    const targetDeg = 360 * 5 - (randomSlice * sliceAngle) - 22.5; // 多轉5圈

    wheel.style.transform = `rotate(${targetDeg}deg)`;
    SoundEngine.playRoll();

    setTimeout(() => {
        const player = GameState.players[GameState.activePlayerIdx];
        const slice = WheelSlices[randomSlice];
        
        document.getElementById("wheel-result").textContent = `✨ 恭喜抽中：${slice.text}！`;
        
        // 執行轉盤效果
        slice.effect(player);
        updatePlayDashboard();

        // 轉盤抽完之後關閉
        if (player.isAi) {
            setTimeout(() => {
                closeModal("modal-wheel");
                wheel.style.transform = "rotate(0deg)";
                // 如果是命運卡或前進步數，這些子程序會自己引導 nextTurn，其餘的則在此前進
                if (slice.text !== "抽取命運卡" && slice.text !== "前進 3 步") {
                    nextTurn();
                }
            }, 2000);
        } else {
            const btnClose = document.getElementById("btn-close-wheel");
            btnClose.style.display = "block";
            btnClose.onclick = () => {
                closeModal("modal-wheel");
                wheel.style.transform = "rotate(0deg)";
                if (slice.text !== "抽取命運卡" && slice.text !== "前進 3 步") {
                    nextTurn();
                }
            };
        }
    }, 4100);
}

// 7. 命運卡抽取
function triggerDestinyCardDraw(player) {
    openModal("modal-card");
    document.getElementById("btn-close-card").style.display = "none";
    
    const cardInner = document.getElementById("card-inner");
    cardInner.classList.remove("flipped");

    const hintEl = document.getElementById("card-draw-hint");
    
    // 隨機抽卡
    const card = DestinyCards[Math.floor(Math.random() * DestinyCards.length)];
    
    document.getElementById("card-emoji").textContent = card.emoji;
    document.getElementById("card-title").textContent = card.title;
    document.getElementById("card-description").textContent = card.desc;

    // 複製節點以清除先前的事件監聽器
    const newCardInner = cardInner.cloneNode(true);
    cardInner.parentNode.replaceChild(newCardInner, cardInner);

    if (player.isAi) {
        hintEl.textContent = "💻 電腦正在抽取命運卡...";
        setTimeout(() => {
            newCardInner.classList.add("flipped");
            SoundEngine.playFlip();
            SoundEngine.playCheer();
            executeDestinyCardEffect(player, card);
            
            setTimeout(() => {
                closeModal("modal-card");
                nextTurn();
            }, 2500);
        }, 1500);
    } else {
        hintEl.textContent = "👉 點擊卡片翻開你的命運！";
        
        newCardInner.addEventListener("click", () => {
            if (newCardInner.classList.contains("flipped")) return;
            
            newCardInner.classList.add("flipped");
            SoundEngine.playFlip();
            SoundEngine.playCheer();
            hintEl.textContent = "✨ 命運降臨！";
            
            // 執行卡片效果
            executeDestinyCardEffect(player, card);

            // 1 秒後顯示確定收下按鈕
            setTimeout(() => {
                const closeBtn = document.getElementById("btn-close-card");
                closeBtn.style.display = "block";
                closeBtn.onclick = () => {
                    closeModal("modal-card");
                    nextTurn();
                };
            }, 1000);
        });
    }
}

function executeDestinyCardEffect(player, card) {
    switch (card.type) {
        case "cash":
            player.cash += card.value;
            if (card.value > 0) {
                SoundEngine.playCoin();
                triggerCoinRain(); // 啟動互動金幣雨！
            } else {
                SoundEngine.playBuzzer();
                if (player.cash < 0) handleBankruptcy(player, null);
            }
            break;
            
        case "item":
            player.items[card.value] = (player.items[card.value] || 0) + 1;
            break;
            
        case "rest":
            player.restTurn = card.value;
            break;

        case "backstep":
            // 延後執行，避免卡片未關閉就移動
            setTimeout(() => movePlayerBackstep(player, card.value), 2000);
            break;

        case "teleport":
            const randPos = Math.floor(Math.random() * 36);
            setTimeout(() => {
                player.position = randPos;
                renderPlayerTokens();
                landOnCellAction(player);
            }, 2000);
            break;

        case "distribute":
            // 分配金幣
            GameState.players.forEach(p => {
                if (p.id !== player.id && !p.bankrupt) {
                    player.cash += card.value; // card.value 爲負數
                    p.cash -= card.value;
                }
            });
            updatePlayDashboard();
            break;

        case "collect":
            // 收集金幣
            GameState.players.forEach(p => {
                if (p.id !== player.id && !p.bankrupt) {
                    player.cash += card.value;
                    p.cash -= card.value;
                }
            });
            updatePlayDashboard();
            break;

        case "teleport_p":
            // 隨機傳送到其他玩家位置
            const list = GameState.players.filter(p => p.id !== player.id && !p.bankrupt);
            if (list.length > 0) {
                const targetP = list[Math.floor(Math.random() * list.length)];
                setTimeout(() => {
                    player.position = targetP.position;
                    renderPlayerTokens();
                    landOnCellAction(player);
                }, 2000);
            }
            break;

        case "swap_prop":
            // 交換最有價值地產
            const activeProperties = GameState.boardCells.filter(c => c.owner && c.owner.id !== player.id);
            if (activeProperties.length > 0) {
                // 找出價格最高的地產
                activeProperties.sort((a,b) => b.price - a.price);
                const targetProp = activeProperties[0];
                const targetOwner = targetProp.owner;
                
                // 換成自己的
                targetProp.owner = player;
                document.getElementById(`owner-ind-${targetProp.id}`).style.backgroundColor = player.color;
                
                // 找一個自己的普通土地給對方 (若有)
                const myProperties = GameState.boardCells.filter(c => c.owner && c.owner.id === player.id && c.id !== targetProp.id);
                if (myProperties.length > 0) {
                    const myProp = myProperties[0];
                    myProp.owner = targetOwner;
                    document.getElementById(`owner-ind-${myProp.id}`).style.backgroundColor = targetOwner.color;
                }
            }
            break;
    }
    updatePlayDashboard();
}

// ==================== 破產處理機制 ====================
async function handleBankruptcy(player, receiver) {
    player.bankrupt = true;
    player.cash = 0;
    
    // 退還所有地產產權
    GameState.boardCells.forEach(cell => {
        if (cell.owner && cell.owner.id === player.id) {
            if (receiver) {
                // 如果是被別人收取租金破產，地產過戶給對方
                cell.owner = receiver;
                document.getElementById(`owner-ind-${cell.id}`).style.backgroundColor = receiver.color;
            } else {
                // 否則收回國有，清空星星與標示
                cell.owner = null;
                cell.level = 0;
                document.getElementById(`owner-ind-${cell.id}`).style.display = "none";
                document.getElementById(`stars-${cell.id}`).innerHTML = "";
            }
        }
    });

    await showCustomDialog({ message: `💸 很遺憾，【${player.name}】 破產了！` });
    SoundEngine.playBuzzer();
    updatePlayDashboard();
    renderPlayerTokens();

    // 檢查剩餘存活人數
    const activePlayers = GameState.players.filter(p => !p.bankrupt);
    
    // 如果開啟破產即結束，或只剩下一人
    if (GameState.bankruptcyEnabled || activePlayers.length <= 1) {
        endGame("破產結束");
    } else {
        setTimeout(nextTurn, 2500);
    }
}

// ==================== 遊戲結束與結算排行榜 ====================
function endGameDueToTime() {
    endGame("限時時間到");
}

function endGame(reason) {
    GameState.gameStarted = false;
    if (GameState.gameTimerInterval) clearInterval(GameState.gameTimerInterval);

    document.getElementById("gameover-reason").innerHTML = `🔔 <b>遊戲結束原因：</b>${reason}<br>太棒了！小朋友們都學會了如何理財喔！`;
    
    // 計算總資產 (現金 + 地產總值)
    const rankingList = GameState.players.map(p => {
        let totalPropValue = 0;
        GameState.boardCells.forEach(c => {
            if (c.owner && c.owner.id === p.id) {
                totalPropValue += c.price; // 地產原價
                if (c.level > 0) {
                    totalPropValue += Math.floor(c.price * 0.6 * c.level); // 加上升級城堡花費
                }
            }
        });

        return {
            name: p.name,
            avatarEmoji: p.avatarEmoji,
            avatarImg: p.avatarImg,
            color: p.color,
            wealth: p.bankrupt ? 0 : p.cash + totalPropValue,
            bankrupt: p.bankrupt
        };
    });

    // 排序
    rankingList.sort((a, b) => b.wealth - a.wealth);

    const rankContainer = document.getElementById("rank-list");
    rankContainer.innerHTML = "";

    rankingList.forEach((r, idx) => {
        const item = document.createElement("div");
        item.className = `rank-item rank-${idx + 1}`;
        
        let avatarContent = r.avatarImg ? `<img src="${r.avatarImg}" alt="${r.name}">` : `<span class="avatar-emoji">${r.avatarEmoji}</span>`;
        let rankLabel = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`;

        item.innerHTML = `
            <span class="rank-num">${rankLabel}</span>
            <div class="rank-avatar">${avatarContent}</div>
            <span class="rank-name">${r.name}${r.bankrupt ? ' (破產)' : ''}</span>
            <span class="rank-wealth">💰 ${r.wealth} 元</span>
        `;
        rankContainer.appendChild(item);
    });

    openModal("modal-gameover");
    SoundEngine.playCheer();
    ConfettiEffect.spawn(150);
}

function restartGame() {
    closeModal("modal-gameover");
    document.getElementById("play-view").classList.remove("active");
    document.getElementById("setup-view").classList.add("active");
    
    // 清空棋盤
    const board = document.getElementById("board");
    const oldCells = board.querySelectorAll('.board-cell');
    oldCells.forEach(c => c.remove());
}

// ==================== 本地儲存與存檔載入功能 ====================
function saveGameAuto() {
    if (!GameState.gameStarted) return;
    const data = getSerializedGameState();
    localStorage.setItem("monopoly_autosave", JSON.stringify(data));
}

async function saveGameData() {
    const saveName = await showCustomDialog({ title: "💾 儲存檔案", message: "請輸入此存檔的備註名稱（例如：與媽媽的冒險）：", type: "prompt", defaultInput: `存檔 ${new Date().toLocaleString()}` });
    if (!saveName) return;

    const data = getSerializedGameState();
    data.saveName = saveName;
    data.saveTime = Date.now();

    const saves = JSON.parse(localStorage.getItem("monopoly_saves") || "[]");
    saves.push(data);
    localStorage.setItem("monopoly_saves", JSON.stringify(saves));
    await showCustomDialog({ message: "遊戲存檔成功！" });
    
    renderLocalSavesList();
    syncToFirebaseCloud();
}

function getSerializedGameState() {
    // 過濾可能導致循環參照的玩家引用
    const boardCellsData = GameState.boardCells.map(c => ({
        id: c.id,
        ownerId: c.owner ? c.owner.id : null,
        level: c.level
    }));

    return {
        players: GameState.players,
        activePlayerIdx: GameState.activePlayerIdx,
        round: GameState.round,
        diceMode: GameState.diceMode,
        gradeMode: GameState.gradeMode,
        timeLimitEnabled: GameState.timeLimitEnabled,
        timeLimitMin: GameState.timeLimitMin,
        timeLeftSec: GameState.timeLeftSec,
        bankruptcyEnabled: GameState.bankruptcyEnabled,
        boardCells: boardCellsData,
        placedTraps: GameState.placedTraps
    };
}

async function loadGameData(saveIdx = -1) {
    let targetData = null;
    if (saveIdx === -1) {
        // 載入自動存檔
        const saved = localStorage.getItem("monopoly_autosave");
        if (saved) targetData = JSON.parse(saved);
        else {
            await showCustomDialog({ message: "找不到自動存檔！" });
            return;
        }
    } else {
        const saves = JSON.parse(localStorage.getItem("monopoly_saves") || "[]");
        targetData = saves[saveIdx];
    }

    if (!targetData) return;

    // 恢復狀態
    GameState.round = targetData.round;
    GameState.activePlayerIdx = targetData.activePlayerIdx;
    GameState.diceMode = targetData.diceMode;
    GameState.gradeMode = targetData.gradeMode;
    GameState.timeLimitEnabled = targetData.timeLimitEnabled;
    GameState.timeLimitMin = targetData.timeLimitMin;
    GameState.timeLeftSec = targetData.timeLeftSec;
    GameState.bankruptcyEnabled = targetData.bankruptcyEnabled;
    GameState.placedTraps = targetData.placedTraps || {};

    // 恢復玩家資料
    GameState.players = targetData.players;

    // 恢復棋盤與地產產權
    setupBoardCells();
    targetData.boardCells.forEach(cellData => {
        const c = GameState.boardCells[cellData.id];
        c.level = cellData.level;
        if (cellData.ownerId) {
            c.owner = GameState.players.find(p => p.id === cellData.ownerId);
            // 更新星星與地產顏色標示
            const indicator = document.getElementById(`owner-ind-${c.id}`);
            if (indicator && c.owner) {
                indicator.style.display = "block";
                indicator.style.backgroundColor = c.owner.color;
            }
            const starContainer = document.getElementById(`stars-${c.id}`);
            if (starContainer && c.level > 0) {
                starContainer.innerHTML = "";
                for (let s = 0; s < c.level; s++) {
                    starContainer.innerHTML += "⭐";
                }
            }
        }
    });

    GameState.gameStarted = true;

    // 更新介面
    document.getElementById("setup-view").classList.remove("active");
    document.getElementById("play-view").classList.add("active");

    if (GameState.timeLimitEnabled) {
        document.getElementById("time-limit-badge").style.display = "flex";
        startCountdownTimer();
    } else {
        document.getElementById("time-limit-badge").style.display = "none";
    }

    // 隱藏不必要的骰子 (若是單骰子模式)
    if (GameState.diceMode === 'single') {
        document.getElementById("dice-container-2").style.display = "none";
    } else {
        document.getElementById("dice-container-2").style.display = "block";
    }

    updatePlayDashboard();
    renderPlayerTokens();
    
    closeModal("modal-settings");
    await showCustomDialog({ message: "遊戲存檔載入成功！" });
    startTurn();
}

function renderLocalSavesList() {
    const container = document.getElementById("local-saves-list");
    container.innerHTML = "";
    const saves = JSON.parse(localStorage.getItem("monopoly_saves") || "[]");
    
    if (saves.length === 0) {
        container.innerHTML = `<p class="text-muted">尚無存檔記錄</p>`;
        return;
    }

    saves.forEach((s, idx) => {
        const item = document.createElement("div");
        item.className = "save-item";
        item.innerHTML = `
            <div>
                <div><b>${s.saveName}</b></div>
                <div style="font-size: 0.75rem; color:#64748B;">回合: ${s.round} | 玩家數: ${s.players.length}</div>
            </div>
            <button class="btn secondary" style="padding: 3px 8px; font-size:0.85rem;" onclick="loadGameData(${idx})">載入</button>
        `;
        container.appendChild(item);
    });
}

// ==================== 自選 Firebase 雲端同步 (資安安心方案) ====================
function toggleFirebaseFields() {
    const enabled = document.getElementById("chk-enable-firebase").checked;
    document.getElementById("firebase-config-fields").style.display = enabled ? "block" : "none";
}

function saveFirebaseConfig() {
    const apiKey = document.getElementById("fb-apiKey").value.trim();
    const authDomain = document.getElementById("fb-authDomain").value.trim();
    const projectId = document.getElementById("fb-projectId").value.trim();
    const storageBucket = document.getElementById("fb-storageBucket").value.trim();
    const messagingSenderId = document.getElementById("fb-messagingSenderId").value.trim();
    const appId = document.getElementById("fb-appId").value.trim();

    if (!apiKey || !projectId || !appId) {
        alert("請至少填寫 API Key, Project ID 與 App ID！");
        return;
    }

    const config = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
    localStorage.setItem("fb_config", JSON.stringify(config));
    GameState.firebaseEnabled = true;
    GameState.firebaseConfig = config;

    // 動態載入 Firebase 腳本並建立連接
    initializeFirebaseCloud();
}

let firebaseApp = null;
let firestoreDb = null;

function initializeFirebaseCloud() {
    const configStr = localStorage.getItem("fb_config");
    if (!configStr) return;

    const config = JSON.parse(configStr);
    GameState.firebaseConfig = config;
    GameState.firebaseEnabled = true;
    
    document.getElementById("chk-enable-firebase").checked = true;
    document.getElementById("firebase-config-fields").style.display = "block";
    document.getElementById("fb-apiKey").value = config.apiKey || "";
    document.getElementById("fb-authDomain").value = config.authDomain || "";
    document.getElementById("fb-projectId").value = config.projectId || "";
    document.getElementById("fb-storageBucket").value = config.storageBucket || "";
    document.getElementById("fb-messagingSenderId").value = config.messagingSenderId || "";
    document.getElementById("fb-appId").value = config.appId || "";

    // 載入 Firebase compat 庫並初始化
    if (typeof firebase === 'undefined') {
        const scriptApp = document.createElement("script");
        scriptApp.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js";
        scriptApp.onload = () => {
            const scriptFs = document.createElement("script");
            scriptFs.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js";
            scriptFs.onload = () => {
                try {
                    if (!firebase.apps.length) {
                        firebase.initializeApp(config);
                    }
                    firestoreDb = firebase.firestore();
                    document.getElementById("fb-connection-status").textContent = "🔌 雲端已連線";
                    document.getElementById("fb-connection-status").className = "status-text text-success";
                    
                    // 執行首次同步 (拉取雲端題庫與存檔)
                    pullFromFirebaseCloud();
                } catch (e) {
                    console.error("Firebase 初始化失敗", e);
                    document.getElementById("fb-connection-status").textContent = "❌ 連線失敗";
                    document.getElementById("fb-connection-status").className = "status-text text-danger";
                }
            };
            document.head.appendChild(scriptFs);
        };
        document.head.appendChild(scriptApp);
    }
}

// 備份自訂題目與存檔到雲端 (玩家專屬資料庫，防資安問題)
function syncToFirebaseCloud() {
    if (!GameState.firebaseEnabled || !firestoreDb) return;

    const deviceId = getOrCreateDeviceId();
    
    // 1. 同步題庫
    firestoreDb.collection("custom_questions").doc(deviceId).set({
        questions: GameState.customQuestions,
        updatedAt: Date.now()
    }).catch(e => console.error("題庫雲端同步失敗", e));

    // 2. 同步存檔
    const saves = JSON.parse(localStorage.getItem("monopoly_saves") || "[]");
    firestoreDb.collection("saves").doc(deviceId).set({
        saves: saves,
        updatedAt: Date.now()
    }).catch(e => console.error("存檔雲端同步失敗", e));
}

// 從雲端拉取資料，合併到本地
function pullFromFirebaseCloud() {
    if (!GameState.firebaseEnabled || !firestoreDb) return;
    const deviceId = getOrCreateDeviceId();

    // 1. 拉取題庫
    firestoreDb.collection("custom_questions").doc(deviceId).get().then(doc => {
        if (doc.exists) {
            const cloudQs = doc.data().questions || [];
            if (cloudQs.length > GameState.customQuestions.length) {
                GameState.customQuestions = cloudQs;
                localStorage.setItem("custom_questions", JSON.stringify(GameState.customQuestions));
                renderQuestionList();
            }
        }
    });

    // 2. 拉取存檔
    firestoreDb.collection("saves").doc(deviceId).get().then(doc => {
        if (doc.exists) {
            const cloudSaves = doc.data().saves || [];
            const localSaves = JSON.parse(localStorage.getItem("monopoly_saves") || "[]");
            if (cloudSaves.length > localSaves.length) {
                localStorage.setItem("monopoly_saves", JSON.stringify(cloudSaves));
                renderLocalSavesList();
            }
        }
    });
}

function getOrCreateDeviceId() {
    let id = localStorage.getItem("monopoly_device_id");
    if (!id) {
        id = "device_" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("monopoly_device_id", id);
    }
    return id;
}

// ==================== 視窗 UI 控制 ====================
function openModal(id) {
    document.getElementById(id).classList.add("active");
    if (id === "modal-settings") {
        renderLocalSavesList();
        initializeFirebaseCloud(); // 重新檢查並顯示 Firebase 狀態
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove("active");
}

// 互動金幣雨小活動
function triggerCoinRain() {
    const activePlayer = GameState.players[GameState.activePlayerIdx];
    if (activePlayer.isAi) return; // 僅限真人玩家可以點擊收集！

    const coinCount = 12;
    const body = document.body;

    for (let i = 0; i < coinCount; i++) {
        const coin = document.createElement("div");
        coin.className = "falling-coin";
        coin.textContent = "🪙";
        coin.style.left = `${Math.random() * 85 + 5}vw`;
        coin.style.animationDelay = `${Math.random() * 1.5}s`;
        
        const scale = 0.8 + Math.random() * 0.5;
        coin.style.transform = `scale(${scale})`;

        // 點擊收集金幣，每點一個獲得 20 金幣
        coin.addEventListener("click", () => {
            activePlayer.cash += 20;
            updatePlayDashboard();
            SoundEngine.playCoin();
            
            // 飄浮字體提示
            const text = document.createElement("div");
            text.textContent = "+20";
            text.style.position = "fixed";
            text.style.left = coin.style.left;
            text.style.top = coin.getBoundingClientRect().top + "px";
            text.style.color = "var(--primary-yellow)";
            text.style.fontWeight = "900";
            text.style.fontSize = "1.8rem";
            text.style.pointerEvents = "none";
            text.style.zIndex = "10001";
            text.style.transition = "all 0.8s ease-out";
            text.style.fontFamily = "var(--font-heading)";
            body.appendChild(text);

            setTimeout(() => {
                text.style.transform = "translateY(-60px) scale(1.2)";
                text.style.opacity = "0";
            }, 50);
            setTimeout(() => text.remove(), 900);

            coin.remove();
        });

        body.appendChild(coin);

        // 動畫結束後自動銷毀
        const totalDuration = (2.5 + parseFloat(coin.style.animationDelay)) * 1000;
        setTimeout(() => {
            if (coin.parentNode) {
                coin.remove();
            }
        }, totalDuration);
    }
}
