import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contentDir = join(__dirname, '../src/data/content');
const outputFile = join(__dirname, '../src/data/bundledContent.js');

function readMarkdownFiles(dir) {
	const files = readdirSync(dir);
	const content = {};

	for (const file of files) {
		const fullPath = join(dir, file);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			// Skip image directories
			if (file === 'images') continue;
			// Recursively read subdirectories
			const subContent = readMarkdownFiles(fullPath);
			Object.assign(content, subContent);
		} else if (file.endsWith('.md')) {
			const relativePath = fullPath.replace(contentDir + '/', '');
			const fileContent = readFileSync(fullPath, 'utf-8');
			content[relativePath] = fileContent;
		}
	}

	return content;
}

const allContent = readMarkdownFiles(contentDir);

const output = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const bundledContent = ${JSON.stringify(allContent, null, 2)};

export function getContent(path) {
  return bundledContent[path];
}
`;

writeFileSync(outputFile, output, 'utf-8');
console.log(`✅ Bundled ${Object.keys(allContent).length} markdown files into ${outputFile}`);
