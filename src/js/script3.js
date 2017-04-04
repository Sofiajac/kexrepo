var data = d3.nest()
    .key(function(d) { return +d.year;})
    .rollup(function(d) { 
        return d3.mean(d, function(g) {return g.adj; });
    }).entries(json_data);
    console.log(data);


var data2 = d3.nest()
    .key(function(d) { return +d.year;})
    .key(function(d) { return +d.month;})
    .rollup(function(d) { 
        return d3.mean(d, function(g) {return g.adj; });
    }).entries(json_data);
    console.log(data2[0]);


var svg = d3.select("#svg1");
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = +svg.attr("width"); - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

var x2 = d3.scaleLinear().rangeRound([0, width]);
var y2 = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([1756, 2015]);
//data.map(function(d) { return +d.key; }));
y.domain([0, d3.max(data, function(d) { return d.value; })]);

x2.domain([1, 12]);
//data.map(function(d) { return +d.key; }));
y2.domain([0, 15]);


var xAxis = d3.axisBottom(x)
                .tickSize(5)
                .tickFormat(function(d){if (d % 10 == 0) {return d;}})
                .tickPadding(3)
                .ticks(26);

var yAxis = d3.axisLeft(y)
                .tickSize(5)
                .tickPadding(3)
                .ticks(20);

var xAxis2 = d3.axisBottom(x2)
                .tickSize(5)
                //.tickFormat(function(d){if (d % 10 == 0) {return d;}})
                .tickPadding(3)
                .ticks(26);

var yAxis2 = d3.axisLeft(y2)
                .tickSize(5)
                .tickPadding(3)
                .ticks(20);


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

g.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

g.append("g")
    .classed("y axis", true)
    .attr("transform", "translate(-1,0)")
    .call(yAxis)

g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", 3)
    .attr("height", function(d) { return height - y(d.value); })
    .on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("Year: " + d.key + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
       })
    .on("click", function(d) {
        console.log(d);
    });


var svg2 = d3.select("#svg2");
var g2 = svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
g2.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2);

g2.append("g")
    .classed("y axis", true)
    .attr("transform", "translate(-1,0)")
    .call(yAxis2)

console.log(data2);
var months = [{"month":1, "temp": 3}, {"month":2, "temp": 5}, {"month":3, "temp": 7}];
g2.selectAll(".bar")
    .data(months)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x2(d.month); })
    .attr("y", function(d) { return y2(d.temp); })
    .attr("width", 3)
    .attr("height", function(d) { return height - y2(d.temp); })
    .on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("Year: " + d.key + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
       })
    .on("click", function(d) {
        console.log(d);
    });