function drawViz4() {
    const drawBars4 = (spend, divId, xlabel, ylabel, title, subtitle, sources) => {
        const graphWidth = Math.min(screen.width, 600);

        const labelForUS = 'U.S.';

        clearDiv(divId);
        centerDiv(divId);

        const textPadding = 7;
    
        const margin = {top:30, right: 10, bottom: 10, left: 90},
            width = graphWidth - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
    
        addTitle(divId, title);
        addSubtitle(divId, subtitle);
        
    
        const svg = d3.select(divId)
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
        const g = svg.append("g")
            .attr("transform",
                "translate(0," + margin.top + ")");
    
        const x = d3.scaleLinear()
            .range([margin.left, margin.left + width / 2 - 10]);

        const x2 = d3.scaleLinear()
            .range([margin.left + width/2 + 10, margin.left + width])
    
        const y = d3.scaleBand()
            .range([0, height])
            .padding(.15);
    
        x.domain([0, d3.max(spend, d => Math.max(d['UA Spend'], d['Revenue']))]);
        x2.domain([0, d3.max(spend, d => Math.max(d['UA Spend'], d['Revenue']))])
        y.domain(spend.map(d => d[ylabel]));

        console.log(x.domain(), x.range())
    
        g.select('.y-axis').select(".domain").remove();
        g.select('.y-axis').selectAll(".tick line").remove();
    
        g.selectAll(".country-name")
            .data(spend)
            .join("text")
                .attr("class", "country-name")
                .attr("x", 0 )
                .attr("y", d => y(d[ylabel]) + y.bandwidth() / 2 + 2)
                .style("dominant-baseline", "middle")
                .style("font-family", "Montserrat")
                .style("font-size", "14px")
                .text(d => d[ylabel]);
    
        // SPEND
        g.selectAll(".title-spend")
            .data(['Spend'])
            .join("text")
                .attr("class", "title-spend")
                .attr("x", x(0) )
                .attr("y", margin.top - 48)
                .style("dominant-baseline", "middle")
                .style("font-family", "Montserrat")
                .style("font-size", "14px")
                .style("font-weight", 700)
                .text(d => d);
    
        g.selectAll(".bar-spend")
            .data(spend)
            .join("rect")
                .attr("class", "bar-spend")
                .attr("x", x(0) )
                .attr("y", d => y(d[ylabel]))
                .attr("width", d => x(d['UA Spend']) - x(0))
                .attr("height", y.bandwidth() )
                .attr("fill", d => d[ylabel] === 'Others' ? "#ECEDEE" : "#D9D9D9");
    
        g.selectAll(".percentage-spend")
            .data(spend)
            .join("text")
                .attr("class", "percentage-spend")
                .attr("x", d => {
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === 'Others')) {
                        return x(d['UA Spend']) - textPadding;
                    } else {
                        return x(d['UA Spend']) + textPadding;
                    }
                })
                .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                .style("dominant-baseline", "middle")
                .style("font-family", "Spacegrotesk")
                .style("font-size", "14px")
                .style("text-anchor", d => {
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === 'Others')) {
                        return 'end';
                    } else {
                        return 'start';
                    }
                })
                .style("fill",'#000000')
                .text(d => (d['UA Spend'] * 100).toFixed(1) + '%');
    
        // REVENUE
        g.selectAll(".title-revenue")
            .data(['Revenue'])
            .join("text")
                .attr("class", "title-revenue")
                .attr("x", x2(0) )
                .attr("y", margin.top - 48)
                .style("dominant-baseline", "middle")
                .style("font-family", "Montserrat")
                .style("font-size", "14px")
                .style("font-weight", 700)
                .text(d => d);
    
        g.selectAll(".bar-revenue")
            .data(spend)
            .join("rect")
                .attr("class", "bar-revenue")
                .attr("x", x2(0) )
                .attr("y", d => y(d[ylabel]))
                .attr("width", d => x2(d['Revenue']) - x2(0))
                .attr("height", y.bandwidth() )
                .attr("fill", d => d[ylabel] === 'Others' ? "#ADD7F4" : "#0280FB");
    
        g.selectAll(".percentage-revenue")
            .data(spend)
            .join("text")
                .attr("class", "percentage-revenue")
                .attr("x", d => {
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === 'Others')) {
                        return x2(d['Revenue']) - textPadding;
                    } else {
                        return x2(d['Revenue']) + textPadding;
                    }
                })
                .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                .style("dominant-baseline", "middle")
                .style("font-family", "Spacegrotesk")
                .style("font-size", "14px")
                .style("text-anchor", d => {
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === 'Others')) {
                        return 'end';
                    } else {
                        return 'start';
                    }
                })
                .style("fill", d => d[ylabel] === labelForUS ? '#FFFFFF' : '#000000')
                .text(d => (d['Revenue'] * 100).toFixed(1) + '%');
    
        addSources(divId, sources);
        // fixWidth(divId);
        
    }
    
    
    Promise.all([
        d3.csv("https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz4.csv")
    ]).then((data) => {            
    
        data[0].forEach(d => {
            d['Percentage revenue'] = +d['Percentage revenue'];
        });
    
        drawBars4(data[0],
            divId = "#geo-viz4",
            xlabel = 'Percentage revenue',
            ylabel = 'Market full name',
            title = "Marketing spend and total in-app purchase revenue is aligned in most countries",
            subtitle = "Mobile gaming (IAP) user acquisition compared to mobile gaming (IAP) D7 revenue",
            sources = "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025) & Moloco advertiser total gaming IAP revenue (organic and paid) by market (Sep 2023 to August 2024). Spend in mainland China is excluded from </br>this analysis, but spend by mobile gaming apps based in China in non-domestic markets is included."
        )
        
    })
}

drawViz4();