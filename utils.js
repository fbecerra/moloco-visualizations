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
        .html(text);
}

function addSubtitle(id, text) {
    d3.select(id)
        .append("div")
        .attr("class", "subtitle")
        .style("font-family", "Montserrat")
        .style("font-size", "14px")
        .style("font-weight", 400)
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
        .html(text);
}