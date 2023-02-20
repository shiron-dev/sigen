import { runIncludeCommand } from "./includeCmd";

export type SigenCommandType = "include" | "none";
export interface SigenCommand {
  type: SigenCommandType;
  tokens: string[];
  runtimePath: string;
}

export const runCommand = async (cmd: SigenCommand): Promise<string> => {
  switch (cmd.type) {
    case "include":
      return await runIncludeCommand(cmd);
    default:
      return "";
  }
};
