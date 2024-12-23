function drawViz1(dataSource, divId, xlabels, ylabel, colors, title, subtitle, sources, othersLabel,
    operatingSystem, iOS, android
) {
    const drawBars1 = (spend, divId, xlabels, ylabel, colors, title, subtitle, sources, othersLabel,
        operatingSystem, iOS, android
    ) => {
        const graphWidth = Math.min(Math.min(window.innerWidth, screen.width) - 40, 600);

        clearDiv(divId);
        centerDiv(divId);
        const textPadding = 7;
    
        const margin = {top: 10, right: 10, bottom: 10, left: 100},
            width = graphWidth - margin.left - margin.right,
            height = 460 - margin.top - margin.bottom;
    
        addTitle(divId, title);
        addSubtitle(divId, subtitle);
        addLegend(divId, operatingSystem, iOS, android);

        const tooltip = d3.select(divId)
            .style("position", "relative")
            .append("div")
            .attr("class", "viz-tooltip")
            .style("position", "absolute")
            .style("font-family", "Montserrat")
            .style("font-size", "14px")
            .style("font-weight", 400)
            .style("padding", "4px 6px")
            .style("display", "none")
            .html('');
    
        const svg = d3.select(divId)
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
        const g = svg.append("g")
            .attr("transform",
                "translate(0," + margin.top + ")");
    
        const subgroups = xlabels;
        const groups = spend.map(d => d[ylabel]);
    
        const series = d3.stack()
            .keys(subgroups)
            (spend)
    
        const x = d3.scaleLinear()
            .range([margin.left, width]);
    
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
                .attr("fill", d => d.data[ylabel] === othersLabel ? (d.data.key === 'iOS' ? "#CCC" : "#ECEDEE") : "")
                .on("mousemove", (evt, d) => {
                    const pClass = d.data[ylabel] === othersLabel ? (d.data.key === 'iOS' ? "otheriOS" : "otherAndroid") : d.data.key;
                    tooltip.style("display", "inline-block")
                        .style("background-color", d.data[ylabel] === othersLabel ? (d.data.key === 'iOS' ? "#CCC" : "#ECEDEE") : color(d.data.key))
                        .style("color", d.data[ylabel] === 'Others' ? "#000" : "#FFF")
                        .html(`<span class="${pClass}" style="font-family: 'Spacegrotesk';font-size: 14px;font-weight: 400;">${d.data.key}: ${(d.data[d.data.key] * 100).toFixed(1)}%</span>`);

                    const tooltipWidth = tooltip.node().getBoundingClientRect().width;
                    const tooltipHeight = tooltip.node().getBoundingClientRect().height;

                    tooltip.style("left", `${evt.layerX - tooltipWidth/2}px`)
                        .style("top", `${evt.layerY - tooltipHeight - 18}px`);
                })
                .on("mouseout", (evt, d) => {
                    tooltip.style("display", "none");
                });
    
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
                .attr("x", 0 )
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
                .style("font-family", "Spacegrotesk")
                .style("font-size", "14px")
                .style("text-anchor", 'start')
                .style("fill", '#000000')
                .text(d => (d['Total'] * 100).toFixed(1) + '%');
    
        addSources(divId, sources);  
        
    }
    
    Promise.all([
        d3.csv(dataSource),
    ]).then((data) => {            
    
        data[0].forEach(d => {
            d.Android = +d.Android;
            d.iOS = +d.iOS;
            d.Total = +d.Total;
        });
    
        drawBars1(data[0], divId, xlabels, ylabel, colors, title, subtitle, sources, othersLabel, operatingSystem, iOS, android)
    })
}

