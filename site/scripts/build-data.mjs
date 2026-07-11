import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.resolve(__dirname, '../src/data');

// Allow an explicit local fast path, but always regenerate in normal builds so
// stale or invalid source reports cannot be hidden by committed output files.
if (process.env.SKIP_DATA_BUILD === '1') {
  console.log('SKIP_DATA_BUILD=1, keeping pre-generated data files');
  process.exit(0);
}

// Directories containing idea files
const IDEA_DIRS = ['ideas', 'pr', 'prs', 'proposals', 'pr-proposals', 'features', 'fix'];

const hasRepositorySources = IDEA_DIRS.some((dir) => fs.existsSync(path.join(ROOT, dir)));
if (!hasRepositorySources) {
  const hasGeneratedData = fs.existsSync(path.join(OUT, 'ideas.json'))
    && fs.existsSync(path.join(OUT, 'content-map.json'));
  if (!hasGeneratedData) {
    throw new Error(`Idea source directories are unavailable under ${ROOT}, and no generated data was committed`);
  }
  console.log(`Idea sources are unavailable under ${ROOT}; using committed generated data`);
  process.exit(0);
}

// Meta files to skip
const SKIP_FILES = new Set([
  'README.md', 'README_EN.md', 'TEMPLATE.md', 'INTERACTIVE_TEMPLATE.md',
  'VISUAL_ENHANCEMENT_TEMPLATE.md', 'CREATIVE_STYLE_OPTIMIZATION_REPORT.md',
  'GITHUB_ABOUT_GUIDE.md', 'LICENSE', 'AI-Code-Review-Assistant.md',
  'evaluation-final-report.md', 'README_backup.md', 'tech-spec.md',
  'evaluation_report.json', 'idea-tracker.json', 'progress.json',
]);

function isIdeaFile(name) {
  if (SKIP_FILES.has(name)) return false;
  if (name.endsWith('-ORIGINAL.md')) return false;
  return name.endsWith('.md');
}

function extractFrontmatter(content, fileName) {
  // No YAML frontmatter - extract metadata from markdown structure
  const titleMatch = content.match(/^#\s+(.+)/m);
  const pitchMatch = content.match(/>\s*\*\*一句话卖点\*\*[：:]\s*(.+)/m);

  // Extract sections
  const sections = {};
  const sectionRegex = /^##\s+(.+)/gm;
  let match;
  const headings = [];
  while ((match = sectionRegex.exec(content)) !== null) {
    headings.push({ name: match[1], index: match.index });
  }
  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index + headings[i].name.length + 3;
    const end = i + 1 < headings.length ? headings[i + 1].index : content.length;
    sections[headings[i].name.trim()] = content.slice(start, end).trim();
  }

  // Extract core features if available
  const features = [];
  const coreSection = sections['功能设计'] || '';
  const featureRegex = /(?:^|\n)\d+\.\s+\*\*(.+?)\*\*[：:]\s*(.+)/g;
  let fm;
  while ((fm = featureRegex.exec(coreSection)) !== null) {
    features.push({ name: fm[1], desc: fm[2] });
  }

  return {
    title: titleMatch ? titleMatch[1].replace(/[^\w\s\u4e00-\u9fff\-()（）]/g, '').trim() : path.basename(fileName, '.md'),
    pitch: pitchMatch ? pitchMatch[1].trim() : '',
    sections,
    features: features.slice(0, 6),
  };
}

