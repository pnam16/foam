#!/usr/bin/env node
/*
  Extract topics from daily notes and consolidate into structured notes.
  - Groups by simple heuristics based on section headings and keywords
  - Maintains source attribution and related links
*/
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const DAILY_DIR = path.join(ROOT, 'daily');
const NOTES_DIR = path.join(ROOT, 'notes');

/** Topic routing rules */
const routes = [
  { matcher: /\b(react|useeffect|uselayouteffect|usecallback|usememo|usestate)\b/i, target: noteForReact },
  { matcher: /\b(event\s*loop|microtask|macrotask)\b/i, target: () => ['programming/javascript/event-loop.md', 'Event loop'] },
  { matcher: /\b(long\s*polling)\b/i, target: () => ['programming/long-polling.md', 'Long polling'] },
  { matcher: /\b(closure|scope|hoisting|var|let|const)\b/i, target: () => ['programming/javascript/closures.md', 'JavaScript Basics'] },
  { matcher: /\b(solid)\b/i, target: () => ['programming/solid.md', 'SOLID'] },
  { matcher: /\b(feature\s*flag|toggle)\b/i, target: () => ['programming/feature-flags.md', 'Feature Flags'] },
  { matcher: /\b(java|jvm|jdk|jre|wrapper|autoboxing|equals\(\)|final(ly|ize)?|primitive)\b/i, target: () => ['programming/java/index.md', 'Java'] },
  { matcher: /\b(finance|tài chính|đầu tư|ETF|bogleheads|efficient\s*frontier|quản lý tài chính)\b/i, target: () => ['personal/finance-management.md', 'Personal Finance'] },
  { matcher: /\b(wyckoff|VSA|EMA\s*50|EMA\s*200|RSI|day\s*trading|scalping)\b/i, target: () => ['trading/wyckoff/plan.md', 'Trading Strategies'] },
  { matcher: /\b(interview|phỏng\s*vấn)\b/i, target: () => ['career/interview-preparation.md', 'Interview Preparation'] },
];

function noteForReact(text) {
  if (/useState/i.test(text)) return ['programming/react/useState.md', 'React useState'];
  return ['programming/react-hooks-side-effects.md', 'React Side Effects'];
}

function readFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(dir, f));
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function parseSections(content) {
  // Split by level-2 headings and above, keep heading line
  const lines = content.split(/\r?\n/);
  const sections = [];
  let current = { heading: '', body: [] };
  for (const line of lines) {
    if (/^#{2,}\s+/.test(line)) {
      if (current.heading || current.body.length) sections.push(current);
      current = { heading: line.replace(/^#+\s+/, ''), body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current.heading || current.body.join('').trim()) sections.push(current);
  return sections.map((s) => ({ heading: s.heading.trim(), text: s.body.join('\n').trim() })).filter((s) => s.heading || s.text);
}

function selectTarget(sectionText) {
  for (const rule of routes) {
    if (rule.matcher.test(sectionText)) {
      return rule.target(sectionText);
    }
  }
  return null;
}

function readNote(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return ''; }
}

function writeNote(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function addAttribution(note, dailyFile, relatedLinks) {
  const source = path.relative(ROOT, dailyFile);
  const sourceLine = `- Source: [[${source.replace(/\\/g, '/')}|${path.basename(dailyFile, '.md')}]]`;
  const related = relatedLinks.length ? `\n- Related: ${relatedLinks.join(', ')}` : '';

  // Append under a Sources section (create if missing)
  if (!/^## Sources/m.test(note)) {
    return note.trimEnd() + `\n\n## Sources\n${sourceLine}${related}\n`;
  }
  if (!note.includes(sourceLine)) {
    return note.replace(/## Sources[^]*?$/, (block) => block.trimEnd() + `\n${sourceLine}${related}\n`);
  }
  return note;
}

function mergeSectionIntoNote(note, heading, body, dailyFile) {
  const safeHeading = heading || 'Notes';
  const sectionTitle = `### ${safeHeading}`;

  if (note.includes(sectionTitle)) {
    // Append under existing section, avoid duplicates
    const existingBlockRegex = new RegExp(`${sectionTitle}[\n\r]+([\s\S]*?)(?=\n## |\n### |$)`, 'm');
    const match = note.match(existingBlockRegex);
    if (match) {
      const existing = match[1];
      if (!existing.includes(body)) {
        return note.replace(existingBlockRegex, `${sectionTitle}\n${existing.trimEnd()}\n\n${body}\n`);
      }
      return note;
    }
  }

  // Insert before Sources if present, else at end
  if (/\n## Sources\n/.test(note)) {
    return note.replace(/\n## Sources\n/, `\n${sectionTitle}\n\n${body}\n\n## Sources\n`);
  }
  return note.trimEnd() + `\n\n${sectionTitle}\n\n${body}\n`;
}

function wikiLinkFor(targetPath, label) {
  const withoutExt = targetPath.replace(/\.md$/, '');
  return `[[${withoutExt}|${label}]]`;
}

function processDaily(dailyFile) {
  const content = fs.readFileSync(dailyFile, 'utf8');
  const sections = parseSections(content);
  const related = new Set();
  const edits = [];

  for (const s of sections) {
    const text = `${s.heading}\n\n${s.text}`.trim();
    const target = selectTarget(text);
    if (!target) continue;
    const [targetRel, label] = target;
    const targetAbs = path.join(NOTES_DIR, targetRel);
    const note = readNote(targetAbs) || `# ${label}\n`;

    const link = wikiLinkFor(targetRel, label);
    related.add(link);

    const merged = mergeSectionIntoNote(note, s.heading, s.text, dailyFile);
    const withAttr = addAttribution(merged, dailyFile, []);
    if (withAttr !== note) {
      writeNote(targetAbs, withAttr);
      edits.push(targetRel);
    }
  }
  return { dailyFile, updatedNotes: Array.from(new Set(edits)), relatedLinks: Array.from(related) };
}

function main() {
  const files = readFiles(DAILY_DIR);
  if (!files.length) {
    console.error('No daily notes found');
    process.exit(1);
  }
  const onlyAug = files.filter((f) => /2025-08-/.test(path.basename(f)));
  const results = (onlyAug.length ? onlyAug : files).map(processDaily);
  console.log(JSON.stringify(results, null, 2));
}

main();


