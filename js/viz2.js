function drawViz2() {
    const graphWidth = Math.min(screen.width - 40, 660);

    clearDiv("#geo-viz2");
    centerDiv("#geo-viz2");
    addTitle("#geo-viz2", "RPG games tend to target East Asia, while Match and Casino games focus on English-speaking regions");
    addSubtitle("#geo-viz2", "2025 estimated user acquisition spend by country within genre");
    
    d3.select("#geo-viz2")
        .append("div")
        .attr("class", "select-label")
        .style("font-family", "Montserrat")
        .style("font-size", "14px")
        .style("font-weight", 700)
        .style("display", "table")
        .html("Select genre");
    
    const dropdown = d3.select("#geo-viz2")
        .append("div")
        .attr("class", "dropdown")
        .attr("id", "select-dropdown-2");
    
    dropdown.append("div")
        .attr("class", "dropbtn")
        .attr("id", "select-dropbtn-2");
    
    dropdown.append("div")
        .attr("class", "dropdown-content")
        .attr("id", "select-content-2");
    
    const textPadding = 7;
    
    const margin = {top: 40, right: 60, bottom: 10, left: 90},
        width = graphWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select("#geo-viz2")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    
    window.onclick = function(event) {
        if (!event.target.matches('#select-dropbtn-2')) {
            const dropdown = document.getElementById("select-content-2");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
    
    
    const g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    const x = d3.scaleLinear()
        .range([0, width / 2 - 20])
        .domain([0, 100]);
    
    const y = d3.scaleBand()
        .range([0, height])
        .padding(.15);

    addSources("#geo-viz2", "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025). Moloco uses a number of inputs to estimate paid UA spend, including install data sourced from data.ai, assumptions on paid vs. organic ratios, and actual or estimated CPIs for specific app segments. Spend in mainland China is excluded from this analysis, but spend by mobile gaming apps based in China in non-domestic markets is included.")
    
    
    Promise.all([
        d3.csv('https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz2.csv')
    ]).then((data) => {
        const spend = data[0];
    
        let selectedGenre = "RPG";
    
        spend.forEach(d => {
            d['Android'] = +d['Android'].slice(0,-1);
            d['iOS'] = +d['iOS'].slice(0,-1);
            d['Total'] = +d['Total'].slice(0,-1);
        });
    
        const updatePlot = () => {
            const ylabel = 'Market full name';
            const dataToPlot = spend.filter(d => d.Genre === selectedGenre);
    
            y.domain(dataToPlot.map(d => d[ylabel]));
    
            g.selectAll(".country-name")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "country-name")
                    .attr("x", -margin.left )
                    .attr("y", d => y(d[ylabel]) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .text(d => d[ylabel]);
    
    
            // iOS
            g.selectAll(".title-iOS")
                .data(['iOS'])
                .join("text")
                    .attr("class", "title-iOS")
                    .attr("x", x(0) )
                    .attr("y", margin.top - 48)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .text(d => d);
    
            g.selectAll(".bg-ios")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bg-ios")
                    .attr("x", x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(100))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#ECEDEE");
    
            g.selectAll(".bar-ios")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bar-ios")
                    .attr("x", x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(d['iOS']))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#040078");
    
            g.selectAll(".percentage-ios")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "percentage-ios")
                    .attr("x", d => {
                        if (d.iOS > 80) {
                            return x(d['iOS']) - textPadding;
                        } else {
                            return x(d['iOS']) + textPadding;
                        }
                    })
                    .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("text-anchor", d => {
                        if (d.iOS > 80) {
                            return 'end';
                        } else {
                            return 'start';
                        }
                    })
                    .style("fill",'#000000')
                    .text(d => d['iOS'].toFixed(1) + '%');
    
            // ANDROID
            g.selectAll(".title-android")
                .data(['Android'])
                .join("text")
                    .attr("class", "title-android")
                    .attr("x", width/2 + x(0) )
                    .attr("y", margin.top - 48)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .text(d => d);
    
            g.selectAll(".bg-android")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bg-android")
                    .attr("x", width/2 + x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(100))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#ECEDEE");
    
            g.selectAll(".bar-android")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bar-android")
                    .attr("x", width/2 + x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(d['Android']))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#558FC9");
    
            g.selectAll(".percentage-android")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "percentage-android")
                    .attr("x", d => {
                        if (d.iOS > 80) {
                            return width/2 + x(d['Android']) - textPadding;
                        } else {
                            return width/2 + x(d['Android']) + textPadding;
                        }
                    })
                    .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("text-anchor", d => {
                        if (d.iOS > 80) {
                            return 'end';
                        } else {
                            return 'start';
                        }
                    })
                    .style("fill",'#000000')
                    .text(d => d['Android'].toFixed(1) + '%');
    
            // Total
            g.selectAll(".title-total")
                .data(['Total'])
                .join("text")
                    .attr("class", "title-total")
                    .attr("x", width)
                    .attr("y", margin.top - 48)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .text(d => d);
    
            g.selectAll(".percentage-total")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "percentage-total")
                    .attr("x", width)
                    .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .style("text-anchor", 'start')
                    .style("fill",'#000000')
                    .text(d => d['Total'].toFixed(1) + '%');

            fixWidth("#geo-viz2");
    
        }
    
        const genre = getUniquesMenu(spend, 'Genre');
        let genreOpts = addOptions("select-content-2", genre);
    
        d3.select("#select-dropdown-2")
            .on("click", function(d){
                document.getElementById("select-content-2").classList.toggle("show");
            });
        d3.select("#select-dropdown-2").select(".dropbtn").html('RPG');
        genreOpts.selectAll("a").on("click", function(event, d){
            if (d !== selectedGenre) {
                selectedGenre = d;
                d3.select("#select-dropdown-2").select(".dropbtn").html(selectedGenre);
                updatePlot();
            }
        })
    
        updatePlot();
    })
};

drawViz2();

