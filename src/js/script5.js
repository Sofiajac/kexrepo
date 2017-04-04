var svg = d3.select("svg");
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var monthsArray = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* Variable that holds the data used to visualize the chart */
var data = d3.nest()
    .key(function(d) { return +d.year;})
    .rollup(function(d) { 
        return d3.mean(d, function(g) {return g.adj; });
    }).entries(json_data);
    //console.log(data);

/* Create the chart area and move it to the correct position in the svg graph */
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* Update x and y scaling */
var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

/* Define the x and y domains */
x.domain([1756, 2015]);
y.domain([0, d3.max(data, function(d) { return d.value; })]);

/* Create the axes */
var xAxis = d3.axisBottom(x)
                .tickSize(5)
                .tickFormat(function(d){if (d % 10 == 0) {return d;}})
                .tickPadding(3)
                .ticks(26);
var yAxis = d3.axisLeft(y)
                .tickSize(5)
                .tickPadding(3)
                .ticks(20);

/* Tooltip box */
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/* Append the axes */
g.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
g.append("g")
    .classed("y axis", true)
    .attr("transform", "translate(-1,0)")
    .call(yAxis)

/* Append the bars */
g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", 3)
    .attr("height", function(d) { return height - y(d.value); })
    .on("click", function(d){
        console.log(d.key);
        sortByChosenYear(d.key);
    })
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Year: " + d.key + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
       });

/* Updates the chart to show the mean temperature each year */
function sortByYear() {
    var dataYear = d3.nest()
    .key(function(d) { return +d.year;})
    .rollup(function(d) { 
        return d3.mean(d, function(g) {return g.adj; });
    }).entries(json_data);

    g.selectAll(".bar").data(dataYear);
    x.domain([1756, 2015]);
    y.domain([0, d3.max(dataYear, function(d) { return d.value; })]);
    xAxis = d3.axisBottom(x)
                .tickSize(5)
                .tickFormat(function(d){if (d % 10 == 0) {return d;}})
                .tickPadding(3)
                .ticks(26);
    yAxis = d3.axisLeft(y)
                .tickSize(5)
                .tickPadding(3)
                .ticks(20);
        
    var svg2 = d3.select("svg").transition();
    svg2.selectAll(".bar")   // change the bars
        .duration(750)
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", 3)
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", "steelblue");
    svg2.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg2.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
}

/* Updates the chart to show the mean temperature over a specified month each year */
function sortByMonth(month) {
    var newData = json_data.filter(function (entry){
                return entry.month == month;
            });

    var datamonth = d3.nest()
        .key(function(d) { return +d.year;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(newData);

    g.selectAll(".bar").data(datamonth)
    
    // Scale the range of the data again
    x.domain([1756, 2015]);
    y.domain([Math.min(d3.min(datamonth, function(d) { return d.value; }), 0), d3.max(datamonth, function(d) { return d.value; })]);
    /* Update the axes */
    xAxis = d3.axisBottom(x)
                    .tickSize(5)
                    .tickFormat(function(d){if (d % 10 == 0) {return d;}})
                    .tickPadding(3)
                    .ticks(26);
    yAxis = d3.axisLeft(y)
                    .tickSize(5)
                    .tickPadding(3)
                    .ticks(20);

    // Make the changes
    var svg2 = d3.select("svg").transition();
    svg2.selectAll(".bar")   // change the bars
        .duration(750)
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { 
            if (d.value < 0) {
                return y(0);
            } else {
                return y(d.value);
            }
        })
        .attr("width", 3)
        .attr("height", function(d) { 
            if (d.value < 0) {
                return y(d.value) - y(0);
            } else {
                return Math.abs(y(d.value) - y(0));
            } 
        })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        });
    svg2.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg2.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
    }

function sortByChosenYear(year) {
    var newData = json_data.filter(function (entry){
                return entry.year == year;
            });

    console.log(newData);

    var groupedData = d3.nest()
        .key(function(d) { return +d.month;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(newData);

        console.log(groupedData);

    g.selectAll(".bar").data(groupedData)
    .on("click", null);;
    
    // Scale the range of the data again
    //x = d3.scaleTime();

    //x.domain([new Date(2017,0,1), new Date(2017, 11, 31)]);
    x.domain([0.5, 12.9])
    console.log(x.domain());
    y.domain([Math.min(d3.min(groupedData, function(d) { return d.value; }), 0), d3.max(groupedData, function(d) { return d.value; })]);
    /* Update the axes */
    xAxis = d3.axisBottom(x)
                    .tickSize(5)
                    .ticks(12)
                    .tickFormat(function(d){ {return monthsArray[d-1];}})
                    //.tickFormat(function(d){if (d % 10 == 0) {return d;}})
                    .tickPadding(3)
                    //.ticks(26);
                    //.ticks(d3.time.months)
                    //.tickFormat(d3.timeFormat("%B"));
    yAxis = d3.axisLeft(y)
                    .tickSize(5)
                    .tickPadding(3)
                    .ticks(20);

    // Make the changes
    var svg2 = d3.select("svg").transition();
    svg2.selectAll(".bar")   // change the bars
        .duration(750)
        .attr("x", function(d) { return x(d.key)-width/26; })
        .attr("y", function(d) { 
            if (d.value < 0) {
                return y(0);
            } else {
                return y(d.value);
            }
        })
        .attr("width", width/13)
        .attr("height", function(d) { 
            if (d.value < 0) {
                return y(d.value) - y(0);
            } else {
                return Math.abs(y(d.value) - y(0));
            } 
        })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        });
    svg2.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg2.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
    }

// Update data section on click of button in HTML
function updateData() {
    var chosenMonth = document.getElementById('monthSelection').selectedIndex;
    if (chosenMonth == 0) {
        sortByYear();
    } else {
        sortByMonth(chosenMonth);
    }
}