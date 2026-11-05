
/* ==========================================
   FutureAI - AI 工具互動比較器
   script.js
   五大分類 × 六款工具 = 30 款
========================================== */

// 一、AI 工具資料庫
// 以下是工具特色的簡要介紹，不代表即時價格或排名。

const aiDatabase = {
  "聊天 AI": [
    {
      name: "ChatGPT",
      feature: "通用型對話與多模態 AI 助手",
      functions: "問答、寫作、翻譯、程式協助、圖像理解與生成",
      audience: "學生、上班族、創作者、開發者",
      advantage: "用途廣泛，適合多種日常與專業工作",
      limitation: "部分進階功能與使用額度依方案而異"
    },
    {
      name: "Claude",
      feature: "著重文字理解、分析與文件處理",
      functions: "長篇寫作、文件摘要、研究分析、程式協助",
      audience: "研究人員、文字工作者、開發者",
      advantage: "適合整理複雜資料及長篇內容",
      limitation: "功能、模型與使用額度依方案及地區而異"
    },
    {
      name: "Gemini",
      feature: "Google 生態系的多模態 AI 助手",
      functions: "問答、寫作、圖片理解、研究及 Google 服務整合",
      audience: "學生、Google 服務使用者、上班族",
      advantage: "適合搭配 Google 相關工具使用",
      limitation: "部分整合及進階功能需符合方案與地區條件"
    },
    {
      name: "Grok",
      feature: "具備即時資訊探索特色的 AI 助手",
      functions: "對話、資料整理、寫作、推理與資訊探索",
      audience: "一般使用者、內容創作者、資訊研究者",
      advantage: "適合探索熱門議題與多元觀點",
      limitation: "資訊仍需查證，功能與額度依服務方案而異"
    },
    {
      name: "DeepSeek",
      feature: "著重推理及程式任務的 AI 模型服務",
      functions: "推理問答、程式生成、除錯、數學分析",
      audience: "學生、工程師、技術研究者",
      advantage: "適合邏輯推理與技術性問題",
      limitation: "不同模型與服務入口的能力及限制可能不同"
    },
    {
      name: "Microsoft Copilot",
      feature: "結合 Microsoft 服務的 AI 助手",
      functions: "問答、寫作、資料整理、辦公工作輔助",
      audience: "企業員工、學生、Microsoft 使用者",
      advantage: "可與部分 Microsoft 工作流程整合",
      limitation: "Microsoft 365 等進階整合可能需要額外授權"
    }
  ],

  "繪圖 AI": [
    {
      name: "Midjourney",
      feature: "強調視覺美感與創意風格的圖像生成",
      functions: "文字生成圖片、風格探索、概念設計",
      audience: "設計師、藝術家、內容創作者",
      advantage: "適合製作富有風格的視覺作品",
      limitation: "使用權限、費用及圖片授權需依官方方案確認"
    },
    {
      name: "Adobe Firefly",
      feature: "Adobe 旗下的生成式創意工具",
      functions: "圖片生成、生成式編輯、視覺素材製作",
      audience: "設計師、行銷人員、Adobe 使用者",
      advantage: "適合與 Adobe 創作流程搭配",
      limitation: "生成額度與可用功能依方案不同"
    },
    {
      name: "FLUX",
      feature: "高品質文字生成圖像模型系列",
      functions: "文字生成圖片、圖像編輯、風格製作",
      audience: "設計師、開發者、AI 創作者",
      advantage: "提供多種模型及部署使用方式",
      limitation: "授權、費用及功能取決於模型版本與服務平台"
    },
    {
      name: "Ideogram",
      feature: "重視文字排版與視覺設計的圖像工具",
      functions: "海報、文字圖像、品牌視覺、創意圖片",
      audience: "平面設計師、行銷人員、創作者",
      advantage: "適合製作含文字的視覺素材",
      limitation: "複雜文字及排版仍需人工檢查"
    },
    {
      name: "Stable Diffusion",
      feature: "可高度客製化的圖像生成模型生態系",
      functions: "文生圖、圖生圖、模型微調、風格控制",
      audience: "技術創作者、開發者、設計師",
      advantage: "部署與自訂工作流程的彈性較高",
      limitation: "自行部署可能需要硬體及技術知識"
    },
    {
      name: "ChatGPT 圖像生成",
      feature: "透過自然語言對話建立與修改圖片",
      functions: "圖片生成、圖像修改、視覺構想、素材製作",
      audience: "一般使用者、學生、設計與行銷人員",
      advantage: "能以對話方式反覆調整圖片需求",
      limitation: "生成額度與編輯功能依方案及版本而異"
    }
  ],

  "影片 AI": [
    {
      name: "Runway",
      feature: "AI 影片生成與創意製作平台",
      functions: "文字生成影片、圖片生成影片、影片編輯",
      audience: "影像創作者、導演、行銷團隊",
      advantage: "提供整合式 AI 影片創作流程",
      limitation: "生成點數、解析度及功能依方案不同"
    },
    {
      name: "Kling AI",
      feature: "文字及圖片驅動的 AI 影片生成",
      functions: "文生影片、圖生影片、動態畫面製作",
      audience: "短影音創作者、設計師、行銷人員",
      advantage: "適合製作具有動態效果的視覺片段",
      limitation: "生成時間、額度與輸出品質可能因方案而異"
    },
    {
      name: "Pika",
      feature: "偏向快速創意影片與視覺特效",
      functions: "短片生成、圖片動畫、創意特效",
      audience: "社群創作者、短影音製作者",
      advantage: "適合製作有趣的短篇視覺內容",
      limitation: "長影片與複雜鏡頭可能需要多次生成"
    },
    {
      name: "Luma AI",
      feature: "AI 影像與動態內容生成平台",
      functions: "影片生成、圖像動畫、創意視覺製作",
      audience: "影像創作者、廣告與設計團隊",
      advantage: "適合探索電影感及動態視覺概念",
      limitation: "輸出規格、生成額度與功能可能調整"
    },
    {
      name: "Google Flow",
      feature: "Google 的 AI 影像敘事與影片創作工具",
      functions: "AI 影片創作、場景設計、影像敘事",
      audience: "電影創作者、影像工作者、設計師",
      advantage: "適合規劃連貫的視覺敘事",
      limitation: "可用地區、模型及功能依官方服務規定"
    },
    {
      name: "Hailuo AI",
      feature: "以文字與圖片產生影片內容",
      functions: "文生影片、圖生影片、短片創作",
      audience: "社群創作者、行銷人員、影像愛好者",
      advantage: "適合快速探索不同影片創意",
      limitation: "人物一致性及動作細節仍需檢查"
    }
  ],

  "音樂 AI": [
    {
      name: "Suno",
      feature: "以文字描述生成歌曲的 AI 音樂平台",
      functions: "歌曲生成、歌詞與人聲創作、音樂風格探索",
      audience: "音樂愛好者、創作者、影音製作者",
      advantage: "能快速將創意轉換成完整歌曲",
      limitation: "商業使用權及生成額度依方案規定"
    },
    {
      name: "Udio",
      feature: "AI 歌曲與音樂片段生成工具",
      functions: "歌曲生成、音樂延伸、風格實驗",
      audience: "音樂創作者、內容製作者",
      advantage: "適合探索不同歌曲風格與創作構想",
      limitation: "功能可用性及授權條款需以官方資訊為準"
    },
    {
      name: "AIVA",
      feature: "以配樂與作曲為主的 AI 音樂工具",
      functions: "背景配樂、器樂作曲、音樂編排",
      audience: "影片製作者、遊戲開發者、作曲者",
      advantage: "適合製作情境式器樂及背景音樂",
      limitation: "下載格式及商用授權依方案而異"
    },
    {
      name: "Soundraw",
      feature: "以需求條件生成背景音樂",
      functions: "音樂生成、情緒選擇、曲風與長度調整",
      audience: "YouTuber、行銷人員、影片剪輯者",
      advantage: "適合依影片氛圍挑選與調整配樂",
      limitation: "下載及使用授權須遵守官方條款"
    },
    {
      name: "Beatoven.ai",
      feature: "面向影片及內容創作的 AI 配樂工具",
      functions: "背景音樂生成、情緒設定、影片配樂",
      audience: "Podcast、影片創作者、內容團隊",
      advantage: "適合依情境快速建立背景音樂",
      limitation: "商業使用及下載條件依方案規定"
    },
    {
      name: "Stable Audio",
      feature: "AI 音樂及音效生成服務",
      functions: "文字生成音樂、音效製作、聲音素材生成",
      audience: "音效設計師、影片製作者、創作者",
      advantage: "適合製作音樂與聲音素材",
      limitation: "長度限制、授權及可用功能依服務版本而異"
    }
  ],

  "程式 AI": [
    {
      name: "GitHub Copilot",
      feature: "整合開發環境的 AI 程式助手",
      functions: "程式補全、程式解說、除錯、程式碼建議",
      audience: "軟體工程師、學生、開發團隊",
      advantage: "適合在日常編碼流程中取得 AI 協助",
      limitation: "功能及使用額度依方案和 IDE 支援情況而異"
    },
    {
      name: "Cursor",
      feature: "以 AI 為核心的程式碼編輯器",
      functions: "程式生成、專案理解、跨檔案修改、除錯",
      audience: "程式設計師、獨立開發者",
      advantage: "適合在同一編輯器內進行 AI 輔助開發",
      limitation: "部分模型與進階功能依訂閱方案而異"
    },
    {
      name: "Windsurf",
      feature: "AI 輔助程式開發環境",
      functions: "程式生成、程式碼理解、修改與除錯",
      audience: "開發者、工程團隊、程式學習者",
      advantage: "適合結合 AI 與專案開發工作流程",
      limitation: "模型、額度及功能可能依方案調整"
    },
    {
      name: "Replit Agent",
      feature: "以自然語言協助建立應用程式",
      functions: "應用程式建立、程式修改、測試與部署協助",
      audience: "初學者、創業者、快速原型開發者",
      advantage: "適合快速製作與測試應用程式原型",
      limitation: "部署資源及 Agent 使用量依方案計算"
    },
    {
      name: "Tabnine",
      feature: "聚焦程式碼建議的 AI 開發工具",
      functions: "程式補全、程式碼建議、開發流程輔助",
      audience: "工程師、企業開發團隊",
      advantage: "適合重視團隊開發流程的使用者",
      limitation: "企業管理與模型功能依方案不同"
    },
    {
      name: "Amazon Q Developer",
      feature: "AWS 生態系的 AI 開發助手",
      functions: "程式協助、AWS 問答、除錯與雲端開發輔助",
      audience: "雲端工程師、AWS 使用者、開發者",
      advantage: "適合搭配 AWS 相關開發工作",
      limitation: "部分功能需 AWS 環境及適用權限"
    }
  ]
};


