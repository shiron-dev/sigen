import * as util from "util";
import * as fs from "fs";
import * as path from "path";
import { runHTML } from "./sigen";
import { stdYN } from "@/interactive";

// TODO: promise
// TODO: copy not html files
// TODO: not copy used html files
export const startSigen = async () => {
  const args = util.parseArgs({
    options: {
      recursive: { type: "boolean", short: "r" },
    },
    allowPositionals: true,
  });
  if (args.values.recursive === undefined) args.values.recursive = false;

  const ioFiles = getTargetFiles(args.positionals, args.values.recursive);
  if (ioFiles === undefined) {
    console.log("Error");
    return;
  }

  if (ioFiles.in.length === 1) {
    // input one file, output one file
    saveSigenHTML(ioFiles.in[0], ioFiles.out, true);
  } else {
    // input multiple files, output to directory

    // 出力パスを出力ディレクトリからの相対パスにする
    const filePaths = ioFiles.in.map((p) => ({
      in: p,
      out: p
        .split("/")
        .filter((v, i) => i !== 0)
        .join("/"),
    }));

    filePaths.forEach((p) => {
      const outPath = path.join(ioFiles.out, p.out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      saveSigenHTML(p.in, outPath);
    });
  }
};

const saveSigenHTML = async (
  inPath: string,
  outPath: string,
  doCheckOverwrite = false
) => {
  const writeHTML = () => {
    fs.writeFileSync(outPath, runHTML(inPath));
  };

  if (fs.existsSync(inPath)) {
    // 新規ファイル
    writeHTML();
  } else {
    if (fs.statSync(outPath).isDirectory()) {
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

const getTargetFiles = (
  paths: string[],
  isR: boolean
): { in: string[]; out: string } | undefined => {
  if (paths.length < 2) return;

  // 一番最後の要素が出力パス
  const outPaths = paths[paths.length - 1];

  if (isR) {
    const inFiles: string[] = [];
    const inPaths = paths
      .filter((p, i) => {
        if (i === paths.length - 1) return false;
        if (!fs.existsSync(p)) {
          console.log(`${fs.existsSync(p)} is not exists.`);
          return false;
        }
        if (fs.statSync(p).isDirectory()) {
          return true;
        } else {
          inFiles.push(p);
          return false;
        }
      })
      .flatMap((p) => getFilesRecursive(p));
    inPaths.concat(inFiles);

    return { in: inPaths, out: outPaths };
  } else {
    const inPaths = paths.filter((p, i) => {
      if (i === paths.length - 1) return false;
      if (fs.existsSync(p)) {
        return true;
      } else {
        console.log(`${p} is not exists.`);
        return false;
      }
    });

    return { in: inPaths, out: outPaths };
  }
};

const getFilesRecursive = (dir: string): string[] => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((f) =>
      f.isDirectory()
        ? getFilesRecursive(path.join(dir, f.name))
        : path.join(dir, f.name)
    );
};
