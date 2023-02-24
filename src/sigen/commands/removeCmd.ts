import { CommandResult, SigenCommand } from "./command";

let removeBegin = -1;

export const runRemoveCommand = async (
  command: SigenCommand,
  source: string
): Promise<CommandResult> => {
  if (command.tokens.length < 3) {
    console.log("Error:");
    console.log(command.commandStr);
    return { source: source, diff: 0 };
  }
  if (command.tokens[2] === "from") {
    if (removeBegin === -1) {
      removeBegin = command.pos.begin;
    }
    return {
      source: source,
      diff: 0,
    };
  } else {
    if (removeBegin === -1) {
      console.log("Error:");
      console.log(command.commandStr);
      return { source: source, diff: 0 };
    }
    const ret = {
      source:
        source.substring(0, removeBegin) + source.substring(command.pos.end),
      diff: command.pos.end - removeBegin,
    };
    removeBegin = -1;
    return ret;
  }
};
