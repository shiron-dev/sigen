import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { runHTML } from "./sigen";
import { stdYN } from "@/interactive";

const sigenExt = [".html"];

interface FileMap {
  in: string;
  out: string;
}

// TODO: not copy used html files
export const startSigen = async () => {
  const args = util.parseArgs({
    options: {
      recursive: { type: "boolean", short: "r" },
      all: { type: "boolean", short: "a" },
    },
    allowPositionals: true,
  });
  if (args.values.recursive === undefined) args.values.recursive = false;
  if (args.values.all === undefined) args.values.all = false;

  if (args.positionals.length < 2) {
    console.log("Error");
    return;
  }

  const ioPaths: FileMap[] = (() => {
    if (!args.values.recursive) {
      const outDir = path.join(
        __dirname,
        args.positionals[args.positionals.length - 1]
      );
      return args.positionals
        .filter((v, i) => i !== args.positionals.length - 1)
        .map((v) => ({
          in: path.join(__dirname, v),
          out: path.join(outDir, path.basename(v)),
        }));
    } else {
      return getIOPaths(
        args.positionals.filter((v, i) => i !== args.positionals.length - 1),
        args.positionals[args.positionals.length - 1]
      );
    }
  })();

  await Promise.all(
    ioPaths.map(async (ioPath) => {
      await fs.promises.mkdir(path.dirname(ioPath.out), { recursive: true });

      if (sigenExt.includes(path.extname(ioPath.in))) {
        await saveSigenHTML(ioPath.in, ioPath.out);
      } else {
        console.log(ioPath.in, ioPath.out);
        await fs.promises.copyFile(ioPath.in, ioPath.out);
      }
    })
  );
};

const saveSigenHTML = async (
  inPath: string,
  outPath: string,
  doCheckOverwrite = false
) => {
  const writeHTML = async () => {
    await fs.promises.writeFile(outPath, await runHTML(inPath));
  };

  if (await exists(inPath)) {
    // 新規ファイル
    writeHTML();
  } else {
    if ((await fs.promises.stat(outPath)).isDirectory()) {
      // ディレクトリならError
      console.log(`${outPath} is not a file.`);
    } else if (doCheckOverwrite) {
      // 上書き確認
      console.log(`${inPath} is exists.`);
      if (await stdYN("Do you want to overwrite?")) {
        writeHTML();
      }
    } else {
      writeHTML();
    }
  }
};

const getIOPaths = (inputDirs: string[], outputDir: string): FileMap[] => {
  const result: FileMap[] = [];

  const traverseDir = (dir: string, rootDir: string) => {
    fs.readdirSync(dir).forEach((file: string) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        traverseDir(filePath, rootDir);
      } else {
        const relativePath = path.relative(rootDir, filePath);
        result.push({
          in: filePath,
          out: path.join(outputDir, relativePath),
        });
      }
    });
  };

  inputDirs.forEach((dir) => traverseDir(dir, dir));
  return result;
};

const exists = async (str: string) => {
  try {
    await fs.promises.stat(str);
    return true;
  } catch (e) {
    return false;
  }
};
