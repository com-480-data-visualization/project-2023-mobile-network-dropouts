import * as d3 from 'd3';
import { FetchBasicEloGameStats } from '../api/stats_api';

// set the dimensions and margins of the graph
const margin = { top: 80, right: 50, bottom: 90, left: 40 },
    width = 950 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;

export const EloGamesDistributionViz = (querySelector: string) => {
    FetchBasicEloGameStats().then(data => {
        var svg = d3.select(querySelector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

        svg.append("text")
            .attr("transform", "translate(100,0)")
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", "24px")
            .text("Basic ELO Stats")

        var xScale = d3.scaleBand().range([0, width]).padding(0.4),
            yScale = d3.scaleLinear().range([height, 0]);

        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");
        
        xScale.domain(data.map((d) => `${d.elo_min}-${d.elo_max}`));
        yScale.domain([0, d3.max(data, (d) => d.nr_games)??0]);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-30) translate(-10,5)");

        g.append("text")
            .attr("y", height + 50)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Player ELOs");

        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function (d) {
                return d + "%";
            }).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Percentage of Games");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(`${d.elo_min}-${d.elo_max}`)??0)
            .attr("y", (d) => yScale(d.nr_games))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - yScale(d.nr_games))
            .attr("fill", "blue")
    }).catch(err => console.log(err));
}
