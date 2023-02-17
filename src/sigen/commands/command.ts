import { runIncludeCommand } from "./includeCmd";

export type SigenCommandType = "include" | "none";
export interface SigenCommand {
  type: SigenCommandType;
  tokens: string[];
  runtimePath: string;
}

export const runCommand = (cmd: SigenCommand): string => {
  switch (cmd.type) {
    case "include":
      return runIncludeCommand(cmd);
    default:
      return "";
  }
};