// 二、取得 HTML 元素

const categoryButtons =
  document.querySelectorAll(".category-btn");

const toolASelect =
  document.getElementById("tool-a");

const toolBSelect =
  document.getElementById("tool-b");

const compareButton =
  document.getElementById("compare-btn");

const compareMessage =
  document.getElementById("compare-message");

const resultNameA =
  document.getElementById("result-name-a");

const resultNameB =
  document.getElementById("result-name-b");

const comparisonResults =
  document.getElementById("comparison-results");

const resultsSection =
  document.getElementById("results-section");


// 三、目前選擇的分類

let currentCategory = "聊天 AI";


// 四、依照分類更新工具選單

function updateToolOptions(category) {
  const tools = aiDatabase[category] || [];

  toolASelect.innerHTML = "";
  toolBSelect.innerHTML = "";

  tools.forEach((tool) => {
    const optionA = document.createElement("option");
    optionA.value = tool.name;
    optionA.textContent = tool.name;

    const optionB = document.createElement("option");
    optionB.value = tool.name;
    optionB.textContent = tool.name;

    toolASelect.appendChild(optionA);
    toolBSelect.appendChild(optionB);
  });

  // 預設選擇兩款不同的工具
  if (tools.length >= 2) {
    toolASelect.selectedIndex = 0;
    toolBSelect.selectedIndex = 1;
  }

  compareMessage.textContent = "";

  resetResults();
}


