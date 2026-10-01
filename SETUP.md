# Marky Momos — franchise enquiry setup

The website is ready for a real lead-capture flow. The only piece that cannot be deployed from a static ZIP by itself is the Google account connection that stores the leads and sends the owner email.

## What the finished flow does

Customer fills the franchise enquiry → lead is added to a Google Sheet → `info@markymomos.in` receives an email notification → customer sees a clean success tick popup.

The website does **not** ask visitors to create an account or enter a password. That is intentional: an enquiry is faster and lower-friction this way.

## One-time setup (free)

1. Create a Google Sheet, e.g. `Marky Momos Franchise Leads`.
2. Open **Extensions → Apps Script**.
3. Paste the code from `apps-script.gs` into `Code.gs`.
4. Replace `PASTE_GOOGLE_SHEET_ID_HERE` with the ID from the Google Sheet URL.
5. Save.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as: Me** and **Who has access: Anyone**.
8. Deploy and copy the generated `/exec` URL.
9. Open `script.js` and replace `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
10. Upload the website again.

The public contact email used by the backend is `info@markymomos.in`, which is listed for Marky Momos in current public listings. Verify that address with the brand before launch.

## Why Google Sheets + Apps Script

It keeps the front-end simple, avoids a paid form platform, gives the owner a searchable lead list, and supports an automatic email alert without exposing an email server password in the website code.

## Before launch

Verify the destination email, investment wording, available cities, and all outlet details with the brand. Public franchise directories currently show differing investment figures, so this website avoids claiming a guaranteed return or fixed franchise economics.
