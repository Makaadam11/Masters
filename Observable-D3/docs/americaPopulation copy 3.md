---
theme: dashboard
title: America Population 🦬
toc: false
---

# America Population Dashboard 🦬

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

  let americaData = longData.filter((d) => ["Latin America & Caribbean", "North America"].includes(d["Country Name"]));

  // Get the unique years in the data
  let years = [...new Set(americaData.map((d) => d.Year))];

  // For each year, calculate the total population of "Latin America & Caribbean" and "North America"
  years.forEach((year) => {
    let totalPopulation = americaData.filter((d) => d.Year === year).reduce((sum, d) => sum + d.Population, 0);

    // Add a new object to the americaData array for the total population
    americaData.push({
      "Country Name": "America Total",
      Year: year,
      Population: totalPopulation,
    });
  });

  return americaData;
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
let northAmericaData = data.filter((d) => d["Country Name"] === "North America");

// Sort the data by year
northAmericaData.sort((a, b) => a.Year - b.Year);

// Calculate the population difference for each consecutive year
let populationDifferencesNorth = northAmericaData.slice(1).map((d, i) => d.Population - northAmericaData[i].Population);

// Calculate the average population increase
let averageNorthAmerica = populationDifferencesNorth.reduce((sum, d) => sum + d, 0) / populationDifferencesNorth.length;

// Round the average to 2 decimal places
averageNorthAmerica = Math.round(averageNorthAmerica * 100) / 100;

// Filter the data for "Latin America & Caribbean"
let latinAmericaData = data.filter((d) => d["Country Name"] === "Latin America & Caribbean");

// Sort the data by year
latinAmericaData.sort((a, b) => a.Year - b.Year);

// Calculate the population difference for each consecutive year
let populationDifferencesLatin = latinAmericaData.slice(1).map((d, i) => d.Population - latinAmericaData[i].Population);

// Calculate the average population increase
let averageLatinAmerica = populationDifferencesLatin.reduce((sum, d) => sum + d, 0) / populationDifferencesLatin.length;

// Round the average to 2 decimal places
averageLatinAmerica = Math.round(averageLatinAmerica * 100) / 100;

let americaTotal = averageLatinAmerica + averageNorthAmerica;
```

<div class="grid grid-cols-3">
  <div class="card">
    <h2>America Total 🔵</h2>
    <span class="big">${americaTotal}</span>
  </div>
  <div class="card">
    <h2>North America 🟠</h2>
    <span class="big">${averageNorthAmerica}</span>
  </div>
  <div class="card">
    <h2>Latin America & Caribbean 🔴</h2>
    <span class="big">${averageLatinAmerica}</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => createChart(data, width))}
  </div>
</div>

### Data: World Population Dataset

### Link:https://www.kaggle.com/datasets/iamsouravbanerjee/world-population-dataset
