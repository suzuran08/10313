// ============================================================
// 台鐵司機員線上測驗 - sketch.js (p5.js 穩健增強版)
// 護眼暖色系 | 響應式排版 | 階梯式闖關流程 | 防卡死安全防護
// ============================================================

// 題庫資料 (對應 media/ 資料夾圖檔)
const QUESTIONS_DATA = [
  {
    stage: 1,
    stageName: "第一階段：基礎色燈號誌",
    type: "image",
    src: "media/signal1.png",
    fallbackType: "3_aspect",
    activeLamp: 1, // 中黃
    q: "請問圖上號誌之限速為多少？",
    options: ["45 km/h", "60 km/h", "75 km/h", "按路線最高速限"],
    answer: "60 km/h",
    explain: "注意號誌（Y）為單顆橙黃燈常亮，限速 60 km/h，預知次一號誌機為險阻號誌。"
  },
  {
    stage: 1,
    stageName: "第一階段：基礎色燈號誌",
    type: "image",
    src: "media/signal2.png",
    fallbackType: "4_aspect_yy",
    q: "請問圖上號誌之限速為多少？",
    options: ["45 km/h", "60 km/h", "75 km/h", "按路線最高速限"],
    answer: "60 km/h",
    explain: "中速號誌（Y/Y）為四燈式上位橙黃燈常亮＋下位橙黃燈常亮（雙黃燈），限速 60 km/h。"
  },
  {
    stage: 1,
    stageName: "第一階段：基礎色燈號誌",
    type: "anim",
    src: "media/signal3.gif",
    fallbackType: "3_aspect_ryf",
    q: "請問圖上號誌之限速為多少？",
    options: ["25 km/h", "35 km/h", "45 km/h", "60 km/h"],
    answer: "35 km/h",
    explain: "低速號誌（R/YF）為上位紅燈常亮＋下位橙黃色閃光燈，限速 35 km/h。"
  },
  {
    stage: 1,
    stageName: "第一階段：基礎色燈號誌",
    type: "image",
    src: "media/signal4.png",
    fallbackType: "3_aspect",
    activeLamp: 2, // 下綠
    q: "請問圖上號誌之限速為多少？",
    options: ["75 km/h", "110 km/h", "130 km/h", "按路線最高速限"],
    answer: "按路線最高速限",
    explain: "平安號誌（G）為單顆綠燈常亮，閉塞區間開通無阻，得按該路線最高速限行駛。"
  },
  {
    stage: 1,
    stageName: "第一階段：基礎色燈號誌",
    type: "anim",
    src: "media/signal5.gif",
    fallbackType: "3_aspect_rf",
    q: "請問圖上號誌於單機運轉時之限速為多少？",
    options: ["25 km/h", "35 km/h", "45 km/h", "60 km/h"],
    answer: "45 km/h",
    explain: "准許調車號誌（RF）為單顆紅色閃光燈，一般調車為 25 km/h 以下，單機運轉時為 45 km/h。"
  },
  {
    stage: 2,
    stageName: "第二階段：預告與臨時號誌",
    type: "image",
    src: "media/signal6.png",
    fallbackType: "repeating",
    q: "請問此號誌機之名稱為何？",
    options: ["預告號誌", "閉塞號誌", "掩護號誌", "臨時號誌"],
    answer: "預告號誌",
    explain: "此為燈列式號誌預告機，以橫、斜、直等白色燈列方式預告主體號誌機之顯示狀態。"
  },
  {
    stage: 2,
    stageName: "第二階段：預告與臨時號誌",
    type: "image",
    src: "media/signal7.png",
    fallbackType: "temp_slow",
    q: "請問此號誌機之名稱為何？",
    options: ["調車號誌", "閉塞號誌", "掩護號誌", "臨時號誌"],
    answer: "臨時號誌",
    explain: "此為臨時號誌機之慢行號誌（白邊橙黃色圓形反光板），設置於慢行區域外方 20 公尺處。"
  },
  {
    stage: 2,
    stageName: "第二階段：預告與臨時號誌",
    type: "anim",
    src: "media/signal8.gif",
    fallbackType: "hand_stop",
    q: "請問此手作號誌之涵義為何？",
    options: ["險阻", "注意", "慢行", "平安"],
    answer: "險阻",
    explain: "手作險阻號誌：日間以紅色旗顯示；若不得已無紅旗時，得以高舉雙臂急遽搖動代替之。"
  },
  {
    stage: 3,
    stageName: "最終階段：行車決策情境題",
    type: "image",
    src: "media/signal9.png",
    fallbackType: "sub_green_flag",
    q: "您正在駕駛7558次貨物列車\n此時景美站進站號誌機位置\n有站員正高舉代用手作平安號誌\n請問通過轉轍器時的最高速限為？",
    options: ["25 km/h", "35 km/h", "45 km/h", "60 km/h"],
    answer: "25 km/h",
    explain: "列車依代用手作平安號誌越過其顯示處所時，至通過有關轉轍器時止，一律不得超過 25 km/h。"
  },
  {
    stage: 3,
    stageName: "最終階段：行車決策情境題",
    type: "image",
    src: "media/signal10.png",
    fallbackType: "shunting_approach",
    q: "請問在調車時，下列手作調車號誌何者為「接近號訊」？",
    options: ["綠旗左右搖動", "綠色旗上下搖動", "紅旗上下搖動", "紅旗靜止"],
    answer: "綠旗左右搖動",
    explain: "調車號訊「接近」：綠色旗左右搖動（指示機車或列車朝向顯示號訊人員的方向駛來）。"
  }
];

