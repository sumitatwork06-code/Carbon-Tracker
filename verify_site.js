const fs = require('fs');

async function verify() {
  const logLines = [];
  logLines.push(`Verification Timestamp: ${new Date().toISOString()}`);
  logLines.push('Starting automated browser & API verification...');

  try {
    // 1. Verify Home Page
    const resHome = await fetch('http://localhost:3000');
    logLines.push(`Home Page Status: ${resHome.status}`);
    if (resHome.status === 200) {
      const html = await resHome.text();
      logLines.push(`Home Page Loaded: ${html.includes('Track Your') && html.includes('Carbon Footprint') ? 'SUCCESS' : 'FAILED'}`);
    }

    // 2. Verify Dashboard Page
    const resDashboard = await fetch('http://localhost:3000/dashboard');
    logLines.push(`Dashboard Page Status: ${resDashboard.status}`);
    if (resDashboard.status === 200) {
      const html = await resDashboard.text();
      const hasContent = html.includes('Ecosystem Dashboard') || html.includes('Loading dashboard metrics');
      logLines.push(`Dashboard Page Loaded: ${hasContent ? 'SUCCESS' : 'FAILED'}`);
    }

    // 3. Verify api/history API
    const resHistory = await fetch('http://localhost:3000/api/history');
    logLines.push(`API /api/history Status: ${resHistory.status}`);
    if (resHistory.status === 200) {
      const history = await resHistory.json();
      logLines.push(`API logs returned: ${Array.isArray(history.logs) ? 'SUCCESS' : 'FAILED'}`);
      logLines.push(`Total logs this week: ${history.logs.length}`);
      if (history.logs.length > 0) {
        logLines.push('First log entry details: ' + JSON.stringify(history.logs[0]));
      }
    }

    logLines.push('Automated verification completed successfully.');
  } catch (err) {
    logLines.push(`Verification error: ${err.message}`);
  }

  const logContent = logLines.join('\n');
  console.log(logContent);
  fs.writeFileSync('verification_log.txt', logContent, 'utf8');
}

verify();
