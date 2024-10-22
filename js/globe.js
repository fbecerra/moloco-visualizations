function drawGlobe() {
    const globeDiv = d3.select("#geo-hero-globe");
    globeDiv.select("img").style("display", "none");
    const globeWidth = globeDiv.node().getBoundingClientRect().width;
    const bodyWidth = d3.select("body").node().getBoundingClientRect().width;
    const width = globeWidth > 0 ? globeWidth : bodyWidth - 60,
        height = globeWidth > 0 ? globeWidth : bodyWidth - 60;
    const projection = d3.geoOrthographic()
        .scale(width/2)
        .translate([width / 2, height / 2])
        .clipAngle(90);
    const path = d3.geoPath()
        .projection(projection);
    const λ = d3.scaleLinear()
        .domain([0, width])
        .range([-180, 180]);
    const φ = d3.scaleLinear()
        .domain([0, height])
        .range([90, -90]);
    const svg = globeDiv.append("svg")
        .attr("width", width)
        .attr("height", height);
    const markerGroup = svg.append('g');
    const center = [width/2, height/2];
    const graticule = d3.geoGraticule()
      .step([10, 10]);
    
    Promise.all([
        d3.json('https://raw.githubusercontent.com/fbecerra/dataexperiments/master/data/land-110m.json'),
        d3.csv('https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/coordinates.csv')
    ]).then((world) => {
        const coords = world[1];
        coords.forEach(d => {
            d.lat = +d.lat;
            d.long = +d.long;
            d.size = Math.random() * 20;
        })

        svg.append("path")
            .datum(topojson.feature(world[0], world[0].objects.land))
            .attr("class", "land")
            .attr("d", path)
            .style("stroke", "steelblue")
            .style("stroke-width", "0.85px")
            .style("fill", '#0A0663');
            
        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "#C6E3F7")
            .style("stroke-width", "0.72px")
            .style("opacity", 0.2);
            
        const config = {
            speed: 0.005,
            verticalTilt: -30,
            horizontalTilt: 0
        }
        function enableRotation() {
            d3.timer(function (elapsed) {
                projection.rotate([config.speed * elapsed - 90, config.verticalTilt, config.horizontalTilt]);
                svg.selectAll("path").attr("d", path);
                drawMarkers();
            });
        }
    
        function drawMarkers() {
            const markers = markerGroup.selectAll('circle')
                .data(coords);
            markers
                .enter()
                .append('circle')
                .merge(markers)
                .attr('cx', d => projection([d.long, d.lat])[0])
                .attr('cy', d => projection([d.long, d.lat])[1])
                .attr('fill', d => {
                    const coordinate = [d.long, d.lat];
                    gdistance = d3.geoDistance(coordinate, projection.invert(center));
                    return gdistance > 1.57 ? 'none' : '#3599FC';
                })
                .attr('r', d => d.size)
                .attr("opacity", 0.2);
    
            markerGroup.each(function () {
                this.parentNode.appendChild(this);
            });
        }
    
        enableRotation();
    });
}

drawGlobe();


