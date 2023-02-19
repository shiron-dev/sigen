import * as readline from "readline";

export const stdYN = async (que: string): Promise<boolean> => {
  const trueList = ["true", "t", "yes", "y", "ok"];
  const ans = await stdQA(que);
  return trueList.find((v) => v === ans.toLowerCase()) !== undefined;
};

export const stdQA = (que: string): Promise<string> => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    readlineInterface.question(que, (answer) => {
      resolve(answer);
      readlineInterface.close();
    });
  });
};
