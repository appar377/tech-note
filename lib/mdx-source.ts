import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const MDX_EXTENSION = ".mdx";

export function parseMdxSource(raw: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);

  if (!match) {
    return {
      data: {},
      content: raw,
    };
  }

  return {
    data: parseYaml(match[1]) ?? {},
    content: raw.slice(match[0].length),
  };
}

export function listMdxFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return listMdxFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(MDX_EXTENSION) ? [entryPath] : [];
  });
}
