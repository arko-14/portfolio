/**
 * Site Link Tracker - Google Sheets Integration
 * Tracks clicks on social links, GitHub, and Resume downloads.
 * Optimized for spreadsheet column headers: Timestamp, IP, City, Country, Organization, Referrer, Language, Screen Size, Timezone, User Agent, Link Type, Target URL.
 */

const SiteTracker = {
    // Google Apps Script URL
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwSegnHDQMqRUuVXy1A3aqlChyUxwUaA_1uBUjLPr6YavmlV1GzDFv8-qzS9ydwYZf3Nw/exec',

    trackLink(event) {
        const link = event.currentTarget;
        const linkType = link.getAttribute('data-track') || link.innerText || 'Unknown';
        const href = link.href;

        // Track in the background (fire and forget)
        this._sendTracking(linkType, href).catch(() => { });
    },

    async _sendTracking(linkType, url) {
        const data = {
            "Timestamp": new Date().toLocaleString(),
            "IP": 'Unknown',
            "City": '',
            "Country": '',
            "Organization": '',
            "Referrer": document.referrer || 'Direct',
            "Language": navigator.language,
            "Screen Size": `${window.screen.width}x${window.screen.height}`,
            "Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "User Agent": navigator.userAgent,
            "Link Type": linkType,
            "Target URL": url
        };

        // Get IP and location
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            data["IP"] = ipData.ip;

            const locRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
            const locData = await locRes.json();
            data["City"] = locData.city || '';
            data["Country"] = locData.country_name || '';
            data["Organization"] = locData.org || '';
        } catch (e) { /* silent */ }

        // Send to Google Sheets
        try {
            await fetch(this.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(data)
            });
            console.log(`[SiteTracker] Logged: ${linkType}`, data);
        } catch (err) {
            console.error('[SiteTracker] Failed:', err);
        }
    },

    init() {
        // Track all links with data-track attribute
        document.querySelectorAll('a[data-track]').forEach(link => {
            link.addEventListener('click', (e) => this.trackLink(e));
        });

        // Legacy support for resume download if data-track is missing
        document.querySelectorAll('.resume-download').forEach(link => {
            if (!link.hasAttribute('data-track')) {
                link.setAttribute('data-track', 'Resume');
                link.addEventListener('click', (e) => this.trackLink(e));
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => SiteTracker.init());
