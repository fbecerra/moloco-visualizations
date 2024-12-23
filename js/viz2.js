function drawViz2(dataSource, divId, title, subtitle, sources, selectGenre, initialGenre,
                iOSColumnTitle, androidColumnTItle, totalColumnTitle) {
    const graphWidth = Math.min(Math.min(window.innerWidth, screen.width) - 40, 660);

    clearDiv(divId);
    centerDiv(divId);
    addTitle(divId, title);
    addSubtitle(divId, subtitle);
    
    d3.select(divId)
        .append("div")
        .attr("class", "select-label")
        .style("font-family", "Montserrat")
        .style("font-size", "14px")
        .style("font-weight", 700)
        .style("display", "table")
        .html(selectGenre);
    
    const dropdown = d3.select(divId)
        .append("div")
        .attr("class", "dropdown")
        .attr("id", "select-dropdown-2");
    
    dropdown.append("div")
        .attr("class", "dropbtn")
        .attr("id", "select-dropbtn-2");
    
    dropdown.append("div")
        .attr("class", "dropdown-content")
        .attr("id", "select-content-2");
    
    const textPadding = 7;
    
    const margin = {top: 40, right: 60, bottom: 10, left: 90},
        width = graphWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select(divId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    
    window.onclick = function(event) {
        if (!event.target.matches('#select-dropbtn-2')) {
            const dropdown = document.getElementById("select-content-2");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
    
    const g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    const x = d3.scaleLinear()
        .range([0, width / 2 - 20])
        .domain([0, 100]);
    
    const y = d3.scaleBand()
        .range([0, height])
        .padding(.15);

    addSources(divId, sources)
    
    Promise.all([
        d3.csv(dataSource)
    ]).then((data) => {
        const spend = data[0];
    
        let selectedGenre = initialGenre;
    
        spend.forEach(d => {
            d['Android'] = +d['Android'].slice(0,-1);
            d['iOS'] = +d['iOS'].slice(0,-1);
            d['Total'] = +d['Total'].slice(0,-1);
        });
    
        const updatePlot = () => {
            const ylabel = 'Market full name';
            const dataToPlot = spend.filter(d => d.Genre === selectedGenre);
    
            y.domain(dataToPlot.map(d => d[ylabel]));
    
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
    
    
            // iOS
            g.selectAll(".title-iOS")
                .data([iOSColumnTitle])
                .join("text")
                    .attr("class", "title-iOS")
                    .attr("x", x(0) )
                    .attr("y", margin.top - 48)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .text(d => d);
    
            g.selectAll(".bg-ios")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bg-ios")
                    .attr("x", x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(100))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#ECEDEE");
    
            g.selectAll(".bar-ios")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bar-ios")
                    .attr("x", x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(d['iOS']))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#040078");
    
            g.selectAll(".percentage-ios")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "percentage-ios")
                    .attr("x", d => {
                        if (d.iOS > 80) {
                            return x(d['iOS']) - textPadding;
                        } else {
                            return x(d['iOS']) + textPadding;
                        }
                    })
                    .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("text-anchor", d => {
                        if (d.iOS > 80) {
                            return 'end';
                        } else {
                            return 'start';
                        }
                    })
                    .style("fill",'#000000')
                    .text(d => d['iOS'].toFixed(1) + '%');
    
            // ANDROID
            g.selectAll(".title-android")
                .data([androidColumnTItle])
                .join("text")
                    .attr("class", "title-android")
                    .attr("x", width/2 + x(0) )
                    .attr("y", margin.top - 48)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .text(d => d);
    
            g.selectAll(".bg-android")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bg-android")
                    .attr("x", width/2 + x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(100))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#ECEDEE");
    
            g.selectAll(".bar-android")
                .data(dataToPlot)
                .join("rect")
                    .attr("class", "bar-android")
                    .attr("x", width/2 + x(0) )
                    .attr("y", d => y(d[ylabel]))
                    .attr("width", d => x(d['Android']))
                    .attr("height", y.bandwidth() )
                    .attr("fill", "#558FC9");
    
            g.selectAll(".percentage-android")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "percentage-android")
                    .attr("x", d => {
                        if (d.iOS > 80) {
                            return width/2 + x(d['Android']) - textPadding;
                        } else {
                            return width/2 + x(d['Android']) + textPadding;
                        }
                    })
                    .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("text-anchor", d => {
                        if (d.iOS > 80) {
                            return 'end';
                        } else {
                            return 'start';
                        }
                    })
                    .style("fill",'#000000')
                    .text(d => d['Android'].toFixed(1) + '%');
    
            // Total
            g.selectAll(".title-total")
                .data([totalColumnTitle])
                .join("text")
                    .attr("class", "title-total")
                    .attr("x", width)
                    .attr("y", margin.top - 48)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .text(d => d);
    
            g.selectAll(".percentage-total")
                .data(dataToPlot)
                .join("text")
                    .attr("class", "percentage-total")
                    .attr("x", width)
                    .attr("y", d => y(d['Market full name']) + y.bandwidth() / 2 + 2)
                    .style("dominant-baseline", "middle")
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("font-weight", 700)
                    .style("text-anchor", 'start')
                    .style("fill",'#000000')
                    .text(d => d['Total'].toFixed(1) + '%');

            fixWidth(divId);
    
        }
    
        const genre = getUniquesMenu(spend, 'Genre');
        let genreOpts = addOptions("select-content-2", genre);
    
        d3.select("#select-dropdown-2")
            .on("click", function(d){
                document.getElementById("select-content-2").classList.toggle("show");
            });
        d3.select("#select-dropdown-2").select(".dropbtn").html(initialGenre);
        genreOpts.selectAll("a").on("click", function(event, d){
            if (d !== selectedGenre) {
                selectedGenre = d;
                d3.select("#select-dropdown-2").select(".dropbtn").html(selectedGenre);
                updatePlot();
            }
        })
    
        updatePlot();
    })
};
const urlPath2 = window.location.pathname;
if (urlPath2.includes('/ja/')) {
    drawViz2(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz2-ja.csv', 
        divId = "#geo-viz2", 
        title = "RPGは東アジアで人気が高く、マッチングとカジノは英語圏地域で勢いがある", 
        subtitle = "2025年の国・ジャンル別ユーザー獲得コスト（推定）の内訳", 
        sources = "データソース：Molocoによる2025年のモバイルゲーム （アプリ内購入）におけるユーザー獲得コストの推定。Molocoは、有料ユーザーの獲得コストを推定するためにさまざまなインプットを使用しています。これには、Sensor Towerの一部であるdata.aiからのインストールデータ、有料対オーガニックの推定比率、特定のアプリ市場の実際または推定のCPIが含まれます。中国本土での支出は除外されていますが、中国を拠点とするモバイルゲームアプリによる国外市場での支出は含まれています。",
        selectGenre = "ジャンルを選ぶ",
        initialGenre = "RPG", // Translation for "RPG"
        iOSColumnTitle = 'iOS',
        androidColumnTItle = 'Android',
        totalColumnTitle = 'Total'
    );
} else if (urlPath2.includes('/zh/')) {
    drawViz2(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz2-zh.csv', 
        divId = "#geo-viz2", 
        title = "角色扮演游戏（RPG）在东亚很流行，而匹配类和博彩类游戏在英语国家大受欢迎", 
        subtitle = "2025 年各国/地区及各类别用户获取支出预估", 
        sources = "来源：Moloco 预估的移动游戏 应用内购买（IAP）用户获取支出（2025年）。Moloco 结合多项指标预估付费 UA 支出，包括来自 Sensor Tower 旗下 data.ai 的安装数据、付费及自然用户获取比例的预估，以及特定 App 类别的实际或预估的每次安装成本（CPI）。本分析不包含在中国大陆市场的投放，但包括中国本土移动游戏 App 在海外市场的投放。",
        selectGenre = "选择类型",
        initialGenre = "角色扮演类", // Translation for "RPG"
        iOSColumnTitle = 'iOS',
        androidColumnTItle = '安卓',
        totalColumnTitle = '全渠道'
    );
} else if (urlPath2.includes('/ko/')) {
    drawViz2(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz2-ko.csv', 
        divId = "#geo-viz2", 
        title = "RPG는 동아시아, 매치와 카지노는 영어권 지역에서 성행", 
        subtitle = "2025년 국가 및 장르별 UA 지출 추정치", 
        sources = "출처: 몰로코의 모바일 게임(IAP) UA 지출 추정치(2025년)<br>몰로코는 페이드 UA 지출을 추정하기 위해 data.ai(센서타워)의 앱 설치 데이터, 페이드 및 오가닉 비율 추정치, 특정 앱 세그먼트의 실제 또는 추정 CPI 등 다양한 정보를 활용했습니다. 본 분석에서는 중국 본토에서 발생한 광고 지출은 제외되었으나, 중국 기반 모바일 게임의 해외 시장 광고 지출은 포함됩니다.",
        selectGenre = "장르 선택",
        initialGenre = "RPG", // Translation for "RPG"
        iOSColumnTitle = 'iOS',
        androidColumnTItle = '안드로이드',
        totalColumnTitle = '전체'
    );
} else {
    drawViz2(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz2.csv', 
        divId = "#geo-viz2", 
        title = "RPG is popular in East Asia, while Match and Casino thrive in English-speaking regions", 
        subtitle = "2025 estimated user acquisition spend by country/region and genre", 
        sources = "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025). Moloco uses a number of inputs to estimate paid UA spend, including install data sourced from data.ai, a Sensor Tower company, assumptions on paid vs. organic ratios, and actual or estimated CPIs for specific app segments. Spend in mainland China is excluded from this analysis, but spend by mobile gaming apps based in China in non-domestic markets is included.",
        selectGenre = "Select genre",
        initialGenre = "RPG", // Translation for "RPG"
        iOSColumnTitle = 'iOS',
        androidColumnTItle = 'Android',
        totalColumnTitle = 'Total'
    );
}

