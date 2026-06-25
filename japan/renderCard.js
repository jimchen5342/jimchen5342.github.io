export default class RenderCard {
  constructor(props) {
    this.props = props;
    // console.log(props)

    this.colNum = 1;
    let cardboxWidth = 0;
    if(props.A4 == true || props.A5 == true) {
      let pixel = this.getPixel();
      this.width = Math.floor(pixel * (props.A4 == true ? 200 : 138));
      this.height = Math.floor(pixel * (props.A4 == true ? 287 : 200));
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
        break;
      }
    }
    // console.log(`colNum: ${this.colNum}, cardWith: ${this.cardWidth}`)
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

  generate() {
    let title = (str, index) => {
      let header = document.createElement('h2');
      header.innerText = str;
      header.style.fontSize = "1.5em";
      header.style.borderBottom = "1px solid #eee";
      header.style.marginTop = index == 0 ? "0px" : "40px";
      header.style.marginBottom = "5px";
      return header;
    }
    // document.body.innerHTML = null;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);
    let words = this.props.words;
    let page, section;
    let generatePage = () =>{
      page = document.createElement('div');
      page.classList.add('page');
      page.style.border = "1px solid blue";
      // page.style.width = this.width + "px";
      // page.style.height = this.height + "px";
      container.appendChild(page);
    };
    let calHeight = () => {
      let h = 0;
      for(let i = 0; i < page.children.length; i++) {
        h += page.children[i].getBoundingClientRect().height;
      }
      return h;
    }
    // helper to measure element height (forces layout)
    let measure = (el) => el.getBoundingClientRect().height;
    generatePage();

    let generateSection = () =>{
      section = document.createElement('div');
      section.style.display = "flex";
      section.style.flexDirection = "row";
      section.classList.add('section');
      page.appendChild(section);
    }

    let generateEmpty = () =>{
      let card = document.createElement('div');
      card.style.flex = "1";
      section.appendChild(card);
    }

    let generateFooter = () =>{
      let footer = document.createElement('div');
      footer.classList.add('footer');
      footer.innerHTML = container.children.length
      page.appendChild(footer);
    }

    let count = 0;
    for(let i = 0; i < words.length; i++) {
      let el = words[i];
      if(i == 0 || typeof el.title == "string") {
        if(i > 0 && section.children.length < this.colNum) {
          generateEmpty();
        }
        page.appendChild(title(i == 0 ? this.props.title : el.title, i));
        generateSection();
        count = 0;
      }
      let card = document.createElement('div');
      card.innerHTML = this.renderItem(el, i);
      card.classList.add('card');
      card.style.display = "flex";
      card.style.flexDirection = "row";
      card.style.padding = "5px";
      card.style.borderBottom = "1px solid #eee";
      card.style.flex = "1";
      if(this.colNum > 1) {
        if(section.children.length > 0) {
          card.style.marginLeft = "5px";
          section.children[section.children.length - 1].style.marginRight = "5px";
        }
      }
  
      if(count > 0 && count % this.colNum == 0) {
        generateSection();
      }
      section.appendChild(card);
      count++;
      if(section.children.length == this.colNum) {
        console.log(`${i} => section.height = ${measure(section)}`)
        console.log(`${i} => calHeight = ${calHeight()}, page.scrollHeight: ${page.scrollHeight}, page.offsetHeight = ${page.offsetHeight}`)
      }
      // console.log(section.children.length % this.colNum)
      if(i == words.length -1) {
        if(section.children.length < this.colNum) {
          generateEmpty();
        }
        generateFooter()
      } else if(calHeight() >= this.height - 20 && section.children.length == this.colNum) {
        generateFooter();
        generatePage();
        generateSection();
        count = 0;
      }
    }

    // console.log(`clientHeight = ${page.clientHeight}, scrollHeight: ${page.scrollHeight}, offsetHeight = ${page.offsetHeight}`)
    let innerHTML = container.innerHTML;
    document.body.removeChild(container);
    return innerHTML;
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
        width: 200mm; /* A4 寬度 210mm 減 margin 5mm * 2 */
        height: 287mm; /* A4 高度 297mm 減 margin 5mm * 2 */
        margin: 5mm;
    ` 
    : `
      width: 138mm; /* A5 寬度  148mm - 5mm*2 */
      height: 200mm; /* A5 高度 210mm - 5mm*2 */    
      margin: 5mm;
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
        display: flex;
        flex-direction: column;
      }
      .page {
        ${page}
        page-break-after: always;
        display: flex;
        flex-direction: column;
      }
      h2 {
        text-align: center;
      }
      .footer {
        flex: 1;
        font-size: 1.2rem;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        margin-bottom: 10px;
      }
      </style>
    `
  }
  html() {
    let str = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          ${this.injectedStyles()}
        </head>
        <body>
            ${this.generate()}
        </body>
        </html>
    `;
    // console.log(str)
    return str;
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