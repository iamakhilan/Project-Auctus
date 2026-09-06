#!/usr/bin/env node
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * AUCTUS Android Production & Debug APK Builder
 * Builds web assets, syncs Capacitor native project, and compiles the Android APK.
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GOLD = '\x1b[38;2;251;191;36m';
const CYAN = '\x1b[38;2;0;210;255m';
const EMERALD = '\x1b[38;2;0;229;155m';
const GRAY = '\x1b[90m';

function findJavaHome() {
  if (process.env.JAVA_HOME && fs.existsSync(process.env.JAVA_HOME)) {
    return process.env.JAVA_HOME;
  }

  try {
    execSync('java -version', { stdio: 'ignore' });
    return null; // java already accessible in PATH
  } catch {
    // Search common paths
    const candidates = [
      'C:\\Program Files\\Android\\Android Studio\\jbr',
      'C:\\Program Files\\Android\\Android Studio\\jre',
      '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
      '/opt/android-studio/jbr',
    ];

    for (const cand of candidates) {
      if (fs.existsSync(cand)) {
        return cand;
      }
    }
  }
  return null;
}

function findAndroidSdk() {
  if (process.env.ANDROID_HOME && fs.existsSync(process.env.ANDROID_HOME)) {
    return process.env.ANDROID_HOME;
  }
  if (process.env.ANDROID_SDK_ROOT && fs.existsSync(process.env.ANDROID_SDK_ROOT)) {
    return process.env.ANDROID_SDK_ROOT;
  }

  const defaultSdk = path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk');
  if (fs.existsSync(defaultSdk)) {
    return defaultSdk;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const isRelease = args.includes('--release');
  const gradleTask = isRelease ? 'assembleRelease' : 'assembleDebug';

  console.log(`\n${GOLD}${BOLD}====================================================${RESET}`);
  console.log(`${GOLD}${BOLD}      ⚔️  AUCTUS — ANDROID APPLICATION BUILDER       ${RESET}`);
  console.log(`${GOLD}${BOLD}====================================================${RESET}\n`);

  console.log(`${CYAN}• Target:${RESET} ${isRelease ? 'Release APK' : 'Debug APK'}`);

  // 1. Build Web Assets
  console.log(`\n${CYAN}1. Compiling production web bundle (Vite + TypeScript)...${RESET}`);
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Sync with Native Capacitor Project
  console.log(`\n${CYAN}2. Syncing assets with native Android shell (Capacitor)...${RESET}`);
  execSync('npx cap sync android', {
    stdio: 'inherit',
    env: {
      ...process.env,
      CAPACITOR_SERVER_URL: '', // Ensure bundled production assets are used
    },
  });

  // 3. Locate Java and SDK
  const javaHome = findJavaHome();
  const androidSdk = findAndroidSdk();

  const customEnv = { ...process.env };
  if (javaHome) {
    customEnv.JAVA_HOME = javaHome;
    customEnv.PATH = `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.PATH || ''}`;
    console.log(`${GRAY}• Using Java at: ${javaHome}${RESET}`);
  }
  if (androidSdk) {
    customEnv.ANDROID_HOME = androidSdk;
    customEnv.ANDROID_SDK_ROOT = androidSdk;
    console.log(`${GRAY}• Using Android SDK at: ${androidSdk}${RESET}`);
  }

  // 4. Run Gradle Build
  console.log(`\n${CYAN}3. Compiling native Android APK (${gradleTask})...${RESET}`);
  const isWindows = process.platform === 'win32';
  const gradlewCmd = isWindows ? '.\\gradlew.bat' : './gradlew';
  const androidDir = path.resolve(process.cwd(), 'android');

  execSync(`${gradlewCmd} ${gradleTask}`, {
    cwd: androidDir,
    stdio: 'inherit',
    env: customEnv,
  });

  // 5. Check Output APK
  const tempApkPath = path.join(
    os.homedir(),
    'AppData',
    'Local',
    'Temp',
    'auctus-build',
    'app',
    'outputs',
    'apk',
    isRelease ? 'release' : 'debug',
    isRelease ? 'app-release-unsigned.apk' : 'app-debug.apk'
  );

  const standardApkDir = path.join(androidDir, 'app', 'build', 'outputs', 'apk', isRelease ? 'release' : 'debug');
  const targetApkPath = path.join(standardApkDir, isRelease ? 'app-release-unsigned.apk' : 'app-debug.apk');

  if (fs.existsSync(tempApkPath)) {
    fs.mkdirSync(standardApkDir, { recursive: true });
    fs.copyFileSync(tempApkPath, targetApkPath);
  }

  console.log(`\n${EMERALD}${BOLD}====================================================${RESET}`);
  console.log(`${EMERALD}${BOLD}   ✓ AUCTUS ANDROID APK BUILT SUCCESSFULLY!        ${RESET}`);
  console.log(`${EMERALD}${BOLD}====================================================${RESET}`);
  if (fs.existsSync(targetApkPath)) {
    const stats = fs.statSync(targetApkPath);
    console.log(`${CYAN}• APK Location:${RESET} ${BOLD}${targetApkPath}${RESET}`);
    console.log(`${CYAN}• APK Size:${RESET} ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  }
  console.log(`\n${GOLD}To install directly onto connected device via ADB:${RESET}`);
  console.log(`${GRAY}  adb install -r "${targetApkPath}"${RESET}\n`);
}

main().catch(err => {
  console.error('\nAndroid build failed:', err.message);
  process.exit(1);
});
