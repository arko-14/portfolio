/**
 * Resume Download Tracker - Google Sheets Integration
 * Sends download info directly to your Google Sheet
 */

const ResumeTracker = {
    // ⚠️ UPDATE THIS with your Google Apps Script URL
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwSegnHDQMqRUuVXy1A3aqlChyUxwUaA_1uBUjLPr6YavmlV1GzDFv8-qzS9ydwYZf3Nw/exec',

    async trackDownload(event) {
        event.preventDefault();
        const downloadLink = event.currentTarget.href;

        // Collect visitor info
        const data = {
            timestamp: new Date().toLocaleString(),
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        // Get IP and location
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            data.ip = ipData.ip;

            const locRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
            const locData = await locRes.json();
            data.city = locData.city || '';
            data.country = locData.country_name || '';
            data.org = locData.org || '';
        } catch (e) {
            data.ip = 'Unknown';
            data.city = '';
            data.country = '';
            data.org = '';
        }

        // Send to Google Sheets
        try {
            const response = await fetch(this.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(data)
            });
            console.log('Tracking data sent:', data);
        } catch (err) {
            console.error('Failed to send tracking data:', err);
        }

        // Open the resume
        window.open(downloadLink, '_blank');
    },

    init() {
        document.querySelectorAll('a[href*="Sandipan_Paul.pdf"], .resume-download').forEach(link => {
            link.addEventListener('click', (e) => this.trackDownload(e));
        });
    }
};

document.addEventListener('DOMContentLoaded', () => ResumeTracker.init());
