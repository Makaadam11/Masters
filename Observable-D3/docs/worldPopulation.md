---
theme: dashboard
title: World Population 🌍
toc: false
---

# World Population Dashboard 🌍

##

### Average increase in population each year

```js
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

  // Filter for specific countries
  let worldData = longData.filter((d) =>
    ["India", "China", "United States", "Brazil", "Mexico", "Japan", "Colombia", "Germany", "United Kingdom", "Poland"].includes(d["Country Name"])
  );

  return worldData;
}

function createLineChart(data, width) {
  let plotData = [];
  console.log(data);
  data.forEach((item) => {
    plotData.push({
      country: item["Country Name"],
      year: item["Year"],
      population: item["Population"],
    });
  });

  return Plot.plot({
    marginTop: 20,
    marginLeft: 60,
    width: width,
    height: 400,
    color: {
      legend: true, // Enable the color legend
    },
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

function createChart(data, width) {
  let plotData = data.map((item) => ({
    country: item["Country Name"],
    year: item["Year"],
    population: item["Population"],
  }));

  let chartTitle = plotData[0] ? plotData[0].country : "Population Data";

  console.log(plotData);
  return Plot.plot({
    width: width,
    height: 1000,
    y: {
      label: "Change in population between 1960 and 2022 (millions)",
      transform: (d) => d / 1000000, // Convert population to millions for better readability
      grid: true,
    },
    color: {
      legend: true, // Optionally add a legend if using 'year' or another field as 'fill'
    },
    marks: [
      Plot.barY(plotData, {
        x: "country",
        y: "population",
        fill: "year", // Optionally use 'year' as 'fill' to differentiate bars by year
      }),
    ],
    x: {
      label: "Country",
      domain: plotData.map((d) => d.country), // Set the domain to include all countries
      padding: 0.2,
    },
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
let averageIndia = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "India"));
let averageChina = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "China"));
let averageUS = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "United States"));
let averageBrazil = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Brazil"));
let averageMexico = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Mexico"));
let averageColombia = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Colombia"));
let averageJapan = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Japan"));
let averageGermany = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Germany"));
let averageUK = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "United Kingdom"));
let averagePoland = calculateAverageIncrease(data.filter((d) => d["Country Name"] === "Poland"));

let IndiaData = data.filter((d) => d["Country Name"] === "India");
let ChinaData = data.filter((d) => d["Country Name"] === "China");
let USData = data.filter((d) => d["Country Name"] === "United States");
let BrasilData = data.filter((d) => d["Country Name"] === "Brazil");
let MexicoData = data.filter((d) => d["Country Name"] === "Mexico");
let ColombiaData = data.filter((d) => d["Country Name"] === "Colombia");
let JapanData = data.filter((d) => d["Country Name"] === "Japan");
let DEData = data.filter((d) => d["Country Name"] === "Germany");
let UKData = data.filter((d) => d["Country Name"] === "United Kingdom");
let PLData = data.filter((d) => d["Country Name"] === "Poland");
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>India 🇮🇳</h2>
    <span class="big">${averageIndia}</span>
  </div>
  <div class="card">
    <h2>China 🇨🇳</h2>
    <span class="big">${averageChina}</span>
  </div>
  <div class="card">
    <h2>United States 🇺🇸</h2>
    <span class="big">${averageUS}</span>
  </div>
  <div class="card">
    <h2>Brazil 🇧🇷</h2>
    <span class="big">${averageBrazil}</span>
  </div>
  <div class="card">
    <h2>Mexico 🇲🇽</h2>
    <span class="big">${averageMexico}</span>
  </div>
  <div class="card">
    <h2>Colombia 🇨🇴</h2>
    <span class="big">${averageColombia}</span>
  </div>
  <div class="card">
    <h2>Japan 🇯🇵</h2>
    <span class="big">${averageJapan}</span>
  </div>
  <div class="card">
    <h2>Germany 🇩🇪</h2>
    <span class="big">${averageGermany}</span>
  </div>
  <div class="card">
    <h2>United Kingdom 🇬🇧</h2>
    <span class="big">${averageUK}</span>
  </div>
  <div class="card">
    <h2>Poland 🇵🇱</h2>
    <span class="big">${averagePoland}</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => createChart(data, width))}
  </div>
</div>
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => createLineChart(data, width))}
  </div>
</div>
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => createLineChart(IndiaData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(ChinaData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(USData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(BrasilData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(MexicoData, width))}
  </div>
    <div class="card">
    ${resize((width) => createLineChart(ColombiaData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(JapanData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(DEData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(UKData, width))}
  </div>
  <div class="card">
    ${resize((width) => createLineChart(PLData, width))}
  </div>
</div>

### Data: World Population Dataset

### Link:https://www.kaggle.com/datasets/iamsouravbanerjee/world-population-dataset
