import { runIncludeCommand } from "./includeCmd";
import { runRemoveCommand } from "./removeCmd";

export type SigenCommandType = "include" | "remove" | "none";
export interface SigenCommand {
  type: SigenCommandType;
  tokens: string[];
  commandStr: string;
  runtimePath: string;
  pos: CommandPosition;
}
export interface CommandPosition {
  begin: number;
  end: number;
}

export interface CommandResult {
  source: string;
  diff: number;
}

export const runCommand = async (
  cmd: SigenCommand,
  source: string
): Promise<CommandResult> => {
  switch (cmd.type) {
    case "include":
      return await runIncludeCommand(cmd, source);
    case "remove":
      return await runRemoveCommand(cmd, source);
    default:
      return { source: source, diff: 0 };
  }
};
