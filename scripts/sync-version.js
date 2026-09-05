import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(__dirname, '..', 'package.json');
const sdkPath = path.join(__dirname, '..', 'src', 'PieSocket.js');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
let version = pkg.version;

if (process.stdin.isTTY) {
  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
  const answer = await rl.question(`Current version is ${version}. Bump it? (y/N) `);

  if (/^y(es)?$/i.test(answer.trim())) {
    const newVersion = (await rl.question('Enter new version: ')).trim();

    if (newVersion) {
      pkg.version = newVersion;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      version = newVersion;
      console.log(`package.json version updated to ${version}`);
    } else {
      console.log('No version entered, keeping', version);
    }
  }

  rl.close();
}

const sdkSrc = fs.readFileSync(sdkPath, 'utf8');
const versionRegex = /const SDK_VERSION = '[^']*';/;
const updatedSrc = sdkSrc.replace(versionRegex, `const SDK_VERSION = '${version}';`);

if (updatedSrc !== sdkSrc) {
  fs.writeFileSync(sdkPath, updatedSrc);
  console.log(`SDK_VERSION synced to ${version} in src/PieSocket.js`);
} else {
  console.log(`SDK_VERSION already matches ${version}`);
}
