import * as fs from "fs";
import { runCommand } from "./commands/command";
import { findSigenCommands } from "./parser";

export const runHTML = async (path: string): Promise<string> => {
  const html = (await fs.promises.readFile(path)).toString();

  // 置換
  const sigenCommands = findSigenCommands(html, path);
  let ret = html;
  let diffSum = 0;
  const it = 0;
  for (let i = 0; i < sigenCommands.length; i++) {
    const result = await runCommand(
      {
        ...sigenCommands[i],
        pos: {
          begin: sigenCommands[i].pos.begin + diffSum,
          end: sigenCommands[i].pos.end + diffSum,
        },
      },
      ret
    );
    ret = result.source;
    diffSum += result.diff;
  }

  return ret;
};
