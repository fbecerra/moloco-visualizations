function drawViz6() {

    const windowWidth = screen.width;
    const tooSmall = windowWidth < 700;

    clearDiv("#geo-viz6");

    const gray = '#ECEDEE';
    const blue = '#0280FB';
    const darkerGray = "#D9D9D9";

    // NEW to test

    d3.select("#geo-viz6 .title")
        .style("max-width", "700px")
        .style("margin", "auto");

    d3.select("#geo-viz6 .subtitle")
        .style("max-width", "700px")
        .style("margin", "8px auto 24px auto");

    // End of NEW to test

    Promise.all([
        d3.json('https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/world-110m-2024.json'),
        d3.csv('https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz6.csv')
    ]).then((data) => {

        const world = data[0];
        const values = data[1];

        countries = topojson.feature(world, world.objects.countries);
        countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

        values.forEach(d => {
            d.Revenue = +d.Revenue;
            d['UA Spend'] = +d['UA Spend'];
            d.ARPPU = +d.ARPPU;
        })

        const groups = getUniquesMenu(values, 'Tier');
        //const groups = ['US and English Language', 'Europe & Middle East (Tier 1)', 
        //   'LATAM Spanish Speaking', 'East Asia Pacific',
        //   'Europe & Middle East (Tier 2)', 'Global Developing Markets'];
        //const groups = getUniquesMenu(values, 'Tier');
        //const groups = ['US and English Language', 'Europe & Middle East (Group 1)', 
        //    'LATAM Spanish Speaking', 'East Asia Pacific',
        //    'Europe & Middle East (Group 2)', 'Global Developing Markets'];
        const groupLabels = {
            'US and English Language': "US and English Language", 
            'Europe & Middle East (Group 1)': "Europe & Middle East (Group 1)", 
            'LATAM Spanish Speaking': "LATAM Spanish Speaking", 
            'East Asia Pacific': "East Asia Pacific",
            'Europe & Middle East (Group 2)': "Europe & Middle East (Group 2)", 
            'Global Developing Markets': "Global Developing Markets"
        }
        let selectedGroup = groups[0];

        const [min, max] = d3.extent(values, d => d.ARPPU);

        const x = d3.scaleLinear()
            .domain([0, max])
            .range([0, 100]);

        d3.select("#geo-viz6")
            .style("font-family", "Montserrat")
            .style("font-size", '14px')
            .style("display", "block");

        const tooltip = d3.select("#geo-viz6")
            .style("position", "relative")
            .append("div")
            .attr("class", "viz-tooltip")
            .style("position", "absolute")
            .style("font-family", "Montserrat")
            .style("font-size", "14px")
            .style("font-weight", 400)
            .style("padding", "12px 24px")
            .style("background-color", "white")
            .style("border", "0.5px solid #000")
            .style("z-index", 2)
            .style("display", "none")
            .html('');

        addTitle("#geo-viz6", "Mapping global opportunities ");
        addSubtitle("#geo-viz6", "Interact with this visualization to learn more about user value, user acquisition, and revenue dynamics for markets of interest")

        addBoldText("#geo-viz6", "Select country group")

        const gridWrapper = d3.select("#geo-viz6").append("div")
            .attr("class", 'grid-wrapper')
            .style("margin-top", '12px')
            .style("display", tooSmall ? "block" : "grid");

        const leftPanel = gridWrapper.append("div")
            .attr("class", "left-panel")
            .style("display", tooSmall ? "block" : "grid");

        const rightPanel = gridWrapper.append("div")
            .attr("class", "right-panel")
            .attr("id", "right-panel")
            .style("background-color", gray)
            .style("padding", "8px 10px")

        // RIGHT PANEL

        addBoldText('#right-panel', "Countries");

        const countriesString = rightPanel.append("div")
            .style("height", '100px');
        const budgetBar = rightPanel.append("div")
            .attr("id", "budget")
            .style("height", '60px');
        const revenueBar = rightPanel.append("div")
            .attr("id", "revenue")
            .style("height", '60px');

        rightPanel.append("div")
            .attr("id", "arppu")
            .style("height", '60px');

        rightPanel.append("div")
            .attr("id", 'selected-tier-name')
            .style('font-weight', 700)
            .style('margin-top', '42px');

        rightPanel.append("div")
            .attr("id", 'selected-tier-info');

        function addBar(divId, legendText) {
            const bar = d3.select("#" + divId).append('div')
                .attr('class', 'bar')
                .style("position", "relative")
                .style("width", '100%')
                .style("margin-top", '24px')
                .style("height", divId === 'arppu' ? '17px' : '11px')

            bar.append("div")
                .style("width", "100%")
                .style("background-color", darkerGray)
                .style("height", '11px')
                .style("position", 'absolute')
                .style("top", divId === 'arppu' ? '3px' : 0)
                .style("left", 0)

            bar.append("div")
                .attr("id", divId + '-bar')
                .style("width", "20%")
                .style("background-color", blue)
                .style("height", divId === 'arppu' ? '17px' : '11px' )
                .style("position", 'absolute')
                .style("top", 0)
                .style("left", 0);

            const legend = d3.select("#" + divId).append("div")
                .attr("class", 'legend')
                .style('position', 'relative')
                .style("width", '100%')
                .style("margin-top", '8px');

            legend.append("div")
                .attr("id", divId + '-legend')
                .style("width", "40%")
                .style("position", 'absolute')
                .style("font-size", "32px")
                .style("font-weight", 700)
                .style('font-family', 'Spacegrotesk')
                .style("color", blue)
                .style("top", 0)
                .style("left", 0)
                .html("52%")

            legend.append("div")
                .style('text-align', 'right')
                .style("width", "60%")
                .style("position", 'absolute')
                .style("top", 0)
                .style("right", 0)
                .html(legendText)
        }

        addBar("budget", "paid UA budget");
        addBar("revenue", "gaming revenue");
        addBar("arppu", "D7 ARPPU");

        // addBoldText("#right-panel", "US ")
        
        // LEFT PANEL

        if (tooSmall) {
            const dropdown = leftPanel.append("div")
                .attr("class", "dropdown")
                .attr("id", "select-dropdown-tier")
                .style("width", '300px');
            
            dropdown.append("div")
                .attr("class", "dropbtn")
                .attr("id", "select-dropbtn-tier");
            
            dropdown.append("div")
                .attr("class", "dropdown-content")
                .attr("id", "select-content-tier")
                .style("width", '208');

            let tierOpts = addOptions("select-content-tier", groups);

            d3.select("#select-dropdown-tier")
                .on("click", function(d){
                    document.getElementById("select-content-tier").classList.toggle("show");
                });
            d3.select("#select-dropdown-tier").select(".dropbtn").html(selectedGroup);
            tierOpts.selectAll("a").on("click", function(event, d){
                if (d !== selectedGroup) {
                    selectedGroup = d;
                    d3.select("#select-dropdown-tier").select(".dropbtn").html(selectedGroup);
                    updatePlot();
                }
            })

        } else {
            const buttonsWrapper = leftPanel.append("div")
                .attr("class", "button-wrapper-viz")

            buttonsWrapper.selectAll(".country-button")
                .data(groups)
                .join("div")
                    .attr("class", "country-button")
                    .style("background-color", d => d === selectedGroup ? blue : gray)
                    .style("color", d => d === selectedGroup ? "#FFFFFF" : "#000000")
                    .style("font-weight", d => d === selectedGroup ? 700 : 400)
                    .style("cursor", "pointer")
                    .style("padding", "10px")
                    .html(d => d)
                    .on("click", (evt, d) => {
                        if (selectedGroup !== d) {
                            selectedGroup = d;
                            d3.selectAll(".country-button")
                                .style("background-color", d => d === selectedGroup ? blue : gray)
                                .style("color", d => d === selectedGroup ? "#FFFFFF" : "#000000")
                                .style("font-weight", d => d === selectedGroup ? 700 : 400);
                            updatePlot();
                        }
                    });
        }
        
        const vizWrapper = leftPanel.append("div")
                .attr("class", "viz-wrapper")
                .attr("id", "viz-wrapper")
                .style("margin-top", tooSmall ? '18px' : '-30px')

        addBoldText("#viz-wrapper", "Select genre");

        const dropdown = d3.select("#viz-wrapper")
            .append("div")
            .attr("class", "dropdown")
            .attr("id", "select-dropdown")
            .style("margin-top", '10px');
        
        dropdown.append("div")
            .attr("class", "dropbtn")
            .attr("id", "select-dropbtn");
        
        dropdown.append("div")
            .attr("class", "dropdown-content")
            .attr("id", "select-content");

        let selectedGenre ='All genres';
        const genre = getUniquesMenu(values, 'Genre');;
        let genreOpts = addOptions("select-content", genre);

        d3.select("#select-dropdown")
            .on("click", function(d){
                document.getElementById("select-content").classList.toggle("show");
            });
        d3.select("#select-dropdown").select(".dropbtn").html(selectedGenre);
        genreOpts.selectAll("a").on("click", function(event, d){
            if (d !== selectedGenre) {
                selectedGenre = d;
                d3.select("#select-dropdown").select(".dropbtn").html(selectedGenre);
                updatePlot();
            }
        })

        window.onclick = function(event) {
            if (!event.target.matches('#select-dropbtn')) {
                const dropdown = document.getElementById("select-content");
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }

        const width = tooSmall ? windowWidth : 828;
        const marginTop = 46;
        const height = width / 828 * 450 + marginTop;

        const projection = d3.geoMiller()
            .fitExtent([[2, marginTop + 2 -100], [width - 2, height + 150]], {type: "Sphere"})
            // .scale(width/5);
        // const projection = d3.geoEqualEarth()
        //     .fitExtent([[2, marginTop + 2], [width - 2, height]], {type: "Sphere"});
        // const projection = d3.geoMercator()
        //     .center([0, 0])
        //     .translate([width/2, height/2])
        //     .scale(width / (2 * Math.PI))
        const path = d3.geoPath(projection);

        const svg = vizWrapper.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");
        
        const g = svg.append("g");

        let countriesLabel;
        let paidBudgetLabel;
        let revenueLabel;
        let minARPPU, maxARPPU;
        let minMaxLabel;

        function updateRightPanel() {
            countriesString.html(countriesLabel);
            d3.select("#budget-bar").style("width", paidBudgetLabel);
            d3.select("#budget-legend").html(paidBudgetLabel);
            d3.select("#revenue-bar").style("width", revenueLabel);
            d3.select("#revenue-legend").html(revenueLabel);
            d3.select("#arppu-bar")
                .style("left", x(minARPPU) + '%')
                .style("width", (x(maxARPPU) - x(minARPPU)) + '%');
            d3.select("#arppu-legend").html(minMaxLabel);
            d3.select("#selected-tier-name").html(selectedGroup);
            d3.select("#selected-tier-info").html('<p style="font-family: Montserrat; color: #000; letter-spacing: 0px; font-size: 14px">Lowest barrier to entry for non-native developers.</p><p style="font-family: Montserrat; color: #000; font-size: 14px; letter-spacing: 0px;">Of these markets the US is the obvious outlier in terms of total opportunity, but broadly these markets see similar levels of average user value ($x to $x) and share low barriers of entry to most app developers</p>');
        }

        function updatePlot() {
            const groupCountries = values.filter(value => (value.Tier === selectedGroup) & (value.Genre === selectedGenre));
            countriesLabel = groupCountries.map(d => d['Market full name']).join(', ');
            paidBudgetLabel = (groupCountries.reduce((a,b) => a + b['UA Spend'], 0) * 100).toFixed(0) + '%';
            revenueLabel = (groupCountries.reduce((a,b) => a + b['Revenue'], 0) * 100).toFixed(0) + '%';
            [minARPPU, maxARPPU] = d3.extent(groupCountries, d => d.ARPPU);
            minMaxLabel = `$${minARPPU.toFixed(1)}-$${maxARPPU.toFixed(1)}`;

            updateRightPanel();

            const abbvCountries = groupCountries.map(d => d.Market);
            const paddingRows = 36;

            g.selectAll("path")
                .data(countries.features)
                .join("path")
                    // .attr("fill", d => color(valuemap.get(d.properties.name)))
                    .attr("fill", d => abbvCountries.indexOf(d.properties.a3) >= 0 ? blue : gray)
                    .attr("d", path)
                    .on("mousemove", (evt, d) => {
                        if (abbvCountries.indexOf(d.properties.a3) >= 0){
                            const thisCountry = values.filter(v => v.Market === d.properties.a3)[0];
                            d3.select(evt.target).attr("fill", "#C368F9");

                            tooltip.style("display", "inline-block")
                                .html(`
                                    <table>
                                        <tr colspan="3">
                                            <td style="font-weight: 700;padding-bottom: 24px;">${thisCountry['Market full name']}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right: ${paddingRows}px;font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">${(thisCountry['UA spend'] * 100).toFixed(1)}%
                                            </td>
                                            <td style="padding-right: ${paddingRows}px;font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">${(thisCountry.Revenue * 100).toFixed(1)}%
                                            </td>
                                            <td style="font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">$${thisCountry.ARPPU}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right: ${paddingRows}px">paid UA budget
                                            </td>
                                            <td style="padding-right: ${paddingRows}px">gaming revenue
                                            </td>
                                            <td>D7 ARPPU
                                            </td>   
                                        </tr>
                                    </table>`);

                            const tooltipWidth = tooltip.node().getBoundingClientRect().width;
                            const tooltipHeight = tooltip.node().getBoundingClientRect().height;

                            let xPos = Math.max(0, evt.layerX - tooltipWidth/2);
                            if (xPos + tooltipWidth > width) {
                                xPos = width - tooltipWidth - 48;
                            }

                            tooltip.style("left", `${xPos}px`)
                                .style("top", `${evt.layerY - tooltipHeight - 18}px`);
                        }
                    })
                    .on("mouseout", (evt, d) => {
                        if (abbvCountries.indexOf(d.properties.a3) >= 0){
                            d3.select(evt.target).attr("fill", blue);
                            tooltip.style("display", "none");
                        }
                    })
        
        
            svg.append("path")
                .datum(countrymesh)
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("d", path);
        }

        updatePlot();

        addSources("#geo-viz6", "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025) & Moloco advertiser total gaming IAP revenue (organic and paid) by market (Sep 2023 to August 2024). Spend in Mainland China is excluded from this analysis, but spend by Chinese marketers in non-domestic markets is included.")

        d3.select("#geo-viz6 .sources")
            .style("max-width", "700px")
            .style("margin", "16px auto 0 auto");
        
    })

}

drawViz6();
