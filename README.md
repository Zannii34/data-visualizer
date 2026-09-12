# Data Visualizer

Upload a CSV or JSON file. Get interactive charts. Runs entirely in the browser.

## Live Demo

_Deployed on GitHub Pages — URL coming soon_

## Features

- Upload CSV or JSON via drag & drop or file picker
- Preview first 20 rows in a table
- Pick X and Y axes from detected columns
- Switch between bar, line, pie, and scatter charts
- Summary stats (row count, column count, numeric columns)
- Runs entirely client-side — no backend, no data uploads

## Tech Stack

- Vanilla HTML/CSS/JS
- Chart.js for charts
- PapaParse for CSV parsing
- Deployed on GitHub Pages

## Usage

1. Open the site
2. Drop a CSV or JSON file
3. Pick axes and chart type
4. Explore your data

### Try the sample

A sample file is included at ``samples/business-financials.csv``.

## What I Learned

- Client-side file parsing (CSV, JSON)
- Dynamic chart rendering with Chart.js
- Handling typed data (numbers vs strings)
- Responsive design for tables and charts
- Deploying static sites with GitHub Pages

## What is Next

- Export chart as PNG
- Multi-series charts
- More chart types (doughnut, radar, heatmap)
- Save chart state to URL
- Dark mode

## License

MIT
