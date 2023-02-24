import * as fs from "fs";
import * as path from "path";
import { CommandResult, SigenCommand } from "./command";

interface IncludeCommand extends SigenCommand {
  path: string;
}

const toIncludeCommand = (command: SigenCommand): IncludeCommand => {
  return { ...command, path: command.tokens[2] };
};

export const runIncludeCommand = async (
  command: SigenCommand,
  source: string
): Promise<CommandResult> => {
  const cmd = toIncludeCommand(command);
  const includeHtml = (
    await fs.promises.readFile(
      path.join(path.dirname(cmd.runtimePath), cmd.path)
    )
  ).toString();
  return {
    source:
      source.substring(0, command.pos.begin) +
      includeHtml +
      source.substring(command.pos.end),
    diff: includeHtml.length - command.commandStr.length,
  };
};