// 遊戲狀態常數
const STATE_HOME = 0;         // 首頁
const STATE_QUIZ = 1;         // 答題中
const STATE_STAGE_TRANS = 2;  // 階段通關/未達標轉場提示
const STATE_RESULT = 3;       // 總結分數與錯題解析

// 全域狀態變數
let gameState = STATE_HOME;
let currentQIndex = 0;
let userScore = 0;
let totalAnswered = 0;
let stage1Correct = 0;
let stage2Correct = 0;
let stage3Correct = 0;

let selectedOption = null;
let isAnswered = false;
let isCorrectAnswer = false;
let wrongQuestionsList = [];

// 階段過場訊息物件
let transitionMsg = {
  title: "",
  desc: "",
  success: false,
  targetIndex: 0
};

// 圖片與動畫資原始件
let mediaAssets = [];
let mediaLoadedFlags = [];
let confettiParticles = [];
let celebrationPlayed = false;

// 首頁背景圖變數
let imgBgMobile, imgBgDesktop;
let bgMobileLoaded = false;
let bgDesktopLoaded = false;

// 護眼配色常數
const THEME = {
  bg: [247, 243, 235],       // #F7F3EB 暖米白
  card: [234, 226, 211],     // #EAE2D3 燕麥奶灰
  text: [74, 63, 53],        // #4A3F35 深焙咖啡
  textMuted: [120, 108, 96], // 灰褐色
  btnDark: [43, 38, 35],     // #2B2623 深可可棕
  correct: [22, 163, 74],    // #16A34A 綠色
  wrong: [220, 38, 38],      // #DC2626 紅色
  amber: [217, 119, 6],      // #D97706 暖黃/金黃
  border: [218, 208, 192],
  mastBg: [30, 27, 24],      // #1E1B18 號誌燈箱底色
  mastBorder: [58, 51, 44]   // #3A332C
};

// 點擊判定區塊清單
let clickableAreas = [];
let lastClickTime = 0;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type, duration, delay = 0, gainLevel = 0.15) {
  if (!audioCtx) return;
  setTimeout(() => {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }, delay * 1000);
}

function playCorrectSound() {
  initAudio();
  playTone(523.25, "sine", 0.12, 0, 0.2);     
  playTone(659.25, "sine", 0.14, 0.08, 0.2);  
  playTone(783.99, "sine", 0.25, 0.16, 0.25); 
}

function playWrongSound() {
  initAudio();
  playTone(220.00, "triangle", 0.18, 0, 0.25);    
  playTone(185.00, "sawtooth", 0.32, 0.12, 0.25); 
}

function playCelebrationFanfare() {
  initAudio();
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    playTone(freq, "triangle", 0.22, idx * 0.12, 0.25);
  });
  setTimeout(() => {
    playTone(783.99, "sine", 0.2, 0, 0.2);
    playTone(1046.50, "sine", 0.5, 0.15, 0.3);
  }, 600);
}

