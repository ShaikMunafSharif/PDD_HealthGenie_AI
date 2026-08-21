const axios = require('axios');
const exceljs = require('exceljs');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5000/api/config';

// Helper to delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTestScenario(name, maxConcurrentUsers, durationSeconds, rampUpSeconds = 0) {
    console.log(`\n--- Starting ${name} ---`);
    console.log(`Target: ${TARGET_URL}`);
    console.log(`Max Users: ${maxConcurrentUsers}, Duration: ${durationSeconds}s, Ramp Up: ${rampUpSeconds}s`);

    const results = {
        name,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        responseTimes: [],
        startTime: Date.now(),
        endTime: null,
    };

    let isRunning = true;
    let currentUsers = 0;

    // Timer to stop the test
    setTimeout(() => {
        isRunning = false;
    }, durationSeconds * 1000);

    const makeRequest = async () => {
        const reqStart = Date.now();
        try {
            await axios.get(TARGET_URL, { timeout: 5000 });
            results.successfulRequests++;
        } catch (error) {
            results.failedRequests++;
        }
        const reqEnd = Date.now();
        results.responseTimes.push(reqEnd - reqStart);
        results.totalRequests++;
    };

    const worker = async () => {
        while (isRunning) {
            await makeRequest();
            // Tiny sleep to avoid completely freezing Node.js event loop
            await sleep(10);
        }
    };

    // Ramp up logic
    const rampUpIntervalMs = rampUpSeconds > 0 ? (rampUpSeconds * 1000) / maxConcurrentUsers : 0;
    
    const workers = [];
    for (let i = 0; i < maxConcurrentUsers; i++) {
        if (!isRunning) break;
        workers.push(worker());
        if (rampUpIntervalMs > 0) {
            await sleep(rampUpIntervalMs);
        }
        currentUsers++;
        if (i % 50 === 0 && i !== 0) {
            console.log(`[${name}] Spawned ${currentUsers} virtual users...`);
        }
    }

    // Wait for all workers to finish
    await Promise.all(workers);
    results.endTime = Date.now();

    const actualDurationSec = (results.endTime - results.startTime) / 1000;
    results.rps = results.totalRequests / actualDurationSec;
    results.minResponseTime = results.responseTimes.length > 0 ? Math.min(...results.responseTimes) : 0;
    results.maxResponseTime = results.responseTimes.length > 0 ? Math.max(...results.responseTimes) : 0;
    results.avgResponseTime = results.responseTimes.length > 0 ? 
        results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length : 0;

    console.log(`\n--- Completed ${name} ---`);
    console.log(`Total Requests: ${results.totalRequests}`);
    console.log(`RPS: ${results.rps.toFixed(2)} req/sec`);
    console.log(`Min: ${results.minResponseTime}ms | Max: ${results.maxResponseTime}ms | Avg: ${results.avgResponseTime.toFixed(2)}ms`);

    return results;
}

async function main() {
    console.log("Starting Performance Testing Suite...");

    const allResults = [];

    try {
        // 1. Baseline/Load Testing: 100 users for 60 seconds
        allResults.push(await runTestScenario("Baseline/Load Testing", 100, 60, 5));
        await sleep(5000); // Cool down

        // 2. Stress Testing: 300 users for 60 seconds
        allResults.push(await runTestScenario("Stress Testing", 300, 60, 10));
        await sleep(5000); // Cool down

        // 3. Spike Testing: 500 users with very rapid ramp up
        allResults.push(await runTestScenario("Spike Testing", 500, 30, 2));
        await sleep(5000); // Cool down

        // 4. Soak Testing: 50 users for 3 minutes (180 seconds)
        allResults.push(await runTestScenario("Soak Testing", 50, 180, 5));
        
        console.log("\nAll tests completed! Generating Excel Report...");

        // Generate Excel Report
        const workbook = new exceljs.Workbook();
        workbook.creator = 'HealthGenie CI';
        workbook.created = new Date();

        const sheet = workbook.addWorksheet('Performance Metrics');
        
        sheet.columns = [
            { header: 'Test Scenario', key: 'name', width: 25 },
            { header: 'Total Requests', key: 'total', width: 15 },
            { header: 'Success', key: 'success', width: 15 },
            { header: 'Failed', key: 'failed', width: 15 },
            { header: 'RPS (req/sec)', key: 'rps', width: 15 },
            { header: 'Min Response (ms)', key: 'min', width: 18 },
            { header: 'Max Response (ms)', key: 'max', width: 18 },
            { header: 'Avg Response (ms)', key: 'avg', width: 18 }
        ];

        // Add styling to headers
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

        for (const res of allResults) {
            sheet.addRow({
                name: res.name,
                total: res.totalRequests,
                success: res.successfulRequests,
                failed: res.failedRequests,
                rps: res.rps.toFixed(2),
                min: res.minResponseTime,
                max: res.maxResponseTime,
                avg: res.avgResponseTime.toFixed(2)
            });
        }

        const reportPath = 'performance_test_report.xlsx';
        await workbook.xlsx.writeFile(reportPath);
        console.log(`Excel report successfully saved to ${reportPath}`);
    } catch (error) {
        console.error("An error occurred during performance testing:", error);
        process.exit(1);
    }
}

main();
