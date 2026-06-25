export default class RenderCard {
  constructor(props) {
    this.props = props;
    console.log(props)

    this.colNum = 1;
    let cardboxWidth = 0;
    if(props.A4 == true || props.A5 == true) {
      let pixel = this.getPixel();
      this.width = pixel * (props.A4 == true ? 190 : 128);
      this.height = pixel * (props.A4 == true ? 277 : 190);
      cardboxWidth = this.width;
    } else if(typeof this.props.cardbox !== "undefined") {
      cardbox.innerHTML = "";
      cardboxWidth = this.props.cardbox.clientWidth - 20;
      this.width = cardboxWidth;
    }
    console.log(`width: ${this.width}, height: ${this.height}`)

    for(let i = 8; i >= 1; i--) {
      let w = Math.floor((cardboxWidth - ((i -1))) / i);
      if(w > 320) {
        this.cardWidth = w + "px";
        this.colNum = i;
        console.log(`cardWidth: ${this.cardWidth}, colNum: ${this.colNum}`)
        break;
      }
    }
  }

  getPixel() {
    const el = document.createElement('div');
    el.style.width = '1mm';
    el.style.height = '1mm';
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    const px = el.getBoundingClientRect().height;
    document.body.removeChild(el);
    return px;
  }

  render() {
    let words = this.props.words;

    words.forEach((el, index) => {
      const el2 = document.createElement('div');
      el2.innerHTML = this.renderItem(el, index);
      el2.classList.add('card');
      el2.style.width = this.cardWidth;   
      if(typeof this.props.cardbox !== "undefined") {
        el2.id = "card" + el.id;
        cardbox.appendChild(el2);
      }
    });
  }

  renderItem(item, index) {
    let dom = `
      <div style="min-width: 25px; font-size: 1rem; padding-top: 2px;">${index + 1}.</div>
      <div style="flex: 1; display: flex; flex-direction: column;">
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
          <div style="font-size: 1.2rem; flex: 1;">
            ${item.accent ? this.renderAccent(item.kana, item.accent) : item.kana}
          </div>
          <div style="color: #2d8cf0; margin-left: 10px; font-size: 1rem">
            ${item.accent || ""}
          </div>
        </div>
        <div style="flex: 1; font-size: 1.2rem">
          ${item.kanji || ""}
        </div>
        <span style="font-size: 1rem; color: #2d8cf0">
          ${item.roma}
        </span>
        <div>${item.mean}</div>
      </div>
    `
    return dom;
  }

  renderAccent(kana, accent) {
    /**
     * 渲染日語單詞的重音標記
     * 
     * 重音標記規則：
     * "0" => 無聲音：第一音拔高
     * "1" => 第一音拔高
     * 數字 => 該位置之前的音拔高
     * "," or "，" => 常用表記法（逗號）
     * "~" => 連接符號（波浪號）
     * "-" => 句子中的各單字間隔符號
     */
    const VOICED_SOUNDS = "ゃャゅュょョっッィ"; // 拗音、促音
    const ACCENT_SEPARATORS = ["~", "-"];
    const PERIOD = "。";
    const SPAN_ACCENT = "accent";
    const SPAN_ACCENT_BOTTOM = "accent-bottom";
    const SEPARATOR_WAVE = "~";
    const SEPARATOR_DASH = "-";

    /**
     * 將單個片段按重音規則分段並加上HTML標記
     * @param {string} value - 要處理的字符串
     * @param {string|null} accentPos - 重音位置
     * @returns {string} HTML標記的結果
     */
    const segment = (value, accentPos) => {
      if (!value) return "";

      let normalizedAccent = this._normalizeAccent(accentPos);
      
      // 將拗音和促音與前一個字合併
      let charArray = this._splitWithVoicedSounds(value);

      // 如果沒有重音標記，直接返回
      if (normalizedAccent === null) {
        return charArray.join("");
      }

      // 分配字符到三個區間：前、重音、後
      const [before, accented, after] = this._partitionByAccent(charArray, normalizedAccent);

      return this._buildAccentedHTML(before, accented, after);
    };

    /**
     * 規範化重音值
     * @param {string|undefined} accent
     * @returns {string|null} 規範化後的重音值
     */
    this._normalizeAccent = (accent) => {
      try {
        if (typeof accent === "string" && accent.length > 0) {
          return accent.charAt(0); // 使用 charAt 替代廢棄的 substr
        }
        return null;
      } catch (e) {
        console.warn(`Failed to normalize accent: "${accent}"`, e);
        return null;
      }
    };

    /**
     * 將字符串拆分，保持拗音和促音與前一字符連接
     * @param {string} value
     * @returns {string[]} 字符數組
     */
    this._splitWithVoicedSounds = (value) => {
      const arr = [];
      for (let i = 0; i < value.length; i++) {
        const char = value.charAt(i);
        if (char === PERIOD) {
          // 跳過句號
          continue;
        } else if (VOICED_SOUNDS.includes(char)) {
          // 拗音、促音合併到前一個字
          if (arr.length > 0) {
            arr[arr.length - 1] += char;
          }
        } else {
          arr.push(char);
        }
      }
      return arr;
    };

    /**
     * 根據重音位置將字符數組分為三部分
     * @param {string[]} charArray
     * @param {string} accentPos - 重音位置（"0", "1", 或數字）
     * @returns {[string, string, string]} [前置, 重音, 後置]
     */
    this._partitionByAccent = (charArray, accentPos) => {
      let [before, accented, after] = ["", "", ""];
      const accentIndex = parseInt(accentPos, 10);

      for (let i = 0; i < charArray.length; i++) {
        const char = charArray[i];
        
        if (accentPos === "0" && i > 0) {
          // "0" 表示第一音拔高，其餘正常
          accented += char;
        } else if (accentPos === "1" && i === 0) {
          // "1" 表示第一音拔高
          accented += char;
        } else if (!isNaN(accentIndex) && accentIndex > 0 && i > 0 && i < accentIndex) {
          // 數字表示該位置之前的音拔高
          accented += char;
        } else {
          // 其餘放在後置或前置
          if (accented.length === 0) {
            before += char;
          } else {
            after += char;
          }
        }
      }

      return [before, accented, after];
    };

    /**
     * 構建帶有HTML標記的重音結果
     * @param {string} before
     * @param {string} accented
     * @param {string} after
     * @returns {string} HTML字符串
     */
    this._buildAccentedHTML = (before, accented, after) => {
      let result = "";
      
      if (before) {
        result += `<span class="${SPAN_ACCENT_BOTTOM}">${before}</span>`;
      }
      if (accented) {
        result += `<span class="${SPAN_ACCENT}">${accented}</span>`;
      }
      if (after) {
        result += `<span class="${SPAN_ACCENT_BOTTOM}">${after}</span>`;
      }

      return result;
    };

    /**
     * 檢測並返回分隔符號
     * @param {string} str
     * @returns {string} 分隔符號或空字符串
     */
    const detectSeparator = (str) => {
      if (str.includes(SEPARATOR_WAVE)) return SEPARATOR_WAVE;
      if (str.includes(SEPARATOR_DASH)) return SEPARATOR_DASH;
      return "";
    };

    // 主邏輯
    const separator = detectSeparator(kana);
    const kanaValues = separator ? kana.split(separator) : [kana];
    const accentValues = separator ? accent.split(separator) : [accent];

    let result = "";
    for (let x = 0; x < kanaValues.length; x++) {
      const kanaValue = kanaValues[x];
      const accentValue = accentValues.length > x ? accentValues[x] : accentValues[0];
      const segmentResult = segment(kanaValue, accentValue);

      if (segmentResult) {
        if (result.length > 0) {
          result += separator === SEPARATOR_WAVE ? " ~ " : " ";
        }
        result += segmentResult;
      }
    }

    return result;
  }

  injectedStyles() {
    let page = this.props.A4 == true 
    ? `
        width: 190mm; /* A4 寬度 210mm 減 margin 10mm * 2 */
        height: 277mm; /* A4 高度 297mm 減 margin 10mm * 2 */
    ` 
    : `
      width: 128mm; /* A5 寬度  148mm - 10mm*2 */
      height: 190mm; /* A5 高度 210mm - 10mm*2 */    
    `

    return `
      <style>
      * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-family: 'Times New Roman', 'Helvetica Neue', 微軟正黑體, 'Microsoft Jhenghei', Helvetica, Arial, sans-serif;
        font-size: 1rem;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .page {
        ${page}
        page-break-after: always;
      }
      </style>
    `
  }
  dom(html) {
    // if (breakH1.checked) pageBreakCss += "h1 { break-before: page !important; page-break-before: always !important; }\n";
    // if (breakH2.checked) pageBreakCss += "h2 { break-before: page !important; page-break-before: always !important; }\n";
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          ${this.injectedStyles()}
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;
  }
}

