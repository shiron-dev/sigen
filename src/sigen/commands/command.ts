import { runIncludeCommand } from "./includeCmd";

export type SigenCommandType = "include" | "none";
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
    default:
      return { source: source, diff: 0 };
  }
};