const urlPath = window.location.pathname;
if (urlPath.includes('/ja/')) {
    drawViz1(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz1-ja.csv",
        divId = "#geo-viz1",
        xlabels = ['iOS', 'Android'], // Column names
        ylabel = 'Market full name', // Column name
        colors = ["#040078", "#558FC9"],
        title = "モバイルゲームにおけるユーザー獲得コストの約4分の3が10カ国に集中",
        subtitle = "2025年の国別ユーザー獲得コスト（推定）の内訳",
        sources = "データソース：Molocoによる2025年のモバイルゲーム （IAP）におけるユーザー獲得コストの推定。Molocoは、有料ユーザーの獲得コストを推定するためにさまざまなインプットを使用しています。これには、Sensor Towerの一部であるdata.aiからのインストールデータ、有料対オーガニックの推定比率、特定のアプリ市場の実際または推定のCPIが含まれます。中国本土での支出は除外されていますが、中国を拠点とするモバイルゲームアプリによる国外市場での支出は含まれています。",
        othersLabel = 'Others', // Market full name label for 'Others'
        operatingSystem = 'オペレーションシステム',
        iOS = 'iOS',
        android = 'Android'
    );
} else if (urlPath.includes('/zh/')) {
    drawViz1(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz1-zh.csv",
        divId = "#geo-viz1",
        xlabels = ['iOS', 'Android'],
        ylabel = 'Market full name',
        colors = ["#040078", "#558FC9"],
        title = "近四分之三的移动游戏用户获取支出集中在  10 个国家",
        subtitle = "2025 年各国预计用户获取支出集中程度",
        sources = "来源：Moloco 预估的移动游戏应用内购买（IAP）用户获取支出（2025年）。Moloco 结合多项指标预估付费 UA 支出，包括来自 Sensor Tower 旗下 data.ai 的安装数据、付费及自然用户获取比例的预估，以及特定 App 类别的实际或预估的每次安装成本（CPI）。本分析不包含在中国大陆市场的投放，但包括中国本土移动游戏 App 在海外市场的投放。",
        othersLabel = '其他',
        operatingSystem = '操作系统',
        iOS = 'iOS',
        android = '安卓'
    );
} else if (urlPath.includes('/ko/')) {
    drawViz1(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz1-ko.csv",
        divId = "#geo-viz1",
        xlabels = ['iOS', 'Android'],
        ylabel = 'Market full name',
        colors = ["#040078", "#558FC9"],
        title = "모바일 게임 UA 지출의 약 3/4은 10개국에 집중",
        subtitle = "2025년 국가별 유저 확보 지출 집중도 추정치",
        sources = "출처: 몰로코의 모바일 게임(IAP) UA 지출 추정치(2025년)<br>몰로코는 페이드 UA 지출을 추정하기 위해 data.ai(센서타워)의 앱 설치 데이터, 페이드 및 오가닉 비율 추정치, 특정 앱 세그먼트의 실제 또는 추정 CPI 등 다양한 정보를 활용했습니다. 본 분석에서는 중국 본토에서 발생한 광고 지출은 제외되었으나, 중국 기반 모바일 게임의 해외 시장 광고 지출은 포함됩니다.",
        othersLabel = 'Others',
        operatingSystem = '운영체제(OS)',
        iOS = 'iOS',
        android = '안드로이드'
    );
} else {
    drawViz1(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz1.csv",
        divId = "#geo-viz1",
        xlabels = ['iOS', 'Android'],
        ylabel = 'Market full name',
        colors = ["#040078", "#558FC9"],
        title = "Almost three-quarters of user acquisition spend for mobile gaming is concentrated in ten countries",
        subtitle = "2025 estimated user acquisition spend concentration by country",
        sources = "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025). Moloco uses a number of inputs to estimate paid UA spend, including install data sourced from data.ai, a Sensor Tower company, assumptions on paid vs. organic ratios, and actual or estimated CPIs for specific app segments. Spend in mainland China is excluded from this analysis, but spend by mobile gaming apps based in China in non-domestic markets is included.",
        othersLabel = 'Others',
        operatingSystem = 'Operating System',
        iOS = 'iOS',
        android = 'Android'
    );
}
