export default class RenderCard {
  constructor(props) {
    this.props = props;
    // console.log(props)

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

    for(let i = 8; i >= 1; i--) {
      let w = Math.floor((cardboxWidth - ((i -1))) / i);
      if(w > 320) {
        this.cardWidth = w + "px";
        this.colNum = i;
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
            ${item.accent ? window.renderAccent(item.kana, item.accent) : item.kana}
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