import { Configuration, BannerPlugin } from "webpack";
import * as path from "path";
import match from "./config/match";
import pg from "./package.json";

const banner = `// ==UserScript==
// @name         ${pg.name}
// @namespace    ${pg.name}
// @version      ${pg.version}
// @description  ${pg.description}
// @author       ${pg.author}
${match}
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// ==/UserScript==`;

const config: Configuration = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new BannerPlugin({
      raw: true,
      banner,
    }),
  ],
};

export default config;
