import { SigenCommand, SigenCommandType } from "./commands/command";

export interface SigenCommandPos {
  begin: number;
  end: number;
  command: SigenCommand;
}

export const findSigenCommands = (
  str: string,
  path: string
): SigenCommandPos[] => {
  const p = /\<\!\-\- +sigen\:/g;
  const ret: SigenCommandPos[] = [];
  let begin: number | undefined;
  while ((begin = p.exec(str)?.index) !== undefined) {
    const end = str.indexOf("-->", begin) + 3;
    ret.push({
      begin: begin,
      end: end,
      command: toSigenCommand(str.substring(begin, end), path),
    });
  }
  return ret;
};

const toSigenCommand = (str: string, path: string): SigenCommand => {
  const tokens = str.split(" ").slice(1, -1);
  const getType = (): SigenCommandType => {
    switch (tokens[1]) {
      case "include":
        return "include";
      default:
        return "none";
    }
  };
  return { type: getType(), tokens: tokens, runtimePath: path };
};
