import * as fs from "fs";
import { findSigenCommands } from "./parser";
import { runCommand } from "./commands/command";

export const runHTML = async (path: string): Promise<string> => {
  const html = (await fs.promises.readFile(path)).toString();

  // 置換
  const sigenComPos = findSigenCommands(html, path);
  let ret = "";
  let it = 0;
  for (let i = 0; i < sigenComPos.length; i++) {
    ret += html.substring(it, sigenComPos[i].begin);
    ret += await runCommand(sigenComPos[i].command);
    it = sigenComPos[i].end;
  }
  ret += html.substring(it);

  return ret;
};
