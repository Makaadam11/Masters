---
theme: dashboard
title: Europe Population 🏰
toc: false
---

# Europe Population Dashboard 🏰

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

  let asiaData = longData.filter((d) => ["Central Europe and the Baltics", "European Union"].includes(d["Country Name"]));

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
let europeanUnion = data.filter((d) => d["Country Name"] === "European Union");

// Sort the data by year
europeanUnion.sort((a, b) => a.Year - b.Year);

// Calculate the population difference for each consecutive year
let populationDifferencesNorth = europeanUnion.slice(1).map((d, i) => d.Population - europeanUnion[i].Population);

// Calculate the average population increase
let averageEU = populationDifferencesNorth.reduce((sum, d) => sum + d, 0) / populationDifferencesNorth.length;

// Round the average to 2 decimal places
averageEU = Math.round(averageEU * 100) / 100;

// Filter the data for "Latin America & Caribbean"
let europeTotal = data.filter((d) => d["Country Name"] === "Central Europe and the Baltics");

// Sort the data by year
europeTotal.sort((a, b) => a.Year - b.Year);

// Calculate the population difference for each consecutive year
let populationDifferencesLatin = europeTotal.slice(1).map((d, i) => d.Population - europeTotal[i].Population);

// Calculate the average population increase
let averageEuropeTotal = populationDifferencesLatin.reduce((sum, d) => sum + d, 0) / populationDifferencesLatin.length;

// Round the average to 2 decimal places
averageEuropeTotal = Math.round(averageEuropeTotal * 100) / 100;
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Europe Total 🟠</h2>
    <span class="big">${averageEuropeTotal}</span>
  </div>
  <div class="card">
    <h2>European Union 🔵</h2>
        <span class="big">${averageEU}</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => createChart(data, width))}
  </div>
</div>

### Data: World Population Dataset

### Link:https://www.kaggle.com/datasets/iamsouravbanerjee/world-population-dataset
