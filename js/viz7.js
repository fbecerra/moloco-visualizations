function drawViz7() {

    const gray = '#ECEDEE';
    const blue = '#0280FB';
    const darkerGray = "#808080";

    const main = d3.select("#geo-viz7")
        .style("font-family", 'Montserrat')
        .style("font-size", '14px')
        .style("max-width", "80%")
        .style("margin", "auto");

    const scrolly = main.append("section")
            .attr("id", "scrolly");

    const figure = scrolly.append("figure");

    const article = scrolly.append("article");

    const paragraphs = ['', '<p>The top 2% of paying users generate between XX and XX% of total in-app purchase revenue, a trend that holds true across different market sizes and gaming genres.</br><span class="bold-text">Hover over a country to see the user value ($)</span></p>',
        '<p>Similarly, the top 10% of paying users account for XX% of IAP revenue.</p>'
    ]

    paragraphs.forEach((d, i) => {
        article.append("div")
            .attr("class", "step")
            .attr("data-step", `${i + 1}`)
            .attr("id", `step-${i+1}`)
            .html(d)
    })

    var step = article.selectAll(".step");

    const scroller = scrollama();


    Promise.all([
        d3.csv('./data/data-viz7.csv')
    ]).then((data) => {
        const countries = data[0];
        countries.forEach(d => {
            d['Relative Size of Bubble (Market Size)'] = + d['Relative Size of Bubble (Market Size)'];
            d['Revenue (percentage of coloured bubbles)'] = + d['Revenue (percentage of coloured bubbles)'];
            d['Median ARRPU'] = + d['Median ARRPU'];
        })

        let filteredData = countries.filter(d => d['Payers group'] === 'top 10%');
        let colorFunction = d => d.children ? "white" : gray;

        const width = 1000,
            height = 800;

        const pack = data => d3.pack()
            .size([width, height])
            .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value))

        const svg = figure.append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("display", "block")
            .style("margin", "0 -14px");

        function handleResize() {
            // 1. update height of step elements
            var stepH = Math.floor(window.innerHeight * 1);
            step.style("height", stepH + "px");
    
            var figureHeight = height / 2;
            var figureMarginTop = 20; //(window.innerHeight - figureHeight) / 2;
    
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
            updatePlot();
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

        function updatePlot() {
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

            const node = svg.append("g")
                .selectAll("circle")
                .data(root.descendants().slice(1))
                .join("circle")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", d => d.r)
                    .attr("fill", colorFunction)
                    .attr("stroke", d => d.children ? darkerGray : "none");

            const label = svg.append("g")
                .selectAll("text")
                .data(root.descendants())
                .join("text")
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
        
    })
}

drawViz7();