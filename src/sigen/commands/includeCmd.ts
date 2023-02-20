import { SigenCommand } from "./command";
import * as fs from "fs";
import * as path from "path";

interface IncludeCommand extends SigenCommand {
  path: string;
}

const toIncludeCommand = (command: SigenCommand): IncludeCommand => {
  return { ...command, path: command.tokens[2] };
};

export const runIncludeCommand = async (
  command: SigenCommand
): Promise<string> => {
  const cmd = toIncludeCommand(command);
  const includeHtml = (
    await fs.promises.readFile(
      path.join(path.dirname(cmd.runtimePath), cmd.path)
    )
  ).toString();
  return includeHtml;
};
