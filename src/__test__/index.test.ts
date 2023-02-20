import { runHTML } from "@/sigen/sigen";
import * as fs from "fs";
import * as path from "path";

test("test", async () => {
  const thisFile = (
    await fs.promises.readFile(path.join(__dirname, "index.test.ts"))
  ).toString();
  expect((await runHTML(path.join(__dirname, "index.test.html"))).trim()).toBe(
    thisFile.trim()
  );
});
