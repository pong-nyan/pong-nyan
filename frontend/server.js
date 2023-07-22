const { parse } = require('url');
const next = require('next');

const https = require('https');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000;

const httpsOptions = {
    key: fs.readFileSync('../secrets/cert.key'),
    cert: fs.readFileSync('../secrets/cert.crt'),
};

app.prepare().then(() => {
    https
        .createServer(httpsOptions, (req, res) => {
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        })
        .listen(PORT, (err) => {
            if (err) throw err;
            console.log(`> HTTPS: Ready on https://localhost:${PORT}`);
        });
});