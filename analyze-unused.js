#!/usr/bin/env node

/**
 * سكريبت لتحليل الكود غير المستخدم في المشروع
 * استخدم: node analyze-unused.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قائمة الملفات والمجلدات التي يجب تجاهلها
const IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  '.git',
  '.vite',
  'stats.html',
  'package-lock.json',
  'yarn.lock',
  '*.log',
  '*.map'
];

function scanDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!IGNORE_PATTERNS.some(pattern => fullPath.includes(pattern))) {
          scan(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  return files;
}

function analyzeImports(files) {
  const imports = new Set();
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        // البحث عن import statements
        const importMatch = line.match(/import\s+.*?from\s+['"]([^'"]+)['"]/);
        if (importMatch) {
          const importPath = importMatch[1];
          
          // تجاهل imports المحلية
          if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
            const packageName = importPath.split('/')[0];
            imports.add(packageName);
          }
        }
      }
    } catch (error) {
      console.warn(`خطأ في قراءة الملف: ${file}`);
    }
  }
  
  return Array.from(imports);
}

function checkPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    
    return { dependencies, devDependencies };
  } catch (error) {
    console.error('خطأ في قراءة package.json');
    return { dependencies: [], devDependencies: [] };
  }
}

function main() {
  console.log('🔍 بدء تحليل الكود غير المستخدم...\n');
  
  const projectRoot = path.join(__dirname);
  const files = scanDirectory(projectRoot);
  
  console.log(`📁 تم العثور على ${files.length} ملف`);
  
  const usedImports = analyzeImports(files);
  console.log(`📦 المكتبات المستخدمة: ${usedImports.length}`);
  
  const { dependencies, devDependencies } = checkPackageJson();
  const allDependencies = [...dependencies, ...devDependencies];
  
  // console.log(`\n📋 تحليل المكتبات:`);
  // console.log(`- إجمالي المكتبات في package.json: ${allDependencies.length}`);
  // console.log(`- المكتبات المستخدمة فعلياً: ${usedImports.length}`);
  
  // البحث عن المكتبات غير المستخدمة
  const unusedDependencies = allDependencies.filter(dep => !usedImports.includes(dep));
  
  // console.log(`\n❌ المكتبات غير المستخدمة:`);
  if (unusedDependencies.length === 0) {
    // console.log('✅ لا توجد مكتبات غير مستخدمة');
  } else {
    unusedDependencies.forEach(dep => {
      // console.log(`- ${dep}`);
    });
  }
  
  // البحث عن المكتبات المستخدمة ولكن غير موجودة في package.json
  const missingDependencies = usedImports.filter(imp => !allDependencies.includes(imp));
  
  // console.log(`\n⚠️ المكتبات المستخدمة ولكن غير موجودة في package.json:`);
  if (missingDependencies.length === 0) {
    // console.log('✅ جميع المكتبات المستخدمة موجودة في package.json');
  } else {
    missingDependencies.forEach(dep => {
      // console.log(`- ${dep}`);
    });
  }
  
  // console.log(`\n💡 توصيات للتحسين:`);
  // console.log('1. إزالة المكتبات غير المستخدمة من package.json');
  // console.log('2. استخدام dynamic imports للمكتبات الكبيرة');
  // console.log('3. تفعيل tree shaking في Vite');
  // console.log('4. استخدام lazy loading للمكونات');
  
  // حساب حجم التوفير المحتمل
  const estimatedSize = unusedDependencies.length * 50; // تقدير تقريبي
  console.log(`\n💰 حجم التوفير المحتمل: ~${estimatedSize}KB`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 