function drawViz6() {

    const gray = '#ECEDEE';
    const blue = '#0280FB';
    const darkerGray = "#D9D9D9";

    Promise.all([
        // d3.json('./data/countries-50m.json'),
        d3.json('./data/world-110m-2024.json'),
        d3.csv('./data/data-viz6.csv')
    ]).then((data) => {

        const world = data[0];
        const values = data[1];

        countries = topojson.feature(world, world.objects.countries);
        countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

        values.forEach(d => {
            d.Revenue = +d.Revenue;
            d.ARPPU = +d.ARPPU;
        })

        const groups = getUniquesMenu(values, 'Tier');
        let selectedGroup = 'US and English Language Markets';

        const [min, max] = d3.extent(values, d => d.ARPPU);
        console.log(min, max)

        const x = d3.scaleLinear()
            .domain([0, max])
            .range([0, 100])

        addBoldText("#geo-viz6", "Select country group")

        const gridWrapper = d3.select("#geo-viz6").append("div")
            .attr("class", 'grid-wrapper');

        const leftPanel = gridWrapper.append("div")
            .attr("class", "left-panel");

        const rightPanel = gridWrapper.append("div")
            .attr("class", "right-panel")
            .attr("id", "right-panel")
            .style("background-color", gray)
            .style("padding", "8px 10px")

        // RIGHT PANEL

        addBoldText('#right-panel', "Countries");

        const countriesString = rightPanel.append("div");
        const budgetBar = rightPanel.append("div")
            .attr("id", "budget")
            .style("height", '60px');
        const revenueBar = rightPanel.append("div")
            .attr("id", "revenue")
            .style("height", '60px');

        rightPanel.append("div")
            .attr("id", "arppu")
            .style("height", '60px');

        function addBar(divId, legendText) {
            const bar = d3.select("#" + divId).append('div')
                .attr('class', 'bar')
                .style("position", "relative")
                .style("width", '100%')
                .style("margin", 'auto')
                .style("height", divId === 'arppu' ? '17px' : '11px')

            bar.append("div")
                .style("width", "100%")
                .style("background-color", darkerGray)
                .style("height", '11px')
                .style("position", 'absolute')
                .style("top", divId === 'arppu' ? 3 : 0)
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
                .style("margin", 'auto');

            legend.append("div")
                .attr("id", divId + '-legend')
                .style("width", "40%")
                .style("position", 'absolute')
                .style("font-size", "32px")
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
        addBar("arppu", "ARPPU");
        
        // LEFT PANEL

        const buttonsWrapper = leftPanel.append("div")
            .attr("class", "button-wrapper")

        const vizWrapper = leftPanel.append("div")
            .attr("class", "viz-wrapper")
            .attr("id", "viz-wrapper")

        buttonsWrapper.selectAll(".country-button")
            .data(groups)
            .join("div")
                .attr("class", "country-button")
                .style("background-color", d => d === selectedGroup ? blue : gray)
                .style("color", d => d === selectedGroup ? "#FFFFFF" : "#000000")
                .style("cursor", "pointer")
                .html(d => d)
                .on("click", (evt, d) => {
                    if (selectedGroup !== d) {
                        selectedGroup = d;
                        d3.selectAll(".country-button")
                            .style("background-color", d => d === selectedGroup ? blue : gray)
                            .style("color", d => d === selectedGroup ? "#FFFFFF" : "#000000")
                        updatePlot();
                    }
                });

        addBoldText("#viz-wrapper", "Select genre");

        const dropdown = d3.select("#viz-wrapper")
            .append("div")
            .attr("class", "dropdown")
            .attr("id", "select-dropdown");
        
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

        const width = 828;
        const marginTop = 46;
        const height = 600 + marginTop;

        const projection = d3.geoMiller()
            .fitExtent([[2, marginTop + 2], [width - 2, height]], {type: "Sphere"})
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
        }

        function updatePlot() {
            const groupCountries = values.filter(value => (value.Tier === selectedGroup) & (value.Genre === selectedGenre));
            countriesLabel = groupCountries.map(d => d['Market full name']).join(', ');
            paidBudgetLabel = (groupCountries.reduce((a,b) => a + b['UA Spend'], 0) * 100).toFixed(0) + '%';
            revenueLabel = (groupCountries.reduce((a,b) => a + b['Revenue'], 0) * 100).toFixed(0) + '%';
            [minARPPU, maxARPPU] = d3.extent(groupCountries, d => d.ARPPU);
            minMaxLabel = `$${minARPPU.toFixed(1)}-$${maxARPPU.toFixed(1)}`;
            console.log(minARPPU, maxARPPU)

            updateRightPanel();

            const abbvCountries = groupCountries.map(d => d.Market);

            g.selectAll("path")
                .data(countries.features)
                .join("path")
                    // .attr("fill", d => color(valuemap.get(d.properties.name)))
                    .attr("fill", d => abbvCountries.indexOf(d.properties.a3) > 0 ? blue : gray)
                    .attr("d", path)
        
        
            svg.append("path")
                .datum(countrymesh)
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("d", path);
        }

        updatePlot();

        
    })

}

drawViz6();