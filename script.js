const tooltip = document.getElementById('tooltip');
const colors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
var baseTemp = undefined;


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(res => res.json())
    .then(res => {
        const { baseTemperature, monthlyVariance } = res;

        var heading = d3.select("body");
        console.log(monthlyVariance);
        heading.append("h3")
          .attr('id', 'description')
          .html(monthlyVariance[0].year + " to " + monthlyVariance[monthlyVariance.length-1].year + " with base temperature of " + baseTemperature + "&#8451;");



        createGraph(monthlyVariance.map(d => ({
          ...d,
          temp: baseTemperature + d.variance
        })));
    })

    


function createGraph(data) {
  console.log(data, data.length);
    var width = $(window).width() - 280,
        height = $(window).height() - 330,
        xPadding = 60,
        yPadding = 70,
        xyrPadding = 70,
        barWidth = (width) / (data.length / 12);
        barHeight = (height) / 12;

    const tempScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.temp),
        d3.max(data, d => d.temp)])
      .range([0,10]);

    var xScale = d3.scaleLinear()
        .domain([
          d3.min(data, d => d.year),
          d3.max(data, d => d.year)])
        .range([xPadding, width + xPadding]) 


    var yScale = d3.scaleLinear()
        .domain([1,12])
        .range([yPadding, height + yPadding]);
    
    var svg = d3.select('body').append('svg')
        .attr('width', width + xPadding + xyrPadding)
        .attr('height', height + yPadding + xyrPadding);
    
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('data-month', d => d.month-1)
        .attr('data-year',d => d.year)
        .attr('data-temp', d => d.temp)
        .attr('fill', d => 
          colors[Math.floor(tempScale(d.temp))]
        )
        .attr('x', d => xScale(d.year))
        .attr('y', d => yScale(d.month))
        // .attr('x', (d, i) => i * barWidth + xPadding)
        // .attr('y', d => yScale(d[1]) - yPadding + xyrPadding)
        .attr('width', barWidth)
        .attr('height', barHeight)
        // .attr('width', barWidth)
        // .attr('height', d => height - yScale(d[1]) + yPadding + 'px')
        // .on('mousemove',  (d, item) => {
        //     let yearLine = "";
        //     switch(item[0].substring(5, 7)) {
        //         case '01':
        //             yearLine = item[0].substring(0, 4) + ' Q1';
        //             break;
        //         case '04':
        //             yearLine = item[0].substring(0, 4) + ' Q2';
        //             break;
        //         case '07':
        //             yearLine = item[0].substring(0, 4) + ' Q3';
        //             break;
        //         case '10':
        //             yearLine = item[0].substring(0, 4) + ' Q4';
        //             break;
        //         default:
        //           // code block
        //       };

        //     let gdpLine = "$ " + item[1].toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Billion' 

        //     tooltip.style.left = d.pageX + xyrPadding + 'px';
        //     tooltip.style.top = height + xyrPadding + 'px';
        //     tooltip.innerHTML = yearLine + "<br/>" + gdpLine;
        //     tooltip.setAttribute("data-date", item[0]);
        // })
        // .on('mouseover', () => tooltip.style.visibility = "visible")
        // .on('mouseout', () => tooltip.style.visibility = "hidden")



    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    var xAxisGroup = svg.append('g')
        .attr('transform', `translate(0, ${height+xyrPadding+barHeight})`)
        .attr('id', 'x-axis')
        .call(xAxis);






    var yAxis = d3.axisLeft(yScale).tickFormat((month) => {
      console.log(month)
      let date = new Date(0);
      date.setUTCMonth(month);
      return d3.timeFormat('%B')(date);
    })
    var yAxisGroup = svg.append('g')
        .attr('transform', `translate(${xPadding}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis);
  //   var yAxisGroup = svg.append('g')
  //   .classed("y-axis", true)
  //   .attr("id", "y-axis")
  //   .attr("transform", "translate(" + xPadding + "," + -(yPadding-xyrPadding) + ")")
  //   .call(yAxis)
  // .append("text")
  //   .text("Months")
  //   .style("text-anchor", "middle")
  //   .attr("transform", "translate(" + (-7*fontSize) + "," + (height/2) + ")" + "rotate(-90)");



        
    const legendWidth = 200;
    const legendHeight = 50;

    const legendRectWidth = legendWidth / colors.length;
    const legend = d3.select('body')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .selectAll('rect')
    .data(colors)
    .append('rect')
    .attr('x', (_, i)=> i * legendRectWidth)
    .attr('y', 0)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', c => c);
}
