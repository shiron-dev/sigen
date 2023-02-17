import * as util from "util";
import * as fs from "fs";
import { runHTML } from "./sigen/sigen";

console.log("Hello sigen!");

const args = util.parseArgs({
  options: {},
  allowPositionals: true,
});

if (args.positionals.length == 2) {
  fs.writeFileSync(args.positionals[1], runHTML(args.positionals[0]));
} else {
  console.log("sigen <in path> <out path>");
}