// ============================================================
// p5.js 生命週期
// ============================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  // 載入首頁背景圖
  imgBgMobile = loadImage('media/DSC_4629_2.jpg', () => bgMobileLoaded = true);
  imgBgDesktop = loadImage('media/DSC_4607-3.jpg', () => bgDesktopLoaded = true);

  // 非同步載入所有題庫圖檔
  QUESTIONS_DATA.forEach((q, i) => {
    mediaLoadedFlags[i] = false;
    loadImage(
      q.src,
      (loadedImg) => {
        mediaAssets[i] = loadedImg;
        mediaLoadedFlags[i] = true;
      },
      () => {
        mediaLoadedFlags[i] = false;
        console.warn(`[資源載入提示] ${q.src} 無法存取，已切換為純向量號誌繪製模式。`);
      }
    );
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clickableAreas = []; // 每幀重新收集點擊熱區

  if (gameState === STATE_HOME) {
    drawHomeScreen();
  } else {
    // 測驗與結果畫面維持原本的暖色背景
    background(THEME.bg[0], THEME.bg[1], THEME.bg[2]);
    if (gameState === STATE_QUIZ) {
      drawQuizScreen();
    } else if (gameState === STATE_STAGE_TRANS) {
      drawStageTransitionScreen();
    } else if (gameState === STATE_RESULT) {
      drawResultScreen();
    }
  }
}

// ============================================================
// 1. 首頁畫面 
// ============================================================
function drawHomeScreen() {
  const isMobile = width < 768;
  const cx = width / 2;
  const cy = height / 2;

  let bgImg = isMobile ? (bgMobileLoaded ? imgBgMobile : null) : (bgDesktopLoaded ? imgBgDesktop : null);
  if (bgImg) {
    push();
    imageMode(CENTER);
    let aspect = bgImg.width / bgImg.height;
    let winAspect = width / height;
    let dw = width, dh = height;
    if (winAspect > aspect) { 
      dh = width / aspect; 
    } else { 
      dw = height * aspect; 
    }
    image(bgImg, width / 2, height / 2, dw, dh);
    
    rectMode(CENTER);
    fill(0, 0, 0, 100);
    noStroke();
    rect(width / 2, height / 2, width, height);

    if (!isMobile) {
      fill(255, 255, 255, 180);
      textSize(14);
      textAlign(RIGHT, BOTTOM);
      text("攝於2026/10/3 台南地上車站", width - 20, height - 20);
    }
    pop();
  } else {
    background(THEME.bg[0], THEME.bg[1], THEME.bg[2]);
  }

  const contentW = min(width * 0.9, 720);
  const cardH = min(height * 0.85, 520);

  push();
  rectMode(CENTER);

  fill(THEME.card[0], THEME.card[1], THEME.card[2], 245);
  stroke(THEME.border[0], THEME.border[1], THEME.border[2]);
  strokeWeight(2);
  rect(cx, cy, contentW, cardH, 24);

  noStroke();
  fill(THEME.amber[0], THEME.amber[1], THEME.amber[2], 30);
  rect(cx, cy - cardH * 0.36, isMobile ? 220 : 260, 32, 16);
  fill(THEME.amber[0], THEME.amber[1], THEME.amber[2]);
  textSize(isMobile ? 12 : 14);
  textStyle(BOLD);
  text("台鐵司機員號誌速限線上測驗", cx, cy - cardH * 0.36);

  fill(THEME.text[0], THEME.text[1], THEME.text[2]);
  textSize(isMobile ? 21 : 32);
  textStyle(BOLD);
  text("遵守行車號誌  絕不超速行駛", cx, cy - cardH * 0.22);

  textStyle(NORMAL);
  fill(THEME.textMuted[0], THEME.textMuted[1], THEME.textMuted[2]);
  textSize(isMobile ? 13 : 15);
  const descY = cy - cardH * 0.05;
  text("【階梯式考核闖關規則】", cx, descY - 30);
  text("階段一：單選題（第1~5題，需答對 2 題以上解鎖下一階段）", cx, descY);
  text("階段二：預告與臨時號誌（第6~8題，需答對 2 題以上晉級）", cx, descY + 26);
  text("階段三：最終情境題（第9~10題，司機員行車操作情境）", cx, descY + 52);

  const btnW = isMobile ? contentW * 0.75 : 240;
  const btnH = 52;
  const btnY = cy + cardH * 0.32;
  const isHover = mouseX > cx - btnW / 2 && mouseX < cx + btnW / 2 && mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2;

  fill(isHover ? 60 : THEME.btnDark[0], isHover ? 52 : THEME.btnDark[1], isHover ? 48 : THEME.btnDark[2]);
  rect(cx, btnY, btnW, btnH, 16);
  fill(255);
  textSize(isMobile ? 16 : 18);
  textStyle(BOLD);
  text("開始遊戲", cx, btnY);

  addClickable(cx - btnW / 2, btnY - btnH / 2, btnW, btnH, () => {
    initAudio();
    startNewGame();
  });
  pop();
}

// ============================================================
// 2. 測驗主畫面
// ============================================================
function drawQuizScreen() {
  const isMobile = width < 768;
  const qData = QUESTIONS_DATA[currentQIndex];
  const maxW = min(width * 0.94, 980);
  const cx = width / 2;

  drawHeaderBar(cx, maxW, isMobile, qData);

  if (isMobile) {
    drawQuizMobileLayout(cx, maxW, qData);
  } else {
    drawQuizDesktopLayout(cx, maxW, qData);
  }

  if (isAnswered) {
    drawExplanationPopup(cx, maxW, isMobile, qData);
  }
}

function drawHeaderBar(cx, maxW, isMobile, qData) {
  push();
  rectMode(CENTER);
  const topY = isMobile ? 40 : 55;

  fill(THEME.card[0], THEME.card[1], THEME.card[2]);
  stroke(THEME.border[0], THEME.border[1], THEME.border[2]);
  strokeWeight(1.5);
  rect(cx, topY, maxW, isMobile ? 44 : 52, 14);

  noStroke();
  textAlign(LEFT, CENTER);
  fill(THEME.text[0], THEME.text[1], THEME.text[2]);
  textSize(isMobile ? 13 : 15);
  textStyle(BOLD);
  text(qData.stageName, cx - maxW / 2 + 16, topY);

  textAlign(RIGHT, CENTER);
  fill(THEME.amber[0], THEME.amber[1], THEME.amber[2]);
  text(`第 ${currentQIndex + 1} / 10 題  |  得分：${userScore} 分`, cx + maxW / 2 - 16, topY);
  pop();
}

function drawQuizDesktopLayout(cx, maxW, qData) {
  const topReserve = 100; 
  const bottomReserve = 140; 
  const maxCardH = 500;
  const cardH = min(height - topReserve - bottomReserve, maxCardH);
  const cardCy = topReserve + cardH / 2; 

  const halfW = (maxW - 24) / 2;
  const leftCx = cx - halfW / 2 - 6;
  const rightCx = cx + halfW / 2 + 6;

  push();
  rectMode(CENTER);
  fill(THEME.card[0], THEME.card[1], THEME.card[2]);
  stroke(THEME.border[0], THEME.border[1], THEME.border[2]);
  strokeWeight(2);
  rect(leftCx, cardCy, halfW, cardH, 20);

  renderSignalMedia(leftCx, cardCy, halfW - 40, cardH - 50, qData);
  pop();

  push();
  rectMode(CENTER);
  fill(THEME.card[0], THEME.card[1], THEME.card[2]);
  stroke(THEME.border[0], THEME.border[1], THEME.border[2]);
  strokeWeight(2);
  rect(rightCx, cardCy, halfW, cardH, 20);

  rectMode(CORNER);
  noStroke();
  fill(THEME.text[0], THEME.text[1], THEME.text[2]);
  textAlign(CENTER, CENTER); 
  textWrap(CHAR); 
  textStyle(BOLD);
  textSize(18); 
  
  const textPad = 24;
  const textY = cardCy - cardH / 2 + 20;
  const textBoxH = 110; 
  
  text(qData.q, rightCx - halfW / 2 + textPad, textY, halfW - textPad * 2, textBoxH);

  const optionsStartY = textY + textBoxH + 8;
  const bottomPadding = 20;
  const availableOptSpace = (cardCy + cardH / 2) - optionsStartY - bottomPadding;
  const optGap = 12;
  
  let optH = Math.floor((availableOptSpace - optGap * 3) / 4);
  optH = min(optH, 58); 
  
  const optW = halfW - textPad * 2;
  const actualTotalOptsH = 4 * optH + 3 * optGap;
  const adjustedStartY = optionsStartY + max(0, (availableOptSpace - actualTotalOptsH) / 2);

  qData.options.forEach((opt, idx) => {
    const btnCx = rightCx;
    const btnCy = adjustedStartY + idx * (optH + optGap) + optH / 2;
    drawOptionButton(btnCx, btnCy, optW, optH, opt, qData);
  });
  pop();
}

function drawQuizMobileLayout(cx, maxW, qData) {
  const headerH = 80; 
  const bottomReserve = 140; 
  const availableMobileH = height - headerH - bottomReserve;

  const imgBoxH = min(availableMobileH * 0.3, 180);
  const imgCy = headerH + imgBoxH / 2;

  push();
  rectMode(CENTER);
  fill(THEME.card[0], THEME.card[1], THEME.card[2]);
  stroke(THEME.border[0], THEME.border[1], THEME.border[2]);
  strokeWeight(1.5);
  rect(cx, imgCy, maxW, imgBoxH, 16);
  renderSignalMedia(cx, imgCy, maxW - 24, imgBoxH - 20, qData);
  pop();

  push();
  const qTextY = headerH + imgBoxH + 12;
  
  rectMode(CORNER);
  noStroke();
  fill(THEME.text[0], THEME.text[1], THEME.text[2]);
  textAlign(CENTER, CENTER);
  textWrap(CHAR); 
  textStyle(BOLD);
  textSize(16); 
  
  const textPad = 16;
  const textBoxH = 110; 
  text(qData.q, cx - maxW / 2 + textPad, qTextY, maxW - textPad * 2, textBoxH);

  const optionsStartY = qTextY + textBoxH + 4;
  const availableOptSpace = (height - bottomReserve + 20) - optionsStartY;
  const optGap = 10;
  
  let optH = Math.floor((availableOptSpace - optGap * 3) / 4);
  optH = constrain(optH, 36, 52); 
  
  const actualTotalOptsH = 4 * optH + 3 * optGap;
  const adjustedStartY = optionsStartY + max(0, (availableOptSpace - actualTotalOptsH) / 2);

  qData.options.forEach((opt, idx) => {
    const btnCy = adjustedStartY + idx * (optH + optGap) + optH / 2;
    drawOptionButton(cx, btnCy, maxW - 32, optH, opt, qData);
  });
  pop();
}

function renderSignalMedia(boxCx, boxCy, maxW, maxH, qData) {
  const imgAsset = mediaAssets[currentQIndex];
  const isLoaded = mediaLoadedFlags[currentQIndex];

  if (isLoaded && imgAsset && imgAsset.width > 1 && imgAsset.height > 1) {
    const aspect = imgAsset.width / imgAsset.height;
    if (isFinite(aspect) && aspect > 0) {
      let drawW = maxW;
      let drawH = drawW / aspect;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * aspect;
      }
      image(imgAsset, boxCx, boxCy, drawW, drawH);
      return;
    }
  }
  drawFallbackVectorSignal(boxCx, boxCy, qData);
}

