function drawViz7() {

    const windowWidth = screen.width;
    const smallScreen = windowWidth < 700;

    clearDiv("#geo-viz7");
    centerDiv("#geo-viz7");

    const gray = '#ECEDEE';
    const blue = '#0280FB';
    const darkerGray = "#808080";

    const main = d3.select("#geo-viz7")
        .style("font-family", 'Montserrat')
        .style("font-size", '14px')
        .style("max-width", smallScreen ? "95%" : "80%")
        .style("margin", "auto");

    const scrolly = main.append("section")
            .attr("id", "scrolly");

    const figure = scrolly.append("figure")
        .attr("id", "figure")
        .style("margin-bottom", smallScreen ? "50%" : "45%");

    figure.append("div")
        .attr("id", "title-wrapper");

    addTitle("#title-wrapper", "Top payers drive the majority of total IAP revenue");
    addSubtitle("#title-wrapper", "Top payers drive the majority of total IAP revenue/ Let’s take a look at total (D7 IAP) revenue for the RPG genre in a selection of global markets.")

    d3.select("#title-wrapper")
        .style("max-width", "700px")
        .style("margin", "auto");

    const article = scrolly.append("article")
        .style("pointer-events", "none");

    const paragraphs = ['', '<p>The top 2% of paying users generate roughly 35% to 45% of total in-app purchase revenue, a trend that broadly holds across different market sizes and genres.<br>Hover over market to see D7 ARPPU for top 2% of payers.</p>',
        '<p>The top 10% of paying users account for 70% to 85% of total IAP revenue.</p>'
    ]

    paragraphs.forEach((d, i) => {
        article.append("div")
            .attr("class", "step")
            .attr("data-step", `${i + 1}`)
            .attr("id", `step-${i+1}`)
            .html(d)
    })

    var step = article.selectAll(".step")
        .style("pointer-events", "none");

    step.selectAll("p")
        .style("padding", smallScreen ? "10px" : "60px 100px")

    const scroller = scrollama();


    Promise.all([
        d3.csv('https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz7.csv')
    ]).then((data) => {
        const countries = data[0];
        countries.forEach(d => {
            d['Relative Size of Bubble (Market Size)'] = + d['Relative Size of Bubble (Market Size)'];
            d['Revenue (percentage of coloured bubbles)'] = + d['Revenue (percentage of coloured bubbles)'];
            d['Median ARRPU'] = + d['Median ARRPU'];
        })

        let filteredData = countries.filter(d => d['Payers group'] === 'top 10%');
        let colorFunction = d => d.children ? "white" : gray;

        const width = Math.min(windowWidth - 40, 1000);
            height = width / 1000 * 600;

        const size = smallScreen ? [width, height] : [width - 180, height + 200];
        const viewBox = smallScreen ? `0 0 ${width} ${height}` : `0 60 ${width} ${height + 80}`;

        const pack = data => d3.pack()
            .size(size)
            .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value))

        const svg = figure.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", viewBox)
            .style("display", "block")
            .style("margin", "0 -14px");

        function handleResize() {
            // 1. update height of step elements
            var stepH = smallScreen ? Math.floor(window.innerHeight * 0.7) : Math.floor(window.innerHeight * 1);
            step.style("height", stepH + "px");
    
            var figureHeight = height / 2;
            var figureMarginTop = 156; //(window.innerHeight - figureHeight) / 2;
    
            figure
                .style("height", figureHeight + "px")
                .style("top", figureMarginTop + "px");
    
            // 3. tell scrollama to update new element dimensions
            scroller.resize();
        }
    
        function handleStepEnter(response) {
            // response = { element, direction, index }
    
            // add color to current step only
            step.classed("is-active", function (d, i) {
                return i === response.index;
            });
    
            // update graphic based on step

            if (response.index === 0) {
                colorFunction = d => d.children ? "white" : gray;
            } else {
                colorFunction = d => d.children ? "white" : d.data.index < d.data.revenue ? blue : gray;
            }
            if (response.index === 2) {
                filteredData = countries.filter(d => d['Payers group'] === 'top 10%')
            } else {
                filteredData = countries.filter(d => d['Payers group'] === 'top 2%')
            }
            tooltip.style("display", "none");
            updatePlot(response.index);
        }

        function init() {

			// 1. force a resize on load to ensure proper dimensions are sent to scrollama
			handleResize();

			// 2. setup the scroller passing options
			// 		this will also initialize trigger observations
			// 3. bind scrollama event handlers (this can be chained like below)
			scroller
				.setup({
					step: "#scrolly article .step",
					offset: 0.9,
					debug: false
				})
				.onStepEnter(handleStepEnter);
		}

        init();

        const node = svg.append("g")
            .selectAll("circle");

        const label = svg.append("g")
            .selectAll(".label")

        const tooltip = svg.append("g");

        const rect = tooltip.append("rect")
            .attr("height", '32px')
            .attr("width", '80px')
            .attr("fill", "#0280FB");

        const triangle = tooltip.append("path")
            .attr("d", "M30 30 L50 30 L40 40 z")
            .attr("fill", "#0280FB")

        const text = tooltip.append('text')
            .attr("fill", "#FFF")
            .attr("y", 22)
            .attr("x", 40)
            .attr("text-anchor", "middle")
            .style("font-family", 'Spacegrotesk')
            .style("font-size", "16px")
            .style("font-weight", 700);

        function updatePlot(index) {
            const circleData = {
                'name': '',
                'children': filteredData.map(d => {
                    return {
                        'name': d.Market,
                        'children': d3.range(100).map(child => {
                            return {
                                'name': `${d.Market}-${child}`,
                                'index': child,
                                'value': d['Relative Size of Bubble (Market Size)']/100,
                                'revenue': (d['Revenue (percentage of coloured bubbles)'] * 100).toFixed(0)
                            }
                        })
                    }
                })
            }

            const root = pack(circleData);

            node.data(root.descendants().slice(1))
                .join("circle")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", d => d.r)
                    .attr("fill", colorFunction)
                    .attr("stroke", d => d.children ? darkerGray : "none")
                    .style("pointer-events", d => d.children ? 'all' : 'none')
                    .on("mousemove", (evt, d) => {
                        if (d.hasOwnProperty('children') & index !== 0) {
                            const thisCountry = filteredData.filter(fd => fd.Market === d.data.name)[0];

                            tooltip.attr("transform", `translate(${d.x-40},${d.y - d.r - 10 - 32})`)
                                .style("display", "block")

                            text.text(`$${thisCountry['Median ARRPU'].toFixed(1)}`);
                        }
                    })
                    .on("mouseout", (evt, d) => {
                        if (d.hasOwnProperty('children') & index !== 0) {
                            tooltip.style("display", "none");
                        }
                    });

            label.data(root.descendants().filter(d => d.children))
                .join("text")
                .attr("class", "label")
                .attr("x", d => {
                    if (d.data.name === 'U.S.') {
                        return d.x - 0.8 * d.r
                    } else if (d.data.name === 'Mexico') {
                        return d.x + 0.7 * d.r
                    } else if (d.data.name === 'Japan') {
                        return d.x + 0.75 * d.r
                    } else if (d.data.name === 'Italy') {
                        return d.x - 1.1 * d.r
                    } else if (d.data.name === 'Indonesia') {
                        return d.x - 0.5 * d.r
                    } else if (d.data.name === 'Germany') {
                        return d.x + 0.8 * d.r
                    }
                })
                .attr("y", d => {
                    if (d.data.name === 'U.S.') {
                        return d.y - 0.8 * d.r
                    } else if (d.data.name === 'Mexico') {
                        return d.y - d.r
                    } else if (d.data.name === 'Japan') {
                        return d.y - 0.75 * d.r
                    } else if (d.data.name === 'Italy') {
                        return d.y - d.r
                    } else if (d.data.name === 'Indonesia') {
                        return d.y - 1.1 * d.r 
                    } else if (d.data.name === 'Germany') {
                        return d.y + 0.8 * d.r
                    }
                })
                .attr("fill", darkerGray)
                .text(d => d.children ? d.data.name : '');
        }

        updatePlot();

        addSources("#geo-viz7", "Source: RPG total gaming IAP revenue by user (organic and paid, 7-day sample period in July 2024).");

        d3.select("#geo-viz7 .sources")
            .style("max-width", "700px")
            .style("margin", "16px auto 0 auto");
        
    })
}

drawViz7();
