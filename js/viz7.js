function drawViz7(dataSource, divId, title, subtitle, sources, paragraphs, arppuLabel, countryLabels) {

    const windowWidth = Math.min(window.innerWidth, screen.width);
    const smallScreen = windowWidth < 700;

    clearDiv(divId);
    centerDiv(divId);

    const gray = '#ECEDEE';
    const blue = '#0280FB';
    const darkerGray = "#808080";

    const main = d3.select(divId)
        .style("font-family", 'Montserrat')
        .style("font-size", '14px')
        .style("max-width", smallScreen ? "100%" : "80%")
        .style("margin", "auto");

    const scrolly = main.append("section")
            .attr("id", "scrolly");

    const figure = scrolly.append("figure")
        .attr("id", "figure")
        .style("margin-bottom", smallScreen ? "120%" : "45%");

    figure.append("div")
        .attr("id", "title-wrapper");

    addTitle("#title-wrapper", title);
    addSubtitle("#title-wrapper", subtitle)

    d3.select("#title-wrapper")
        .style("max-width", "700px")
        .style("margin", "auto");

    const article = scrolly.append("article")
        .style("pointer-events", "none");

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
        d3.csv(dataSource)
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
            height = smallScreen ? width / 3 * 4 : width / 1000 * 600;

        const size = smallScreen ? [width, height] : [width - 180, height + 200];
        const viewBox = smallScreen ? `0 0 ${width + 40} ${height}` : `0 60 ${width} ${height + 80}`;

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
            var figureMarginTop = smallScreen ? 76 : 156; //(window.innerHeight - figureHeight) / 2;
    
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
            .attr("transform", "translate(20,0)")
            .selectAll("circle");

        const label = svg.append("g")
            .attr("transform", "translate(20,0)")
            .selectAll(".label")

        const tooltip = svg.append("g");

        const rect = tooltip.append("rect")
            .attr("height", '32px')
            .attr("width", '120px')
            .attr("fill", "#0280FB");

        const triangle = tooltip.append("path")
            .attr("d", "M50 30 L70 30 L60 40 z")
            .attr("fill", "#0280FB")

        const text = tooltip.append('text')
            .attr("fill", "#FFF")
            .attr("y", 22)
            .attr("x", 60)
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

                            tooltip.attr("transform", `translate(${d.x-60},${d.y - d.r - 10 - 32})`)
                                .style("display", "block")

                            text.text(`${arppuLabel}: $${thisCountry['Median ARRPU'].toFixed(1)}`);
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
                        return smallScreen ? d.x - 0.8 * d.r : d.x - 0.8 * d.r
                    } else if (d.data.name === 'Mexico') {
                        return smallScreen ? d.x - 2 * d.r : d.x + 0.7 * d.r
                    } else if (d.data.name === 'Japan') {
                        return smallScreen ? d.x + 0.25 * d.r : d.x + 0.75 * d.r
                    } else if (d.data.name === 'Italy') {
                        return smallScreen ? d.x - 1.2 * d.r : d.x - 1.1 * d.r
                    } else if (d.data.name === 'Indonesia') {
                        return smallScreen ? d.x - 0.5 * d.r : d.x - 0.5 * d.r
                    } else if (d.data.name === 'Germany') {
                        return smallScreen ? d.x + 0.2 * d.r : d.x + 0.8 * d.r
                    }
                })
                .attr("y", d => {
                    if (d.data.name === 'U.S.') {
                        return smallScreen ? d.y - d.r : d.y - 0.8 * d.r
                    } else if (d.data.name === 'Mexico') {
                        return smallScreen ? d.y + 1.6 * d.r : d.y - d.r
                    } else if (d.data.name === 'Japan') {
                        return smallScreen ? d.y - 1.1 * d.r : d.y - 0.75 * d.r
                    } else if (d.data.name === 'Italy') {
                        return smallScreen ? d.y - 1.2 * d.r : d.y - d.r
                    } else if (d.data.name === 'Indonesia') {
                        return smallScreen ? d.y - 1.2 * d.r : d.y - 1.1 * d.r 
                    } else if (d.data.name === 'Germany') {
                        return smallScreen ? d.y + 1.4 * d.r : d.y + 0.8 * d.r
                    }
                })
                .attr("fill", darkerGray)
                .text(d => d.children ? countryLabels[d.data.name] : '');
        }

        updatePlot();

        addSources(divId, sources);

        d3.select(`${divId} .sources`)
            .style("max-width", "700px")
            .style("margin", "16px auto 0 auto");
        
    })
}

