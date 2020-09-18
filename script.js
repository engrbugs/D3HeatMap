const tooltip = document.getElementById("tooltip");
const colors = [
  "#a50026",
  "#d73027",
  "#f46d43",
  "#fdae61",
  "#fee090",
  "#ffffbf",
  "#e0f3f8",
  "#abd9e9",
  "#74add1",
  "#4575b4",
  "#313695",
];
var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
var baseTemp = undefined;

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((res) => res.json())
  .then((res) => {
    const { baseTemperature, monthlyVariance } = res;

    var heading = d3.select("body");
    console.log(monthlyVariance);
    heading
      .append("h3")
      .attr("id", "description")
      .html(
        monthlyVariance[0].year +
          " to " +
          monthlyVariance[monthlyVariance.length - 1].year +
          " with base temperature of " +
          baseTemperature +
          "&#8451;"
      );

    createGraph(
      monthlyVariance.map((d) => ({
        ...d,
        temp: baseTemperature + d.variance,
      }))
    );
  });

function createGraph(data) {
  console.log(data, data.length);
  var width = $(window).width() - 280,
    height = $(window).height() - 260,
    xPadding = 60,
    yPadding = 20,
    xyrPadding = 70,
    barWidth = width / (data.length / 12);
  barHeight = height / 12;

  const tempScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.temp), d3.max(data, (d) => d.temp)])
    .range([0, 10]);

  var xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.year), d3.max(data, (d) => d.year)])
    .range([xPadding, width + xPadding]);

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + xPadding + xyrPadding)
    .attr("height", height + yPadding + xyrPadding);

  var yScale = d3
    .scaleLinear()
    .domain([1, 12])
    .range([yPadding, height + yPadding]);

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.temp)
    .attr("fill", (d) => colors[Math.round(tempScale(d.temp))])
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", barWidth + 1)
    .attr("height", barHeight)
  .on('mousemove',  (d, item) => {
    tooltip.style.left = d.pageX - (xyrPadding / 2) + "px";
    tooltip.style.top = d.pageY - xyrPadding + "px";
    tooltip.innerHTML = `${months[item.month-1]} ${item.year}</br>${Math.round((item.temp + Number.EPSILON) * 100) / 100}°C`;

    tooltip.setAttribute("data-year", item.year);
  })
  .on('mouseover', () => tooltip.style.visibility = "visible")
  .on('mouseout', () => tooltip.style.visibility = "hidden")

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  var xAxisGroup = svg
    .append("g")
    .attr("transform", `translate(0, ${height+barHeight+yPadding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale).tickFormat((month) => {
    // console.log(month)
    let date = new Date(0);
    date.setUTCMonth(month);
    return d3.timeFormat("%B")(date);
  });
  var yAxisGroup = svg
    .append("g")
    .attr("transform", `translate(${xPadding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  var lxScale = d3
    .scaleLinear()
    .domain([0,11])
    .range([xPadding, width + xPadding]);

  const legendWidth = width;
  const legendHeight = 25;

  const legendRectWidth = legendWidth / colors.length;
  const legend = d3
    .select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (_, i) => i * legendRectWidth)
    .attr("y", 0)
    .attr("width", legendRectWidth)
    .attr("height", 25)
    .attr("fill", (c) => c);

  var lxAxis = d3.axisBottom(lxScale).tickFormat(d3.format("d"));

  var lxAxisGroup = legend
    .append("g")
    .attr("transform", `translate(100, 100)`)
    .attr("id", "axis")
    .call(lxAxis);
}