function drawFallbackVectorSignal(boxCx, boxCy, qData) {
  push();
  rectMode(CENTER);
  const isBlinkOn = (Math.floor(millis() / 500) % 2 === 0);

  if (qData.fallbackType === "3_aspect") {
    drawSignalMastPill(boxCx, boxCy, 80, 180);
    const ys = [boxCy - 50, boxCy, boxCy + 50];
    const colors = [[239, 68, 68], [251, 191, 36], [34, 197, 94]]; 
    ys.forEach((ly, idx) => {
      drawLampCircle(boxCx, ly, 18, idx === qData.activeLamp ? colors[idx] : null);
    });
  } else if (qData.fallbackType === "4_aspect_yy") {
    drawSignalMastPill(boxCx, boxCy, 80, 220);
    const ys = [boxCy - 75, boxCy - 25, boxCy + 25, boxCy + 75];
    ys.forEach((ly, idx) => {
      const isLit = (idx === 0 || idx === 3);
      drawLampCircle(boxCx, ly, 16, isLit ? [251, 191, 36] : null);
    });
  } else if (qData.fallbackType === "3_aspect_ryf") {
    drawSignalMastPill(boxCx, boxCy, 80, 180);
    drawLampCircle(boxCx, boxCy - 50, 18, [239, 68, 68]);             
    drawLampCircle(boxCx, boxCy, 18, null);                            
    drawLampCircle(boxCx, boxCy + 50, 18, isBlinkOn ? [251, 191, 36] : null); 
  } else if (qData.fallbackType === "3_aspect_rf") {
    drawSignalMastPill(boxCx, boxCy, 80, 180);
    drawLampCircle(boxCx, boxCy - 50, 18, null);
    drawLampCircle(boxCx, boxCy, 18, null);
    drawLampCircle(boxCx, boxCy + 50, 18, isBlinkOn ? [239, 68, 68] : null); 
  } else if (qData.fallbackType === "repeating") {
    fill(THEME.mastBg[0], THEME.mastBg[1], THEME.mastBg[2]);
    stroke(THEME.mastBorder[0], THEME.mastBorder[1], THEME.mastBorder[2]);
    strokeWeight(4);
    ellipse(boxCx, boxCy, 170, 170);
    [[-40, 40], [0, 0], [40, -40]].forEach(([dx, dy]) => {
      drawLampCircle(boxCx + dx, boxCy + dy, 15, [255, 255, 250]);
    });
  } else if (qData.fallbackType === "temp_slow") {
    fill(THEME.mastBorder[0], THEME.mastBorder[1], THEME.mastBorder[2]);
    noStroke();
    rect(boxCx, boxCy + 70, 12, 100);
    fill(255);
    stroke(THEME.mastBorder[0], THEME.mastBorder[1], THEME.mastBorder[2]);
    strokeWeight(3);
    ellipse(boxCx, boxCy - 10, 150, 150);
    fill(251, 191, 36);
    noStroke();
    ellipse(boxCx, boxCy - 10, 110, 110);
  } else {
    fill(255, 255, 255, 120);
    noStroke();
    rect(boxCx, boxCy, 200, 120, 16);
    fill(THEME.text[0], THEME.text[1], THEME.text[2]);
    textSize(14);
    textStyle(BOLD);
    text("【手作號誌情境演示】", boxCx, boxCy - 20);
    textStyle(NORMAL);
    textSize(12);
    text("（請依題目敘述判斷正確速限）", boxCx, boxCy + 15);
  }
  pop();
}

