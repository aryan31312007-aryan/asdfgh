const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    // 1. Handle API routes
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        if (req.url === '/api/save-config') {
            req.on('end', () => {
                try {
                    const configData = JSON.parse(body);
                    fs.writeFileSync(
                        path.join(__dirname, 'config.json'), 
                        JSON.stringify(configData, null, 2), 
                        'utf8'
                    );
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Configuration saved successfully!' }));
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            });
            return;
        }

        if (req.url === '/api/git-push') {
            req.on('end', () => {
                exec('git add . && git commit -m "chore: Update proposal configuration online" && git push origin main', (error, stdout, stderr) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: error.message, details: stderr }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, stdout: stdout }));
                });
            });
            return;
        }

        if (req.url === '/api/firebase-deploy') {
            req.on('end', () => {
                exec('npx firebase-tools deploy', (error, stdout, stderr) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: error.message, details: stderr }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, stdout: stdout }));
                });
            });
            return;
        }

        if (req.url === '/api/log-visit') {
            req.on('end', () => {
                try {
                    const logData = JSON.parse(body);
                    const logsFile = path.join(__dirname, 'logs.json');
                    let logs = [];
                    
                    if (fs.existsSync(logsFile)) {
                        try {
                            const raw = fs.readFileSync(logsFile, 'utf8');
                            logs = raw ? JSON.parse(raw) : [];
                        } catch (e) {
                            console.error("Error reading logs.json, initializing empty:", e);
                        }
                    }
                    
                    const idx = logs.findIndex(l => l.sessionId === logData.sessionId);
                    const now = new Date().toISOString();
                    
                    if (idx !== -1) {
                        logs[idx].lastActive = now;
                        logs[idx].lastPage = logData.pageIndex;
                        logs[idx].userAgent = logData.userAgent || logs[idx].userAgent;
                        if (logData.isCompleted) {
                            logs[idx].isCompleted = true;
                        }
                        const flowLen = logs[idx].pathFlow.length;
                        if (flowLen === 0 || logs[idx].pathFlow[flowLen - 1] !== logData.pageIndex) {
                            logs[idx].pathFlow.push(logData.pageIndex);
                        }
                    } else {
                        logs.push({
                            sessionId: logData.sessionId,
                            userAgent: logData.userAgent || 'Unknown Device',
                            lastActive: now,
                            lastPage: logData.pageIndex,
                            isCompleted: !!logData.isCompleted,
                            pathFlow: [logData.pageIndex]
                        });
                    }
                    
                    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            });
            return;
        }

        if (req.url === '/api/clear-logs') {
            req.on('end', () => {
                try {
                    const logsFile = path.join(__dirname, 'logs.json');
                    fs.writeFileSync(logsFile, JSON.stringify([], null, 2), 'utf8');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            });
            return;
        }
    }

    // 2. Serve Static files
    if (req.method === 'GET') {
        if (req.url === '/api/get-logs') {
            try {
                const logsFile = path.join(__dirname, 'logs.json');
                let logs = [];
                if (fs.existsSync(logsFile)) {
                    const raw = fs.readFileSync(logsFile, 'utf8');
                    logs = raw ? JSON.parse(raw) : [];
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(logs));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
        }

        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './index.html';
        }

        // Remove query parameters
        filePath = filePath.split('?')[0];

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${error.code} ..\n`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
    console.log(`Press Ctrl+C to stop the server.`);
});
