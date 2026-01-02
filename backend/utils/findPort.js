/**
 * Utility to find and kill process using a specific port
 * Usage: node utils/findPort.js 5000
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const findPortProcess = async (port) => {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const match = line.match(/\s+(\d+)\s*$/);
      if (match) {
        pids.add(match[1]);
      }
    });
    
    return Array.from(pids);
  } catch (error) {
    return [];
  }
};

export const killPortProcess = async (port) => {
  const pids = await findPortProcess(port);
  if (pids.length === 0) {
    console.log(`No process found using port ${port}`);
    return;
  }
  
  for (const pid of pids) {
    try {
      await execAsync(`taskkill /PID ${pid} /F`);
      console.log(`Killed process ${pid} using port ${port}`);
    } catch (error) {
      console.error(`Failed to kill process ${pid}:`, error.message);
    }
  }
};

