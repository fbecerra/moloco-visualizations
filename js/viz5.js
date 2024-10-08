function drawViz5() {
    clearDiv("#geo-viz5");
    addTitle("#geo-viz5", "East Asia sweeps the podium when it comes to </br>average revenue per paying user, although this </br>picture changes by OS and genre")   
    addSubtitle("#geo-viz5", "ARPPU for top 15 countries");

    const dropdowns = d3.select("#geo-viz5")
        .append("div")
        .attr("class", "dropdowns")
        .style("display", "table");

    const dropdownsOpts = ['genre', 'OS'];

    dropdownsOpts.forEach(d => {

        const dropdownWrapper = dropdowns.append("div")
            .attr("class", "dropdown-wrapper")
            .style("display", 'inline-block')
            .style("margin-right", "38px");

        dropdownWrapper.append("div")
            .attr("class", "select-label")
            .style("font-family", "Montserrat")
            .style("font-size", "14px")
            .style("font-weight", 700)
            .html(`Select ${d}`);
            
        const dropdown = dropdownWrapper.append("div")
            .attr("class", "dropdown inline")
            .attr("id", d+"-dropdown");

        dropdown.append("div")
            .attr("class", "dropbtn")
            .attr("id", d+"-dropbtn");

        dropdown.append("div")
            .attr("class", "dropdown-content")
            .attr("id", d+"-content");
    });


    const margin = {top: 10, right: 60, bottom: 10, left: 120},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#geo-viz5")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    addSources("#geo-viz5", "Source: Moloco advertiser median D7 ARPPU (organic and paid </br>all channels), apps with $1000+ revenue, outlier treatment applied. </br>Excluding Mainland China");

    window.onclick = function(event) {
        if (!event.target.matches('#genre-dropbtn')) {
            const dropdown = document.getElementById("genre-content");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }

        if (!event.target.matches('#OS-dropbtn')) {
            const dropdown = document.getElementById("OS-content");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }

    const textPadding = 7;

    const g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
        .range([ 0, width]);

    const y = d3.scaleBand()
        .range([ 0, height ])
        .padding(.15);

    const xAxis = g.append("g")
        .attr("transform", "translate(0," + height + ")")

    Promise.all([
        d3.csv('https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz5.csv')
    ]).then((data) => {
        const revenue = data[0];

        let selectedGenre = "All genres";
        let selectedOS = 'All systems';

        revenue.forEach(d => {
            d['Android'] = +d['Android'];
            d['iOS'] = +d['iOS'];
            d['Total'] = +d['Total']
;            });

        const updatePlot = () => {
            const xlabel = selectedOS === 'All systems' ? 'Total' : selectedOS,
                ylabel = 'Market full name';
            const dataToPlot = revenue.filter(d => d.Genre === selectedGenre)
                .sort((a,b) => b[xlabel] - a[xlabel]);


            x.domain([0, d3.max(dataToPlot, d => d[xlabel])]);
            y.domain(dataToPlot.map(d => d[ylabel]));

            g.selectAll(".bar")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bar")
                    .attr("x", x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(d[xlabel]))
                    .attr("height", y.bandwidth() )
                    .attr("fill", (d, i) => i < 3 ? "#C368F9" : "#D8DADC");

            xAxis.call(d3.axisBottom(x).ticks(20));
            xAxis.select(".domain").remove();
            xAxis.selectAll(".tick text").remove();
            xAxis.selectAll(".tick line").attr('y2', -height).style('stroke', '#FFF');
            xAxis.raise();

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

            g.selectAll(".percentage")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "percentage")
                    .attr("x", d => x(d[xlabel]) + textPadding)
                    .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("text-anchor", 'start')
                    .style("fill", '#000000')
                    .text(d => '$' + d[xlabel].toFixed(1));

            g.selectAll(".percentage").raise();

            fixWidth("#geo-viz5");

        }

        const genre = getUniquesMenu(revenue, 'Genre');
        let genreOpts = addOptions("genre-content", genre);

        d3.select("#genre-dropdown")
            .on("click", function(d){
                document.getElementById("genre-content").classList.toggle("show");
            });
        d3.select("#genre-dropdown").select(".dropbtn").html(selectedGenre);
        genreOpts.selectAll("a").on("click", function(event, d){
            if (d !== selectedGenre) {
                selectedGenre = d;
                d3.select("#genre-dropdown").select(".dropbtn").html(selectedGenre);
                updatePlot();
            }
        })

        const systems = ['All systems', 'Android', 'iOS'];
        let systemOpts = addOptions("OS-content", systems);

        d3.select("#OS-dropdown")
            .on("click", function(d){
                document.getElementById("OS-content").classList.toggle("show");
            });
        d3.select("#OS-dropdown").select(".dropbtn").html(selectedOS);
        systemOpts.selectAll("a").on("click", function(event, d){
            if (d !== selectedOS) {
                selectedOS = d;
                d3.select("#OS-dropdown").select(".dropbtn").html(selectedOS);
                updatePlot();
            }
        })

        updatePlot();
    })
}

drawViz5();