const urlPath7 = window.location.pathname;
if (urlPath7.includes('/ja/')) {
    drawViz7(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz7-ja.csv',
        divId = "#geo-viz7",
        title = "上位の有料ユーザーがIAPによる総収益の大部分を占めている",
        subtitle = "価値の高いユーザーはメジャーな市場に限られているわけではなく、世界中のいたる所に存在します。ほとんどの市場においてこれらの上位有料ユーザーがIAPによる総収益の大きな部分を占めています。この点について分かりやすく説明するため、世界の一部の市場におけるRPGジャンルのD7（最初の7日間）のIAP収益を詳しく見てみましょう。<br><br>市場にカーソルを合わせるとD7 ARPPU（最初の7日間のARPPU）が表示されます。",
        sources = "データソース：RPGのゲーマーによるIAP収益の合計（オーガニックおよび有料、2024年7月における7日間のサンプル期間）",
        paragraphs = [
            '', 
            '<p>IAP収益全体の約35～45%が有料ユーザーの上位2%によるもの<br>であり、この傾向は市場規模やジャンルが異なっても<br>ほぼ共通していました。</p>',
            '<p>有料ユーザーの上位10%が、IAP収益全体の70～85%を<br>占めています。</p>'
        ],
        arppuLabel = 'ARPPU',
        countryLabels = { // No need to change country names in the data
            'U.S.': '米国',
            'Mexico': 'メキシコ',
            'Japan': '日本',
            'Italy': 'イタリア',
            'Indonesia': 'インドネシア',
            'Germany': 'ドイツ'
        }
    );
} else if (urlPath7.includes('/zh/')) {
    drawViz7(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz7-zh.csv',
        divId = "#geo-viz7",
        title = "少数高价值用户贡献了大部分应用内购买（IAP）收益",
        subtitle = "高价值用户并不只存在于大家熟知的市场，而是散落在全球各个角落。在大多数市场里，付费最多的一小部分用户支撑起了总应用内购买（IAP）收益的极大份额。为了更好地展现这点，我们来看看角色扮演游戏（RPG）在不同地区市场里的第七天应用内购买（D7 IAP）收益。<br><br>鼠标悬停在市场上以查看第七天每付费用户平均收益（D7 ARPPU）",
        sources = "来源：角色扮演游戏（RPG）的每用户总应用内购买（IAP）收益（自然和付费渠道，来自2024 年 7 月的七天样本 ）。",
        paragraphs = [
            '', 
            '<p>前 2% 的付费用户贡献了 35% 到 45% 的总应用内购买（IAP）收益，其他市场和 App 类型也大多呈现这一趋势。<br>美国｜意大利｜印度尼西亚｜墨西哥｜日本｜德国</p>',
            '<p>前 10% 的付费用户贡献了 70% 至 85% 的总应用内购买（IAP）收益。<br>美国｜意大利｜印度尼西亚｜墨西哥｜日本｜德国</p>'
        ],
        arppuLabel = '每付费用户平均收益',
        countryLabels = { // No need to change country names in the data
            'U.S.': '美国',
            'Mexico': '墨西哥',
            'Japan': '日本',
            'Italy': '意大利',
            'Indonesia': '印度尼西亚',
            'Germany': '德国'
        }
    );
} else if (urlPath7.includes('/ko/')) {
    drawViz7(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz7-ko.csv',
        divId = "#geo-viz7",
        title = "Top payers drive the majority of total IAP revenue",
        subtitle = "High-value users aren’t confined to well-known markets — they can be found in every corner of the globe. In most markets, the top-paying users account for a disproportionate share of total IAP revenue. To illustrate this, let’s take a closer look at D7 IAP revenue for the RPG genre across a selection of global markets.<br><br>Hover over market to see D7 ARPPU.",
        sources = "Source: RPG total gaming IAP revenue by user (organic and paid, 7-day sample period in July 2024).",
        paragraphs = [
            '', 
            '<p>The top 2% of paying users generate roughly 35% to 45% of total IAP revenue, a trend that broadly holds across different market sizes and genres.</p>',
            '<p>The top 10% of paying users account for 70% to 85% of total IAP revenue.</p>'
        ],
        arppuLabel = 'ARPPU',
        countryLabels = { // No need to change country names in the data
            'U.S.': '미국',
            'Mexico': '멕시코',
            'Japan': '일본',
            'Italy': '이탈리아',
            'Indonesia': '인도네시아',
            'Germany': '독일'
        }
    );
} else {
    drawViz7(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz7.csv',
        divId = "#geo-viz7",
        title = "Top payers drive the majority of total IAP revenue",
        subtitle = "High-value users aren’t confined to well-known markets — they can be found in every corner of the globe. In most markets, the top-paying users account for a disproportionate share of total IAP revenue. To illustrate this, let’s take a closer look at D7 IAP revenue for the RPG genre across a selection of global markets.<br><br>Hover over market to see D7 ARPPU.",
        sources = "Source: RPG total gaming IAP revenue by user (organic and paid, 7-day sample period in July 2024).",
        paragraphs = [
            '', 
            '<p>The top 2% of paying users generate roughly 35% to 45% of total IAP revenue, a trend that broadly holds across different market sizes and genres.</p>',
            '<p>The top 10% of paying users account for 70% to 85% of total IAP revenue.</p>'
        ],
        arppuLabel = 'ARPPU',
        countryLabels = { // No need to change country names in the data
            'U.S.': 'U.S.',
            'Mexico': 'Mexico',
            'Japan': 'Japan',
            'Italy': 'Italy',
            'Indonesia': 'Indonesia',
            'Germany': 'Germany'
        }
    );
}


