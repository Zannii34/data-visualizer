// Data Visualizer — CSV/JSON to charts
let currentData = [];
let currentColumns = [];
let chart = null;

const uploadZone = document.getElementById("uploadZone");
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const clearBtn = document.getElementById("clearBtn");
const previewSection = document.getElementById("previewSection");
const chartsSection = document.getElementById("chartsSection");
const statsSection = document.getElementById("statsSection");
const previewTable = document.getElementById("previewTable");
const xAxisSelect = document.getElementById("xAxisSelect");
const yAxisSelect = document.getElementById("yAxisSelect");
const chartTypeSelect = document.getElementById("chartTypeSelect");

uploadZone.addEventListener("click", () => fileInput.click());
browseBtn.addEventListener("click", (e) => { e.stopPropagation(); fileInput.click(); });
fileInput.addEventListener("change", (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });

uploadZone.addEventListener("dragover", (e) => { e.preventDefault(); uploadZone.classList.add("dragover"); });
uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragover"));
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("dragover");
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

clearBtn.addEventListener("click", () => {
  currentData = [];
  currentColumns = [];
  if (chart) { chart.destroy(); chart = null; }
  previewSection.classList.add("hidden");
  chartsSection.classList.add("hidden");
  statsSection.classList.add("hidden");
  fileInput.value = "";
});

function handleFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      let data;
      if (ext === "csv") {
        const result = Papa.parse(e.target.result, { header: true, skipEmptyLines: true, dynamicTyping: true });
        data = result.data;
      } else if (ext === "json") {
        data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) data = [data];
      } else {
        alert("Unsupported file type. Use .csv or .json");
        return;
      }
      if (!data.length) { alert("File is empty."); return; }
      currentData = data;
      currentColumns = Object.keys(data[0]);
      render();
    } catch (err) {
      alert("Could not parse file: " + err.message);
    }
  };
  reader.readAsText(file);
}

function render() {
  renderPreview();
  renderControls();
  renderChart();
  renderStats();
  previewSection.classList.remove("hidden");
  chartsSection.classList.remove("hidden");
  statsSection.classList.remove("hidden");
}

function renderPreview() {
  const rows = currentData.slice(0, 20);
  previewTable.innerHTML =
    "<thead><tr>" + currentColumns.map(c => "<th>" + escapeHtml(c) + "</th>").join("") + "</tr></thead>" +
    "<tbody>" + rows.map(row => "<tr>" + currentColumns.map(c => "<td>" + escapeHtml(String(row[c] ?? "")) + "</td>").join("") + "</tr>").join("") + "</tbody>";
}

function escapeHtml(s) {
  return s.replace(/[&<>"\\x27]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\\"": "&quot;", "\\x27": "&#39;" }[m]));
}

function renderControls() {
  const numericCols = currentColumns.filter(col =>
    currentData.some(row => !isNaN(parseFloat(row[col])) && row[col] !== "")
  );
  xAxisSelect.innerHTML = currentColumns.map(c => "<option value=\\"" + c + "\\">" + c + "</option>").join("");
  yAxisSelect.innerHTML = numericCols.map(c => "<option value=\\"" + c + "\\">" + c + "</option>").join("");
  xAxisSelect.onchange = renderChart;
  yAxisSelect.onchange = renderChart;
  chartTypeSelect.onchange = renderChart;
}

function renderChart() {
  const xCol = xAxisSelect.value;
  const yCol = yAxisSelect.value;
  const type = chartTypeSelect.value;
  if (!xCol) return;

  const labels = currentData.map(row => String(row[xCol] ?? ""));
  const values = yCol ? currentData.map(row => parseFloat(row[yCol]) || 0) : labels.map(() => 1);

  if (chart) chart.destroy();
  const ctx = document.getElementById("mainChart");
  chart = new Chart(ctx, {
    type: type === "pie" ? "pie" : (type === "scatter" ? "scatter" : type),
    data: {
      labels: type === "pie" || type === "bar" || type === "line" ? labels : undefined,
      datasets: [{
        label: yCol || "Count",
        data: type === "scatter" ? currentData.map((row, i) => ({ x: i, y: parseFloat(row[yCol]) || 0 })) : values,
        backgroundColor: ["#1677ff", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1"],
        borderColor: "#1677ff",
        borderWidth: type === "line" || type === "scatter" ? 2 : 1,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: type === "pie" } },
      scales: type === "pie" ? {} : { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxTicksLimit: 20 } } }
    }
  });
}

function renderStats() {
  const numericCols = currentColumns.filter(col =>
    currentData.some(row => !isNaN(parseFloat(row[col])) && row[col] !== "")
  );
  statsGrid.innerHTML =
    "<div class=\\"stat-card\\"><span>Rows</span><strong>" + currentData.length + "</strong></div>" +
    "<div class=\\"stat-card\\"><span>Columns</span><strong>" + currentColumns.length + "</strong></div>" +
    "<div class=\\"stat-card\\"><span>Numeric columns</span><strong>" + numericCols.length + "</strong></div>";
}
