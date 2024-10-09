function drawViz6() {

    const groups = ['US', 'EU 1', 'LATAM', 'EAP', 'EU 2', 'Global'];

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
            .style("background-color", "#d2d2d2")
            .html(d => d);

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
    const genre = ['All genres', 'RPG'];
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


    Promise.all([
        // d3.json('./data/countries-50m.json'),
        d3.json('./data/world-110m-2024.json'),
    ]).then((data) => {

        const world = data[0];

        countries = topojson.feature(world, world.objects.countries);
        countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

        svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
            // .attr("fill", d => color(valuemap.get(d.properties.name)))
            .attr("fill", "steelblue")
            .attr("d", path)
        
        
        svg.append("path")
            .datum(countrymesh)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("d", path);
    })

}

drawViz6();