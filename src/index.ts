import JSZip from "jszip";
import { saveAs } from "file-saver";

const kEvent = document.createEvent("UIEvents") as any;
kEvent.keyCode = 39;
kEvent.initEvent("keydown", true, true);

let totalPage = 0;

let startTimer = setInterval(() => {
  //搜尋頂部欄，找到之後插入按鈕
  const bar = document.querySelector(
    ".sc-chPdSV.sc-kgoBCf.lnAVd"
  ) as HTMLDivElement;
  if (bar) {
    const page = document.querySelector(".sc-chPdSV.sc-ckVGcZ.pqkll")
      ?.innerHTML;
    totalPage = Number(page?.match(/(of.*)/)![0].replace("of ", ""));

    const downloadButton = document.createElement("div");
    downloadButton.className = "sc-eNQAEJ sc-hMqMXs dEsIoC";
    downloadButton.innerHTML = "下載";
    downloadButton.addEventListener("click", download);

    bar.insertBefore(downloadButton, bar.childNodes[2]);
    clearInterval(startTimer);
  }
}, 100);

async function download() {
  let list: Blob[] = [];
  while (true) {
    const data = await getBlobUrl();
    if (data.length === 0) {
      break;
    }

    const d = await getImage(data);
    list = [...list, ...d];
    dispatchEvent(kEvent);
  }

  const zip = new JSZip();
  list.forEach((blob, i) => zip.file(`${i + 1}.jpg`, blob, { binary: true }));

  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "Book.zip");
  });
}

/**
 * 回到第一頁
 */
function goBackPage1() {
  let div = document.querySelector(
    ".sc-chPdSV.sc-dxgOiQ.jEmltq > .sc-eNQAEJ.sc-hMqMXs.dEsIoC"
  ) as HTMLDivElement;

  div.click();

  const list = document.querySelector(
    "div[style*='height: 100%; padding: 66px 60px 0px; position: absolute; width: 100%;'] > div"
  ) as HTMLDivElement;

  list.scrollTop = 0;

  div = document.querySelector(".sc-kXeGPI.eLbnqg") as HTMLDivElement;

  div.click();

  // const allPreview = document.querySelector(
  //   ".sc-chPdSV.sc-dxgOiQ.jEmltq > .sc-eNQAEJ.sc-hMqMXs.dEsIoC"
  // ) as HTMLDivElement;
  // allPreview.click();
}

/**
 * 從網址取得圖片Blob
 * @param url
 */
async function getImage(url: string[]): Promise<Blob[]> {
  const arr: Blob[] = [];
  for (let i = 0; i < url.length; i++) {
    const res = await fetch(url[i]);
    const blob = await res.blob();
    arr.push(blob);
  }
  return arr;
}

/**
 * 取得Blob的Url
 */
async function getBlobUrl(): Promise<string[]> {
  return new Promise((resolve) => {
    const findBlob = setInterval(() => {
      const viewers: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        ".viewer[style*='translateX(0%)'] .hej-view__content"
      );
      const first: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        ".viewer[style*='translateX(-100%)'] .hej-view__content"
      );

      const last: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        ".viewer[style*='translateX(100%)'] .hej-view__content"
      );
      const arr: string[] = [];

      const str = document.querySelector(".sc-chPdSV.sc-ckVGcZ.pqkll")
        ?.innerHTML as string;

      const currentPage = Number(
        str.substr(
          str.lastIndexOf("-") + 1,
          str.lastIndexOf("of") - 1 - str.lastIndexOf("-") - 1
        )
      );

      if (currentPage === totalPage) {
        clearInterval(findBlob);
        resolve(arr);
      } else if (viewers.length === 2 || first.length === 0) {
        viewers.forEach(async (el) => {
          const blobUrl = el.style.backgroundImage
            .match(/(blob.*)\"/)![0]
            .replace('"', "");
          arr.push(blobUrl);
        });
        clearInterval(findBlob);
        resolve(arr);
      }
    }, 100);
  });
}

/**
 * 移除一開始那個backdrop
 */

document.body.addEventListener("DOMSubtreeModified", () => {
  const backdrop = document.querySelector(
    ".sc-fnwBNb.izhUwZ"
  ) as HTMLDivElement;
  if (backdrop && backdrop.style.display !== "none") {
    backdrop.style.display = "none";
  }
});
