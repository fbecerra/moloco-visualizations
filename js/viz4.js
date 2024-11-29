function drawViz4(dataSource, divId, xlabel, ylabel, title, subtitle, sources,
    labelForUS, spendLabel, revenueLabel, othersLabel
) {
    const drawBars4 = (spend, divId, xlabel, ylabel, title, subtitle, sources, 
        labelForUS, spendLabel, revenueLabel, othersLabel
    ) => {
        const graphWidth = Math.min(Math.min(window.innerWidth, screen.width) - 40, 600);

        clearDiv(divId);
        centerDiv(divId);

        const textPadding = 7;
    
        const margin = {top:30, right: 10, bottom: 10, left: 100},
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
            .data([spendLabel])
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
                .attr("fill", d => d[ylabel] === othersLabel ? "#ECEDEE" : "#D9D9D9");
    
        g.selectAll(".percentage-spend")
            .data(spend)
            .join("text")
                .attr("class", "percentage-spend")
                .attr("x", d => {
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === othersLabel)) {
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
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === othersLabel)) {
                        return 'end';
                    } else {
                        return 'start';
                    }
                })
                .style("fill",'#000000')
                .text(d => (d['UA Spend'] * 100).toFixed(1) + '%');
    
        // REVENUE
        g.selectAll(".title-revenue")
            .data([revenueLabel])
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
                .attr("fill", d => d[ylabel] === othersLabel ? "#ADD7F4" : "#0280FB");
    
        g.selectAll(".percentage-revenue")
            .data(spend)
            .join("text")
                .attr("class", "percentage-revenue")
                .attr("x", d => {
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === othersLabel)) {
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
                    if ((d[ylabel] === labelForUS) || (d[ylabel] === othersLabel)) {
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
        d3.csv(dataSource)
    ]).then((data) => {            
    
        data[0].forEach(d => {
            d['Percentage revenue'] = +d['Percentage revenue'];
        });
    
        drawBars4(data[0],divId, xlabel, ylabel, title, subtitle, sources,
            labelForUS, spendLabel, revenueLabel, othersLabel)
        
    })
}

const urlPath4 = window.location.pathname;
if (urlPath4.includes('/ja/')) {
    drawViz4(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz4-ja.csv",
        divId = "#geo-viz4",
        xlabel = 'Percentage revenue',
        ylabel = 'Market full name',
        title = "マーケティング費用とアプリ内購入の総収益がほとんどの国で一致",
        subtitle = "モバイルゲーム（IAP）のユーザー獲得コストとD7 の収益（最初の7日間の収益）の比較",
        sources = "データソース：Molocoによる2025年のモバイルゲーム （アプリ内購入）におけるユーザー獲得コストの推定および2023年9月～2024年9月におけるMoloco広告主の市場別ゲームアプリ内購入による総収益（オーガニックおよび有料）。中国本土での支出は分析の対象外ですが、中国を拠点とするモバイルゲームアプリによる国外市場での支出は含まれています。",
        labelForUS = '米国',
        spendLabel = 'ユーザー獲得支出',
        revenueLabel = 'IAP収益',
        othersLabel = 'その他',
    );
} else if (urlPath4.includes('/zh/')) {
    drawViz4(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz4-zh.csv",
        divId = "#geo-viz4",
        xlabel = 'Percentage revenue',
        ylabel = 'Market full name',
        title = "大多数国家和地区的营销支出和总 App 内购买收益成正比",
        subtitle = "移动游戏（应用内购买，IAP）用户获取支出与移动游戏（应用内购买，IAP）第七天收益对比",
        sources = "来源：Moloco 预估的移动游戏 应用内购买（IAP）用户获取支出（2025 年） & Moloco 广告主在各市场的总游戏应用内购买（IAP） 收益（包括自然和付费渠道）数据（2023 年 9 月到 2024 年 9 月）。本分析不包含在中国大陆的投放，但包括中国本土的移动游戏 App 在海外市场的投放。",
        labelForUS = '美国',
        spendLabel = '支出',
        revenueLabel = '应用内购买收入',
        othersLabel = '其他',
    );
} else if (urlPath4.includes('/ko/')) {
    drawViz4(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz4-ko.csv",
        divId = "#geo-viz4",
        xlabel = 'Percentage revenue',
        ylabel = 'Market full name',
        title = "대부분 국가에서 일치하는 마케팅 지출과 총 IAP 매출",
        subtitle = "모바일 게임(IAP) UA 지출과 모바일 게임(IAP) D7 매출 비교",
        sources = "출처: 몰로코의 모바일 게이밍(IAP) UA 지출 추정치(2025년) 및 몰로코 광고주의 시장별 총 게임 IAP 매출(오가닉 및 페이드, 2023년 9월~2024년 9월 기준). 중국 본토 내 광고 비용은 제외되었으나 중국 기반 모바일 게임 앱의 해외 시장 광고 비용은 포함합니다.",
        labelForUS = '미국',
        spendLabel = 'UA 지출',
        revenueLabel = 'IAP 매출',
        othersLabel = 'Others',
    );
} else {
    drawViz4(
        dataSource = "https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz4.csv",
        divId = "#geo-viz4",
        xlabel = 'Percentage revenue',
        ylabel = 'Market full name',
        title = "Marketing spend and total in-app purchase revenue are aligned in most countries and regions",
        subtitle = "Mobile gaming (IAP) user acquisition spend compared to mobile gaming (IAP) D7 revenue",
        sources = "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025) & Moloco advertiser total gaming IAP revenue (organic and paid) by market (September 2023 to September 2024). Spend in mainland China is excluded from this analysis, but spend by mobile gaming apps based in China in non-domestic markets is included.",
        labelForUS = 'U.S.',
        spendLabel = 'Spend',
        revenueLabel = 'IAP revenue',
        othersLabel = 'Others',
    );
}


