---
theme: dashboard
title: Africa Population 🦁
toc: false
---

# Africa Population Dashboard 🦁

##

### Average increase in population each year

```js
// Corrected and optimized code

// Load data asynchronously
async function loadData() {
  // Assuming FileAttachment is defined elsewhere to fetch and parse CSV files
  let data = await FileAttachment("data/countries.csv").csv({ typed: true });

  // Transform data to a long format
  let longData = data.flatMap((d) =>
    Object.keys(d)
      .filter((key) => key !== "Country Name")
      .map((year) => ({
        "Country Name": d["Country Name"],
        Year: parseInt(year), // Ensure year is an integer
        Population: d[year],
      }))
  );

  // Filter for specific African regions
  let africaData = longData.filter((d) =>
    ["Africa Eastern and Southern", "Africa Western and Central", "Middle East & North Africa", "Sub-Saharan Africa"].includes(d["Country Name"])
  );

  return africaData;
}

// Function to create a chart (assuming Plot and d3 are defined elsewhere)
function createChart(data, width) {
  let plotData = data.map((item) => ({
    country: item["Country Name"],
    year: item["Year"],
    population: item["Population"],
  }));

  return Plot.plot({
    marginTop: 20,
    marginLeft: 60,
    width: width,
    height: 400,
    x: {
      label: "Year",
      type: "linear",
      tickFormat: d3.format("d"),
    },
    y: {
      label: "Population",
      grid: true,
    },
    marks: [
      Plot.line(plotData, { x: "year", y: "population", stroke: "country", title: "country" }),
      Plot.dot(plotData, { x: "year", y: "population", fill: "country", title: (d) => `Year: ${d.year}, Population: ${d.population}` }),
      Plot.ruleY([0]),
    ],
  });
}

// Function to calculate average population increase
function calculateAverageIncrease(data) {
  let sortedData = [...data].sort((a, b) => a.Year - b.Year);
  let populationDifferences = sortedData.slice(1).map((d, i) => d.Population - sortedData[i].Population);
  let averageIncrease = populationDifferences.reduce((sum, d) => sum + d, 0) / populationDifferences.length;
  return Math.round(averageIncrease * 100) / 100; // Round to 2 decimal places
}

// Example usage
let data = await loadData();

// Calculate average population increase for different regions
let averageEastAfrica = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Africa Eastern and Southern"));
let averageWestAfrica = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Africa Western and Central"));
let averageMiddleAfrica = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Middle East & North Africa"));
let averageSubAfrica = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Sub-Saharan Africa"));
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Sub-Saharan Africa 🟢</h2>
    <span class="big">${averageSubAfrica}</span>
  </div>
  <div class="card">
    <h2>Africa Western and Central 🔵</h2>
    <span class="big">${averageWestAfrica}</span>
  </div>
  <div class="card">
    <h2>Africa Eastern and Southern 🟠</h2>
    <span class="big">${averageEastAfrica}</span>
  </div>
  <div class="card">
    <h2>Middle East & North Africa 🔴</h2>
    <span class="big">${averageMiddleAfrica}</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => createChart(data, width))}
  </div>
</div>

### Data: World Population Dataset

### Link:https://www.kaggle.com/datasets/iamsouravbanerjee/world-population-dataset
