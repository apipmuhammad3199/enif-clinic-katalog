import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

try {
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('dist directory not found. Did you run npm run build?');
    process.exit(1);
  }
  console.log('Deploying to gh-pages...');
  
  // Navigate to dist folder
  process.chdir(distPath);
  
  // Initialize git and push
  execSync('git init', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  
  try {
    execSync('git commit -m "Deploy"', { stdio: 'inherit' });
  } catch (e) {
    console.log('Nothing to commit or commit failed. Continuing...');
  }
  
  execSync('git push --force https://github.com/apipmuhammad3199/enif-clinic-katalog.git master:gh-pages', { stdio: 'inherit' });
  console.log('Successfully deployed to gh-pages!');
} catch (error) {
  console.error('Deployment failed:', error);
}
