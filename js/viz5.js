function drawViz5(dataSource, divId, title, subtitle, selectLabels, sources,
    selectedGenre, selectedOS, allSystems, android, iOS
) {
    clearDiv(divId);
    centerDiv(divId);
    addTitle(divId, title)   
    addSubtitle(divId, subtitle);

    const dropdowns = d3.select(divId)
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
            .html(selectLabels[d]);
            
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

    const graphWidth = Math.min(Math.min(window.innerWidth, screen.width) - 40, 660);

    const margin = {top: 10, right: 60, bottom: 10, left: 120},
        width = graphWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select(divId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    addSources(divId, sources);

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
        d3.csv(dataSource)
    ]).then((data) => {
        const revenue = data[0];

        revenue.forEach(d => {
            d['Android'] = +d['Android'];
            d['iOS'] = +d['iOS'];
            d['Total'] = +d['Total'];
        });

        const updatePlot = () => {
            const xlabel = selectedOS === allSystems ? 'Total' : (selectedOS === android ? 'Android' : 'iOS'),
                ylabel = 'Market full name';
            const dataToPlot = revenue.filter(d => d.Genre === selectedGenre)
                .sort((a,b) => b[xlabel] - a[xlabel]).slice(0,15);

            x.domain([0, Math.max(d3.max(revenue, d => d[xlabel]), 20)]);
            y.domain(dataToPlot.map(d => d[ylabel]));

            g.selectAll(".bar")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bar")
                    .attr("x", x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(d[xlabel]))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#0280FB");

            xAxis.call(d3.axisBottom(x).ticks(14));
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

            fixWidth(divId);

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

        const systems = [allSystems, android, iOS]
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

const urlPath5 = window.location.pathname;
if (urlPath5.includes('/ja/')) {
    drawViz5(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz5-ja.csv',
        divId = "#geo-viz5",
        title = "有料ユーザー1人あたりの平均収益に関しては東アジア・太平洋地域がリードしているものの、OSとジャンルによって状況が異なる",
        subtitle = "上位15カ国のD7 ARPPU（米ドル）",
        selectLabels = {
            'genre': 'ジャンルを選ぶ',
            'OS': 'OSを選ぶ'
        },
        sources = "データソース：Moloco広告主のD7 ARPPU（最初の7日間のARPPU）の中央値（2023年8月～2024年9月）。D7 IAP収益が1,000米ドルを超えるアプリのみを対象とし、中国本土は含まれません。",
        selectedGenre = "すべてのジャンル",
        selectedOS = 'すべてのシステム',
        allSystems = 'すべてのシステム',
        android = 'Android',
        iOS = 'iOS'
    );
} else if (urlPath5.includes('/zh/')) {
    drawViz5(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz5-zh.csv',
        divId = "#geo-viz5",
        title = "东亚及亚太市场在每付费用户平均收益方面领先全球，但数据在不同操作系统（OS）及游戏类型上有显著变化",
        subtitle = "第七天每付费用户平均收益（D7 ARPPU）（$美元）最高的 15 个国家和地区",
        selectLabels = {
            'genre': '选择类型',
            'OS': '选择操作系统'
        },
        sources = "来源：Moloco 广告主第七天每付费用户平均收益（D7 ARPPU） 中位数数据，包括所有自然和付费渠道（2023 年 8 月至 2024 年 8 月）。仅包含第七天 应用内购买（D7 IAP）收益超过  1000  美元的 App。不包含中国大陆的数据。",
        selectedGenre = "所有类型",
        selectedOS = '全渠道',
        allSystems = '全渠道',
        android = '安卓',
        iOS = 'iOS'
    );
} else if (urlPath5.includes('/ko/')) {
    drawViz5(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz5-ko.csv',
        divId = "#geo-viz5",
        title = "동아시아 태평양 시장이 ARPPU에서는 앞서지만, 이러한 양상은 OS 및 장르에 따라 크게 변동",
        subtitle = "D7 ARPPU($USD) 상위 15개국",
        selectLabels = {
            'genre': '장르 선택',
            'OS': '운영체제(OS) 선택'
        },
        sources = "출처: 몰로코 광고주의 오가닉 및 페이드 채널에 걸친 D7 ARPPU 중앙값 (2023년 8월~2024년 8월 기준). D7 IAP 매출이 1,000 달러를 넘는 앱만 포함하며 중국 본토는 제외합니다.",
        selectedGenre = "모든 장르",
        selectedOS = '전체',
        allSystems = '전체',
        android = '안드로이드',
        iOS = 'iOS'
    );
} else {
    drawViz5(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz5.csv',
        divId = "#geo-viz5",
        title = "East Asia Pacific leads when it comes to average revenue per paying user, although this picture changes by OS and genre",
        subtitle = "D7 ARPPU ($USD) for top 15 countries and regions",
        selectLabels = {
            'genre': 'Select genre',
            'OS': 'Select OS'
        },
        sources = "Source: Moloco advertiser median D7 ARPPU across all organic and paid channels (August 2023 to August 2024). Only apps with more than $1000 (USD) D7 IAP revenue are included. Excluding Mainland China.",
        selectedGenre = "All genres",
        selectedOS = 'All systems',
        allSystems = 'All systems',
        android = 'Android',
        iOS = 'iOS'
    );
}
