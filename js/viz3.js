function drawViz3(dataSource, divId, title, subtitle, titleFirstRow, titleSecondRow, sources,
    labelForUS, spendIn, leftToRight, country2, uniqueDestinations
) {

    const windowWidth = Math.min(window.innerWidth, screen.width);

    clearDiv(divId);
    centerDiv(divId);
    addTitle(divId, title);
    addSubtitle(divId, subtitle);
    // addLegend("#geo-viz3");
    addBoldText(divId, titleFirstRow);

    const textPadding = 7;
    const squaresPerRow = 5;
    const squareSize = 15;
    const squarePadding = 2;
    const waffleSize = 10 * squareSize + 9 * squarePadding;
    const waffleHPadding = 10;
    const waffleVPadding = 54;
    const countryNamePadding = 20;
    const topText = countryNamePadding + 2 * squareSize + squarePadding;
    const leftText = 7 * squareSize + 6 * squarePadding; 
    const wideEnough = windowWidth > 4 * (waffleSize + waffleHPadding) + 40;

    const margin = {top: 0, right: 0, bottom: 0, left: 1},
        width = wideEnough ? 4 * waffleSize + 3 * waffleHPadding - margin.left - margin.right
                : 2 * waffleSize + waffleHPadding - margin.left - margin.right,
        height = wideEnough ? (waffleSize + waffleVPadding) - margin.top - margin.bottom
            : 2 * (waffleSize + waffleVPadding) - margin.top - margin.bottom;

    const svg1 = d3.select(divId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    const g1 = svg1.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.select(divId)
        .append("div")
        .attr("class", "separator")
        .style("border-bottom", '1px dotted #808080');

    addBoldText(divId, titleSecondRow);
    const dropdowns = d3.select(divId)
        .append("div")
        .attr("class", "dropdowns")
        .style("display", "table");

    const svg2 = d3.select(divId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    const g2 = svg2.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // const x = d3.scaleLinear()
    //     .range([ 0, width]);

    const y = d3.scaleLinear()
        .range([0, squareSize])
        .domain([0, 1]);

    // const xAxis = g.append("g")
    //     .attr("transform", "translate(0," + height + ")");

    addSources(divId, sources)

    window.onclick = function(event) {
        if (!event.target.matches('#country2-dropbtn-2')) {
            const dropdown = document.getElementById("country2-content-2");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }

    const xlabel = 'HQ country full name',
        ylabel = 'Total';

    Promise.all([
        d3.csv(dataSource)
    ]).then((data) => {
        const spend = data[0];

        spend.forEach(d => {
            d['Total'] = +d['Total'];
            d['Android'] = +d['Android'];
            d['iOS'] = +d['iOS'];
        });

        let countries = ["country2"];
        countries.forEach(d => {

            const dropdownWrapper = dropdowns.append("div")
                .attr("class", "dropdown-wrapper")
                
            const dropdown = dropdownWrapper.append("div")
                .attr("class", "dropdown inline")
                .attr("id", d+"-dropdown-2");

            dropdown.append("div")
                .attr("class", "dropbtn")
                .attr("id", d+"-dropbtn-2");

            dropdown.append("div")
                .attr("class", "dropdown-content")
                .attr("id", d+"-content-2");
        });

        const updatePlot = (g, country) => {
            // const dataToPlot = spend.filter(d => d.Genre === selectedGenre);
            const countriesToPlot = [country];

            const countryGroups = g.selectAll(".country-group")
                .data(countriesToPlot)
                .join("g")
                    .attr("class", "country-group")
                    .attr("transform", (d,i) => "translate(0," + i * (countryNamePadding + waffleSize + waffleVPadding) + ")")

            const groups = countryGroups.selectAll(".group")
                .data(d => uniqueDestinations.map(ud => spend.filter(si => ((si[xlabel] === d) && (si.Destination === ud)))))
                .join("g")
                    .attr("class", "group")
                    .attr("transform", (d,i) => {
                        if (wideEnough) {
                            return "translate(" + i * (waffleSize + waffleHPadding) + ",0)"
                        } else {
                            const row = Math.floor(i / 2);
                            const col = i % 2;
                            return "translate(" + (col * (waffleSize + waffleHPadding)) + "," + (row * (waffleSize + waffleVPadding))  + ")"
                        }
                    });

            groups.selectAll(".square")
                .data(d => d3.range(0, 100, 1).map(idx => {
                    return {
                        idx: idx,
                        Android: d[0].Android,
                        Total: d[0].Total
                    }
                }))
                .join("rect")
                    .attr("class", "square")
                    .attr("x", d => waffleSize - (d.idx % 10 + 1) * (squareSize + squarePadding))
                    .attr("y", d => countryNamePadding + Math.floor(d.idx / 10) * (squareSize + squarePadding))
                    .attr("width", squareSize)
                    .attr("height", squareSize)
                    .attr("fill", d =>  (d.idx >= 100 * (1 - d.Total)) ? "#0280FB" : "#ECEDEE");

            groups.selectAll(".fractional-square-android")
                .data(d => {
                    const remainder = (d[0].Total * 1000) % 10 / 10;
                    const idx = Math.floor(100 - d[0].Total * 100);
                    return [{
                        x: waffleSize - (idx % 10 + 1) * (squareSize + squarePadding),
                        y: countryNamePadding + Math.floor(idx / 10) * (squareSize + squarePadding),
                        height: y(remainder)
                    }]
                })
                .join("rect")
                    .attr("class", "fractional-square-android")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y + (squareSize - d.height))
                    .attr("width", squareSize)
                    .attr("height", d => d.height)
                    .attr("fill", "#0280FB");

            groups.selectAll(".percentage")
                .data(d => [d])
                .join("text")
                    .attr("class", "percentage")
                    .attr("x", leftText)
                    .attr("y", topText)
                    .style("font-family", "Spacegrotesk")
                    .style("font-size", "14px")
                    .style("text-anchor", 'start')
                    .attr("fill", "#000000")
                    .text(d => (d[0][ylabel] * 100).toFixed(1) + '%');

            groups.selectAll(".destination-name")
                .data(d => [d])
                .join("text")
                    .attr("class", "destination-name")
                    .attr("x", 0)
                    .attr("y", d => countryNamePadding + waffleSize + 24)
                    .style("font-family", "Montserrat")
                    .style("font-size", "14px")
                    .style("text-anchor", 'start')
                    .attr("fill", "#000000")
                    .text(d => leftToRight === true ? spendIn + d[0]['Destination'] : d[0]['Destination'] + spendIn)

            fixWidth(divId);

        }

        const uniqueCountries = getUniquesMenu(spend, xlabel).filter(d => d !== labelForUS);
        let country2Opts = addOptions("country2-content-2", uniqueCountries);

        d3.select("#country2-dropdown-2")
            .on("click", function(d){
                document.getElementById("country2-content-2").classList.toggle("show");
            });
        d3.select("#country2-dropdown-2").select(".dropbtn").html(country2);
        country2Opts.selectAll("a").on("click", function(event, d){
            if (d !== country2) {
                country2 = d;
                d3.select("#country2-dropdown-2").select(".dropbtn").html(country2);
                updatePlot(g2, country2);
            }
        })

        updatePlot(g1, labelForUS);
        updatePlot(g2, country2);
    })
}

const urlPath3 = window.location.pathname;
if (urlPath3.includes('/ja/')) {
    drawViz3(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz3-ja.csv',
        divId = "#geo-viz3",
        title = "拠点がある地域に専念するマーケターもいれば、よりグローバルなアプローチでユーザー獲得に取り組むマーケターもいる",
        subtitle = "2025年の国別ユーザー獲得コスト（推定）の内訳 - アプリ開発企業の本拠地別にフィルタリング可能",
        titleFirstRow = "本社が米国にあるゲームアプリ企業",
        titleSecondRow = "本拠地を選択して比較",
        sources = "データソース：Molocoによる2025年のモバイルゲーム （IAP）におけるユーザー獲得コストの推定。Molocoは、有料ユーザーの獲得コストを推定するためにさまざまなインプットを使用しています。これには、Sensor Towerの一部であるdata.aiからのインストールデータ、有料対オーガニックの推定比率、特定のアプリ市場の実際または推定のCPIが含まれます。中国本土での支出は除外されていますが、中国を拠点とするモバイルゲームアプリによる国外市場での支出は含まれています。",
        labelForUS = '米国',
        spendIn = 'での支出',
        leftToRight = false,
        country2 = '中国',
        uniqueDestinations = ['北米', 'ヨーロッパ', 'アジア太平洋地域', 'その他の地域']
    );
} else if (urlPath3.includes('/zh/')) {
    drawViz3(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz3-zh.csv',
        divId = "#geo-viz3",
        title = "一部分营销人员更加专注本土市场，而另一部分营销人员则会采取更加全球化的用户获取策略",
        subtitle = "2025 年各国及各类别用户获取支出预估，根据 App 开发商总部所在地区分类",
        titleFirstRow = "总部在美国",
        titleSecondRow = "选择总部所属地区比较数据",
        sources = "来源：Moloco 预估的移动游戏应用内购买（IAP）用户获取支出（2025年）。Moloco 结合多项指标预估付费 UA 支出，包括来自 Sensor Tower 旗下 data.ai 的安装数据、付费及自然用户获取比例的预估，以及特定 App 类别的实际或预估的每次安装成本（CPI）。本分析不包含在中国大陆市场的投放，但包括中国本土移动游戏 App 在海外市场的投放。",
        labelForUS = '美国',
        spendIn = '地区支出',
        leftToRight = false,
        country2 = '中国大陆',
        uniqueDestinations = ['北美', '欧洲', '亚太地区', '世界其他地区']
    );
} else if (urlPath3.includes('/ko/')) {
    drawViz3(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz3-ko.csv',
        divId = "#geo-viz3",
        title = "일부 마케터는 UA를 현지에 집중, 일부는 더 글로벌한 접근 방식을 채택",
        subtitle = "2025년 앱 개발사 본사 위치 기준으로 필터링된 국가별 UA 지출 추정치",
        titleFirstRow = "미국 본사",
        titleSecondRow = "비교할 본사 선택",
        sources = "출처: 몰로코의 모바일 게임(IAP) UA 지출 추정치(2025년)<br>몰로코는 페이드 UA 지출을 추정하기 위해 data.ai(센서타워 자회사)의 앱 설치 데이터, 페이드 및 오가닉 비율 추정치, 특정 앱 세그먼트의 실제 또는 추정 CPI 등 다양한 정보를 활용했습니다. 본 분석에서는 중국 본토에서 발생한 광고 지출은 제외되었으나, 중국 기반 모바일 게임의 해외 시장 광고 지출은 포함됩니다.",
        labelForUS = '미국',
        spendIn = '지출',
        leftToRight = false,
        country2 = '중국',
        uniqueDestinations = ['북미', '유럽', '아시아 태평양', '그 외 지역']
    );
} else {
    drawViz3(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz3.csv',
        divId = "#geo-viz3",
        title = "Some marketers focus on their local regions, while others take a more global approach to user acquisition",
        subtitle = "2025 estimated user acquisition spend by country, filtered by app developer HQ location",
        titleFirstRow = "HQ in the U.S.",
        titleSecondRow = "Select HQ to compare",
        sources = "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025). Moloco uses a number of inputs to estimate paid UA spend, including install data sourced from data.ai, a Sensor Tower company, assumptions on paid vs. organic ratios, and actual or estimated CPIs for specific app segments. Spend in mainland China is excluded from this analysis, but spend by mobile gaming apps based in China in non-domestic markets is included.",
        labelForUS = 'U.S.',
        spendIn = 'Spend in ',
        leftToRight = true,
        country2 = 'China',
        uniqueDestinations = ['North America', 'Europe', 'Asia Pacific', 'Rest of World']
    );
}