function drawSignalMastPill(cx, cy, w, h) {
  fill(THEME.mastBg[0], THEME.mastBg[1], THEME.mastBg[2]);
  stroke(THEME.mastBorder[0], THEME.mastBorder[1], THEME.mastBorder[2]);
  strokeWeight(3.5);
  rect(cx, cy, w, h, 36);
}

function drawLampCircle(cx, cy, r, colorRgb) {
  if (colorRgb) {
    fill(colorRgb[0], colorRgb[1], colorRgb[2]);
    stroke(0, 0, 0, 150);
    strokeWeight(2);
    ellipse(cx, cy, r * 2, r * 2);
  } else {
    fill(65, 60, 56);
    stroke(0, 0, 0, 120);
    strokeWeight(2);
    ellipse(cx, cy, r * 2, r * 2);
  }
}

function drawOptionButton(btnCx, btnCy, btnW, btnH, optText, qData) {
  push();
  rectMode(CENTER);

  let bgCol = [255, 255, 255];
  let borderCol = THEME.border;
  let textCol = [0, 0, 0]; 

  if (isAnswered) {
    if (optText === qData.answer) {
      bgCol = THEME.correct;
      borderCol = [15, 118, 54];
      textCol = [255, 255, 255]; 
    } else if (optText === selectedOption && !isCorrectAnswer) {
      bgCol = THEME.wrong;
      borderCol = [185, 28, 28];
      textCol = [255, 255, 255]; 
    } else {
      bgCol = [240, 235, 226];
      textCol = [120, 120, 120]; 
    }
  } else {
    const isHover = mouseX > btnCx - btnW / 2 && mouseX < btnCx + btnW / 2 && mouseY > btnCy - btnH / 2 && mouseY < btnCy + btnH / 2;
    if (isHover) {
      bgCol = [250, 246, 238];
      borderCol = [0, 0, 0];
    }
  }

  fill(bgCol[0], bgCol[1], bgCol[2]);
  stroke(borderCol[0], borderCol[1], borderCol[2]);
  strokeWeight(isAnswered && (optText === qData.answer || optText === selectedOption) ? 2.5 : 1.5);
  rect(btnCx, btnCy, btnW, btnH, 12);

  noStroke();
  fill(textCol[0], textCol[1], textCol[2]);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(btnH >= 60 ? 18 : (btnH > 46 ? 16 : 14));
  text(optText, btnCx, btnCy);

  if (!isAnswered) {
    addClickable(btnCx - btnW / 2, btnCy - btnH / 2, btnW, btnH, () => {
      handleOptionSelect(optText, qData);
    });
  }
  pop();
}