function parseEvaluationReport() {
  const reportPath = path.join(ROOT, 'evaluation-final-report.md');
  if (!fs.existsSync(reportPath)) return {};

  const content = fs.readFileSync(reportPath, 'utf-8');
  const scores = {};

  // Parse score blocks like:
  // 1. AI 简历诊断师
  //    市场规模 9 | 痛点强度 9 | ...
  //    → (9+9+12+9+8+8)×10/6.5 − 8 = 75.1
  const blockRegex = /(\d+)\.\s+(.+)\n\s+市场规模\s+(\d+)\s*\|\s*痛点强度\s+(\d+)\s*\|\s*爆款潜力\s+(\d+)\s*\|\s*技术可行性\s+(\d+)\s*\|\s*差异化\s+(\d+)\s*\|\s*变现能力\s+(\d+)\s*\|\s*执行难度\s+(\d+)\n\s+→.*?=\s*([\d.]+)/g;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const name = match[2].trim();
    scores[name] = {
      rank: parseInt(match[1]),
      name,
      scores: {
        marketSize: parseInt(match[3]),
        painPoint: parseInt(match[4]),
        viral: parseInt(match[5]),
        techFeasibility: parseInt(match[6]),
        differentiation: parseInt(match[7]),
        monetization: parseInt(match[8]),
        executionDifficulty: parseInt(match[9]),
      },
      overall: parseFloat(match[10]),
    };
  }

  // Also parse the Tier 2 table rows
  // | `prs/ai-rental-guardian.md` | AI 租房避坑顾问 | **67.7** |
  const tier2Regex = /\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|\s*\*\*([\d.]+)\*\*/g;
  const seen = new Set(Object.values(scores).map(s => s.name));
  while ((match = tier2Regex.exec(content)) !== null) {
    const name = match[2].trim();
    if (!seen.has(name)) {
      scores[name] = {
        rank: 0,
        name,
        file: match[1],
        scores: null,
        overall: parseFloat(match[3]),
        tier: 2,
      };
    }
  }

  // Parse Tier 1 table
  const tier1Regex =/\|\s*(\d+)\s*\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|\s*\*\*([\d.]+)\*\*\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(.+?)\s*\|/g;
  while ((match = tier1Regex.exec(content)) !== null) {
    const name = match[3].trim();
    if (scores[name]) {
      scores[name].rank = parseInt(match[1]);
      scores[name].file = match[2];
      scores[name].tier = 1;
      scores[name].viral = parseInt(match[5]);
      scores[name].executionDifficulty = parseInt(match[6]);
      scores[name].verdict = match[7].trim();
    }
  }

  return scores;
}

function parseEvaluationJSON() {
  const jsonPath = path.join(ROOT, 'evaluation_report.json');
  if (!fs.existsSync(jsonPath)) return {};

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const result = {};
    for (const ev of data.evaluations || []) {
      result[ev.idea_name] = {
        file: ev.file,
        name: ev.idea_name,
        scores: {
          marketSize: ev.scores['市场规模'],
          painPoint: ev.scores['痛点强度'],
          viral: ev.scores['爆款潜力'],
          techFeasibility: ev.scores['技术可行性'],
          differentiation: ev.scores['差异化'],
          monetization: ev.scores['变现能力'],
          executionDifficulty: ev.scores['执行难度'],
        },
        overall: ev.overall,
        verdict: ev.verdict,
      };
    }
    return result;
  } catch (error) {
    throw new Error(`Failed to parse ${jsonPath}: ${error.message}`);
  }
}

function getAllIdeaFiles() {
  const files = [];

  // Scan configured subdirectories
  for (const dir of IDEA_DIRS) {
    const dirPath = path.join(ROOT, dir);
    if (!fs.existsSync(dirPath)) continue;
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const subPath = path.join(dirPath, entry.name);
        for (const f of fs.readdirSync(subPath)) {
          if (f === 'README.md' || isIdeaFile(f)) {
            files.push({ path: `${dir}/${entry.name}/${f}`, dir, subpath: entry.name });
          }
        }
      } else if (isIdeaFile(entry.name)) {
        files.push({ path: `${dir}/${entry.name}`, dir, subpath: null });
      }
    }
  }

  // Scan root directory
  for (const f of fs.readdirSync(ROOT)) {
    if (isIdeaFile(f) && (f.startsWith('PR') || f.startsWith('ai-') || f.startsWith('AI-'))) {
      files.push({ path: f, dir: 'root', subpath: null });
    }
  }

  return files;
}

