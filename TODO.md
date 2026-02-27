# Power BI Health Assessment App — To Do

## UX & Design
- [ ] Add a progress percentage or step count on the welcome screen (e.g. "50 questions across 10 categories")
- [ ] Add a "Back to website" link/button in the header linking to bachovak.github.io/website
- [ ] Improve mobile layout of results visuals (pillar rings and category bars)
- [ ] Add animated transitions between category sections
- [ ] Add a confirmation dialog before "Start New Assessment" to prevent accidental resets

## Results Screen
- [ ] Link "I want a follow up" button to Calendly (bachovak.github.io/pbi-health-assessment currently sends to Google Sheets only)
- [ ] Add option to download results as PDF (currently only CSV)
- [ ] Add written recommendations per pillar based on score ranges
- [ ] Show a comparison benchmark (e.g. "You scored higher than average in BI Ops")
- [ ] Add the ability to email results to the respondent automatically

## Data & Integration
- [ ] Verify Google Sheets integration is working and receiving submissions
- [ ] Add error handling if Google Sheets submission silently fails
- [ ] Consider adding a confirmation email to the respondent after submission
- [ ] Add analytics tracking (e.g. how many people start vs. complete the assessment)

## Content & Questions
- [ ] Review question wording for clarity — some may be too technical for non-BI audiences
- [ ] Consider adding an "I don't know" option for questions where the respondent may not have visibility
- [ ] Add tooltips or help text for specialist terms (e.g. RLS, gateway, incremental refresh)

## Technical
- [ ] Split the single index.html into separate CSS/JS files for maintainability
- [ ] Add meta tags (Open Graph) for better link previews when shared on LinkedIn/social
- [ ] Add a print-friendly stylesheet for the results page
- [ ] Test across browsers (Safari, Firefox, Edge) and devices
- [x] Consider adding GDPR/privacy notice since personal data is collected — **Done 2026-02-27**: self-hosted fonts, GDPR consent checkbox on welcome form, privacy notice linking to https://kristinabachova.com/#privacy-policy.
