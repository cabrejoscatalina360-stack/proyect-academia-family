/** Publish only the generated public files; never alter the source index/worktree. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (args, extra = {}) => execFileSync('git', args, { cwd: root, encoding: 'utf8', ...extra }).trim();
const files = [
  ['index.html', readFileSync(path.join(root, 'deliverables/uniciencia.html'))],
  ['uniciencia-web-interactiva.zip', readFileSync(path.join(root, 'deliverables/uniciencia-web-interactiva.zip'))],
  ['INSTRUCCIONES.txt', readFileSync(path.join(root, 'deliverables/INSTRUCCIONES.txt'))],
  ['.nojekyll', Buffer.from('')],
];
const remote = git(['ls-remote', 'origin', 'refs/heads/gh-pages']);
let parent;
if (remote) {
  git(['fetch', 'origin', 'refs/heads/gh-pages']);
  parent = git(['rev-parse', 'FETCH_HEAD']);
}
const temporary = mkdtempSync(path.join(tmpdir(), 'uniciencia-pages-'));
try {
  const options = { env: { ...process.env, GIT_INDEX_FILE: path.join(temporary, 'index') } };
  git(['read-tree', '--empty'], options);
  for (const [name, content] of files) {
    const blob = git(['hash-object', '-w', '--stdin'], { ...options, input: content });
    git(['update-index', '--add', '--cacheinfo', '100644', blob, name], options);
  }
  const tree = git(['write-tree'], options);
  if (parent && git(['rev-parse', `${parent}^{tree}`]) === tree) {
    console.log('La rama gh-pages ya contiene esta versión.');
  } else {
    const args = ['commit-tree', tree, '-m', 'Publicar Uniciencia: verano 2027 y descarga interactiva'];
    if (parent) args.push('-p', parent);
    const commit = git(args, options);
    // A concurrent update is rejected normally. Never force-push a deployment.
    git(['push', 'origin', `${commit}:refs/heads/gh-pages`]);
    console.log(`Archivos publicados en gh-pages: ${commit}`);
  }
  console.log('La web requiere que GitHub Pages esté habilitado desde gh-pages, carpeta / (root).');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
