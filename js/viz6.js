function drawViz6() {

    


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
        })

        const groups = getUniquesMenu(values, 'Tier');
        let selectedGroup = 'US and English Language Markets';

        addBoldText("#geo-viz6", "Select country group")

        const gridWrapper = d3.select("#geo-viz6").append("div")
            .attr("class", 'grid-wrapper');

        const leftPanel = gridWrapper.append("div")
            .attr("class", "left-panel");

        gridWrapper.append("div")
            .attr("class", "right-panel")
            .style("background-color", "#d2d2d2")
            .html("Countries");

        const buttonsWrapper = leftPanel.append("div")
            .attr("class", "button-wrapper")

        const vizWrapper = leftPanel.append("div")
            .attr("class", "viz-wrapper")
            .attr("id", "viz-wrapper")

        buttonsWrapper.selectAll(".country-button")
            .data(groups)
            .join("div")
                .attr("class", "country-button")
                .style("background-color", d => d === selectedGroup ? "#0280FB" : "#ECEDEE")
                .style("color", d => d === selectedGroup ? "#FFFFFF" : "#000000")
                .style("cursor", "pointer")
                .html(d => d)
                .on("click", (evt, d) => {
                    if (selectedGroup !== d) {
                        selectedGroup = d;
                        d3.selectAll(".country-button")
                            .style("background-color", d => d === selectedGroup ? "#0280FB" : "#ECEDEE")
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
                // updatePlot();
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

        const width = 928;
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

        function updatePlot() {
            const groupCountries = values.filter(value => (value.Tier === selectedGroup) & (value.Genre === selectedGenre));

            const abbvCountries = groupCountries.map(d => d.Market);

            g.selectAll("path")
                .data(countries.features)
                .join("path")
                    // .attr("fill", d => color(valuemap.get(d.properties.name)))
                    .attr("fill", d => abbvCountries.indexOf(d.properties.a3) > 0 ? "#0280FB" : "#ECEDEE")
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