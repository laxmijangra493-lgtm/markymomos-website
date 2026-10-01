/**
 * Marky Momos franchise lead collector
 *
 * 1) Create a Google Sheet for franchise enquiries.
 * 2) Extensions -> Apps Script.
 * 3) Paste this file into Code.gs.
 * 4) Put the Sheet ID in SHEET_ID below.
 * 5) Deploy -> New deployment -> Web app -> Execute as Me -> Who has access: Anyone.
 * 6) Copy the web-app URL into FRANCHISE_ENDPOINT in script.js.
 */

const OWNER_EMAIL = 'info@markymomos.in';
const SHEET_ID = '1WJ5BxKGahwmqEjZXrWYdXLpzYr1jg-2E8Mde4ikwVzs';
const SHEET_NAME = 'Marky Momos Franchise Leads';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'marky-momos-franchise-leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    // Honeypot spam trap. Normal visitors never see this field.
    if (String(data.website || '').trim()) {
      return json_({ ok: true });
    }

    const name = clean_(data.name);
    const city = clean_(data.city);
    const phone = clean_(data.phone);
    const investment = clean_(data.investment);
    const start = clean_(data.start);
    const note = clean_(data.note);
    const source = clean_(data.source) || 'website';

    if (!name || !city || !phone || !investment || !start) {
      return json_({ ok: false, error: 'Missing required fields' });
    }

    const now = new Date();
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
      || SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'City', 'Contact', 'Investment', 'Start timeline', 'Note', 'Source']);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([now, name, city, phone, investment, start, note, source]);

    const subject = `New Marky Momos franchise enquiry — ${name}`;
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#201d1b">
        <h2 style="margin:0 0 12px">New franchise enquiry</h2>
        <p style="margin:0 0 18px;color:#6e665f">A new lead was submitted from the Marky Momos website.</p>
        <table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;max-width:620px">
          <tr><td style="font-weight:700;border-bottom:1px solid #eee">Name</td><td style="border-bottom:1px solid #eee">${esc_(name)}</td></tr>
          <tr><td style="font-weight:700;border-bottom:1px solid #eee">City</td><td style="border-bottom:1px solid #eee">${esc_(city)}</td></tr>
          <tr><td style="font-weight:700;border-bottom:1px solid #eee">Contact</td><td style="border-bottom:1px solid #eee">${esc_(phone)}</td></tr>
          <tr><td style="font-weight:700;border-bottom:1px solid #eee">Investment</td><td style="border-bottom:1px solid #eee">${esc_(investment)}</td></tr>
          <tr><td style="font-weight:700;border-bottom:1px solid #eee">Start</td><td style="border-bottom:1px solid #eee">${esc_(start)}</td></tr>
          <tr><td style="font-weight:700;vertical-align:top">Note</td><td>${esc_(note || '—')}</td></tr>
        </table>
        <p style="margin-top:22px;font-size:12px;color:#6e665f">Source: ${esc_(source)} · ${Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd MMM yyyy, hh:mm a')}</p>
      </div>`;

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject,
      htmlBody: html,
      body: [
        'New Marky Momos franchise enquiry',
        `Name: ${name}`,
        `City: ${city}`,
        `Contact: ${phone}`,
        `Investment: ${investment}`,
        `Start: ${start}`,
        `Note: ${note || '—'}`,
        `Source: ${source}`
      ].join('\n')
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function clean_(value) {
  return String(value == null ? '' : value).replace(/[<>]/g, '').trim().slice(0, 500);
}

function esc_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
