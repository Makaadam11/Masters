---
theme: dashboard
title: Asia Population 🍚
toc: false
---

# Asia Population Dashboard 🍚

##

### Average increase in population each year

```js
async function loadData() {
  let data = await FileAttachment("data/countries.csv").csv({ typed: true });

  let longData = data.flatMap((d) =>
    Object.keys(d)
      .filter((key) => key !== "Country Name")
      .map((year) => ({
        "Country Name": d["Country Name"],
        Year: year,
        Population: d[year],
      }))
  );

  let asiaData = longData.filter((d) => ["East Asia & Pacific", "South Asia"].includes(d["Country Name"]));

  // Get the unique years in the data
  let years = [...new Set(asiaData.map((d) => d.Year))];

  // For each year, calculate the total population of "Latin America & Caribbean" and "North America"
  years.forEach((year) => {
    let totalPopulation = asiaData.filter((d) => d.Year === year).reduce((sum, d) => sum + d.Population, 0);

    // Add a new object to the asiaData array for the total population
    asiaData.push({
      "Country Name": "Asia Total",
      Year: year,
      Population: totalPopulation,
    });
  });

  return asiaData;
}

let data = await loadData();

function createChart(data, width) {
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

// Filter the data for "North America"
let southAsiaData = data.filter((d) => d["Country Name"] === "South Asia");

// Sort the data by year
southAsiaData.sort((a, b) => a.Year - b.Year);

// Calculate the population difference for each consecutive year
let populationDifferencesNorth = southAsiaData.slice(1).map((d, i) => d.Population - southAsiaData[i].Population);

// Calculate the average population increase
let averageSouthAsia = populationDifferencesNorth.reduce((sum, d) => sum + d, 0) / populationDifferencesNorth.length;

// Round the average to 2 decimal places
averageSouthAsia = Math.round(averageSouthAsia * 100) / 100;

// Filter the data for "Latin America & Caribbean"
let eastAsiaData = data.filter((d) => d["Country Name"] === "East Asia & Pacific");

// Sort the data by year
eastAsiaData.sort((a, b) => a.Year - b.Year);

// Calculate the population difference for each consecutive year
let populationDifferencesLatin = eastAsiaData.slice(1).map((d, i) => d.Population - eastAsiaData[i].Population);

// Calculate the average population increase
let averageEastAsia = populationDifferencesLatin.reduce((sum, d) => sum + d, 0) / populationDifferencesLatin.length;

// Round the average to 2 decimal places
averageEastAsia = Math.round(averageEastAsia * 100) / 100;

let asiaTotal = averageEastAsia + averageSouthAsia;
```

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Asia Total 🔵</h2>
    <span class="big">${asiaTotal}</span>
  </div>
  <div class="card">
    <h2>South Asia 🟠</h2>
    <span class="big">${averageSouthAsia}</span>
  </div>
  <div class="card">
    <h2>East Asia & Pacific 🔴</h2>
    <span class="big">${averageEastAsia}</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => createChart(data, width))}
  </div>
</div>

### Data: World Population Dataset

### Link:https://www.kaggle.com/datasets/iamsouravbanerjee/world-population-dataset
