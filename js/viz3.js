function drawViz3() {
    clearDiv("#geo-viz3");
    addTitle("#geo-viz3", "Some marketers stick to their local regions, </br>while others are quicker to expand globally");
    addSubtitle("#geo-viz3", "Estimated user acquisition spend by country, filtered by app developer HQ location");
    // addLegend("#geo-viz3");
    addBoldText("#geo-viz3", "HQ in the US");

    const textPadding = 7;
    const squaresPerRow = 5;
    const squareSize = 15;
    const squarePadding = 2;
    const waffleSize = 10 * squareSize + 9 * squarePadding;
    const waffleHPadding = 10;
    const waffleVPadding = 54;
    const countryNamePadding = 20;
    const topText = countryNamePadding + 2 * squareSize + squarePadding;
    const leftText = 7 * squareSize + 6 * squarePadding; 

    const margin = {top: 0, right: 0, bottom: 0, left: 1},
        width = 4 * waffleSize + 3 * waffleHPadding - margin.left - margin.right,
        height = (waffleSize + waffleVPadding) - margin.top - margin.bottom;

    const svg1 = d3.select("#geo-viz3")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    const g1 = svg1.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#geo-viz3")
        .append("div")
        .attr("class", "separator")
        .style("border-bottom", '1px dotted #808080');

    addBoldText("#geo-viz3", "Select HQ to compare");
    const dropdowns = d3.select("#geo-viz3")
        .append("div")
        .attr("class", "dropdowns")
        .style("display", "table");

    const svg2 = d3.select("#geo-viz3")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    const g2 = svg2.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // const x = d3.scaleLinear()
    //     .range([ 0, width]);

    const y = d3.scaleLinear()
        .range([0, squareSize])
        .domain([0, 1]);

    // const xAxis = g.append("g")
    //     .attr("transform", "translate(0," + height + ")");

    addSources("#geo-viz3", "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025). Spend in mainland </br>China is excluded from this analysis, but spend by mobile gaming apps based in China in </br>non-domestic markets is included.")

    window.onclick = function(event) {
        if (!event.target.matches('#country2-dropbtn-2')) {
            const dropdown = document.getElementById("country2-content-2");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }

    const xlabel = 'HQ country full name',
        ylabel = 'Total';

    Promise.all([
        d3.csv('https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz3.csv')
    ]).then((data) => {
        const spend = data[0];

        spend.forEach(d => {
            d['Total'] = +d['Total'];
            d['Android'] = +d['Android'];
            d['iOS'] = +d['iOS'];
        });

        let country1 = "US";
        let country2 = 'China';
        // const uniqueDestinations = getUniquesMenu(spend, 'Destination');
        const uniqueDestinations = ['North America', 'Europe', 'Asia Pacific', 'Rest of World'];

        let countries = ["country2"];
        countries.forEach(d => {

            const dropdownWrapper = dropdowns.append("div")
                .attr("class", "dropdown-wrapper")
                
            const dropdown = dropdownWrapper.append("div")
                .attr("class", "dropdown inline")
                .attr("id", d+"-dropdown-2");

            dropdown.append("div")
                .attr("class", "dropbtn")
                .attr("id", d+"-dropbtn-2");

            dropdown.append("div")
                .attr("class", "dropdown-content")
                .attr("id", d+"-content-2");
        });

        const updatePlot = (g, country) => {
            // const dataToPlot = spend.filter(d => d.Genre === selectedGenre);
            const countriesToPlot = [country];

            const countryGroups = g.selectAll(".country-group")
                .data(countriesToPlot)
                .join("g")
                    .attr("class", "country-group")
                    .attr("transform", (d,i) => "translate(0," + i * (countryNamePadding + waffleSize + waffleVPadding) + ")")

            const groups = countryGroups.selectAll(".group")
                .data(d => uniqueDestinations.map(ud => spend.filter(si => ((si[xlabel] === d) && (si.Destination === ud)))))
                .join("g")
                    .attr("class", "group")
                    .attr("transform", (d,i) => "translate(" + i * (waffleSize + waffleHPadding) + ",0)");

            groups.selectAll(".square")
                .data(d => d3.range(0, 100, 1).map(idx => {
                    return {
                        idx: idx,
                        Android: d[0].Android,
                        Total: d[0].Total
                    }
                }))
                .join("rect")
                    .attr("class", "square")
                    .attr("x", d => waffleSize - (d.idx % 10 + 1) * (squareSize + squarePadding))
                    .attr("y", d => countryNamePadding + Math.floor(d.idx / 10) * (squareSize + squarePadding))
                    .attr("width", squareSize)
                    .attr("height", squareSize)
                    .attr("fill", d =>  (d.idx >= 100 * (1 - d.Total)) ? "#0280FB" : "#ECEDEE");

            groups.selectAll(".fractional-square-android")
                .data(d => {
                    const remainder = (d[0].Total * 1000) % 10 / 10;
                    const idx = Math.floor(100 - d[0].Total * 100);
                    return [{
                        x: waffleSize - (idx % 10 + 1) * (squareSize + squarePadding),
                        y: countryNamePadding + Math.floor(idx / 10) * (squareSize + squarePadding),
                        height: y(remainder)
                    }]
                })
                .join("rect")
                    .attr("class", "fractional-square-android")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y + (squareSize - d.height))
                    .attr("width", squareSize)
                    .attr("height", d => d.height)
                    .attr("fill", "#0280FB");

            // groups.selectAll(".fractional-square-ios")
            //     .data(d => {
            //         const remainder = (d[0].Total * 1000) % 10 / 10;
            //         const idx = Math.floor(100 - d[0].Total * 100);
            //         return [{
            //             x: waffleSize - (idx % 10 + 1) * (squareSize + squarePadding),
            //             y: countryNamePadding + Math.floor(idx / 10) * (squareSize + squarePadding),
            //             height: y(remainder)
            //         }]
            //     })
            //     .join("rect")
            //         .attr("class", "fractional-square-ios")
            //         .attr("x", d => d.x)
            //         .attr("y", d => d.y + (squareSize - d.height))
            //         .attr("width", squareSize)
            //         .attr("height", d => d.height)
            //         .attr("fill", "#040078");

            groups.selectAll(".percentage")
                .data(d => [d])
                .join("text")
                    .attr("class", "percentage")
                    .attr("x", leftText)
                    .attr("y", topText)
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("text-anchor", 'start')
                    .attr("fill", "#000000")
                    .text(d => (d[0][ylabel] * 100).toFixed(1) + '%');

            groups.selectAll(".destination-name")
                .data(d => [d])
                .join("text")
                    .attr("class", "destination-name")
                    .attr("x", 0)
                    .attr("y", d => countryNamePadding + waffleSize + 24)
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("text-anchor", 'start')
                    .attr("fill", "#000000")
                    .text(d => 'Spend in ' + d[0]['Destination'])

            fixWidth("#geo-viz3");

        }

        const uniqueCountries = getUniquesMenu(spend, xlabel);
        let country2Opts = addOptions("country2-content-2", uniqueCountries);

        d3.select("#country2-dropdown-2")
            .on("click", function(d){
                document.getElementById("country2-content-2").classList.toggle("show");
            });
        d3.select("#country2-dropdown-2").select(".dropbtn").html(country2);
        country2Opts.selectAll("a").on("click", function(event, d){
            if (d !== country2) {
                country2 = d;
                d3.select("#country2-dropdown-2").select(".dropbtn").html(country2);
                updatePlot(g2, country2);
            }
        })

        updatePlot(g1, 'US');
        updatePlot(g2, country2);
    })
}

drawViz3();