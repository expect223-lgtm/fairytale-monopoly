<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>歡樂童話大富翁 - 繪本童話風格版</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts: Fredoka & Noto Sans TC for Storybook feel -->
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Noto+Sans+TC:wght@500;700;900&display=swap" rel="stylesheet">
    <!-- Canvas Confetti Fireworks Library -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Fredoka', 'Noto Sans TC', 'sans-serif'],
                    },
                    colors: {
                        storybookPaper: '#FDFBF7',
                        storybookYellow: '#FFE893',
                        storybookOrange: '#FF9E64',
                        storybookPink: '#FFB3C6',
                        storybookGreen: '#85E3B3',
                        storybookBlue: '#93C5FD',
                        storybookPurple: '#C4B5FD',
                    },
                    boxShadow: {
                        'storybook': '0 8px 0px rgba(180, 140, 100, 0.25), 0 15px 25px rgba(0,0,0,0.06)',
                        'storybook-sm': '0 4px 0px rgba(180, 140, 100, 0.2)',
                    }
                }
            }
        }
    </script>

    <style>
        body {
            background: linear-gradient(135deg, #fef9f3 0%, #fff1f5 50%, #f0f7ff 100%);
            background-attachment: fixed;
            touch-action: manipulation;
            user-select: none;
            overflow-x: hidden;
            font-family: 'Fredoka', 'Noto Sans TC', sans-serif;
        }

        /* 8x8 Board Layout - Maximized for Display */
        .board-grid {
            display: grid;
            grid-template-columns: repeat(8, minmax(0, 1fr));
            grid-template-rows: repeat(8, minmax(0, 1fr));
            gap: 6px;
            width: 100%;
            min-height: 520px;
        }

        .tile-0  { grid-column: 1; grid-row: 1; }
        .tile-1  { grid-column: 2; grid-row: 1; }
        .tile-2  { grid-column: 3; grid-row: 1; }
        .tile-3  { grid-column: 4; grid-row: 1; }
        .tile-4  { grid-column: 5; grid-row: 1; }
        .tile-5  { grid-column: 6; grid-row: 1; }
        .tile-6  { grid-column: 7; grid-row: 1; }
        .tile-7  { grid-column: 8; grid-row: 1; }
        
        .tile-8  { grid-column: 8; grid-row: 2; }
        .tile-9  { grid-column: 8; grid-row: 3; }
        .tile-10 { grid-column: 8; grid-row: 4; }
        .tile-11 { grid-column: 8; grid-row: 5; }
        .tile-12 { grid-column: 8; grid-row: 6; }
        .tile-13 { grid-column: 8; grid-row: 7; }
        
        .tile-14 { grid-column: 8; grid-row: 8; }
        .tile-15 { grid-column: 7; grid-row: 8; }
        .tile-16 { grid-column: 6; grid-row: 8; }
        .tile-17 { grid-column: 5; grid-row: 8; }
        .tile-18 { grid-column: 4; grid-row: 8; }
        .tile-19 { grid-column: 3; grid-row: 8; }
        .tile-20 { grid-column: 2; grid-row: 8; }
        .tile-21 { grid-column: 1; grid-row: 8; }

        .tile-22 { grid-column: 1; grid-row: 7; }
        .tile-23 { grid-column: 1; grid-row: 6; }
        .tile-24 { grid-column: 1; grid-row: 5; }
        .tile-25 { grid-column: 1; grid-row: 4; }
        .tile-26 { grid-column: 1; grid-row: 3; }
        .tile-27 { grid-column: 1; grid-row: 2; }

        .center-hub {
            grid-column: 2 / 8;
            grid-row: 2 / 8;
        }

        /* 3D Realistic Dice Styles - Enlarged & Enhanced Depth */
        .dice-scene {
            width: 110px;
            height: 110px;
            perspective: 800px;
            margin: 8px auto;
            filter: drop-shadow(0 12px 15px rgba(0,0,0,0.25));
        }

        .cube-dice {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .dice-face {
            position: absolute;
            width: 110px;
            height: 110px;
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            border: 5px solid #F59E0B;
            border-radius: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: 900;
            color: #7C3AED;
            box-shadow: inset 0 0 15px rgba(245, 158, 11, 0.2), inset -4px -4px 8px rgba(0,0,0,0.1);
            text-shadow: 2px 2px 0px rgba(255,255,255,1), -1px -1px 0px rgba(0,0,0,0.1);
        }

        .face-1 { transform: rotateY(0deg) translateZ(55px); }
        .face-2 { transform: rotateY(180deg) translateZ(55px); }
        .face-3 { transform: rotateY(-90deg) translateZ(55px); }
        .face-4 { transform: rotateY(90deg) translateZ(55px); }
        .face-5 { transform: rotateX(-90deg) translateZ(55px); }
        .face-6 { transform: rotateX(90deg) translateZ(55px); }

        /* Card Flip Animation for Fate/Chance */
        .card-container {
            perspective: 1000px;
        }
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
            transform-style: preserve-3d;
        }
        .card-container.flipped .card-inner {
            transform: rotateY(180deg);
        }
        .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 1.5rem;
        }
        .card-back {
            transform: rotateY(180deg);
        }

        .token-hop {
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        ::-webkit-scrollbar {
            height: 6px;
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #FF9E64;
            border-radius: 10px;
        }
    </style>
</head>
<body class="min-h-screen w-screen flex flex-col items-center justify-between p-2 sm:p-4 text-gray-800">

    <!-- Top Header Bar -->
    <header class="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl px-5 py-2.5 shadow-storybook flex justify-between items-center mb-2 border-4 border-amber-200/70 shrink-0">
        <div class="flex items-center gap-3">
            <span class="text-4xl sm:text-5xl animate-bounce">🎨</span>
            <div>
                <h1 class="text-2xl sm:text-3xl font-black text-amber-800 leading-tight tracking-wide">歡樂童話大富翁</h1>
                <p class="text-xs sm:text-sm text-amber-600/80 font-bold">溫馨手繪繪本風格．適合小朋友全家一起玩！</p>
            </div>
        </div>
        
        <div class="flex items-center gap-2 sm:gap-3">
            <button id="soundToggleBtn" onclick="toggleSound()" class="p-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-2xl font-bold shadow-storybook-sm transition transform active:scale-95" title="音效開關">
                <i class="fas fa-volume-up text-xl sm:text-2xl" id="soundIcon"></i>
            </button>
            <button onclick="openRulesModal()" class="p-2.5 bg-sky-400 hover:bg-sky-500 text-white rounded-2xl font-bold shadow-storybook-sm transition transform active:scale-95" title="遊戲說明">
                <i class="fas fa-book-open text-xl sm:text-2xl"></i>
            </button>
            <button onclick="resetGamePrompt()" class="px-4 py-2.5 bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-black shadow-storybook-sm text-sm sm:text-base transition transform active:scale-95 flex items-center gap-2">
                <i class="fas fa-sliders"></i> 遊戲設定
            </button>
        </div>
    </header>

    <!-- Main Game Section (Maximized Board) -->
    <main class="w-full max-w-6xl flex-1 flex flex-col items-center justify-center my-1">
        
        <!-- Full-Width Board Container matching header width -->
        <div class="w-full bg-amber-100/60 p-2 sm:p-3 rounded-3xl shadow-storybook border-4 border-amber-300 relative flex items-center justify-center">
            
            <div id="board" class="board-grid relative">
                <!-- 28 Tiles dynamically populated by JavaScript -->

                <!-- Center Control Hub -->
                <div class="center-hub bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-3 sm:p-4 border-4 border-amber-200 flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
                    
                    <!-- Turn Status Header -->
                    <div class="w-full text-center">
                        <div id="roundBadge" class="inline-block bg-purple-500 text-white text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-sm mb-1">
                            第 1 / 15 回合
                        </div>
                        <div id="currentPlayerBanner" class="flex items-center justify-center gap-2 bg-white/95 px-5 py-2 rounded-2xl shadow-md border-2 border-amber-200">
                            <span id="turnAvatar" class="text-3xl animate-bounce">🐰</span>
                            <span id="turnText" class="font-black text-lg sm:text-2xl text-amber-900">輪到 小兔🐰 囉！</span>
                        </div>
                    </div>

                    <!-- 3D Realistic Dice Area -->
                    <div class="flex flex-col items-center my-1">
                        <div class="dice-scene">
                            <div id="cubeDice" class="cube-dice">
                                <div class="dice-face face-1">1</div>
                                <div class="dice-face face-2">2</div>
                                <div class="dice-face face-3">3</div>
                                <div class="dice-face face-4">4</div>
                                <div class="dice-face face-5">5</div>
                                <div class="dice-face face-6">6</div>
                            </div>
                        </div>
                        <p id="diceResultText" class="text-xs sm:text-sm font-black text-purple-700 mt-1 h-5">點擊下方按鈕擲骰子！</p>
                    </div>

                    <!-- Items Quick Bar -->
                    <div id="activeItemsBar" class="flex gap-1.5 mb-1 min-h-[32px] items-center">
                        <!-- Dynamic items badges -->
                    </div>

                    <!-- Action Button -->
                    <button id="rollBtn" onclick="handleRollDice()" class="w-full max-w-[240px] py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white font-black text-lg sm:text-2xl rounded-2xl shadow-storybook-sm border-2 border-white transition transform active:scale-95 animate-pulse">
                        🎲 擲骰子！
                    </button>

                    <!-- Mini Status Message -->
                    <div id="miniLog" class="w-full bg-white/90 rounded-2xl p-2 text-xs sm:text-sm text-amber-900 font-bold text-center border-2 border-amber-100 flex items-center justify-center">
                        🎮 歡迎來到童話世界！點擊「擲骰子」開始冒險！
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Bottom Horizontal Player Bar (Side-by-side, No Side Log) -->
    <footer class="w-full max-w-6xl mt-2">
        <div id="playersContainer" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
            <!-- Player cards dynamically generated side-by-side -->
        </div>
    </footer>

    <!-- 1. Game Setup Modal -->
    <div id="setupModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-storybookPaper rounded-3xl p-6 max-w-lg w-full shadow-storybook border-4 border-amber-300 text-center max-h-[90vh] overflow-y-auto">
            <span class="text-5xl">👑</span>
            <h2 class="text-3xl font-black text-amber-900 mt-1">童話角色設定</h2>
            <p class="text-sm font-bold text-amber-700/80 mb-4">上傳小朋友的照片與輸入名字，打造專屬大富翁！</p>
            
            <div id="setupPlayersList" class="space-y-3 mb-4">
                <!-- Dynamic setup slots -->
            </div>

            <div class="grid grid-cols-1 gap-3 mb-5 text-left">
                <div class="bg-purple-50 p-3 rounded-2xl border-2 border-purple-200">
                    <label class="text-xs sm:text-sm font-black text-purple-800 block mb-1">🎯 獲勝條件目標：</label>
                    <select id="winConditionSelect" class="w-full bg-white border-2 border-purple-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-800 focus:outline-none focus:border-purple-500">
                        <option value="15">完成 15 回合後，金幣最多者獲勝</option>
                        <option value="20">完成 20 回合後，金幣最多者獲勝</option>
                        <option value="3000">率先賺取 3,000 金幣者獲勝</option>
                        <option value="5000">率先賺取 5,000 金幣者獲勝</option>
                    </select>
                </div>

                <div class="bg-sky-50 p-3 rounded-2xl border-2 border-sky-200">
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-xs sm:text-sm font-black text-sky-800">🧠 益智問答難度：</label>
                        <button type="button" onclick="openQuizManagerModal()" class="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl shadow-storybook-sm transition transform active:scale-95 flex items-center gap-1">
                            <i class="fas fa-edit"></i> ✏️ 自訂與管理題庫
                        </button>
                    </div>
                    <select id="quizLevelSelect" class="w-full bg-white border-2 border-sky-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-800 focus:outline-none focus:border-sky-500">
                        <option value="easy">🌱 低年級版 (1-2年級: 基礎算術/常識)</option>
                        <option value="hard" selected>🌿 中高年級版 (3-6年級: 乘除/成語/自然)</option>
                        <option value="mixed">🔥 綜合全科挑戰版 (全方位題庫)</option>
                    </select>
                </div>
            </div>

            <button onclick="startGame()" class="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black text-xl rounded-2xl shadow-storybook-sm border-2 border-white hover:from-emerald-500 hover:to-teal-600 transition transform active:scale-95">
                🚀 開始快樂遊戲！
            </button>
        </div>
    </div>

    <!-- 2. Wide Rules Teaching Modal (Figure 3 Optimization: Single line per item) -->
    <div id="rulesModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-6 sm:p-8 max-w-5xl w-full shadow-storybook border-4 border-sky-300 text-left">
            <h2 class="text-2xl sm:text-3xl font-black text-sky-800 mb-6 flex items-center gap-3">
                <i class="fas fa-book-open text-sky-600"></i> 遊戲規則教學
            </h2>
            
            <div class="space-y-4 mb-6 text-sm sm:text-base font-bold text-gray-800 overflow-x-auto">
                <div class="p-3 bg-sky-50 rounded-2xl border-2 border-sky-200 flex items-center gap-3 whitespace-nowrap">
                    <span class="text-2xl">🎲</span>
                    <span><strong>1. 擲骰子前進：</strong> 輪到你時點擊「擲骰子」，3D 立體骰子會滾動並帶你前進相應步數。</span>
                </div>
                <div class="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center gap-3 whitespace-nowrap">
                    <span class="text-2xl">🍦</span>
                    <span><strong>2. 買地與升級：</strong> 停在無人地產可購買；停在自己的地產可升級星級房屋，賺取更高的過路費！</span>
                </div>
                <div class="p-3 bg-rose-50 rounded-2xl border-2 border-rose-200 flex items-center gap-3 whitespace-nowrap">
                    <span class="text-2xl">🎴</span>
                    <span><strong>3. 命運與機會抽牌：</strong> 踩到命運或機會格可挑選蓋牌翻開，完成肢體小活動或獲得驚喜獎勵！</span>
                </div>
                <div class="p-3 bg-purple-50 rounded-2xl border-2 border-purple-200 flex items-center gap-3 whitespace-nowrap">
                    <span class="text-2xl">🧠</span>
                    <span><strong>4. 益智問答與轉盤：</strong> 踩到益智格回答小學生問題，或踩到轉盤格轉動幸運輪盤拿金幣！</span>
                </div>
                <div class="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-200 flex items-center gap-3 whitespace-nowrap">
                    <span class="text-2xl">🏆</span>
                    <span><strong>5. 獲勝條件：</strong> 達到設定的回合數或率先達到目標金幣金額者，即可奪得最終冠軍勝利！</span>
                </div>
            </div>

            <button onclick="closeModal('rulesModal')" class="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-lg sm:text-xl rounded-2xl shadow-storybook-sm transition transform active:scale-95">
                我知道了！開始玩吧！
            </button>
        </div>
    </div>

    <!-- 3. Interactive Fate/Chance Card Draw Modal -->
    <div id="cardDrawModal" class="fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-6 max-w-xl w-full shadow-storybook border-4 border-rose-300 text-center">
            <div class="flex items-center justify-center gap-2 mb-1">
                <span class="text-4xl">🎴</span>
                <span class="bg-rose-500 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full">幸運命運大冒險</span>
            </div>
            <h2 id="cardModalTitle" class="text-2xl sm:text-3xl font-black text-rose-800">請挑選一張幸運卡片！</h2>
            <p id="cardModalSubtitle" class="text-xs sm:text-sm font-bold text-gray-600 mb-6">點擊下方任一張蓋牌，看看抽到什麼有趣的活動或獎勵吧！</p>

            <!-- 3 Face Down Cards Container -->
            <div id="cardsGrid" class="grid grid-cols-3 gap-3 my-4 h-48">
                <!-- Dynamic 3 cards -->
            </div>

            <div id="cardResultBox" class="hidden bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 my-4 text-center">
                <p id="cardResultText" class="text-base sm:text-lg font-black text-amber-900 leading-relaxed"></p>
            </div>

            <button id="cardFinishBtn" onclick="finishCardDraw()" class="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-storybook-sm transition transform active:scale-95 hidden">
                太棒了！完成活動！
            </button>
        </div>
    </div>

    <!-- 4. Property Buy/Upgrade Modal -->
    <div id="propertyModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-6 max-w-md w-full shadow-storybook border-4 border-amber-300 text-center">
            <span id="propModalIcon" class="text-6xl">🍦</span>
            <h2 id="propModalTitle" class="text-2xl font-black text-amber-900 mt-2">冰淇淋屋</h2>
            <p id="propModalSubtitle" class="text-sm font-bold text-gray-500 mb-4">夢幻甜點區</p>
            
            <div id="propModalDetails" class="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 mb-5 text-sm font-bold text-gray-800 space-y-2">
                <!-- Dynamic text -->
            </div>

            <div class="flex gap-3">
                <button onclick="closeModal('propertyModal'); endTurn();" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-black text-base rounded-2xl transition transform active:scale-95">
                    放棄
                </button>
                <button id="propBuyBtn" class="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow transition transform active:scale-95">
                    購買地產
                </button>
            </div>
        </div>
    </div>

    <!-- 5. Math & Knowledge Quiz Modal -->
    <div id="quizModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-6 max-w-md w-full shadow-storybook border-4 border-sky-300 text-center">
            <div class="flex items-center justify-center gap-2 mb-2">
                <span class="text-4xl">🧠</span>
                <span id="quizCategoryBadge" class="bg-sky-500 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full">小學生大挑戰</span>
            </div>
            <h2 class="text-2xl font-black text-sky-800">益智問答！</h2>
            <p class="text-xs sm:text-sm font-bold text-gray-500 mb-4">答對即可獲得 🪙 150 獎金與彩帶慶祝喔！</p>
            
            <div class="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 mb-4 text-left">
                <p id="quizQuestion" class="text-base sm:text-lg font-black text-sky-950 leading-relaxed">問題內容</p>
            </div>

            <div id="quizOptions" class="grid grid-cols-1 gap-2.5">
                <!-- Dynamic choices buttons -->
            </div>
        </div>
    </div>

    <!-- 5.5 Custom Quiz Bank Manager Modal -->
    <div id="quizManagerModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-storybook border-4 border-sky-300 text-left max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center mb-3 pb-2 border-b-2 border-sky-200">
                <h2 class="text-2xl font-black text-sky-900 flex items-center gap-2">
                    <span>✏️</span> 益智題庫管理員
                </h2>
                <button onclick="closeModal('quizManagerModal')" class="text-gray-400 hover:text-gray-600 font-bold text-2xl px-2">&times;</button>
            </div>

            <div class="overflow-y-auto space-y-4 pr-1 flex-1">
                <!-- Add Question Form -->
                <div class="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200">
                    <h3 class="font-black text-sky-900 mb-3 text-base flex items-center gap-1.5">
                        <span>➕</span> 新增題目
                    </h3>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label class="block text-xs font-black text-sky-800 mb-1">難度等級：</label>
                            <select id="newQuizLevel" class="w-full bg-white border-2 border-sky-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-sky-500">
                                <option value="easy">🌱 低年級 (1-2年級)</option>
                                <option value="hard">🌿 中高年級 (3-6年級)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-black text-sky-800 mb-1">科目/類別名稱：</label>
                            <input type="text" id="newQuizCategory" placeholder="如：📚 國語、📐 數學" value="📚 國語" class="w-full bg-white border-2 border-sky-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-sky-500">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="block text-xs font-black text-sky-800 mb-1">題目內容：</label>
                        <input type="text" id="newQuizQuestion" placeholder="請輸入問題，如：請問「水」的英文怎麼說？" class="w-full bg-white border-2 border-sky-200 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-bold focus:outline-none focus:border-sky-500">
                    </div>

                    <div class="grid grid-cols-2 gap-2 mb-3">
                        <div>
                            <label class="block text-[11px] font-black text-sky-800 mb-0.5">選項 A：</label>
                            <input type="text" id="newQuizOpt0" placeholder="選項 A" class="w-full bg-white border border-sky-200 rounded-lg px-2 py-1 text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-sky-800 mb-0.5">選項 B：</label>
                            <input type="text" id="newQuizOpt1" placeholder="選項 B" class="w-full bg-white border border-sky-200 rounded-lg px-2 py-1 text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-sky-800 mb-0.5">選項 C：</label>
                            <input type="text" id="newQuizOpt2" placeholder="選項 C" class="w-full bg-white border border-sky-200 rounded-lg px-2 py-1 text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black text-sky-800 mb-0.5">選項 D：</label>
                            <input type="text" id="newQuizOpt3" placeholder="選項 D" class="w-full bg-white border border-sky-200 rounded-lg px-2 py-1 text-xs font-bold">
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-black text-sky-900 shrink-0">正確答案是：</label>
                            <select id="newQuizAnswer" class="bg-white border-2 border-emerald-400 text-emerald-800 font-black rounded-lg px-2 py-1 text-xs focus:outline-none">
                                <option value="0">選項 A</option>
                                <option value="1">選項 B</option>
                                <option value="2">選項 C</option>
                                <option value="3">選項 D</option>
                            </select>
                        </div>
                        <button onclick="addCustomQuiz()" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-storybook-sm transition transform active:scale-95 flex items-center gap-1">
                            <i class="fas fa-plus-circle"></i> 儲存新增題目
                        </button>
                    </div>
                </div>

                <!-- Existing Question List View -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-black text-sky-900 text-sm flex items-center gap-1">
                            <span>📋</span> 目前題庫列表
                        </h3>
                        <div class="flex gap-1.5">
                            <button onclick="renderQuizManagerList('easy')" id="tabEasyBtn" class="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-500 text-white">低年級</button>
                            <button onclick="renderQuizManagerList('hard')" id="tabHardBtn" class="px-2.5 py-1 rounded-lg text-xs font-black bg-gray-200 text-gray-700">中高年級</button>
                        </div>
                    </div>

                    <div id="quizManagerItems" class="space-y-2 max-h-52 overflow-y-auto pr-1">
                        <!-- Dynamic list items -->
                    </div>
                </div>
            </div>

            <div class="mt-3 pt-2 border-t border-sky-200">
                <button onclick="closeModal('quizManagerModal')" class="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-sm rounded-xl shadow transition transform active:scale-95 text-center">
                    完成關閉
                </button>
            </div>
        </div>
    </div>

    <!-- 6. Magic Shop Modal -->
    <div id="shopModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-6 max-w-md w-full shadow-storybook border-4 border-purple-300 text-center">
            <span class="text-5xl">🧹</span>
            <h2 class="text-2xl font-black text-purple-800 mt-1">魔法道具商店</h2>
            <p class="text-xs sm:text-sm font-bold text-gray-500 mb-4">購買神奇道具，讓遊戲更有戰略！</p>
            
            <div id="shopItemsList" class="space-y-2.5 mb-5 text-left">
                <!-- Dynamic shop items -->
            </div>

            <button onclick="closeModal('shopModal'); endTurn();" class="w-full py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-black rounded-2xl transition transform active:scale-95 text-base">
                離開商店
            </button>
        </div>
    </div>

    <!-- 7. Spin Wheel Modal -->
    <div id="wheelModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-6 max-w-md w-full shadow-storybook border-4 border-rose-300 text-center">
            <span class="text-5xl">🎡</span>
            <h2 class="text-2xl font-black text-rose-800 mt-1">幸運大轉盤！</h2>
            <p class="text-xs sm:text-sm font-bold text-gray-500 mb-4">點擊轉盤試試看你的好運氣！</p>
            
            <div class="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
                <div id="wheelDisc" class="w-full h-full rounded-full border-4 border-rose-400 bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 flex items-center justify-center shadow-xl transition-all duration-[3000ms] ease-out">
                    <span class="text-2xl font-black text-purple-900">✨ 幸運 ✨</span>
                </div>
                <div class="absolute -top-3 text-3xl text-rose-600">▼</div>
            </div>

            <button id="spinWheelBtn" onclick="spinWheel()" class="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-lg rounded-2xl shadow-storybook-sm transition transform active:scale-95">
                轉動轉盤！
            </button>
        </div>
    </div>

    <!-- 8. Game Over Modal -->
    <div id="victoryModal" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-storybookPaper rounded-3xl p-6 max-w-md w-full shadow-storybook border-4 border-amber-300 text-center">
            <span class="text-7xl animate-bounce inline-block">🏆</span>
            <h2 class="text-3xl font-black text-purple-800 mt-2">遊戲結束！</h2>
            <div id="winnerText" class="text-xl font-black text-rose-600 my-3">🎉 恭喜獲勝者！</div>
            
            <div id="finalScoresList" class="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-left my-4 space-y-2">
                <!-- Final results summary -->
            </div>

            <button onclick="openModal('setupModal'); closeModal('victoryModal');" class="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xl rounded-2xl shadow-storybook-sm border-2 border-white hover:from-amber-500 hover:to-orange-600 transition transform active:scale-95">
                🎮 再玩一次！
            </button>
        </div>
    </div>

    <script>
        let soundEnabled = true;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        let audioCtx = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new AudioCtx();
            }
        }

        function playSound(type) {
            if (!soundEnabled) return;
            try {
                initAudio();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                const now = audioCtx.currentTime;

                if (type === 'dice') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                } else if (type === 'coin') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(987.77, now);
                    osc.frequency.setValueAtTime(1318.51, now + 0.08);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                } else if (type === 'step') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                } else if (type === 'win') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, now);
                    osc.frequency.setValueAtTime(659.25, now + 0.12);
                    osc.frequency.setValueAtTime(783.99, now + 0.24);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                }
            } catch (e) { console.log(e); }
        }

        function triggerConfetti(count = 90) {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: count,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
        }

        function triggerFireworks() {
            if (typeof confetti === 'function') {
                const duration = 2.5 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min;
                }

                const interval = setInterval(function() {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 50 * (timeLeft / duration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                }, 250);
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const soundIcon = document.getElementById('soundIcon');
            const soundBtn = document.getElementById('soundToggleBtn');
            if (soundEnabled) {
                soundIcon.className = "fas fa-volume-up text-xl sm:text-2xl";
                soundBtn.classList.replace('bg-gray-400', 'bg-amber-400');
            } else {
                soundIcon.className = "fas fa-volume-mute text-xl sm:text-2xl";
                soundBtn.classList.replace('bg-amber-400', 'bg-gray-400');
            }
        }

        /* Modal Helpers */
        function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
        function openRulesModal() { openModal('rulesModal'); }
        function resetGamePrompt() { openModal('setupModal'); }

        const AVATARS = [
            { id: 'bunny', name: '兔兔', emoji: '🐰', color: 'bg-rose-400', border: 'border-rose-500', textColor: 'text-rose-600' },
            { id: 'puppy', name: '汪汪', emoji: '🐶', color: 'bg-sky-400', border: 'border-sky-500', textColor: 'text-sky-600' },
            { id: 'bear',  name: '熊熊', emoji: '🐻', color: 'bg-amber-500', border: 'border-amber-600', textColor: 'text-amber-700' },
            { id: 'kitty', name: '貓貓', emoji: '🐱', color: 'bg-purple-400', border: 'border-purple-500', textColor: 'text-purple-600' }
        ];

        const MAGIC_ITEMS = {
            remote_dice: { id: 'remote_dice', name: '遙控骰子 🎲', price: 150, desc: '指定擲出 1~6 步數', icon: '🎲' },
            shield: { id: 'shield', name: '免過路費盾 🛡️', price: 120, desc: '抵擋一次對手過路費', icon: '🛡️' },
            boost: { id: 'boost', name: '雙倍加速卡 🚀', price: 100, desc: '下次移動步數 x2', icon: '🚀' }
        };

        const TILES_DATA = [
            { id: 0,  name: '起點', icon: '🚩', type: 'start', desc: '經過或停在起點可領取 🪙 200 金幣！', groupColor: 'bg-rose-400' },
            { id: 1,  name: '冰淇淋屋', icon: '🍦', type: 'property', price: 120, rent: 25, groupColor: 'bg-rose-300', groupName: '甜點區' },
            { id: 2,  name: '糖果屋', icon: '🍬', type: 'property', price: 140, rent: 30, groupColor: 'bg-rose-300', groupName: '甜點區' },
            { id: 3,  name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 4,  name: '魔法商店', icon: '🧹', type: 'shop', desc: '購買神奇道具卡片！', groupColor: 'bg-purple-400' },
            { id: 5,  name: '玩具工廠', icon: '🧸', type: 'property', price: 180, rent: 35, groupColor: 'bg-amber-300', groupName: '玩具區' },
            { id: 6,  name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 7,  name: '休息區', icon: '😴', type: 'nap', desc: '進入舒服的小睡區，暫停一次！', groupColor: 'bg-gray-300' },
            { id: 8,  name: '水上樂園', icon: '🏊', type: 'property', price: 220, rent: 45, groupColor: 'bg-cyan-300', groupName: '樂園區' },
            { id: 9,  name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 10, name: '幸運大轉盤', icon: '🎡', type: 'wheel', desc: '轉動幸運大轉盤獲得好禮！', groupColor: 'bg-rose-400' },
            { id: 11, name: '可愛動物園', icon: '🐼', type: 'property', price: 280, rent: 60, groupColor: 'bg-emerald-300', groupName: '自然區' },
            { id: 12, name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 13, name: '魔法城堡', icon: '🏰', type: 'property', price: 320, rent: 70, groupColor: 'bg-indigo-300', groupName: '城堡區' },
            { id: 14, name: '魔法傳送門', icon: '🌀', type: 'teleport', desc: '隨機傳送到地圖任意角落！', groupColor: 'bg-fuchsia-400' },
            { id: 15, name: '電影院', icon: '🍿', type: 'property', price: 350, rent: 75, groupColor: 'bg-indigo-300', groupName: '城堡區' },
            { id: 16, name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 17, name: '命運大冒險', icon: '🎴', type: 'chance', desc: '挑選一張蓋牌進行大冒險！', groupColor: 'bg-amber-400' },
            { id: 18, name: '恐龍公園', icon: '🦕', type: 'property', price: 380, rent: 85, groupColor: 'bg-emerald-300', groupName: '冒險區' },
            { id: 19, name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 20, name: '甜點王國', icon: '🍰', type: 'property', price: 420, rent: 95, groupColor: 'bg-rose-300', groupName: '夢幻區' },
            { id: 21, name: '幸運機會', icon: '🎴', type: 'chance', desc: '挑選一張蓋牌進行大冒險！', groupColor: 'bg-amber-400' },
            { id: 22, name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 23, name: '驚喜禮物', icon: '🎈', type: 'gift', desc: '獲得 🪙 150 金幣禮盒！', groupColor: 'bg-amber-300' },
            { id: 24, name: '夢幻主題樂園', icon: '🎢', type: 'property', price: 500, rent: 120, groupColor: 'bg-rose-300', groupName: '夢幻區' },
            { id: 25, name: '益智問答', icon: '🧠', type: 'quiz', desc: '回答小學生題目賺取金幣！', groupColor: 'bg-sky-500' },
            { id: 26, name: '歷史博物館', icon: '🏛️', type: 'property', price: 540, rent: 130, groupColor: 'bg-amber-400', groupName: '歷史區' },
            { id: 27, name: '宇宙飛船站', icon: '🛸', type: 'property', price: 600, rent: 150, groupColor: 'bg-sky-400', groupName: '探索區' }
        ];

        /* Interactive Fate/Chance Activities */
        const FATE_ACTIVITIES = [
            { title: '🎤 卡通唱歌挑戰', action: '請大聲唱出一首可愛的卡通歌！', reward: 180 },
            { title: '😜 搞怪鬼臉時間', action: '請向大家做一個最搞笑的鬼臉！', reward: 150 },
            { title: '🐶 動物模仿大師', action: '請模仿小狗汪汪叫三聲並伸出小爪！', reward: 160 },
            { title: '💃 夢幻 Pose 時間', action: '請站起來擺出一個最帥或最美的 Pose！', reward: 200 },
            { title: '🏃 活力高抬腿', action: '請原地高抬腿跳躍 5 下動一動！', reward: 170 },
            { title: '🍀 幸運四葉草', action: '幸運之星照耀你！直接獲得幸運禮金！', reward: 250 }
        ];

        /* Question Bank */
        const QUIZ_BANK = {
            easy: [
                { category: '📐 數學', q: '請問 8 + 7 等於多少？', options: ['13', '15', '16', '14'], answer: 1 },
                { category: '📐 數學', q: '小明有 5 顆蘋果，媽媽又給他 6 顆，現在共有幾顆？', options: ['10顆', '11顆', '12顆', '9顆'], answer: 1 },
                { category: '🌱 自然', q: '太陽每天是從哪一個方向升起來的？', options: ['西方', '南方', '東方', '北方'], answer: 2 },
                { category: '📚 國語', q: '量詞選擇：一（ ）青蛙跳進水裡。', options: ['隻', '條', '本', '張'], answer: 0 },
                { category: '🚦 常識', q: '過馬路看到紅燈時，應該怎麼做？', options: ['加速跑步', '停下來等待', '慢慢走過去', '閉上眼睛'], answer: 1 },
                { category: '📐 數學', q: '請問 10 減 3 等於多少？', options: ['6', '7', '8', '9'], answer: 1 },
                { category: '🐾 動物', q: '小貓發出的聲音是什麼？', options: ['汪汪', '喵喵', '哞哞', '呱呱'], answer: 1 },
                { category: '🎨 美術', q: '天上的星星通常是什麼形狀？', options: ['方形', '三角形', '圓形', '星形'], answer: 3 },
                { category: '📅 常識', q: '從週一到週五總共有幾天？', options: ['3天', '4天', '5天', '6天'], answer: 2 },
                { category: '🍎 生活', q: '成熟的香蕉是什麼顏色？', options: ['紅色', '綠色', '黃色', '藍色'], answer: 2 }
            ],
            hard: [
                { category: '📐 數學', q: '乘法運算：7 × 8 等於多少？', options: ['54', '56', '64', '48'], answer: 1 },
                { category: '📐 數學', q: '144 分享給 12 個人，每人可以拿到多少？', options: ['10', '11', '12', '14'], answer: 2 },
                { category: '📖 成語', q: '成語填空：「守株待（ ）」', options: ['羊', '兔', '狗', '貓'], answer: 1 },
                { category: '🔬 自然', q: '下列哪一種動物屬於哺乳類動物？', options: ['企鵝', '鯨魚', '烏龜', '金魚'], answer: 1 },
                { category: '🗺️ 地理', q: '台灣最高的山峰是哪一座山？', options: ['陽明山', '雪山', '玉山', '阿里山'], answer: 2 },
                { category: '📐 數學', q: '乘法運算：6 × 9 等於多少？', options: ['54', '48', '63', '56'], answer: 0 },
                { category: '🔬 自然', q: '請問蜜蜂（昆蟲）有幾隻腳？', options: ['4隻', '6隻', '8隻', '10隻'], answer: 1 },
                { category: '🗓️ 節日', q: '台灣的國慶日是哪一天？', options: ['1月1日', '5月1日', '10月10日', '12月25日'], answer: 2 },
                { category: '🐾 動物', q: '下列哪一種動物跑得最慢？', options: ['獵豹', '兔子', '馬', '蝸牛'], answer: 3 },
                { category: '📐 數學', q: '一個三角形總共有幾個內角？', options: ['2個', '3個', '4個', '5個'], answer: 1 }
            ]
        };

        let activeQuizTab = 'easy';

        function openQuizManagerModal() {
            openModal('quizManagerModal');
            renderQuizManagerList(activeQuizTab);
        }

        function renderQuizManagerList(level) {
            activeQuizTab = level;
            const tabEasy = document.getElementById('tabEasyBtn');
            const tabHard = document.getElementById('tabHardBtn');

            if (level === 'easy') {
                tabEasy.className = "px-2.5 py-1 rounded-lg text-xs font-black bg-sky-500 text-white";
                tabHard.className = "px-2.5 py-1 rounded-lg text-xs font-black bg-gray-200 text-gray-700";
            } else {
                tabEasy.className = "px-2.5 py-1 rounded-lg text-xs font-black bg-gray-200 text-gray-700";
                tabHard.className = "px-2.5 py-1 rounded-lg text-xs font-black bg-sky-500 text-white";
            }

            const itemsContainer = document.getElementById('quizManagerItems');
            const questions = QUIZ_BANK[level] || [];

            if (questions.length === 0) {
                itemsContainer.innerHTML = '<p class="text-xs text-gray-400 font-bold p-2 text-center">目前沒有題目喔！</p>';
                return;
            }

            itemsContainer.innerHTML = questions.map((item, idx) => `
                <div class="bg-white p-2.5 rounded-xl border border-sky-200 shadow-sm flex items-center justify-between text-xs">
                    <div class="pr-2 overflow-hidden">
                        <div class="font-black text-sky-950 truncate">${item.category} ${item.q}</div>
                        <div class="text-[10px] text-gray-500 font-bold truncate">
                            答案：<span class="text-emerald-600 font-black">${['A', 'B', 'C', 'D'][item.answer]}. ${item.options[item.answer]}</span> 
                            (${item.options.join(', ')})
                        </div>
                    </div>
                    <button onclick="deleteQuizQuestion('${level}', ${idx})" class="shrink-0 px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-600 font-black rounded-lg transition" title="刪除題目">
                        🗑️ 刪除
                    </button>
                </div>
            `).join('');
        }

        function addCustomQuiz() {
            const level = document.getElementById('newQuizLevel').value;
            const category = document.getElementById('newQuizCategory').value.trim() || '📚 常識';
            const questionText = document.getElementById('newQuizQuestion').value.trim();
            const opt0 = document.getElementById('newQuizOpt0').value.trim();
            const opt1 = document.getElementById('newQuizOpt1').value.trim();
            const opt2 = document.getElementById('newQuizOpt2').value.trim();
            const opt3 = document.getElementById('newQuizOpt3').value.trim();
            const answerIdx = parseInt(document.getElementById('newQuizAnswer').value);

            if (!questionText || !opt0 || !opt1 || !opt2 || !opt3) {
                alert('請完整填寫題目內容與 4 個選項喔！');
                return;
            }

            const newObj = {
                category: category,
                q: questionText,
                options: [opt0, opt1, opt2, opt3],
                answer: answerIdx
            };

            QUIZ_BANK[level].push(newObj);

            // Clear inputs
            document.getElementById('newQuizQuestion').value = '';
            document.getElementById('newQuizOpt0').value = '';
            document.getElementById('newQuizOpt1').value = '';
            document.getElementById('newQuizOpt2').value = '';
            document.getElementById('newQuizOpt3').value = '';

            playSound('win');
            renderQuizManagerList(level);
        }

        function deleteQuizQuestion(level, index) {
            if (QUIZ_BANK[level] && QUIZ_BANK[level].length > index) {
                QUIZ_BANK[level].splice(index, 1);
                renderQuizManagerList(level);
            }
        }

        let players = [];
        let currentPlayerIndex = 0;
        let currentRound = 1;
        let maxRounds = 15;
        let winTargetMoney = 0;
        let quizLevel = 'hard';
        let isMoving = false;
        let propertiesState = {}; 
        let customPhotos = [null, null, null, null]; 
        let currentCardReward = 0;

        const DICE_FACE_ROTATIONS = {
            1: { x: 0, y: 0 },
            2: { x: 0, y: -180 },
            3: { x: 0, y: 90 },
            4: { x: 0, y: -90 },
            5: { x: -90, y: 0 },
            6: { x: 90, y: 0 }
        };

        function initSetupScreen() {
            const container = document.getElementById('setupPlayersList');
            container.innerHTML = '';

            AVATARS.forEach((av, idx) => {
                const defaultIsBot = idx >= 2;
                const photoSrc = customPhotos[idx];
                const avatarPreview = photoSrc 
                    ? `<img src="${photoSrc}" class="w-full h-full object-cover rounded-full">` 
                    : `<span class="text-3xl">${av.emoji}</span>`;

                const slotHtml = `
                    <div class="flex items-center justify-between bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200">
                        <div class="flex items-center gap-3">
                            <div class="relative group cursor-pointer" onclick="triggerPhotoSelect(${idx})" title="點擊上傳照片">
                                <div id="avatarPreview_${idx}" class="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-amber-300 hover:border-amber-500 overflow-hidden shadow-sm">
                                    ${avatarPreview}
                                </div>
                                <span class="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center shadow">📷</span>
                            </div>
                            <input type="file" id="photoInput_${idx}" accept="image/*" class="hidden" onchange="handlePhotoUpload(${idx}, event)">
                            <div class="text-left">
                                <input type="text" id="playerName_${idx}" value="${av.name}" class="w-28 font-black text-sm text-gray-800 bg-white border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 px-2 py-1">
                            </div>
                        </div>
                        <select id="playerType_${idx}" class="bg-white border-2 border-amber-200 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-bold text-gray-800 focus:outline-none focus:border-amber-400">
                            <option value="human" ${!defaultIsBot ? 'selected' : ''}>👤 玩家控制</option>
                            <option value="bot" ${defaultIsBot ? 'selected' : ''}>🤖 電腦夥伴</option>
                            ${idx >= 2 ? '<option value="off">❌ 不參加</option>' : ''}
                        </select>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', slotHtml);
            });
        }

        function triggerPhotoSelect(idx) {
            document.getElementById(`photoInput_${idx}`).click();
        }

        function handlePhotoUpload(idx, event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                customPhotos[idx] = e.target.result;
                const previewEl = document.getElementById(`avatarPreview_${idx}`);
                if (previewEl) {
                    previewEl.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-full">`;
                }
            };
            reader.readAsDataURL(file);
        }

        function startGame() {
            const winVal = document.getElementById('winConditionSelect').value;
            quizLevel = document.getElementById('quizLevelSelect').value;

            if (winVal === '15' || winVal === '20') {
                maxRounds = parseInt(winVal);
                winTargetMoney = 0;
            } else {
                maxRounds = 999;
                winTargetMoney = parseInt(winVal);
            }

            players = [];
            AVATARS.forEach((av, idx) => {
                const typeEl = document.getElementById(`playerType_${idx}`);
                const nameEl = document.getElementById(`playerName_${idx}`);
                const type = typeEl ? typeEl.value : (idx < 2 ? 'human' : 'bot');
                const customName = nameEl && nameEl.value.trim() ? nameEl.value.trim() : av.name;

                if (type !== 'off') {
                    players.push({
                        id: av.id,
                        name: customName,
                        emoji: av.emoji,
                        avatarUrl: customPhotos[idx] || null,
                        color: av.color,
                        border: av.border,
                        textColor: av.textColor,
                        isBot: type === 'bot',
                        money: 1200,
                        position: 0,
                        skipTurns: 0,
                        items: []
                    });
                }
            });

            if (players.length < 2) {
                alert('請至少選擇 2 位角色參加遊戲喔！');
                return;
            }

            propertiesState = {};
            currentPlayerIndex = 0;
            currentRound = 1;
            isMoving = false;

            closeModal('setupModal');
            renderBoardTiles();
            updatePlayerHUD();
            updateTurnBanner();
            updateTokensPosition();

            logMessage(`🎮 遊戲開始囉！大家都好棒！`, 'text-purple-600 font-bold');
            checkBotTurn();
        }

        function renderBoardTiles() {
            const board = document.getElementById('board');
            board.querySelectorAll('.tile-item').forEach(el => el.remove());

            TILES_DATA.forEach((tile, idx) => {
                const prop = propertiesState[idx];
                let ownerBadge = '';

                if (prop && prop.ownerIndex !== null) {
                    const owner = players[prop.ownerIndex];
                    const ownerAvatar = owner.avatarUrl 
                        ? `<img src="${owner.avatarUrl}" class="w-4 h-4 rounded-full object-cover inline-block border border-white">` 
                        : owner.emoji;
                    const levelStars = '⭐'.repeat(prop.level);
                    ownerBadge = `<span class="bg-white/95 rounded-full px-1 shadow flex items-center gap-0.5 text-[9px] font-black">${ownerAvatar}${levelStars}</span>`;
                }

                const tileDiv = document.createElement('div');
                tileDiv.className = `tile-${idx} tile-item bg-storybookPaper rounded-2xl border-2 border-amber-200/90 shadow-storybook-sm flex flex-col items-center justify-between overflow-hidden relative p-0.5 sm:p-1 transition-all hover:scale-[1.02] hover:shadow-md`;
                
                tileDiv.innerHTML = `
                    <div class="w-full ${tile.groupColor} flex items-center justify-center py-0.5 rounded-t-xl">
                        <span class="text-[10px] sm:text-[12px] font-black text-white px-0.5 truncate">${tile.groupName || tile.type}</span>
                    </div>
                    <div class="text-2xl sm:text-3xl my-0.5 transform transition hover:scale-110">${tile.icon}</div>
                    <div class="text-center w-full px-0.5">
                        <div class="text-[10px] sm:text-[13px] font-black text-amber-950 leading-tight truncate">${tile.name}</div>
                        ${tile.type === 'property' ? `
                            <div class="text-[9px] sm:text-[11px] font-black text-amber-700">🪙${tile.price}</div>
                        ` : ''}
                    </div>
                    <div class="absolute top-0.5 right-0.5 flex items-center">
                        ${ownerBadge}
                    </div>
                    <div id="tileTokens_${idx}" class="absolute inset-0 flex items-center justify-center gap-0.5 flex-wrap p-0.5 pointer-events-none z-10">
                    </div>
                `;
                board.appendChild(tileDiv);
            });
        }

        function checkBotTurn() {
            const cur = players[currentPlayerIndex];
            const rollBtn = document.getElementById('rollBtn');
            if (!cur) return;

            if (cur.isBot) {
                rollBtn.disabled = true;
                rollBtn.innerText = `🤖 ${cur.name} 思考中...`;
                rollBtn.classList.add('opacity-50', 'cursor-not-allowed');
                setTimeout(() => {
                    handleRollDice();
                }, 1200);
            } else {
                rollBtn.disabled = false;
                rollBtn.innerText = "🎲 擲骰子！";
                rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }

        function handleRollDice() {
            if (isMoving) return;
            isMoving = true;

            const rollBtn = document.getElementById('rollBtn');
            rollBtn.disabled = true;
            rollBtn.classList.add('opacity-50', 'cursor-not-allowed');

            playSound('dice');

            const cubeDice = document.getElementById('cubeDice');
            const diceResultText = document.getElementById('diceResultText');

            let steps = Math.floor(Math.random() * 6) + 1;
            const cur = players[currentPlayerIndex];

            if (cur.hasBoost) {
                steps = steps * 2;
                cur.hasBoost = false;
                logMessage(`🚀 雙倍加速！一步當兩步！`, 'text-sky-600 font-bold');
            }

            const baseRot = DICE_FACE_ROTATIONS[Math.min(6, Math.max(1, steps))];
            const extraX = (Math.floor(Math.random() * 3) + 3) * 360;
            const extraY = (Math.floor(Math.random() * 3) + 3) * 360;

            const targetX = baseRot.x + extraX;
            const targetY = baseRot.y + extraY;

            cubeDice.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg)`;
            diceResultText.innerText = "🎲 骰子滾動中...";

            setTimeout(() => {
                diceResultText.innerText = `🎲 擲出了 ${steps} 點！`;
                logMessage(`🎲 ${cur.name} 擲出了 ${steps} 點！`, 'font-bold text-amber-900');

                setTimeout(() => {
                    movePlayerSteps(steps);
                }, 500);
            }, 1200);
        }

        function movePlayerSteps(steps) {
            let remainingSteps = steps;
            const cur = players[currentPlayerIndex];

            const stepTimer = setInterval(() => {
                if (remainingSteps <= 0) {
                    clearInterval(stepTimer);
                    handleTileLanding(cur.position);
                    return;
                }

                cur.position = (cur.position + 1) % TILES_DATA.length;
                playSound('step');
                updateTokensPosition();

                if (cur.position === 0) {
                    cur.money += 200;
                    playSound('coin');
                    logMessage(`🚩 ${cur.name} 經過起點，領取 🪙 200 獎勵！`, 'text-emerald-600 font-bold');
                    updatePlayerHUD();
                }

                remainingSteps--;
            }, 250);
        }

        function handleTileLanding(tileIdx) {
            const cur = players[currentPlayerIndex];
            const tile = TILES_DATA[tileIdx];

            logMessage(`📍 ${cur.name} 到達【${tile.name}】`, 'font-bold text-purple-800');

            if (winTargetMoney > 0 && cur.money >= winTargetMoney) {
                triggerGameOver('target_reached', cur);
                return;
            }

            switch (tile.type) {
                case 'start':
                    cur.money += 200;
                    playSound('coin');
                    logMessage(`🎉 停在起點！獲得 🪙 200 金幣！`, 'text-emerald-600 font-bold');
                    updatePlayerHUD();
                    setTimeout(endTurn, 1000);
                    break;

                case 'property':
                    handlePropertyTile(tileIdx);
                    break;

                case 'chance':
                    handleChanceCardTile();
                    break;

                case 'quiz':
                    handleQuizTile();
                    break;

                case 'wheel':
                    handleWheelTile();
                    break;

                case 'shop':
                    handleShopTile();
                    break;

                case 'tax':
                    const taxFee = Math.floor(cur.money * 0.1);
                    cur.money = Math.max(0, cur.money - taxFee);
                    logMessage(`🏛️ ${cur.name} 繳納了 🪙 ${taxFee} 捐款！`, 'text-slate-600 font-bold');
                    updatePlayerHUD();
                    setTimeout(endTurn, 1200);
                    break;

                case 'teleport':
                    playSound('win');
                    const randTarget = Math.floor(Math.random() * TILES_DATA.length);
                    cur.position = randTarget;
                    logMessage(`🌀 進入魔法傳送門！傳送到【${TILES_DATA[randTarget].name}】`, 'text-fuchsia-600 font-bold');
                    updateTokensPosition();
                    setTimeout(() => handleTileLanding(randTarget), 1000);
                    break;

                case 'demon':
                    const lossMoney = 150;
                    cur.money = Math.max(0, cur.money - lossMoney);
                    logMessage(`😈 淘氣小惡魔搗蛋！損失 🪙 ${lossMoney} 金幣！`, 'text-rose-600 font-bold');
                    updatePlayerHUD();
                    setTimeout(endTurn, 1200);
                    break;

                case 'nap':
                    cur.skipTurns = 1;
                    logMessage(`😴 ${cur.name} 在休息區睡個好覺，下回合暫停！`, 'text-sky-600 font-bold');
                    setTimeout(endTurn, 1200);
                    break;

                case 'gift':
                    cur.money += 150;
                    playSound('coin');
                    logMessage(`🎈 獲得禮盒 🪙 150 金幣！`, 'text-amber-600 font-bold');
                    updatePlayerHUD();
                    setTimeout(endTurn, 1200);
                    break;

                default:
                    setTimeout(endTurn, 800);
            }
        }

        function handleChanceCardTile() {
            const cur = players[currentPlayerIndex];
            
            if (cur.isBot) {
                const activity = FATE_ACTIVITIES[Math.floor(Math.random() * FATE_ACTIVITIES.length)];
                cur.money += activity.reward;
                playSound('coin');
                triggerConfetti(60);
                logMessage(`🎴 ${cur.name} 抽到了【${activity.title}】，獲得 🪙 ${activity.reward} 金幣！`, 'text-rose-600 font-bold');
                updatePlayerHUD();
                setTimeout(endTurn, 1200);
            } else {
                setupCardDrawModal();
                openModal('cardDrawModal');
            }
        }

        function setupCardDrawModal() {
            document.getElementById('cardResultBox').classList.add('hidden');
            document.getElementById('cardFinishBtn').classList.add('hidden');
            document.getElementById('cardModalTitle').innerText = "請挑選一張幸運卡片！";

            const cardsGrid = document.getElementById('cardsGrid');
            cardsGrid.innerHTML = '';

            for (let i = 0; i < 3; i++) {
                const activity = FATE_ACTIVITIES[Math.floor(Math.random() * FATE_ACTIVITIES.length)];
                
                const cardHtml = `
                    <div id="cardItem_${i}" class="card-container w-full h-full cursor-pointer hover:scale-105 transition transform" onclick="flipCard(${i}, ${activity.reward}, '${activity.title}', '${activity.action}')">
                        <div class="card-inner">
                            <div class="card-front bg-gradient-to-br from-rose-400 via-amber-300 to-amber-400 border-4 border-white shadow-storybook flex flex-col items-center justify-center p-2 text-white">
                                <span class="text-4xl">🎴</span>
                                <span class="font-black text-sm mt-1">幸運蓋牌</span>
                            </div>
                            <div class="card-back bg-white border-4 border-rose-300 shadow-storybook flex flex-col items-center justify-center p-2 text-rose-900">
                                <span class="text-3xl">✨</span>
                                <span class="font-black text-xs text-rose-700 mt-1">${activity.title}</span>
                                <span class="font-black text-xs text-emerald-600 mt-1">🪙 +${activity.reward}</span>
                            </div>
                        </div>
                    </div>
                `;
                cardsGrid.insertAdjacentHTML('beforeend', cardHtml);
            }
        }

        function flipCard(idx, reward, title, action) {
            const cardEl = document.getElementById(`cardItem_${idx}`);
            if (!cardEl || cardEl.classList.contains('flipped')) return;

            cardEl.classList.add('flipped');
            currentCardReward = reward;

            playSound('win');
            triggerConfetti(80);

            document.getElementById('cardResultText').innerHTML = `
                <span class="text-rose-600 font-black text-lg block mb-1">【${title}】</span>
                <span>${action}</span><br>
                <span class="text-emerald-600 font-black mt-2 inline-block">完成任務可獲得 🪙 ${reward} 金幣！</span>
            `;
            document.getElementById('cardResultBox').classList.remove('hidden');
            document.getElementById('cardFinishBtn').classList.remove('hidden');
        }

        function finishCardDraw() {
            closeModal('cardDrawModal');
            const cur = players[currentPlayerIndex];
            cur.money += currentCardReward;
            playSound('coin');
            logMessage(`🎉 ${cur.name} 完成了大冒險小活動，獲得 🪙 ${currentCardReward} 金幣！`, 'text-rose-600 font-bold');
            updatePlayerHUD();
            endTurn();
        }

        function handlePropertyTile(tileIdx) {
            const cur = players[currentPlayerIndex];
            const tile = TILES_DATA[tileIdx];
            const prop = propertiesState[tileIdx] || { ownerIndex: null, level: 0 };

            if (prop.ownerIndex === null) {
                if (cur.isBot) {
                    if (cur.money >= tile.price) {
                        buyProperty(tileIdx);
                    } else {
                        endTurn();
                    }
                } else {
                    document.getElementById('propModalIcon').innerText = tile.icon;
                    document.getElementById('propModalTitle').innerText = tile.name;
                    document.getElementById('propModalSubtitle').innerText = tile.groupName || '童話地產';
                    document.getElementById('propModalDetails').innerHTML = `
                        <div class="flex justify-between"><span>購買價格：</span><span class="text-amber-600 font-bold">🪙 ${tile.price} 金幣</span></div>
                        <div class="flex justify-between"><span>基礎過路費：</span><span class="text-rose-600 font-bold">🪙 ${tile.rent} 金幣</span></div>
                        <div class="flex justify-between"><span>目前金幣：</span><span class="text-emerald-600 font-bold">🪙 ${cur.money} 金幣</span></div>
                    `;

                    const buyBtn = document.getElementById('propBuyBtn');
                    buyBtn.innerText = "購買地產";
                    if (cur.money >= tile.price) {
                        buyBtn.disabled = false;
                        buyBtn.className = "flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow transition transform active:scale-95";
                        buyBtn.onclick = () => {
                            buyProperty(tileIdx);
                            closeModal('propertyModal');
                        };
                    } else {
                        buyBtn.disabled = true;
                        buyBtn.className = "flex-1 py-3 bg-gray-300 text-gray-500 font-black text-base rounded-2xl cursor-not-allowed";
                    }

                    openModal('propertyModal');
                }
            } else if (prop.ownerIndex === currentPlayerIndex) {
                const upgradePrice = Math.floor(tile.price * 0.6);
                if (prop.level < 3) {
                    if (cur.isBot) {
                        if (cur.money >= upgradePrice) {
                            upgradeProperty(tileIdx);
                        } else {
                            endTurn();
                        }
                    } else {
                        document.getElementById('propModalIcon').innerText = tile.icon;
                        document.getElementById('propModalTitle').innerText = `${tile.name} (升級)`;
                        document.getElementById('propModalSubtitle').innerText = `目前等級：${'⭐'.repeat(prop.level)}`;
                        document.getElementById('propModalDetails').innerHTML = `
                            <div class="flex justify-between"><span>升級價格：</span><span class="text-amber-600 font-bold">🪙 ${upgradePrice} 金幣</span></div>
                            <div class="flex justify-between"><span>升級後過路費：</span><span class="text-rose-600 font-bold">🪙 ${tile.rent * (prop.level + 1)} 金幣</span></div>
                        `;

                        const buyBtn = document.getElementById('propBuyBtn');
                        buyBtn.innerText = "升級地產！";
                        if (cur.money >= upgradePrice) {
                            buyBtn.disabled = false;
                            buyBtn.className = "flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white font-black text-base rounded-2xl shadow transition transform active:scale-95";
                            buyBtn.onclick = () => {
                                upgradeProperty(tileIdx);
                                closeModal('propertyModal');
                            };
                        } else {
                            buyBtn.disabled = true;
                            buyBtn.className = "flex-1 py-3 bg-gray-300 text-gray-500 font-black text-base rounded-2xl cursor-not-allowed";
                        }

                        openModal('propertyModal');
                    }
                } else {
                    logMessage(`🏰 ${cur.name} 回到最高等級【${tile.name}】！`, 'text-purple-600');
                    setTimeout(endTurn, 1000);
                }
            } else {
                const shieldIdx = cur.items.indexOf('shield');
                if (shieldIdx !== -1) {
                    cur.items.splice(shieldIdx, 1);
                    logMessage(`🛡️ ${cur.name} 使用【免過路費護盾】，抵擋了過路費！`, 'text-emerald-600 font-bold');
                    updateActiveItemsBar();
                    setTimeout(endTurn, 1200);
                    return;
                }

                const owner = players[prop.ownerIndex];
                const rentAmount = tile.rent * prop.level;
                const actualPaid = Math.min(cur.money, rentAmount);

                cur.money -= actualPaid;
                owner.money += actualPaid;

                playSound('coin');
                logMessage(`💸 ${cur.name} 支付了 🪙 ${actualPaid} 過路費給 ${owner.name}！`, 'text-rose-600 font-bold');
                updatePlayerHUD();
                setTimeout(endTurn, 1200);
            }
        }

        function buyProperty(tileIdx) {
            const cur = players[currentPlayerIndex];
            const tile = TILES_DATA[tileIdx];
            cur.money -= tile.price;
            propertiesState[tileIdx] = { ownerIndex: currentPlayerIndex, level: 1 };
            playSound('coin');
            logMessage(`🏠 ${cur.name} 購買了【${tile.name}】！`, 'text-emerald-600 font-bold');
            renderBoardTiles();
            updatePlayerHUD();
            updateTokensPosition();
            endTurn();
        }

        function upgradeProperty(tileIdx) {
            const cur = players[currentPlayerIndex];
            const tile = TILES_DATA[tileIdx];
            const prop = propertiesState[tileIdx];
            const upgradePrice = Math.floor(tile.price * 0.6);
            cur.money -= upgradePrice;
            prop.level++;
            playSound('coin');
            logMessage(`⭐ ${cur.name} 將【${tile.name}】升級到了 ${prop.level} 星級！`, 'text-purple-600 font-bold');
            renderBoardTiles();
            updatePlayerHUD();
            updateTokensPosition();
            endTurn();
        }

        let currentQuizAnswer = 0;

        function handleQuizTile() {
            const cur = players[currentPlayerIndex];
            const pool = (quizLevel === 'easy') ? QUIZ_BANK.easy : 
                         (quizLevel === 'hard') ? QUIZ_BANK.hard : 
                         [...QUIZ_BANK.easy, ...QUIZ_BANK.hard];

            const questionObj = pool[Math.floor(Math.random() * pool.length)];
            currentQuizAnswer = questionObj.answer;

            if (cur.isBot) {
                const isCorrect = Math.random() < 0.75;
                if (isCorrect) {
                    cur.money += 150;
                    playSound('coin');
                    triggerConfetti(60);
                    logMessage(`🧠 ${cur.name} 答對挑戰題，獲得 🪙 150 獎金！`, 'text-sky-600 font-bold');
                } else {
                    logMessage(`🧠 ${cur.name} 答錯了題目！`, 'text-gray-500');
                }
                updatePlayerHUD();
                setTimeout(endTurn, 1200);
            } else {
                document.getElementById('quizCategoryBadge').innerText = questionObj.category;
                document.getElementById('quizQuestion').innerText = questionObj.q;
                
                const optsContainer = document.getElementById('quizOptions');
                optsContainer.innerHTML = questionObj.options.map((optText, optIdx) => `
                    <button onclick="handleQuizAnswer(${optIdx})" class="w-full py-2.5 px-4 bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-sm sm:text-base rounded-2xl shadow-storybook-sm transition transform active:scale-95 border-2 border-sky-300 text-left flex items-center gap-3">
                        <span class="w-7 h-7 bg-sky-500 text-white rounded-full text-center text-sm flex items-center justify-center font-bold shrink-0">${['A', 'B', 'C', 'D'][optIdx]}</span>
                        ${optText}
                    </button>
                `).join('');

                openModal('quizModal');
            }
        }

        function handleQuizAnswer(selectedIdx) {
            closeModal('quizModal');
            const cur = players[currentPlayerIndex];

            if (selectedIdx === currentQuizAnswer) {
                cur.money += 150;
                playSound('coin');
                triggerConfetti(100);
                logMessage(`🎉 太棒了！${cur.name} 答對題目，獲得 🪙 150 獎勵！`, 'text-emerald-600 font-bold');
            } else {
                logMessage(`❌ 答錯囉，繼續加油！`, 'text-rose-500 font-bold');
            }
            updatePlayerHUD();
            endTurn();
        }

        function handleWheelTile() {
            const cur = players[currentPlayerIndex];
            if (cur.isBot) {
                const rewards = [100, 200, 300, 150];
                const prize = rewards[Math.floor(Math.random() * rewards.length)];
                cur.money += prize;
                playSound('coin');
                triggerConfetti(60);
                logMessage(`🎡 ${cur.name} 轉動幸運大轉盤，獲得 🪙 ${prize} 金幣！`, 'text-rose-600 font-bold');
                updatePlayerHUD();
                setTimeout(endTurn, 1200);
            } else {
                openModal('wheelModal');
            }
        }

        function spinWheel() {
            const btn = document.getElementById('spinWheelBtn');
            btn.disabled = true;
            const wheelDisc = document.getElementById('wheelDisc');
            const degrees = 1440 + Math.floor(Math.random() * 360);
            wheelDisc.style.transform = `rotate(${degrees}deg)`;
            playSound('dice');

            setTimeout(() => {
                const rewards = [100, 150, 200, 250, 300, 500];
                const prize = rewards[Math.floor(Math.random() * rewards.length)];
                const cur = players[currentPlayerIndex];
                cur.money += prize;
                playSound('win');
                triggerConfetti(120);
                logMessage(`🎉 超幸運！${cur.name} 轉中了 🪙 ${prize} 大獎！`, 'text-rose-600 font-bold');
                updatePlayerHUD();
                closeModal('wheelModal');
                btn.disabled = false;
                wheelDisc.style.transform = `rotate(0deg)`;
                endTurn();
            }, 3200);
        }

        function handleShopTile() {
            const cur = players[currentPlayerIndex];
            if (cur.isBot) {
                if (cur.money > 500 && cur.items.length < 2) {
                    cur.money -= 120;
                    cur.items.push('shield');
                    logMessage(`🧹 ${cur.name} 購買了【免過路費盾】`, 'text-purple-600 font-bold');
                }
                setTimeout(endTurn, 1000);
            } else {
                const list = document.getElementById('shopItemsList');
                list.innerHTML = Object.values(MAGIC_ITEMS).map(item => `
                    <div class="flex items-center justify-between bg-purple-50 p-2.5 rounded-2xl border border-purple-200">
                        <div>
                            <div class="font-black text-sm text-purple-900">${item.name}</div>
                            <div class="text-xs text-gray-500 font-bold">${item.desc}</div>
                        </div>
                        <button onclick="buyMagicItem('${item.id}')" class="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs sm:text-sm rounded-xl shadow transition transform active:scale-95">
                            🪙 ${item.price} 買
                        </button>
                    </div>
                `).join('');

                openModal('shopModal');
            }
        }

        function buyMagicItem(itemId) {
            const cur = players[currentPlayerIndex];
            const item = MAGIC_ITEMS[itemId];
            if (cur.money >= item.price) {
                cur.money -= item.price;
                cur.items.push(itemId);
                playSound('coin');
                logMessage(`🧹 ${cur.name} 購買了【${item.name}】！`, 'text-purple-600 font-bold');
                updatePlayerHUD();
                updateActiveItemsBar();
                closeModal('shopModal');
                endTurn();
            } else {
                alert('金幣不足喔！');
            }
        }

        function updateActiveItemsBar() {
            const bar = document.getElementById('activeItemsBar');
            bar.innerHTML = '';
            const cur = players[currentPlayerIndex];

            if (!cur || cur.items.length === 0) {
                bar.innerHTML = '<span class="text-xs text-amber-700/60 font-bold">尚無道具</span>';
                return;
            }

            cur.items.forEach((itemId, idx) => {
                const item = MAGIC_ITEMS[itemId];
                if (!item) return;

                const btn = document.createElement('button');
                btn.className = "bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 rounded-xl px-2.5 py-1 text-xs sm:text-sm font-black shadow-storybook-sm transition active:scale-95 flex items-center gap-1";
                btn.innerHTML = `${item.name}`;
                btn.onclick = () => useItem(idx);
                bar.appendChild(btn);
            });
        }

        function useItem(itemIdx) {
            if (isMoving) return;
            const cur = players[currentPlayerIndex];
            const itemId = cur.items[itemIdx];

            if (itemId === 'remote_dice') {
                const targetSteps = prompt('🎲 請輸入您想要移動的步數 (1 ~ 6)：', '3');
                const steps = parseInt(targetSteps);
                if (steps >= 1 && steps <= 6) {
                    cur.items.splice(itemIdx, 1);
                    logMessage(`✨ ${cur.name} 使用【遙控骰子】，往前走 ${steps} 步！`, 'text-purple-600 font-bold');
                    updateActiveItemsBar();
                    movePlayerSteps(steps);
                }
            } else if (itemId === 'boost') {
                cur.items.splice(itemIdx, 1);
                cur.hasBoost = true;
                logMessage(`🚀 ${cur.name} 發動【雙倍加速卡】，下次移動步數翻倍！`, 'text-sky-600 font-bold');
                updateActiveItemsBar();
            } else {
                alert('此道具會在踩到對方地產時自動作用！');
            }
        }

        function endTurn() {
            isMoving = false;

            if (winTargetMoney > 0) {
                const winner = players.find(p => p.money >= winTargetMoney);
                if (winner) {
                    triggerGameOver('target_reached', winner);
                    return;
                }
            }

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

            if (currentPlayerIndex === 0) {
                currentRound++;
                document.getElementById('roundBadge').innerText = `第 ${currentRound} / ${maxRounds === 999 ? '∞' : maxRounds} 回合`;

                if (currentRound > maxRounds && maxRounds !== 999) {
                    triggerGameOver('max_rounds');
                    return;
                }
            }

            updateTurnBanner();
            updatePlayerHUD();
            updateActiveItemsBar();

            const cur = players[currentPlayerIndex];

            if (cur.skipTurns > 0) {
                cur.skipTurns--;
                logMessage(`😴 ${cur.name} 正在休息中，本回合跳過！`, 'text-gray-500 font-bold');
                setTimeout(endTurn, 1000);
            } else {
                checkBotTurn();
            }
        }

        function updateTurnBanner() {
            const cur = players[currentPlayerIndex];
            if (!cur) return;
            const avatarSpan = document.getElementById('turnAvatar');
            if (cur.avatarUrl) {
                avatarSpan.innerHTML = `<img src="${cur.avatarUrl}" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-amber-400">`;
            } else {
                avatarSpan.innerHTML = cur.emoji;
            }
            document.getElementById('turnText').innerText = `輪到 ${cur.name} 囉！`;
        }

        /* Figure 2 Optimization: Player cards arranged side-by-side horizontally at bottom */
        function updatePlayerHUD() {
            const container = document.getElementById('playersContainer');
            container.innerHTML = '';

            players.forEach((p, idx) => {
                const isCurrent = idx === currentPlayerIndex;
                const avatarDisplay = p.avatarUrl 
                    ? `<img src="${p.avatarUrl}" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow">` 
                    : `<span class="text-2xl sm:text-3xl">${p.emoji}</span>`;

                const card = document.createElement('div');
                card.className = `p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${isCurrent ? 'bg-amber-100 border-amber-400 shadow-storybook scale-[1.02]' : 'bg-white/90 border-amber-200/60 shadow-storybook-sm'}`;
                card.innerHTML = `
                    <div class="flex items-center gap-2">
                        ${avatarDisplay}
                        <div class="overflow-hidden">
                            <div class="font-black text-sm sm:text-base text-amber-950 truncate flex items-center gap-1">
                                ${p.name}
                                ${p.isBot ? '<span class="text-[9px] bg-amber-200 text-amber-800 px-1 rounded">🤖</span>' : ''}
                            </div>
                            <div class="text-xs text-amber-800/70 font-bold truncate">【${TILES_DATA[p.position].name}】</div>
                        </div>
                    </div>
                    <div class="text-right shrink-0">
                        <div class="font-black text-sm sm:text-base text-amber-700">🪙 ${p.money}</div>
                        <div class="text-[10px] sm:text-xs text-purple-600 font-bold">道具: ${p.items.length}</div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function updateTokensPosition() {
            TILES_DATA.forEach((_, idx) => {
                const container = document.getElementById(`tileTokens_${idx}`);
                if (container) container.innerHTML = '';
            });

            players.forEach((p) => {
                const tileContainer = document.getElementById(`tileTokens_${p.position}`);
                if (tileContainer) {
                    const token = document.createElement('div');
                    token.className = "token-hop animate-bounce";
                    if (p.avatarUrl) {
                        token.innerHTML = `<img src="${p.avatarUrl}" class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-amber-300 shadow-lg">`;
                    } else {
                        token.innerHTML = `<span class="text-lg sm:text-2xl filter drop-shadow">${p.emoji}</span>`;
                    }
                    tileContainer.appendChild(token);
                }
            });
        }

        function logMessage(msg) {
            const miniLog = document.getElementById('miniLog');
            if (miniLog) miniLog.innerHTML = msg;
        }

        function triggerGameOver(reason, winnerObj) {
            playSound('win');
            triggerFireworks();

            let winner = winnerObj;

            if (!winner) {
                const sorted = [...players].sort((a, b) => b.money - a.money);
                winner = sorted[0];
            }

            const winnerText = document.getElementById('winnerText');
            const winnerAvatar = winner.avatarUrl 
                ? `<img src="${winner.avatarUrl}" class="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-4 border-amber-300 shadow-lg">`
                : `<span class="text-6xl block mb-2">${winner.emoji}</span>`;

            winnerText.innerHTML = `
                ${winnerAvatar}
                🎉 恭喜 【${winner.name}】 榮獲童話大富翁冠軍！
            `;

            const scoresList = document.getElementById('finalScoresList');
            const sortedPlayers = [...players].sort((a, b) => b.money - a.money);

            scoresList.innerHTML = sortedPlayers.map((p, rank) => `
                <div class="flex justify-between items-center bg-white p-2.5 rounded-xl shadow-sm border border-amber-200 text-sm font-bold">
                    <span class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full ${rank === 0 ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-700'} flex items-center justify-center font-black">${rank + 1}</span>
                        ${p.name}
                    </span>
                    <span class="text-amber-700 font-black">🪙 ${p.money} 金幣</span>
                </div>
            `).join('');

            openModal('victoryModal');
        }

        /* On page load initialization */
        window.onload = function() {
            initSetupScreen();
            renderBoardTiles();
        };
    </script>
</body>
</html>