// 五、切換 AI 分類

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {

    currentCategory = button.dataset.category;

    categoryButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    updateToolOptions(currentCategory);
  });
});


// 六、清除舊比較結果

function resetResults() {
  resultNameA.textContent = "工具 A";
  resultNameB.textContent = "工具 B";

  comparisonResults.innerHTML = "";

  const fields = [
    "主要特色",
    "核心功能",
    "適合對象",
    "優勢",
    "注意事項"
  ];

  fields.forEach((label) => {
    addComparisonRow(label, "尚未比較", "尚未比較");
  });
}


// 七、建立比較表格的一列

function addComparisonRow(label, valueA, valueB) {
  const row = document.createElement("tr");

  const heading = document.createElement("th");
  heading.scope = "row";
  heading.textContent = label;

  const cellA = document.createElement("td");
  cellA.textContent = valueA;

  const cellB = document.createElement("td");
  cellB.textContent = valueB;

  row.appendChild(heading);
  row.appendChild(cellA);
  row.appendChild(cellB);

  comparisonResults.appendChild(row);
}


// 八、執行 AI 工具比較

function compareTools() {
  const selectedA = toolASelect.value;
  const selectedB = toolBSelect.value;

  if (!selectedA || !selectedB) {
    compareMessage.textContent = "請先選擇兩款 AI 工具。";
    return;
  }

  if (selectedA === selectedB) {
    compareMessage.textContent = "請選擇兩款不同的 AI 工具。";
    return;
  }

  const tools = aiDatabase[currentCategory];

  const toolA = tools.find(
    (tool) => tool.name === selectedA
  );

  const toolB = tools.find(
    (tool) => tool.name === selectedB
  );

  if (!toolA || !toolB) {
    compareMessage.textContent = "找不到工具資料，請重新選擇。";
    return;
  }

  compareMessage.textContent = "";

  resultNameA.textContent = toolA.name;
  resultNameB.textContent = toolB.name;

  comparisonResults.innerHTML = "";

  const comparisonFields = [
    ["主要特色", "feature"],
    ["核心功能", "functions"],
    ["適合對象", "audience"],
    ["優勢", "advantage"],
    ["注意事項", "limitation"]
  ];

  comparisonFields.forEach(([label, key]) => {
    addComparisonRow(
      label,
      toolA[key],
      toolB[key]
    );
  });

  // 將畫面移動到比較結果
  resultsSection.scrollIntoView({
    behavior: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? "auto" : "smooth",
    block: "start"
  });
}


// 九、綁定開始比較按鈕

compareButton.addEventListener(
  "click",
  compareTools
);


// 十、初次載入時顯示聊天 AI 工具

updateToolOptions(currentCategory);
