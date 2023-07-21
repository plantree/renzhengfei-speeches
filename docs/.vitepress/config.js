import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  ignoreDeadLinks: true, 
  title: 'renzhengfei-speeches',
  description: '任正非讲话集',
  lastUpdated: true,
  cleanUrls: true,
  lang: 'zh-CN',
  head: [
    ['link', { rel: "icon", type: "image/jpg", href: "/favicon.jpg"}],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '任正非讲话集' }],
    ['meta', { property: 'og:description', content: '商业, 认知, 决策' }],
    ['meta', { property: 'og:image', content: 'https://renzhengfei-speeches.plantree.me/favicon.jpg' }],
    ['meta', { property: 'og:url', content: 'https://renzhengfei-speeches.plantree.me/' }],
  ],
  markdown: {
    headers: {
      level: [0, 1]
    }
  },
  themeConfig: {
    sidebar: {
      '/speeches/': sidebarSpeeches(),
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/plantree/renzhengfei-speeches' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Plantree'
    },
  }
});

function sidebarSpeeches() {
  const config = [];
  // list all files in ../speeches recursively
  const rootDir = path.join(__dirname, '../speeches');
  const yearDirs = fs.readdirSync(rootDir)
  for (let yearDir of yearDirs) {
    const year = yearDir;
    yearDir = path.join(rootDir, yearDir);
    if (fs.lstatSync(yearDir).isFile()) {
      continue;
    }
    const monthDirs = fs.readdirSync(yearDir);
    const monthItems = [];
    for (let monthDir of monthDirs) {
      const month = monthDir;
      monthDir = path.join(yearDir, monthDir);
      const items = [];
      // list all files
      const files = fs.readdirSync(monthDir);
      for (let file of files) {
        const name = file.replace(/\.md$/, '');
        items.push({
          text: name,
          link: `/speeches/${year}/${month}/${file}`
        });
      }    
      monthItems.push({
        text: month,
        collapsed: true,
        items: items
      });
    }
    config.push({
      text: year,
      collapsed: true,
      items: monthItems.reverse()
    });
  }
  config.reverse();
  config[0].collapsed = false;
  config[0].items[0].collapsed = false;
  return config;
}