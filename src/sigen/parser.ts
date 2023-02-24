import {
  CommandPosition,
  SigenCommand,
  SigenCommandType,
} from "./commands/command";

export const findSigenCommands = (
  str: string,
  path: string
): SigenCommand[] => {
  const p = /<!-- +sigen:/g;
  const ret: SigenCommand[] = [];
  let begin: number | undefined;
  while ((begin = p.exec(str)?.index) !== undefined) {
    const end = str.indexOf("-->", begin) + 3;
    ret.push(
      toSigenCommand(str.substring(begin, end), path, {
        begin: begin,
        end: end,
      })
    );
  }
  return ret;
};

const toSigenCommand = (
  str: string,
  path: string,
  pos: CommandPosition
): SigenCommand => {
  const tokens = str.split(" ").slice(1, -1);
  const getType = (): SigenCommandType => {
    switch (tokens[1]) {
      case "include":
        return "include";
      default:
        return "none";
    }
  };
  return {
    type: getType(),
    commandStr: str,
    tokens: tokens,
    runtimePath: path,
    pos: pos,
  };
};
