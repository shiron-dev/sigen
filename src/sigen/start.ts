import * as util from "util";
import * as fs from "fs";
import * as path from "path";
import { runHTML } from "./sigen";
import { stdYN } from "@/interactive";

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

  const ioFiles = await getTargetFiles(args.positionals, args.values.recursive);
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

    await Promise.all(
      filePaths.map(async (p) => {
        const outPath = path.join(ioFiles.out, p.out);
        await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
        saveSigenHTML(p.in, outPath);
      })
    );
  }
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

const getTargetFiles = async (
  paths: string[],
  isR: boolean
): Promise<{ in: string[]; out: string } | undefined> => {
  if (paths.length < 2) return;

  // 一番最後の要素が出力パス
  const outPaths = paths[paths.length - 1];

  if (isR) {
    const inFiles: string[] = [];
    const filtered = await Promise.all(
      paths.map(async (p, i) => {
        if (i === paths.length - 1) return false;
        if (!(await exists(p))) {
          console.log(`${p} is not exists.`);
          return false;
        }
        if ((await fs.promises.stat(p)).isDirectory()) {
          return true;
        } else {
          inFiles.push(p);
          return false;
        }
      })
    );
    const inPaths = (
      await Promise.all(
        paths.filter((f, i) => filtered[i]).map((p) => getFilesRecursive(p))
      )
    ).flat();
    inPaths.concat(inFiles);

    return { in: inPaths, out: outPaths };
  } else {
    const filtered = await Promise.all(
      paths.map(async (p, i) => {
        if (i === paths.length - 1) return false;
        if (await exists(p)) {
          return true;
        } else {
          console.log(`${p} is not exists.`);
          return false;
        }
      })
    );
    const inPaths = paths.filter((p, i) => filtered[i]);

    return { in: inPaths, out: outPaths };
  }
};

const getFilesRecursive = async (dir: string): Promise<string[]> => {
  return (
    await Promise.all(
      (
        await fs.promises.readdir(dir, { withFileTypes: true })
      ).map(async (f) =>
        f.isDirectory()
          ? getFilesRecursive(path.join(dir, f.name))
          : path.join(dir, f.name)
      )
    )
  ).flat();
};

const exists = async (str: string) => {
  try {
    await fs.promises.stat(str);
    return true;
  } catch (e) {
    return false;
  }
};
