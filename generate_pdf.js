const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF(inputFile, outputFile, lang) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const filePath = `file:///${path.resolve(inputFile).replace(/\\/g, '/')}`;
    await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for fonts to load
    await new Promise(r => setTimeout(r, 2000));

    // Inject print-ready CSS overrides
    await page.addStyleTag({ content: `
        /* Reset for print */
        #navbar, .menu-toggle, .download-btn, .footer, .lang-switch { display: none !important; }

        body {
            background: #fff !important;
            color: #111 !important;
            font-size: 12px !important;
        }

        .cv-container {
            display: block !important;
            padding-top: 0 !important;
            padding: 0 !important;
        }

        .sidebar {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            border-radius: 0 !important;
            background: #f5f5f5 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 1.5rem 2rem !important;
            border-bottom: 2px solid #222 !important;
        }

        .profile-info h1 {
            font-size: 1.8rem !important;
        }

        .contact-info-list {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 0.5rem 1.5rem !important;
        }

        .main-content-wrapper {
            margin-left: 0 !important;
            padding: 1.5rem 2rem !important;
        }

        .main-content {
            gap: 2rem !important;
        }

        .project-card, .tool-card, .edu-item {
            border: 1px solid #ddd !important;
            background: #fff !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
        }

        .tag {
            background: #eee !important;
            border: 1px solid #ccc !important;
            color: #333 !important;
        }

        .reveal {
            opacity: 1 !important;
            transform: none !important;
        }

        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `});

    await page.pdf({
        path: outputFile,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
        scale: 0.75,
    });

    await browser.close();
    console.log(`Generated: ${outputFile}`);
}

(async () => {
    await generatePDF('index.html', 'Vladyslav_Hushpet_GameDev_QA_Resume_UA.pdf', 'uk');
    await generatePDF('en.html', 'Vladyslav_Hushpet_GameDev_QA_Resume_EN.pdf', 'en');
    console.log('Done! Both PDFs created.');
})();
