import * as d3 from 'd3';
import { AverageGameLengthStat, FetchAverageGameLengthStats } from '../api/stats_api';

/** Displays a histogram of the length of the game for a given ELO bucket */
export const NrMovesPerGamePerEloBucket = (selector: string, data: AverageGameLengthStat) => {
    var svg_dom_obj = document.querySelector(selector);
    console.log(svg_dom_obj)
    const margin = { top: 80, right: 80, bottom: 90, left: 40 },
        width = (svg_dom_obj?.clientWidth??10) - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    console.log("Detected size of ",  svg_dom_obj?.clientWidth, width)
    var svg = d3.select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Number of moves histogram")

    var xScale = d3.scaleBand().range([0, width]).padding(0.),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    
    xScale.domain(data.frq_games_by_nr_moves.map((d, idx) => `${idx} moves`));
    yScale.domain([0, d3.max(data.frq_games_by_nr_moves)??0]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("font-size", "8px")
        .attr("transform", "rotate(-30) translate(-10,5)");

    g.append("text")
        .attr("y", height + 50)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Player ELOs");

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d + " games";
        }).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-7.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Average Number of moves per game");

    g.selectAll(".bar")
        .data(Array.from({length: data.frq_games_by_nr_moves.length}).map((_, i) => i))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (idx) => xScale(`${idx} moves`)??0)
        .attr("y", (idx) => yScale(data.frq_games_by_nr_moves[idx]))
        .attr("width", xScale.bandwidth() + 0.5)
        .attr("height", (idx) => height - yScale(data.frq_games_by_nr_moves[idx]))
        .attr("fill", "rgb(205,162,120)")
}