function handleOptionSelect(optText, qData) {
  selectedOption = optText;
  isAnswered = true;
  totalAnswered++;

  if (optText === qData.answer) {
    isCorrectAnswer = true;
    userScore += 10;
    playCorrectSound();
    if (qData.stage === 1) stage1Correct++;
    else if (qData.stage === 2) stage2Correct++;
    else if (qData.stage === 3) stage3Correct++;
  } else {
    isCorrectAnswer = false;
    playWrongSound();
    wrongQuestionsList.push({
      q: qData.q,
      userAns: optText,
      correctAns: qData.answer,
      explain: qData.explain
    });
  }
}

function drawExplanationPopup(cx, maxW, isMobile, qData) {
  push();
  rectMode(CENTER);
  const popupH = isMobile ? 130 : 115;
  const popupY = height - popupH / 2 - 12;

  fill(THEME.btnDark[0], THEME.btnDark[1], THEME.btnDark[2], 25);
  noStroke();
  rect(cx, popupY + 4, maxW, popupH, 20);

  fill(THEME.card[0], THEME.card[1], THEME.card[2]);
  stroke(isCorrectAnswer ? THEME.correct[0] : THEME.wrong[0], isCorrectAnswer ? THEME.correct[1] : THEME.wrong[1], isCorrectAnswer ? THEME.correct[2] : THEME.wrong[2]);
  strokeWeight(2.5);
  rect(cx, popupY, maxW, popupH, 20);

  rectMode(CORNER);
  textAlign(LEFT, TOP); 
  noStroke();
  fill(THEME.text[0], THEME.text[1], THEME.text[2]); 
  
  textStyle(BOLD);
  textSize(isMobile ? 15 : 17);
  
  const textX = cx - maxW / 2 + 24; 
  const titleY = popupY - popupH / 2 + 16; 

  if (isCorrectAnswer) {
    text("👏 恭喜答對！ ＋10 分", textX, titleY);
  } else {
    text(`❌ 答錯了！ 正確答案為：${qData.answer}`, textX, titleY);
  }

  textStyle(NORMAL);
  textSize(isMobile ? 12 : 14); 
  textWrap(CHAR); 
  const textW = isMobile ? maxW - 48 : maxW - 160;
  const descY = titleY + 28; 
  text(qData.explain, textX, descY, textW, popupH - 45); 

  rectMode(CENTER);
  const nextBtnW = isMobile ? maxW - 48 : 120;
  const nextBtnH = isMobile ? 38 : 42;
  const nextBtnX = isMobile ? cx : cx + maxW / 2 - nextBtnW / 2 - 20;
  const nextBtnY = isMobile ? popupY + popupH / 2 - nextBtnH / 2 - 12 : popupY;

  fill(THEME.btnDark[0], THEME.btnDark[1], THEME.btnDark[2]);
  noStroke();
  rect(nextBtnX, nextBtnY, nextBtnW, nextBtnH, 12);

  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(isMobile ? 14 : 15);
  const isLastOfStage = (currentQIndex === 4 || currentQIndex === 7 || currentQIndex === 9);
  text(isLastOfStage ? "檢視階段" : "下一題 ➔", nextBtnX, nextBtnY);

  addClickable(nextBtnX - nextBtnW / 2, nextBtnY - nextBtnH / 2, nextBtnW, nextBtnH, () => {
    handleNextQuestion();
  });
  pop();
}

function handleNextQuestion() {
  isAnswered = false;
  selectedOption = null;

  if (currentQIndex === 4) {
    if (stage1Correct >= 2) {
      transitionMsg = {
        title: "🎉 第一階段達標！",
        desc: `您在單選題答對 ${stage1Correct} / 5 題（門檻為 2 題），成功解鎖第二階段！`,
        success: true,
        targetIndex: 5
      };
      gameState = STATE_STAGE_TRANS;
    } else {
      transitionMsg = {
        title: "⚠️ 第一階段未達標",
        desc: `您在單選題答對 ${stage1Correct} / 5 題（需答對 2 題以上），未能晉級第二階段。`,
        success: false,
        targetIndex: -1
      };
      gameState = STATE_STAGE_TRANS;
    }
    return;
  }

  if (currentQIndex === 7) {
    if (stage2Correct >= 2) {
      transitionMsg = {
        title: "🚀 第二階段達標！",
        desc: `您在第二階段答對 ${stage2Correct} / 3 題（門檻為 2 題），晉級最終情境考驗！`,
        success: true,
        targetIndex: 8
      };
      gameState = STATE_STAGE_TRANS;
    } else {
      transitionMsg = {
        title: "⚠️ 第二階段未達標",
        desc: `您在第二階段答對 ${stage2Correct} / 3 題（需答對 2 題以上），未能晉級最終情境題。`,
        success: false,
        targetIndex: -1
      };
      gameState = STATE_STAGE_TRANS;
    }
    return;
  }

  if (currentQIndex === 9) {
    gameState = STATE_RESULT;
    checkCelebration();
    return;
  }

  currentQIndex++;
}

