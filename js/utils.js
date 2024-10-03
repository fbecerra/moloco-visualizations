function getUniquesMenu(df, thisVariable) {

    var thisList = df.map(o => o[thisVariable]);

    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }

    var uniqueList = uniq(thisList);

    return uniqueList;
}

function addOptions(id, values) {
    var element = d3.select("#"+id);
    var options = element.selectAll("option").data(values);

    options.enter().append("a")
        .html(d => d);

    options.exit().remove();

    return element;
}

function addTitle(id, text) {
    d3.select(id)
        .append("div")
        .attr("class", "title")
        .style("font-family", "Montserrat")
        .style("font-size", "18px")
        .style("font-weight", 700)
        .style("display", "table")
        .html(text);
}

function addSubtitle(id, text) {
    d3.select(id)
        .append("div")
        .attr("class", "subtitle")
        .style("font-family", "Montserrat")
        .style("font-size", "14px")
        .style("font-weight", 400)
        .style("display", "table")
        .html(text);
}

function addSources(id, text) {
    d3.select(id)
        .append("div")
        .attr("class", "sources")
        .style("font-family", "Montserrat")
        .style("font-size", "14px")
        .style("font-weight", 400)
        .style("color", "#808080")
        .style("display", "table")
        .html(text);
}

function addBoldText(id, text) {
    d3.select(id)
        .append("div")
        .attr("class", "bold-text")
        .style("font-family", "Montserrat")
        .style("font-size", "14px")
        .style("font-weight", 700)
        .style("color", "#000")
        .style("display", "table")
        .html(text);
}

function addLegend(id) {
    const rectWidth = 20;

    addBoldText(id, "Operating System");

    const legendItem = d3.select(id)
        .append("div")
        .attr("class", "legend-wrapper")
        .style("margin-top", "8px")
        .style("display", "table")
        .selectAll(".legend-item")
        .data(["iOS", "Android"])
        .join("span")
            .attr("class", "legend-item")
            .style("display", 'inline-block')
            .style("margin-right", "14px");

    legendItem.append("svg")
        .attr("width", rectWidth)
        .attr("height", rectWidth)
        .style("vertical-align", "bottom")
        .style("display", 'inline-block')
        .selectAll("rect")
        .data(d => [d])
        .join("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", rectWidth)
            .attr("height", rectWidth)
            .attr("fill", d => d === 'iOS' ? "#040078" : "#558FC9");

    legendItem.selectAll(".item-text")
        .data(d => [d])
        .join("span")
            .attr("class", "item-text")
            .style("font-family", "Montserrat")
            .style("font-size", "14px")
            .style("font-weight", 400)
            .style("margin-left", "6px")
            .style("vertical-align", "bottom")
            .style("display", 'inline-block')
            .html(d => d)


}

function clearDiv(divId) {
    d3.select(`${divId} img`)
        .style('display', 'none');
    d3.select(divId)
        .style('display', 'block')
        // .style("max-width", "100%")
        .style("margin", "auto")
        .style("background", "#FFF");
}

function fixWidth(divId) {
    const children = d3.select(divId).selectChildren()._groups[0];
    const maxWidth = d3.max(children, child => child.getBoundingClientRect().width);
    d3.select(divId)
        .style("width", `${maxWidth}px`)
        .style("margin", "auto")
        .style("display", "table");
}
    