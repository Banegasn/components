const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findHtmlFiles(file));
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const files = findHtmlFiles('apps/angular-app/src/pages');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match <div class="code-sample"> \n <app-code-block ...></app-code-block> \n </div>
  const regex = /<div class="code-sample">\s*<app-code-block([^>]*)><\/app-code-block>\s*<\/div>/g;
  if (regex.test(content)) {
    const newContent = content.replace(regex, '<app-code-block$1></app-code-block>');
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});