// ============================================================
// 3. 階段過場提示畫面
// ============================================================
function drawStageTransitionScreen() {
  const isMobile = width < 768;
  const contentW = min(width * 0.9, 640);
  const cardH = 340;
  const cx = width / 2;
  const cy = height / 2;

  push();
  rectMode(CENTER);
  fill(THEME.card[0], THEME.card[1], THEME.card[2]);
  stroke(transitionMsg.success ? THEME.correct[0] : THEME.wrong[0], transitionMsg.success ? THEME.correct[1] : THEME.wrong[1], transitionMsg.success ? THEME.correct[2] : THEME.wrong[2]);
  strokeWeight(3);
  rect(cx, cy, contentW, cardH, 24);

  noStroke();
  fill(transitionMsg.success ? THEME.correct[0] : THEME.wrong[0], transitionMsg.success ? THEME.correct[1] : THEME.wrong[1], transitionMsg.success ? THEME.correct[2] : THEME.wrong[2]);
  textSize(isMobile ? 22 : 28);
  textStyle(BOLD);
  text(transitionMsg.title, cx, cy - 70);

  fill(THEME.text[0], THEME.text[1], THEME.text[2]);
  textSize(isMobile ? 14 : 16);
  textStyle(NORMAL);
  text(transitionMsg.desc, cx, cy, contentW - 60);

  const btnW = 200;
  const btnH = 48;
  const btnY = cy + 85;
  fill(THEME.btnDark[0], THEME.btnDark[1], THEME.btnDark[2]);
  rect(cx, btnY, btnW, btnH, 14);

  fill(255);
  textStyle(BOLD);
  textSize(16);
  text(transitionMsg.success ? "進入下一階段 ➔" : "查看總結與錯題", cx, btnY);

  addClickable(cx - btnW / 2, btnY - btnH / 2, btnW, btnH, () => {
    if (transitionMsg.success) {
      currentQIndex = transitionMsg.targetIndex;
      gameState = STATE_QUIZ;
    } else {
      gameState = STATE_RESULT;
      checkCelebration();
    }
  });
  pop();
}

// ============================================================
// 4. 總結成績與彩帶畫面 (優化文字安全邊界與置中)
// ============================================================
function checkCelebration() {
  const totalCorrect = totalAnswered - wrongQuestionsList.length;
  if (totalCorrect >= 8 && !celebrationPlayed) {
    celebrationPlayed = true;
    createConfetti();
    playCelebrationFanfare();
  }
}