function buildData() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const reportScores = parseEvaluationReport();
  const jsonScores = parseEvaluationJSON();
  const ideaFiles = getAllIdeaFiles();

  console.log(`Found ${ideaFiles.length} idea files`);
  console.log(`Parsed ${Object.keys(reportScores).length} scores from evaluation report`);
  console.log(`Parsed ${Object.keys(jsonScores).length} scores from evaluation JSON`);

  const ideas = [];
  let id = 0;
  const withoutContent = (idea) => {
    const rest = { ...idea };
    delete rest.content;
    return rest;
  };

  for (const { path: relPath, dir } of ideaFiles) {
    const fullPath = path.join(ROOT, relPath);
    let content;
    try {
      content = fs.readFileSync(fullPath, 'utf-8');
    } catch {
      continue;
    }

    if (content.length < 100) continue; // skip stubs

    const meta = extractFrontmatter(content, relPath);
    const titleClean = meta.title.replace(/^[#\s]+/, '');

    // Find matching score
    let scoreData = reportScores[titleClean] || jsonScores[titleClean];

    // Try fuzzy match
    if (!scoreData) {
      for (const [name, data] of Object.entries(reportScores)) {
        if (titleClean.includes(name) || name.includes(titleClean)) {
          scoreData = data;
          break;
        }
      }
    }
    if (!scoreData) {
      for (const [name, data] of Object.entries(jsonScores)) {
        if (titleClean.includes(name) || name.includes(titleClean) || relPath.includes(data.file)) {
          scoreData = data;
          break;
        }
      }
    }

    const category = guessCategory(titleClean, content);

    ideas.push({
      id: id++,
      slug: path.basename(relPath, '.md').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-'),
      filePath: relPath,
      title: titleClean,
      pitch: meta.pitch,
      category,
      tier: scoreData?.tier || (scoreData?.rank > 0 && scoreData?.rank <= 10 ? 1 : 0),
      scores: scoreData?.scores || null,
      overall: scoreData?.overall || null,
      verdict: scoreData?.verdict || null,
      features: meta.features,
      hasFullContent: content.length > 500,
      sourceDir: dir,
      content: content,
    });
  }

  // Sort: scored ideas first (by overall desc), then unscored
  ideas.sort((a, b) => {
    if (a.overall != null && b.overall != null) return b.overall - a.overall;
    if (a.overall != null) return -1;
    if (b.overall != null) return 1;
    return a.title.localeCompare(b.title, 'zh');
  });

  const output = {
    generatedAt: new Date().toISOString(),
    totalIdeas: ideas.length,
    scoredIdeas: ideas.filter(i => i.overall != null).length,
    tier1: ideas.filter(i => i.tier === 1).map(withoutContent),
    tier2: ideas.filter(i => i.tier === 2).map(withoutContent),
    categories: [...new Set(ideas.map(i => i.category))].sort(),
    ideas: ideas.map(withoutContent),
  };

  // Write summary JSON (no content)
  fs.writeFileSync(path.join(OUT, 'ideas.json'), JSON.stringify(output, null, 2));

  // Write content map (slug -> content)
  const cmap = {};
  for (const idea of ideas) {
    if (idea.content) {
      cmap[idea.slug] = { content: idea.content };
    }
  }
  fs.writeFileSync(path.join(OUT, 'content-map.json'), JSON.stringify(cmap));

  console.log(`\nGenerated ideas.json with ${ideas.length} ideas (${output.scoredIdeas} scored)`);
  console.log(`Generated content-map.json with ${Object.keys(cmap).length} entries`);
}

function guessCategory(title, content) {
  const t = (title + ' ' + content.slice(0, 500)).toLowerCase();
  // More specific rules first to avoid false matches
  if (/简历|面试|求职|职业|职场|软技能|career|resume|interview|job/.test(t)) return '职业';
  if (/代码|开发|debug|error|编程|code|dev|agent|编排|orchestrat|workflow|automat|智能体/.test(t)) return '开发者工具';
  if (/合同|法律|维权|证据|租|legal|contract|rights/.test(t)) return '法律';
  if (/金融|投资|理财|薪资|财务|记账|finance|invest|salary/.test(t)) return '金融';
  if (/医疗|健康|心理|情绪|照护|医生|患者|health|medical|mental/.test(t)) return '健康';
  if (/翻译|语言|口语|英语|外语|translat|language|english/.test(t)) return '语言';
  if (/教育|教学|学习|课程|学生|教师|培训|mentor|learn|teach|stud/.test(t)) return '教育';
  if (/创意|设计|内容|创作|视频|写作|creativ|content|design|video/.test(t)) return '创作';
  if (/旅行|旅游|出行|travel|tour/.test(t)) return '旅行';
  if (/家庭|亲子|代际|家长|儿童|famil|parent|child/.test(t)) return '家庭';
  return '其他';
}

buildData();
