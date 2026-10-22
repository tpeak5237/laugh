import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean))];
const patterns = [
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api_key|access_token|oauth_token|client_secret)\s*[:=]\s*["'][A-Za-z0-9_-]{16,}/i,
];
const hits = files.filter(file => {
  const text = readFileSync(file, 'utf8');
  return patterns.some(pattern => pattern.test(text));
});
console.log(JSON.stringify({ scannedFiles: files.length, hitFiles: hits, limitation: 'Pattern scan only; not a guarantee of secret absence' }, null, 2));
if (hits.length) process.exitCode = 1;
