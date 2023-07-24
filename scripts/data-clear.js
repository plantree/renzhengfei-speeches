import fs from 'fs';
import path from 'path';

const startYear = 1994;
const endYear = 2018;
const inputDir = 'archive/RenZhengfei-master';
const outputDir = 'docs/speeches';
const pattern = new RegExp('([0-9]+)');

function removePunctuation(str) {
  const punctuationRegex = /[，。！？【】、《》：；“”‘’（）【】！@#￥……&*\[\]\/,!?<>:;"'{}()=_`~$%^&*+|]+/g;
  return str.replace(punctuationRegex, '');
}

function deleteFolderContents(folderPath) {
  fs.readdirSync(folderPath).forEach((file) => {
    if (file.endsWith('/md')) {
        continue;
    }
    const filePath = path.join(folderPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      deleteFolderContents(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });
}

function parseFileName(filename) {
    const ret = pattern.exec(filename);
    return ret[0];
}

function parseDirectory(inputDir, outputDir) {
    const dirs = [];
    for (let i = startYear; i <= endYear; i++) {
        const dir = path.join(inputDir, i.toString());
        dirs.push(dir);
        if (!fs.existsSync(path.join(outputDir, i.toString()))) {
            fs.mkdirSync(path.join(outputDir, i.toString()));
        }
        const files = fs.readdirSync(dir);
        for (let f of files) {
            let originFile = f;
            f = f.replace('_', '');
            f = f.replace(' ', '');
            f = removePunctuation(f);
            const date = parseFileName(f);
            let article = f.slice(date.length);
            article = article.replace('_', '，');
            // get month
            let month = '';
            if (date.length === 4) {
                month = '01';
            } else if (date.length >= 6) {
                month = date.substring(4, 6);
            } else {
                throw new Error('Invalid date format: ' + date);
            }
            if (!fs.existsSync(path.join(outputDir, i.toString(), month))) {
                fs.mkdirSync(path.join(outputDir, i.toString(), month));
            }
            fs.copyFileSync(path.join(dir, originFile), path.join(outputDir, i.toString(), month, article));
        }
    }
}

// console.log(parseFileName('20171225_在听取展厅工作汇报时，关于咨询师的讲话.md'));
deleteFolderContents(outputDir);
parseDirectory(inputDir, outputDir);