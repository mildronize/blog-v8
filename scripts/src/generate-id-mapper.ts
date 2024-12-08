import glob from "tiny-glob";
import matter from "gray-matter";
import fs from "fs-extra";
import path from "path";
import toml from "@iarna/toml";

async function processMarkdownFiles(sourceDirs: string[], targetDir: string) {
  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    for (const dir of sourceDirs) {
      // Find all markdown files in the directory
      const files = await glob(`${dir}/**/*.md`);

      for (const file of files) {
        // Read file content
        const content = await fs.readFile(file, "utf8");

        // Process with gray-matter
        const { data, content: body } = matter(content, {
          delimiters: ["+++", "+++"],
          engines: {
            toml: toml.parse.bind(toml),
          }
        });

        // Construct the output file path
        const relativePath = path.relative(dir, file);
        const targetPath = path.join(targetDir, relativePath);

        // Ensure the target subdirectory exists
        await fs.ensureDir(path.dirname(targetPath));

        // Write the processed file
        const output = matter.stringify(body, data);
        // await fs.writeFile(targetPath, output, "utf8");

        console.log(`Processed: ${file} -> '${data.title}'`);
      }
    }

    console.log("All files processed successfully!");
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

const sourceDirectories = ["../content/posts"];
const targetDirectory = "../public";

processMarkdownFiles(sourceDirectories, targetDirectory);
