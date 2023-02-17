import * as fs from "fs";
import { findSigenCommands } from "./parser";
import { runCommand } from "./commands/command";

export const runHTML = (path: string): string => {
  const html = fs.readFileSync(path).toString();

  // 置換
  const sigenComPos = findSigenCommands(html, path);
  let ret = "";
  let it = 0;
  for (let i = 0; i < sigenComPos.length; i++) {
    ret += html.substring(it, sigenComPos[i].begin);
    ret += runCommand(sigenComPos[i].command);
    it = sigenComPos[i].end;
  }
  ret += html.substring(it);

  return ret;
};
