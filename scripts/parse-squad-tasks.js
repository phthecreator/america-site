#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Agent mapping
const AGENT_MAP = {
  'frontend-dev': { name: 'Frontend Dev', short: 'FD', color: '#1c2f8f' },
  'ui-designer': { name: 'UI Designer', short: 'UD', color: '#28a745' },
  'data-extractor': { name: 'Data Extractor', short: 'DE', color: '#e03a3e' },
  'qa-tester': { name: 'QA Tester', short: 'QA', color: '#ef6c00' }
};

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const data = {};

  // Parse simple key: value pairs and lists
  const lines = yaml.split('\n');
  let currentKey = null;
  let currentValue = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    if (line.startsWith('  - ')) {
      // List item
      if (currentKey) {
        currentValue.push(line.trim().substring(2));
      }
    } else if (line.includes(':') && !line.startsWith('  ')) {
      // Key-value pair at root level
      if (currentKey && currentValue.length > 0) {
        data[currentKey] = currentValue.length === 1 ? currentValue[0] : currentValue;
      }
      const [key, value] = line.split(':').map(s => s.trim());
      currentKey = key;
      currentValue = value ? [value] : [];
    }
  }

  if (currentKey && currentValue.length > 0) {
    data[currentKey] = currentValue.length === 1 ? currentValue[0] : currentValue;
  }

  return data;
}

function calculateProgress(checklist) {
  if (!checklist || !Array.isArray(checklist)) return { completed: 0, total: 0 };

  const total = checklist.length;
  const completed = checklist.filter(item => {
    // Match [x] or [X] patterns
    return /^\[x\]/i.test(item.trim());
  }).length;

  return { completed, total };
}

function determineStatus(progress) {
  if (progress.total === 0) return 'backlog';
  const percentage = (progress.completed / progress.total) * 100;
  if (percentage === 0) return 'backlog';
  if (percentage === 100) return 'done';
  return 'in-progress';
}

function parseTaskFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = parseYamlFrontmatter(content);

  if (!frontmatter || !frontmatter.task || !frontmatter.responsavel) {
    return null;
  }

  // Extract agent ID from @agent-id format
  const responsavelMatch = frontmatter.responsavel.match(/@([\w-]+)/);
  const agentId = responsavelMatch ? responsavelMatch[1] : null;

  if (!agentId || !AGENT_MAP[agentId]) {
    console.warn(`Unknown agent: ${frontmatter.responsavel}`);
    return null;
  }

  const agent = AGENT_MAP[agentId];
  const checklist = frontmatter.Checklist || [];
  const progress = calculateProgress(checklist);
  const status = determineStatus(progress);

  return {
    id: '', // Will be assigned in main()
    agentId: agentId,
    agentName: agent.name,
    agentShort: agent.short,
    agentColor: agent.color,
    name: frontmatter.task,
    status: status,
    progress: Math.round((progress.completed / Math.max(progress.total, 1)) * 100),
    maxProgress: 100,
    checklist: {
      total: progress.total,
      completed: progress.completed
    },
    duration: 1000 + Math.random() * 500 // For game simulation
  };
}

function main() {
  const tasksDir = path.join(__dirname, '../squads/america-catalog/tasks');

  if (!fs.existsSync(tasksDir)) {
    // Squad-live gamification isolated in feature/squad-live branch
    // Main branch contains only home + catalog, no squad tracking
    console.warn(`⚠️ Squad tasks not found (isolated in feature/squad-live)`);

    // Create empty output for main branch
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const output = {
      timestamp: new Date().toISOString(),
      totalTasks: 0,
      completedTasks: 0,
      sprintProgress: 0,
      tasks: [],
      note: 'Squad tracking isolated in feature/squad-live'
    };

    const outputPath = path.join(publicDir, 'squad-tasks.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`✓ Generated empty ${outputPath}`);
    return;
  }

  // Read all markdown files (exclude agent files)
  const files = fs.readdirSync(tasksDir).filter(f => {
    if (!f.endsWith('.md') || f.startsWith('agents/')) return false;
    return f.startsWith('frontend-dev-') || f.startsWith('ui-designer-') ||
           f.startsWith('data-extractor-') || f.startsWith('qa-tester-');
  });

  let tasks = files
    .map(file => parseTaskFile(path.join(tasksDir, file)))
    .filter(task => task !== null);

  // Sort by agent priority order, then by task name
  const agentPriority = ['FD', 'UD', 'DE', 'QA'];
  tasks.sort((a, b) => {
    const aIndex = agentPriority.indexOf(a.agentShort);
    const bIndex = agentPriority.indexOf(b.agentShort);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.name.localeCompare(b.name);
  });

  // Assign sequential task IDs per agent
  const agentCounters = { 'FD': 1, 'UD': 1, 'DE': 1, 'QA': 1 };
  tasks = tasks.map(task => {
    task.id = `${task.agentShort}-${agentCounters[task.agentShort]}`;
    agentCounters[task.agentShort]++;
    return task;
  });

  // Calculate sprint metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const sprintProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const output = {
    timestamp: new Date().toISOString(),
    totalTasks: totalTasks,
    completedTasks: completedTasks,
    sprintProgress: sprintProgress,
    tasks: tasks
  };

  // Create public directory if it doesn't exist
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write JSON file
  const outputPath = path.join(publicDir, 'squad-tasks.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`✓ Parsed ${tasks.length} tasks from ${tasksDir}`);
  console.log(`✓ Generated ${outputPath}`);
  console.log(`  Sprint Progress: ${completedTasks}/${totalTasks} (${sprintProgress}%)`);
}

main();
