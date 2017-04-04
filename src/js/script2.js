var data = d3.nest()
.key(function(d) { return +d.year;})
.rollup(function(d) { 
    return d3.mean(d, function(g) {return g.adj; });
}).entries(json_data);
console.log(data);

var svg = d3.select("svg");
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = +svg.attr("width"); - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;



var axisScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([0, 400]);




var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([1756, 2015]);
//data.map(function(d) { return +d.key; }));
y.domain([0, d3.max(data, function(d) { return d.value; })]);

g.append("g")
    .attr("class", "axis axisx")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(26).tickFormat(function(d){if (d % 10 == 0) {return d;}}))

g.append("g")
    .attr("class", "axis axisy")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("adj");

g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", 3)
    .attr("height", function(d) { return height - y(d.value); });