// .page {
//   width: 190mm; /* A4 寬度 210mm 減 margin 10mm * 2 */
//   height: 277mm; /* A4 高度 297mm 減 margin 10mm * 2 */
//   page-break-after: always;
// }

// .page {
//   width: 128mm; /* A5 寬度  148mm - 10mm*2 */
//   height: 190mm; /* A5 高度 210mm - 10mm*2 */
// }
/*
判斷 div 是否已達一頁高度
最可靠的方式是把「一頁高度」轉成瀏覽器可測量的 px，然後比較目前容器高度。

1. 先定義一頁高度
  例如 A4 直式內容區域：
  height: 277mm（297mm 減去上下各 10mm 邊距）
2. 轉換 mm 到 px
  function mmToPx(mm) {
    const el = document.createElement('div');
    el.style.width = '1mm';
    el.style.height = '1mm';
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    const px = el.getBoundingClientRect().height;
    document.body.removeChild(el);
    return px * mm;
  }

  const pageHeightPx = mmToPx(277); // A4 內容高度
3. 比較 div 高度
  const cardbox = document.querySelector('#cardbox');
  const currentHeight = cardbox.scrollHeight; // 或 cardbox.offsetHeight

  if (currentHeight >= pageHeightPx) {
    console.log('已達一頁高度');
  }
4. 更實用的方式
  用 scrollHeight 代表內容實際高度
  用 offsetHeight 代表目前元素實際顯示高度
  若是追加內容，就在每次新增後檢查一次
建議
  如果要列印，最好用 CSS @page 與 .page { height: 277mm; }
  然後在 JS 裡直接用 pageHeightPx 來判斷是否需要換頁
  總結：用 scrollHeight 或 offsetHeight 比較「轉成 px 的一頁高度」，就能知道目前 div 是否已達到一頁。

*/