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

  renderItem(item, index) {
    let dom = `
      <div style="min-width: 25px; font-size: 1rem; padding-top: 2px;">${index + 1}.</div>
      <div style="flex: 1; display: flex; flex-direction: column;">
        <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
          <div style="font-size: 1.2rem; ">
            ${item.accent ? window.renderAccent(item.kana, item.accent) : item.kana}
          </div>
          <div style="color: #2d8cf0; margin-left: 15px; font-size: 1.2rem">
            ${item.accent || ""}
          </div>
        </div>
        <div style="flex: 1; font-size: 1.1rem">
          ${item.kanji || ""}
        </div>
        <span style="font-size: 1.0rem; color: #2d8cf0">
          ${item.roma}
        </span>
        <div style="font-size: 1.0rem">${item.mean}</div>
      </div>
    `
    return dom;
  }

  generate() {
    let title = (doc, str, index) => {
      let header = doc.createElement('h2');
      header.innerText = str;
      header.style.fontSize = "1.5em";
      header.style.borderBottom = "2px solid #ccc";
      header.style.marginTop = index == 0 ? "0px" : "40px";
      header.style.marginBottom = "5px";
      return header;
    }

    // 1. 建立隱形的沙箱 iframe，隔離父視窗 CSS 污染與 rem 基準差異
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = this.width + 'px';
    iframe.style.height = '10000px'; // 給予足夠高度以利高度測量
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    // 2. 初始化 iframe 內部的 document 與載入樣式
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${this.injectedStyles()}
        <style>
          
        </style>
      </head>
      <body>
        <div id="measure-container"></div>
      </body>
      </html>
    `);
    doc.close();

    const container = doc.getElementById('measure-container');
    let words = this.props.words;
    let page, section;
    
    // 注意：後續建立 DOM 元素時，必須使用 doc.createElement，使其歸屬於 iframe 的 document
    let generatePage = () => {
      page = doc.createElement('div');
      page.classList.add('page');
      page.style.border = "1px solid #aaa";
      page.style.width = this.width + "px";
      container.appendChild(page);
    };

    let calPageHeight = () => {
      let h = 0;
      for(let i = 0; i < page.children.length; i++) {
        h += page.children[i].getBoundingClientRect().height;
      }
      return h;
    }

    generatePage();

    let generateSection = () => {
      section = doc.createElement('div');
      section.style.display = "flex";
      section.style.flexDirection = "row";
      section.classList.add('section');
      page.appendChild(section);
    }

    let generateEmpty = () => {
      let card = doc.createElement('div');
      card.style.flex = "1";
      section.appendChild(card);
    }

    let generateFooter = () => {
      let footer = doc.createElement('div');
      footer.classList.add('footer');
      // padding-top: 5px;  border-top: 2px solid #ccc
      footer.innerHTML = `<div style="width: 100%; text-align: center; margin-bottom: 10px; font-size: 1.2rem;">
        ${container.children.length}
      </div>`
      page.appendChild(footer);
    }

    let count = 0;
    for(let i = 0; i < words.length; i++) {
      let el = words[i];
      if(i == 0 || typeof el.title == "string") {
        if(i > 0 && section.children.length < this.colNum) {
          generateEmpty();
        }
        page.appendChild(title(doc, i == 0 ? this.props.title : el.title, i));
        generateSection();
        count = 0;
      }
      let card = doc.createElement('div');
      card.innerHTML = this.renderItem(el, i);
      card.classList.add('card');
      card.style.display = "flex";
      card.style.flexDirection = "row";
      card.style.padding = "5px";
      card.style.borderBottom = "1px solid #ccc";
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
      
      if(calPageHeight() >= this.height - 40 && section.children.length == this.colNum) {
        let lastSection = section;
        // 從舊頁面移除剛建立的 section
        page.removeChild(lastSection);

        let lastH2 = null;
        if(page.lastChild.tagName.toUpperCase() == "H2") {
          lastH2 = page.lastChild;
          lastH2.style.marginTop = "0px";
          page.removeChild(lastH2);
        }

        generateFooter();
        generatePage();
        if(lastH2 != null) {
          page.appendChild(lastH2);  
        }
        page.appendChild(lastSection);
        generateSection();
        count = 0;
      }
      if(i == words.length - 1) {
        if(section.children.length < this.colNum) {
          generateEmpty();
        }
        generateFooter();
      }
    }

    // 3. 取得 iframe 內部整個 document 的 HTML，並將暫時的 iframe 從父視窗移除
    let innerHTML = doc.documentElement.outerHTML;
    document.body.removeChild(iframe);
    return innerHTML;
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
      html, body {
        margin: 0;
        padding: 0;
        width: ${this.width}px;
      }
      body {
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
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }
      span.accent {
        margin-top: 2px;
        border-top: 1px solid #D3D3D3;
        border-left: 1px solid #D3D3D3;
        border-right: 1px solid #D3D3D3;
        padding: 2px 2px 0 2px;
        font-size: inherit;
      }
      span.accent-bottom  {
        border-bottom: 1px solid #D3D3D3;
        padding: 0px 2px 0px 2px;
        font-size: inherit;
      }
      @media print {
        .page {
          border: none !important;
        }
      }
      </style>
    `
  }
}