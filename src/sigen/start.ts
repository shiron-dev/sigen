import * as util from "util";
import * as fs from "fs";
import * as path from "path";
import { runHTML } from "./sigen";

// TODO: promise
// TODO: stdout
// TODO: catch error
// TODO: copy not html files
// TODO: not copy used html files
export const startSigen = () => {
  const args = util.parseArgs({
    options: {
      recursive: { type: "boolean", short: "r" },
    },
    allowPositionals: true,
  });

  if (args.values.recursive === undefined) args.values.recursive = false;

  const files = getTargetFiles(args.positionals, args.values.recursive);

  if (files === undefined) {
    return;
  }

  if (files.in.length === 1) {
    fs.writeFileSync(files.out, runHTML(files.in[0]));
  } else {
    const filePaths = files.in.map((p) => ({
      in: p,
      out: p
        .split("/")
        .filter((v, i) => i !== 0)
        .join("/"),
    }));
    filePaths.forEach((p) => {
      const outPath = path.join(files.out, p.out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, runHTML(p.in));
    });
  }
};

const getTargetFiles = (
  paths: string[],
  isR: boolean
): { in: string[]; out: string } | undefined => {
  if (paths.length < 2) return;

  const outPaths = paths[paths.length - 1];
  if (isR) {
    const inPaths = paths
      .filter((p, i) => {
        if (i === paths.length - 1) return false;
        return fs.statSync(p).isDirectory();
      })
      .flatMap((p) => getFilesRecursive(p));

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