function drawResultScreen() {
  const isMobile = width < 768;
  const contentW = min(width * 0.92, 840);
  const cx = width / 2;
  const totalCorrect = totalAnswered - wrongQuestionsList.length;

  let scoreColor, ratingWord;
  if (totalCorrect <= 4) {
    scoreColor = THEME.wrong;
    ratingWord = "【再接再厲！】熟悉號誌是行車安全的第一步，多加複習與對照一定能掌握！";
  } else if (totalCorrect <= 7) {
    scoreColor = THEME.amber;
    ratingWord = "【加油，表現不錯！】號誌速限判斷已具備良好基礎，針對錯題加強就能邁向合格司機員！";
  } else {
    scoreColor = THEME.correct;
    ratingWord = "【恭喜！太優秀了！】精準掌握號誌與速限判斷，具備準司機員的專業水準！";
  }

  if (totalCorrect >= 8) {
    updateAndDrawConfetti();
  }

  push();
  rectMode(CENTER);
  const cardH = min(height * 0.9, isMobile ? 720 : 680);
  fill(THEME.card[0], THEME.card[1], THEME.card[2]);
  stroke(THEME.border[0], THEME.border[1], THEME.border[2]);
  strokeWeight(2);
  rect(cx, height / 2, contentW, cardH, 24);

  noStroke();
  fill(THEME.text[0], THEME.text[1], THEME.text[2]);
  textSize(isMobile ? 20 : 26);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("測驗結束・總結成績", cx, height / 2 - cardH * 0.42);

  fill(scoreColor[0], scoreColor[1], scoreColor[2]);
  textSize(isMobile ? 44 : 64);
  text(`${userScore} 分`, cx, height / 2 - cardH * 0.28);

  textSize(isMobile ? 14 : 17);
  fill(scoreColor[0], scoreColor[1], scoreColor[2]);
  text(`總共答對 ${totalCorrect} / ${totalAnswered} 題（滿分 100 分）`, cx, height / 2 - cardH * 0.17);

  // 評語：精準置中並強制自動換行
  fill(THEME.text[0], THEME.text[1], THEME.text[2]);
  textSize(isMobile ? 13 : 15);
  textStyle(NORMAL);
  rectMode(CORNER);
  textAlign(CENTER, TOP); 
  textWrap(CHAR); 
  const ratingY = height / 2 - cardH * 0.11;
  text(ratingWord, cx - (contentW - 60) / 2, ratingY, contentW - 60, 60);

  // 錯題解析列表
  const listTop = height / 2;
  const listH = cardH * 0.32; 
  rectMode(CENTER);
  fill(255, 255, 255, 180);
  stroke(THEME.border[0], THEME.border[1], THEME.border[2]);
  strokeWeight(1);
  rect(cx, listTop + listH / 2 - 10, contentW - 48, listH, 16);

  noStroke();
  if (wrongQuestionsList.length === 0) {
    fill(THEME.correct[0], THEME.correct[1], THEME.correct[2]);
    textSize(isMobile ? 14 : 16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    textWrap(CHAR); 
    rectMode(CORNER);
    text("🌟 太厲害了！本次測驗完全零失誤，所有號誌皆正確判斷！", cx - (contentW - 80) / 2, listTop + listH / 2 - 30, contentW - 80, 60);
  } else {
    fill(THEME.text[0], THEME.text[1], THEME.text[2]);
    rectMode(CORNER);
    textAlign(CENTER, TOP); // 置中對齊
    textStyle(BOLD);
    textSize(13);
    text(`錯題解析列表（共答錯 ${wrongQuestionsList.length} 題）：`, cx - (contentW - 60) / 2, listTop + 6, contentW - 60, 25);

    textStyle(NORMAL);
    textSize(isMobile ? 11 : 12);
    textWrap(CHAR); // 確保文字在邊界處依字元自動斷行
    
    let wrongStr = "";
    // 手機版僅顯示 1 題錯題避免畫面擠爆，電腦版顯示 2 題
    let maxDisplay = isMobile ? 1 : 2; 
    let displayCount = min(wrongQuestionsList.length, maxDisplay);
    
    for(let i = 0; i < displayCount; i++) {
      let item = wrongQuestionsList[i];
      let cleanQ = item.q.replace(/\n/g, " "); // 清掉題目自帶的換行符號
      wrongStr += `【題目】${cleanQ}\n您答: ${item.userAns} | 正解: ${item.correctAns}\n(解析: ${item.explain})\n\n`;
    }
    if (wrongQuestionsList.length > maxDisplay) {
      wrongStr += `...及其他 ${wrongQuestionsList.length - maxDisplay} 題錯題`;
    }

    // 嚴格限制文字外框，絕對不超出
    text(wrongStr, cx - (contentW - 60) / 2, listTop + 30, contentW - 60, listH - 45);
  }

  // 結算畫面按鈕區
  const btnW = isMobile ? contentW * 0.7 : 180;
  const btnH = 46;
  
  const restartBtnX = isMobile ? cx : cx - btnW / 2 - 10;
  const restartBtnY = isMobile ? height / 2 + cardH * 0.30 : height / 2 + cardH * 0.40;

  const homeBtnX = isMobile ? cx : cx + btnW / 2 + 10;
  const homeBtnY = isMobile ? height / 2 + cardH * 0.41 : height / 2 + cardH * 0.40;

  rectMode(CENTER);
  
  fill(THEME.btnDark[0], THEME.btnDark[1], THEME.btnDark[2]);
  noStroke();
  rect(restartBtnX, restartBtnY, btnW, btnH, 14);
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(16);
  text("🔄 重新測驗", restartBtnX, restartBtnY);

  addClickable(restartBtnX - btnW / 2, restartBtnY - btnH / 2, btnW, btnH, () => {
    startNewGame();
  });

  fill(THEME.btnDark[0], THEME.btnDark[1], THEME.btnDark[2]);
  rect(homeBtnX, homeBtnY, btnW, btnH, 14);
  fill(255);
  text("🏠 回首頁", homeBtnX, homeBtnY);

  addClickable(homeBtnX - btnW / 2, homeBtnY - btnH / 2, btnW, btnH, () => {
    gameState = STATE_HOME;
    bgMobileLoaded = false;
    bgDesktopLoaded = false;
    setup(); 
  });

  pop();
}

// ============================================================
// 5. 彩帶特效系統 (Confetti)
// ============================================================
function createConfetti() {
  confettiParticles = [];
  const colors = [
    [239, 68, 68],  
    [245, 158, 11], 
    [34, 197, 94],  
    [59, 130, 246], 
    [168, 85, 247], 
    [236, 72, 153]  
  ];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: random(width),
      y: random(-height, 0),
      w: random(8, 14),
      h: random(6, 12),
      vx: random(-2, 2),
      vy: random(2, 6),
      rot: random(360),
      vrot: random(-6, 6),
      col: random(colors)
    });
  }
}

function updateAndDrawConfetti() {
  push();
  rectMode(CENTER);
  noStroke();
  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;
    if (p.y > height) {
      p.y = -20;
      p.x = random(width);
    }
    push();
    translate(p.x, p.y);
    rotate(radians(p.rot));
    fill(p.col[0], p.col[1], p.col[2]);
    rect(0, 0, p.w, p.h);
    pop();
  });
  pop();
}

// ============================================================
// 6. 工具與穩健點擊判定系統
// ============================================================
function startNewGame() {
  gameState = STATE_QUIZ;
  currentQIndex = 0;
  userScore = 0;
  totalAnswered = 0;
  stage1Correct = 0;
  stage2Correct = 0;
  stage3Correct = 0;
  selectedOption = null;
  isAnswered = false;
  isCorrectAnswer = false;
  wrongQuestionsList = [];
  celebrationPlayed = false;
  confettiParticles = [];
}

function addClickable(x, y, w, h, cb) {
  clickableAreas.push({ x, y, w, h, cb });
}

function triggerClick(px, py) {
  const now = millis();
  if (now - lastClickTime < 250) return; 

  initAudio();
  for (let i = clickableAreas.length - 1; i >= 0; i--) {
    const area = clickableAreas[i];
    if (px >= area.x && px <= area.x + area.w && py >= area.y && py <= area.y + area.h) {
      lastClickTime = now;
      area.cb();
      break;
    }
  }
}

function mousePressed() {
  triggerClick(mouseX, mouseY);
}

function touchStarted() {
  let tx = mouseX;
  let ty = mouseY;
  if (touches && touches.length > 0) {
    tx = touches[0].x;
    ty = touches[0].y;
  }
  triggerClick(tx, ty);
}