function drawViz1() {
    const drawBars1 = (spend, divId, xlabels, ylabel, colors, title, subtitle, sources) => {
        clearDiv(divId);
        const textPadding = 7;
    
        const margin = {top: 10, right: 50, bottom: 10, left: 90},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
    
        addTitle(divId, title);
        addSubtitle(divId, subtitle);
        addLegend(divId);
    
        const svg = d3.select(divId)
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("viewBox", "0 0 460 400");
    
        const g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
        const subgroups = xlabels;
        const groups = spend.map(d => d[ylabel]);
    
        const series = d3.stack()
            .keys(subgroups)
            (spend)
    
        const x = d3.scaleLinear()
            .range([ 0, width]);
    
        const y = d3.scaleBand()
            .range([ 0, height ])
            .padding(.15);
    
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(colors)
            .unknown("#ccc");
    
        x.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        y.domain(spend.map(d => d[ylabel]));
    
        g.select('.y-axis').select(".domain").remove();
        g.select('.y-axis').selectAll(".tick line").remove();
    
        g.selectAll(".bars")
            .data(series)
            .join("g")
                .attr("class", "bars")
                .attr("fill", d => color(d.key))
            .selectAll(".bar")
            .data((d, i) => d.map(e => {
                const f = structuredClone(e);
                f.data.index = i;
                f.data.key = d.key;
                return f;
            }))
            .join("rect")
                .attr("x", d => x(d[0]))
                .attr("y", d => y(d.data[ylabel]))
                .attr("height", y.bandwidth())
                .attr("width", d => x(d[1]) - x(d[0]))
                .attr("fill", d => d.data[ylabel] === 'Others' ? (d.data.key === 'iOS' ? "#CCC" : "#ECEDEE") : "");
    
        g.selectAll(".divider")
            .data(series[1])
            .join("line")
                .attr("class", "divider")
                .attr("x1", d => x(d[0]))
                .attr("x2", d => x(d[0]))
                .attr("y1", d => y(d.data[ylabel]))
                .attr("y2", d => y(d.data[ylabel]) + y.bandwidth())
                .attr("stroke", "white")
                .attr("stroke-width", 1.5);
    
        g.selectAll(".country-name")
            .data(spend)
            .join("text")
                .attr("class", "country-name")
                .attr("x", -margin.left )
                .attr("y", d => y(d[ylabel]) + y.bandwidth() / 2 + 2)
                .style("dominant-baseline", "middle")
                .style("font-family", "Montserrat")
                .style("font-size", "14px")
                .text(d => d[ylabel]);
    
        g.selectAll(".percentage")
            .data(spend)
            .join("text")
                .attr("class", "percentage")
                .attr("x", d => x(d['Total']) + textPadding)
                .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                .style("dominant-baseline", "middle")
                .style("font-family", "Space Grotesk")
                .style("font-size", "14px")
                .style("text-anchor", 'start')
                .style("fill", '#000000')
                .text(d => (d['Total'] * 100).toFixed(1) + '%');
    
        addSources(divId, sources);  
        fixWidth(divId);
        
    }
    
    
    Promise.all([
        d3.csv("https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz1.csv"),
    ]).then((data) => {            
    
        data[0].forEach(d => {
            d['Percentage UA Spend'] = +d['Percentage UA Spend'];
        });
    
        drawBars1(data[0],
            divId = "#geo-viz1",
            xlabels = ['iOS', 'Android'],
            ylabel = 'Market full name',
            colors = ["#040078", "#558FC9"],
            title = "Three quarters of mobile games spend is</br>concentrated in ten countries",
            subtitle = "Gaming spend for top countries, Aug 2023-Aug 2024",
            sources = "Source: TBD"
        )
        
    })
}

drawViz1();