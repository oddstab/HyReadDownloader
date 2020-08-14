import urls from "./urls.json";

/**
 * 自動產生 // @match xxx
 */
function generateMatchString(): string {
  let str = "";
  urls.forEach((u, i) => {
    str += `// @match				 ${u}${i !== urls.length - 1 ? "\r\n" : ""}`;
  });
  return str;
}

export default generateMatchString();
