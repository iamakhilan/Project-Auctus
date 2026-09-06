#!/usr/bin/env node
import { spawn, execSync } from 'child_process';
import os from 'os';
import path from 'path';

/**
 * AUCTUS Live Android Development Runner
 * Supports both Wi-Fi LAN reload and USB ADB reverse port forwarding.
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GOLD = '\x1b[38;2;251;191;36m';
const CYAN = '\x1b[38;2;0;210;255m';
const EMERALD = '\x1b[38;2;0;229;155m';
const GRAY = '\x1b[90m';

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal (127.0.0.1) and non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prefer standard home/office LAN ranges
        if (
          iface.address.startsWith('192.168.') ||
          iface.address.startsWith('10.') ||
          iface.address.startsWith('172.')
        ) {
          return iface.address;
        }
      }
    }
  }
  return 'localhost';
}

function findAdbPath() {
  try {
    execSync('adb --version', { stdio: 'ignore' });
    return 'adb';
  } catch {
    const defaultWinSdkAdb = path.join(
      os.homedir(),
      'AppData',
      'Local',
      'Android',
      'Sdk',
      'platform-tools',
      'adb.exe'
    );
    try {
      execSync(`"${defaultWinSdkAdb}" --version`, { stdio: 'ignore' });
      return defaultWinSdkAdb;
    } catch {
      return null;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isUsb = args.includes('--usb');
  const customIpArg = args.find(a => a.startsWith('--ip='));
  const customIp = customIpArg ? customIpArg.split('=')[1] : null;

  const port = 5173;
  const ipAddress = isUsb ? 'localhost' : customIp || getLocalIpAddress();
  const serverUrl = `http://${ipAddress}:${port}`;

  console.log(`\n${GOLD}${BOLD}====================================================${RESET}`);
  console.log(`${GOLD}${BOLD}   ⚔️  AUCTUS V2 — ANDROID LIVE DEVELOPMENT RUNNER   ${RESET}`);
  console.log(`${GOLD}${BOLD}====================================================${RESET}\n`);

  console.log(`${CYAN}• Mode:${RESET} ${isUsb ? '🔌 USB Mode (ADB Reverse)' : '📶 Wi-Fi LAN Mode'}`);
  console.log(`${CYAN}• Target Dev Server:${RESET} ${BOLD}${serverUrl}${RESET}`);

  const adb = findAdbPath();
  if (adb) {
    console.log(`${GRAY}• ADB Tooling detected: ${adb}${RESET}`);
    try {
      const devices = execSync(`"${adb}" devices`).toString();
      const hasDevice = devices.split('\n').some(line => line.includes('\tdevice'));
      if (hasDevice) {
        console.log(`${EMERALD}✓ Connected Android device detected via ADB!${RESET}`);
        // Setup ADB reverse for USB port forwarding
        execSync(`"${adb}" reverse tcp:${port} tcp:${port}`);
        console.log(`${EMERALD}✓ Configured port forwarding: adb reverse tcp:${port} tcp:${port}${RESET}`);
      } else {
        console.log(`${GRAY}ℹ No active USB device attached via ADB (connect phone with USB Debugging enabled).${RESET}`);
      }
    } catch (e) {
      console.log(`${GRAY}ℹ ADB reverse step skipped (${e.message})${RESET}`);
    }
  }

  // 1. Synchronize Capacitor with Live Server URL
  console.log(`\n${CYAN}• Syncing Capacitor Android project with live server URL...${RESET}`);
  try {
    execSync('npx cap sync android', {
      stdio: 'inherit',
      env: {
        ...process.env,
        CAPACITOR_SERVER_URL: serverUrl,
      },
    });
    console.log(`${EMERALD}✓ Capacitor synced successfully!${RESET}\n`);
  } catch (err) {
    console.error('Capacitor sync error:', err.message);
  }

  console.log(`${GOLD}${BOLD}----------------------------------------------------${RESET}`);
  console.log(`${EMERALD}${BOLD}🚀 Starting Vite Live Development Server...${RESET}`);
  console.log(`${GRAY}Edit source files in the project -> Save -> Phone reflects updates instantly!${RESET}`);
  console.log(`${GOLD}${BOLD}----------------------------------------------------${RESET}\n`);

  // 2. Spawn Vite dev server
  const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', String(port)], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      CAPACITOR_SERVER_URL: serverUrl,
    },
  });

  vite.on('close', code => {
    process.exit(code || 0);
  });
}

main().catch(err => {
  console.error('Failed to start mobile dev runner:', err);
  process.exit(1);
});
