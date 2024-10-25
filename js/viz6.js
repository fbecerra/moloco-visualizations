function drawViz6() {

    const windowWidth = screen.width;
    const tooSmall = windowWidth < 700;

    clearDiv("#geo-viz6");

    const gray = '#ECEDEE';
    const blue = '#0280FB';
    const darkerGray = "#D9D9D9";

    Promise.all([
        d3.json('https://cdn.jsdelivr.net/npm/visionscarto-world-atlas@1/world/50m.json'),
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

        //const groups = getUniquesMenu(values, 'Tier');
        //const groups = ['US and English Language', 'Europe & Middle East (Tier 1)', 
        //   'LATAM Spanish Speaking', 'East Asia Pacific',
        //   'Europe & Middle East (Tier 2)', 'Global Developing Markets'];
        //const groups = getUniquesMenu(values, 'Tier');
        //const groups = ['US and English Language', 'Europe & Middle East (Group 1)', 
        //    'LATAM Spanish Speaking', 'East Asia Pacific',
        //    'Europe & Middle East (Group 2)', 'Global Developing Markets'];
        //const groupLabels = {
        //    'US and English Language': "US and English Language", 
        //    'Europe & Middle East (Group 1)': "Europe & Middle East (Group 1)", 
        //    'LATAM Spanish Speaking': "LATAM Spanish Speaking", 
        //    'East Asia Pacific': "East Asia Pacific",
        //    'Europe & Middle East (Group 2)': "Europe & Middle East (Group 2)", 
        //    'Global Developing Markets': "Global Developing Markets"


        const groups = ['US and English Language', 'East Asia Pacific',
            'Europe & Middle East (Group 1)', 'Europe & Middle East (Group 2)',
            'LATAM Spanish Speaking', 'Global Developing Markets'];
        const groupLabels = {
            'US and English Language': "US and English Language", 
            'East Asia Pacific': "East Asia Pacific",
            'Europe & Middle East (Group 1)': "Europe & Middle East (Group 1)", 
            'Europe & Middle East (Group 2)': "Europe & Middle East (Group 2)", 
            'LATAM Spanish Speaking': "LATAM Spanish Speaking", 
            'Global Developing Markets': "Global Developing Markets"
        }
        const groupInfo = {
            'US and English Language': "The U.S. and many English-language countries are the largest overall mobile gaming market, representing the majority of UA spend and revenue. While the U.S. dominates in total IAP revenue, opportunities exist across these markets, representing similar barriers to entry and consistent user value across genres.", 
            'East Asia Pacific': "East Asia Pacific markets have the highest average user value across most genres. Potentially a higher barrier to entry for non-domestic marketers due to localization and cultural differences. Midcore (RPG, Strategy, Simulation) sees relative strength in this region for user value and total IAP revenue.",
            'Europe & Middle East (Group 1)': "Europe and the Middle East can be grouped into two sets of markets based on user value and total IAP revenue. Group 1 represents some of the largest markets of opportunity within the region with higher user value and IAP revenue. Moreover, a significant percentage of English speakers among the population potentially lowering the barrier of entry for many apps.", 
            'Europe & Middle East (Group 2)': "Europe and the Middle East can be grouped into two sets of markets based on user value and total IAP revenue. Group 2 represents diverse markets with a lower share of the total IAP revenue and high variance in user value. Due to their size, these markets can perhaps be more challenging to enter, but may represent a significant opportunity by grouping key markets to maximize reach.", 
            'LATAM Spanish Speaking': "Latin America (LATAM) markets have relatively low user value and overall IAP revenue contribution. However, localization can be streamlined due to the population being largely Spanish speaking. For marketers, grouping these countries can help with UA viability.", 
            'Global Developing Markets': "Consisting of a wide range of developing countries, these markets have the largest variability of user value with significant differences across genres. However, there are pockets of opportunity for marketers to capture high-value users at a potentially cost efficient price."
        }
        let selectedGroup = groups[0];
        let selectedGenre ='All genres';

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
        
        d3.select("#geo-viz6").append("div")
            .attr("id", "title-wrapper")
            .style("max-width", "700px")
            .style("margin", "auto");;

        addTitle("#title-wrapper", "Mapping global opportunities ");
        addSubtitle("#title-wrapper", "Interact with this visualization to learn more about user value, user acquisition, and revenue dynamics by region. Hover over individual countries for a market-level overview.")
            

        // // NEW to test

        // d3.select("#geo-viz6 .title")
        //     .style("max-width", "700px")
        //     .style("margin", "auto")

        // d3.select("#geo-viz6 .subtitle")
        //     .style("max-width", "700px")
        //     .style("margin", "8px auto 24px auto");

        // // End of NEW to test

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
        addBar("revenue", "gaming IAP revenue");
        addBar("arppu", "D7 ARPPU");

        // addBoldText("#right-panel", "US ")
        
        // LEFT PANEL

        if (tooSmall) {
            const dropdown = leftPanel.append("div")
                .attr("class", "dropdown")
                .attr("id", "select-dropdown-tier")
                .style("width", '100%')  // Changed from 300px to 100%
            
            dropdown.append("div")
                .attr("class", "dropbtn")
                .attr("id", "select-dropbtn-tier");
            
            dropdown.append("div")
                .attr("class", "dropdown-content")
                .attr("id", "select-content-tier")
                //.style("width", '208');

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
        let path = d3.geoPath(projection);


        const svg = vizWrapper.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        //vizWrapper.append("div")
        //    .attr("class", "buttons")
        //    .html('<div class="row"><div class="button" id="zoom-in">+</div></div><div class="row"><div class="button" id="zoom-out">-</div></div>' + 
        //        '<div class="row"><div class="button" id="zoom-reset"><svg width="26" height="26" viewBox="-5 -5 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        //        '<path d="M8.67071 8.95948C7.10583 10.8527 4.28501 11.0208 2.36518 9.29474C0.445358 7.56869 0.202351 4.64596 1.76723 2.75279C3.33211 0.859615 6.16609 0.703294 8.05961 2.4057L9.47976 3.68251L6.42735 3.82578L6.46843 4.27523L10.2631 4.06592L9.89161 0.133917L9.45931 0.157762L9.7623 3.34068L8.34216 2.06388C6.26454 0.19596 3.14237 0.368178 1.42535 2.44541C-0.291677 4.52264 0.00501632 7.76864 2.08263 9.63656C4.16025 11.5045 7.29329 11.3191 8.99945 9.25504L8.67071 8.95948Z" fill="#000000" />' +
        //        '</svg></div></div>');

        // Update the buttons HTML string with a thicker reset icon
        vizWrapper.append("div")
            .attr("class", "buttons")
            .html('<div class="row"><div class="button" id="zoom-in">+</div></div><div class="row"><div class="button" id="zoom-out">-</div></div>' + 
                '<div class="row"><div class="button" id="zoom-reset"><svg width="22" height="22" viewBox="-2.5 -2.5 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M8.67071 8.95948C7.10583 10.8527 4.28501 11.0208 2.36518 9.29474C0.445358 7.56869 0.202351 4.64596 1.76723 2.75279C3.33211 0.859615 6.16609 0.703294 8.05961 2.4057L9.47976 3.68251L6.42735 3.82578L6.46843 4.27523L10.2631 4.06592L9.89161 0.133917L9.45931 0.157762L9.7623 3.34068L8.34216 2.06388C6.26454 0.19596 3.14237 0.368178 1.42535 2.44541C-0.291677 4.52264 0.00501632 7.76864 2.08263 9.63656C4.16025 11.5045 7.29329 11.3191 8.99945 9.25504L8.67071 8.95948Z" fill="#000000" stroke="#000000" stroke-width="0.6"/>' +
                '</svg></div></div>');
        
        const g = svg.append("g");

        let countriesLabel;
        let paidBudgetLabel;
        let revenueLabel;
        let paidBudgetWidth;
        let revenueWidth;
        let minARPPU, maxARPPU;
        let minMaxLabel;

        const maxZoom = 16;
        const minZoom = 1;

        const zoom = d3.zoom()
            .extent([[0, 0], [width, height]])
            .scaleExtent([minZoom, maxZoom])
            .on("zoom", zoomed)

        function zoomed({transform}) {
            g.attr("transform", transform);
            g.selectAll(".country-edge")    
                .attr("stroke-width", 1 / transform.k)
        }

        svg.call(zoom);

        d3.select("#zoom-in")
            .on("click", ({ transform }) => {
                svg.transition().call(zoom.scaleBy, 2);
            });

        d3.select("#zoom-out")
            .on("click", ({ transform }) => {
                svg.transition().call(zoom.scaleBy, 0.5);
            });

        d3.select("#zoom-reset")
            .on("click", () => {
                svg.call(zoom.transform, d3.zoomIdentity);
            });

        function updateRightPanel() {
            countriesString.html(countriesLabel);
            d3.select("#budget-bar").style("width", paidBudgetWidth);
            d3.select("#budget-legend").html(paidBudgetLabel);
            d3.select("#revenue-bar").style("width", revenueWidth);
            d3.select("#revenue-legend").html(revenueLabel);
            d3.select("#arppu-bar")
                .style("left", x(minARPPU) + '%')
                .style("width", (x(maxARPPU) - x(minARPPU)) + '%');
            d3.select("#arppu-legend").html(minMaxLabel);
            d3.select("#selected-tier-name").html(selectedGroup);
            d3.select("#selected-tier-info").html(`<p style="font-family: Montserrat; color: #000; letter-spacing: 0px; font-size: 14px">${groupInfo[selectedGroup]}</p>`);
        }

        function updatePlot() {
            const groupCountries = values.filter(value => (value.Tier === selectedGroup) & (value.Genre === selectedGenre));
            countriesLabel = groupCountries.map(d => d['Market full name']).join(', ');
            const paidBudget = (groupCountries.reduce((a,b) => a + b['UA Spend'], 0) * 100).toFixed(0);
            paidBudgetWidth = paidBudget + '%';
            paidBudgetLabel = paidBudget < 1 ? '<1%' : paidBudget + '%';
            const revenueTotal = (groupCountries.reduce((a,b) => a + b['Revenue'], 0) * 100).toFixed(0);
            revenueWidth = revenueTotal + '%';
            revenueLabel = revenueTotal < 1 ? '<1%' : revenueTotal + '%';
            [minARPPU, maxARPPU] = d3.extent(groupCountries, d => d.ARPPU);
            minMaxLabel = `$${minARPPU.toFixed(1)}-$${maxARPPU.toFixed(1)}`;

            updateRightPanel();

            const abbvCountries = groupCountries.map(d => d.Market);
            const paddingRows = 36;

            g.selectAll(".country-path")
                .data(countries.features)
                .join("path")
                    .attr("class", "country-path")
                    // .attr("fill", d => color(valuemap.get(d.properties.name)))
                    .attr("fill", d => abbvCountries.indexOf(d.properties.a3) >= 0 ? blue : gray)
                    .attr("d", path)
                    .on("mousemove", (evt, d) => {
                        if (abbvCountries.indexOf(d.properties.a3) >= 0){
                            const thisCountry = values.filter(v => (v.Market === d.properties.a3) & (v.Genre === selectedGenre))[0];
                            d3.select(evt.target).attr("fill", "#C368F9");

                            const thisCountrySpend = (thisCountry['UA Spend'] * 100).toFixed(1);
                            const thisCountryRevenue = (thisCountry.Revenue * 100).toFixed(1);

                            const spendLabel = thisCountrySpend < 0.1 ? '<0.1' : '' + thisCountrySpend; 
                            const revenueLabel = thisCountryRevenue < 0.1 ? '<0.1' : '' + thisCountryRevenue; 

                            tooltip.style("display", "inline-block")
                                .html(`
                                    <table>
                                        <tr colspan="3">
                                            <td style="font-weight: 700;padding-bottom: 24px;">${thisCountry['Market full name']}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right: ${paddingRows}px;font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">${spendLabel}%
                                            </td>
                                            <td style="padding-right: ${paddingRows}px;font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">${revenueLabel}%
                                            </td>
                                            <td style="font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">$${thisCountry.ARPPU}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right: ${paddingRows}px">paid UA budget
                                            </td>
                                            <td style="padding-right: ${paddingRows}px">gaming IAP revenue
                                            </td>
                                            <td>D7 ARPPU
                                            </td>   
                                        </tr>
                                    </table>`);

                            const tooltipWidth = tooltip.node().getBoundingClientRect().width;
                            const tooltipHeight = tooltip.node().getBoundingClientRect().height;

                            let xPos = Math.max(0, evt.layerX - tooltipWidth/2);
                            if (xPos + tooltipWidth > width) {
                                xPos = Math.max(0, width - tooltipWidth - 48);
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
        
        
            g.append("path")
                .datum(countrymesh)
                .attr("class", 'country-edge')
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("d", path);
        }

        updatePlot();

        addSources("#geo-viz6", "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025) & Moloco advertiser total gaming IAP revenue (organic and paid) by market (Aug 2023 to Aug 2024). Spend in Mainland China is excluded from this analysis, but spend by Chinese marketers in non-domestic markets is included.")

        d3.select("#geo-viz6 .sources")
            .style("max-width", "700px")
            .style("margin", "16px auto 0 auto");
        
    })

}

drawViz6();
