/* ============================================
   Data Visualizer — Enhanced Interactivity
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const uploadZone = document.getElementById("uploadZone");
  const fileInput = document.getElementById("fileInput");
  const chartTypeSelect = document.getElementById("chartTypeSelect");
  const xAxisSelect = document.getElementById("xAxisSelect");
  const yAxisSelect = document.getElementById("yAxisSelect");

  /* ---------- DRAG VISUAL FEEDBACK ---------- */
  if (uploadZone) {
    ["dragenter", "dragover"].forEach(evt => {
      uploadZone.addEventListener(evt, e => {
        e.preventDefault();
        uploadZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(evt => {
      uploadZone.addEventListener(evt, e => {
        e.preventDefault();
        uploadZone.classList.remove("dragover");
      });
    });
  }

  /* ---------- SAVE CHART PREFERENCES ---------- */
  function saveChartPreference() {
    try {
      localStorage.setItem("dv-chart-type", chartTypeSelect?.value || "bar");
      localStorage.setItem("dv-x-axis", xAxisSelect?.value || "");
      localStorage.setItem("dv-y-axis", yAxisSelect?.value || "");
    } catch (e) {}
  }

  function restoreChartPreference() {
    try {
      const savedType = localStorage.getItem("dv-chart-type");
      if (savedType && chartTypeSelect) chartTypeSelect.value = savedType;
    } catch (e) {}
  }

  restoreChartPreference();

  [chartTypeSelect, xAxisSelect, yAxisSelect].forEach(el => {
    if (el) el.addEventListener("change", saveChartPreference);
  });

  /* ---------- DOWNLOAD CHART AS PNG ---------- */
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "⬇ Download PNG";
  downloadBtn.className = "btn-secondary";
  downloadBtn.style.cssText = "margin-top: 1rem;";
  const chartWrapper = document.querySelector(".chart-wrapper");
  if (chartWrapper) {
    chartWrapper.appendChild(downloadBtn);
    downloadBtn.addEventListener("click", () => {
      const canvas = document.querySelector("#mainChart");
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "chart-" + new Date().toISOString().slice(0, 10) + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  /* ---------- KEYBOARD SHORTCUT: R for random ---------- */
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "o") {
      e.preventDefault();
      fileInput?.click();
    }
  });
});