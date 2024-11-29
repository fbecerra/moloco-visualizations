function drawViz6(dataSource, divId, title, subtitle, selectCountry, countriesAndRegions,
    uaText, revenueText, arppuText, groupLabels, groupInfo, selectGenre, selectedGenre,
    sources, comma
) {

    const windowWidth = Math.min(window.innerWidth, screen.width);
    const tooSmall = windowWidth < 700;

    clearDiv(divId);

    const gray = '#ECEDEE';
    const blue = '#0280FB';
    const darkerGray = "#D9D9D9";

    Promise.all([
        d3.json('https://cdn.jsdelivr.net/npm/visionscarto-world-atlas@1/world/50m.json'),
        d3.csv(dataSource)
    ]).then((data) => {

        const world = data[0];
        const values = data[1];

        countries = topojson.feature(world, world.objects.countries);
        countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

        values.forEach(d => {
            d.Revenue = +d.Revenue;
            d['UA Spend'] = +d['UA Spend'];
            d.ARPPU = +d.ARPPU;
        })

        //const groups = getUniquesMenu(values, 'Tier');
        //const groups = ['US and English Language', 'Europe & Middle East (Tier 1)', 
        //   'LATAM Spanish Speaking', 'East Asia Pacific',
        //   'Europe & Middle East (Tier 2)', 'Global Developing Markets'];
        //const groups = getUniquesMenu(values, 'Tier');
        //const groups = ['US and English Language', 'Europe & Middle East (Group 1)', 
        //    'LATAM Spanish Speaking', 'East Asia Pacific',
        //    'Europe & Middle East (Group 2)', 'Global Developing Markets'];
        //const groupLabels = {
        //    'US and English Language': "US and English Language", 
        //    'Europe & Middle East (Group 1)': "Europe & Middle East (Group 1)", 
        //    'LATAM Spanish Speaking': "LATAM Spanish Speaking", 
        //    'East Asia Pacific': "East Asia Pacific",
        //    'Europe & Middle East (Group 2)': "Europe & Middle East (Group 2)", 
        //    'Global Developing Markets': "Global Developing Markets"


        const groups = ['US and English Language', 'East Asia Pacific',
            'Europe & Middle East (Group 1)', 'Europe & Middle East (Group 2)',
            'LATAM Spanish Speaking', 'Global Developing Markets'];
        let selectedGroup = groups[0];

        const [min, max] = d3.extent(values, d => d.ARPPU);

        const x = d3.scaleLinear()
            .domain([0, max])
            .range([0, 100]);

        d3.select(divId)
            .style("font-family", "Montserrat")
            .style("font-size", '14px')
            .style("display", "block");

        const tooltip = d3.select(divId)
            .style("position", "relative")
            .append("div")
            .attr("class", "viz-tooltip")
            .style("position", "absolute")
            .style("font-family", "Montserrat")
            .style("font-size", "14px")
            .style("font-weight", 400)
            .style("padding", "12px 24px")
            .style("background-color", "white")
            .style("border", "0.5px solid #000")
            .style("z-index", 2)
            .style("display", "none")
            .html('');
        
        d3.select(divId).append("div")
            .attr("id", "title-wrapper")
            .style("max-width", "700px")
            .style("margin", "auto");;

        addTitle("#title-wrapper", title);
        addSubtitle("#title-wrapper", subtitle)
            

        // // NEW to test

        // d3.select("#geo-viz6 .title")
        //     .style("max-width", "700px")
        //     .style("margin", "auto")

        // d3.select("#geo-viz6 .subtitle")
        //     .style("max-width", "700px")
        //     .style("margin", "8px auto 24px auto");

        // // End of NEW to test

        addBoldText(divId, selectCountry)

        const gridWrapper = d3.select(divId).append("div")
            .attr("class", 'grid-wrapper')
            .style("display", tooSmall ? "block" : "grid");

        const leftPanel = gridWrapper.append("div")
            .attr("class", "left-panel")
            .style("margin-top", '12px')
            .style("display", tooSmall ? "block" : "grid");

        const rightPanel = gridWrapper.append("div")
            .attr("class", "right-panel")
            .attr("id", "right-panel")
            .style("background-color", gray)
            .style("padding", "8px 10px")
            .style("margin-top", tooSmall === true ? '36px' : '12px')

        // RIGHT PANEL

        addBoldText('#right-panel', countriesAndRegions);

        const countriesString = rightPanel.append("div")
            .style("height", '100px');
        const budgetBar = rightPanel.append("div")
            .attr("id", "budget")
            .style("height", '60px');
        const revenueBar = rightPanel.append("div")
            .attr("id", "revenue")
            .style("height", '60px');

        rightPanel.append("div")
            .attr("id", "arppu")
            .style("height", '60px');

        rightPanel.append("div")
            .attr("id", 'selected-tier-name')
            .style('font-weight', 700)
            .style('margin-top', '42px');

        rightPanel.append("div")
            .attr("id", 'selected-tier-info');

        function addBar(divID, legendText) {
            const bar = d3.select("#" + divID).append('div')
                .attr('class', 'bar')
                .style("position", "relative")
                .style("width", '100%')
                .style("margin-top", '24px')
                .style("height", divID === 'arppu' ? '17px' : '11px')

            bar.append("div")
                .style("width", "100%")
                .style("background-color", darkerGray)
                .style("height", '11px')
                .style("position", 'absolute')
                .style("top", divID === 'arppu' ? '3px' : 0)
                .style("left", 0)

            bar.append("div")
                .attr("id", divID + '-bar')
                .style("width", "20%")
                .style("background-color", blue)
                .style("height", divID === 'arppu' ? '17px' : '11px' )
                .style("position", 'absolute')
                .style("top", 0)
                .style("left", 0);

            const legend = d3.select("#" + divID).append("div")
                .attr("class", 'legend')
                .style('position', 'relative')
                .style("width", '100%')
                .style("margin-top", '8px');

            legend.append("div")
                .attr("id", divID + '-legend')
                .style("width", "40%")
                .style("position", 'absolute')
                .style("font-size", "32px")
                .style("font-weight", 700)
                .style('font-family', 'Spacegrotesk')
                .style("color", blue)
                .style("top", 0)
                .style("left", 0)
                .html("52%")

            legend.append("div")
                .style('text-align', 'right')
                .style("width", "60%")
                .style("position", 'absolute')
                .style("top", 0)
                .style("right", 0)
                .html(legendText)
        }

        addBar("budget", uaText);
        addBar("revenue", revenueText);
        addBar("arppu", arppuText);

        // addBoldText("#right-panel", "US ")
        
        // LEFT PANEL

        if (tooSmall) {
            const dropdown = leftPanel.append("div")
                .attr("class", "dropdown")
                .attr("id", "select-dropdown-tier")
                .style("width", '100%')  // Changed from 300px to 100%
            
            dropdown.append("div")
                .attr("class", "dropbtn")
                .attr("id", "select-dropbtn-tier");
            
            dropdown.append("div")
                .attr("class", "dropdown-content")
                .attr("id", "select-content-tier")
                //.style("width", '208');

            let tierOpts = addOptionsWithLabels("select-content-tier", groups, groupLabels);

            d3.select("#select-dropdown-tier")
                .on("click", function(d){
                    document.getElementById("select-content-tier").classList.toggle("show");
                });
            d3.select("#select-dropdown-tier").select(".dropbtn").html(groupLabels[selectedGroup]);
            tierOpts.selectAll("a").on("click", function(event, d){
                if (d !== selectedGroup) {
                    selectedGroup = d;
                    d3.select("#select-dropdown-tier").select(".dropbtn").html(groupLabels[selectedGroup]);
                    updatePlot();
                }
            })

        } else {
            const buttonsWrapper = leftPanel.append("div")
                .attr("class", "button-wrapper-viz")

            buttonsWrapper.selectAll(".country-button")
                .data(groups)
                .join("div")
                    .attr("class", "country-button")
                    .style("background-color", d => d === selectedGroup ? blue : gray)
                    .style("color", d => d === selectedGroup ? "#FFFFFF" : "#000000")
                    .style("font-weight", d => d === selectedGroup ? 700 : 400)
                    .style("cursor", "pointer")
                    .style("padding", "10px")
                    .html(d => groupLabels[d])
                    .on("click", (evt, d) => {
                        if (selectedGroup !== d) {
                            selectedGroup = d;
                            d3.selectAll(".country-button")
                                .style("background-color", d => d === selectedGroup ? blue : gray)
                                .style("color", d => d === selectedGroup ? "#FFFFFF" : "#000000")
                                .style("font-weight", d => d === selectedGroup ? 700 : 400);
                            updatePlot();
                        }
                    });
        }
        
        const vizWrapper = leftPanel.append("div")
                .attr("class", "viz-wrapper")
                .attr("id", "viz-wrapper")
                .style("margin-top", tooSmall ? '18px' : '-30px')

        addBoldText("#viz-wrapper", selectGenre);

        const dropdown = d3.select("#viz-wrapper")
            .append("div")
            .attr("class", "dropdown")
            .attr("id", "select-dropdown")
            .style("margin-top", '10px');
        
        dropdown.append("div")
            .attr("class", "dropbtn")
            .attr("id", "select-dropbtn");
        
        dropdown.append("div")
            .attr("class", "dropdown-content")
            .attr("id", "select-content");

        const genre = getUniquesMenu(values, 'Genre');;
        let genreOpts = addOptions("select-content", genre);

        d3.select("#select-dropdown")
            .on("click", function(d){
                document.getElementById("select-content").classList.toggle("show");
            });
        d3.select("#select-dropdown").select(".dropbtn").html(selectedGenre);
        genreOpts.selectAll("a").on("click", function(event, d){
            if (d !== selectedGenre) {
                selectedGenre = d;
                d3.select("#select-dropdown").select(".dropbtn").html(selectedGenre);
                updatePlot();
            }
        })

        window.onclick = function(event) {
            if (!event.target.matches('#select-dropbtn')) {
                const dropdown = document.getElementById("select-content");
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }

        const width = tooSmall ? windowWidth : 828;
        const marginTop = 46;
        const height = width / 828 * 450 + marginTop;

        const projection = d3.geoMiller()
            .fitExtent([[2, marginTop + 2 -100], [width - 2, height + 150]], {type: "Sphere"})
            // .scale(width/5);
        // const projection = d3.geoEqualEarth()
        //     .fitExtent([[2, marginTop + 2], [width - 2, height]], {type: "Sphere"});
        // const projection = d3.geoMercator()
        //     .center([0, 0])
        //     .translate([width/2, height/2])
        //     .scale(width / (2 * Math.PI))
        let path = d3.geoPath(projection);


        const svg = vizWrapper.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        //vizWrapper.append("div")
        //    .attr("class", "buttons")
        //    .html('<div class="row"><div class="button" id="zoom-in">+</div></div><div class="row"><div class="button" id="zoom-out">-</div></div>' + 
        //        '<div class="row"><div class="button" id="zoom-reset"><svg width="26" height="26" viewBox="-5 -5 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        //        '<path d="M8.67071 8.95948C7.10583 10.8527 4.28501 11.0208 2.36518 9.29474C0.445358 7.56869 0.202351 4.64596 1.76723 2.75279C3.33211 0.859615 6.16609 0.703294 8.05961 2.4057L9.47976 3.68251L6.42735 3.82578L6.46843 4.27523L10.2631 4.06592L9.89161 0.133917L9.45931 0.157762L9.7623 3.34068L8.34216 2.06388C6.26454 0.19596 3.14237 0.368178 1.42535 2.44541C-0.291677 4.52264 0.00501632 7.76864 2.08263 9.63656C4.16025 11.5045 7.29329 11.3191 8.99945 9.25504L8.67071 8.95948Z" fill="#000000" />' +
        //        '</svg></div></div>');

        // Update the buttons HTML string with a thicker reset icon
        vizWrapper.append("div")
            .attr("class", "buttons")
            .html('<div class="row"><div class="button" id="zoom-in">+</div></div><div class="row"><div class="button" id="zoom-out">-</div></div>' + 
                '<div class="row"><div class="button" id="zoom-reset"><svg width="22" height="22" viewBox="-2.5 -2.5 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M8.67071 8.95948C7.10583 10.8527 4.28501 11.0208 2.36518 9.29474C0.445358 7.56869 0.202351 4.64596 1.76723 2.75279C3.33211 0.859615 6.16609 0.703294 8.05961 2.4057L9.47976 3.68251L6.42735 3.82578L6.46843 4.27523L10.2631 4.06592L9.89161 0.133917L9.45931 0.157762L9.7623 3.34068L8.34216 2.06388C6.26454 0.19596 3.14237 0.368178 1.42535 2.44541C-0.291677 4.52264 0.00501632 7.76864 2.08263 9.63656C4.16025 11.5045 7.29329 11.3191 8.99945 9.25504L8.67071 8.95948Z" fill="#000000" stroke="#000000" stroke-width="0.6"/>' +
                '</svg></div></div>');
        
        const g = svg.append("g");

        let countriesLabel;
        let paidBudgetLabel;
        let revenueLabel;
        let paidBudgetWidth;
        let revenueWidth;
        let minARPPU, maxARPPU;
        let minMaxLabel;

        const maxZoom = 16;
        const minZoom = 1;

        const zoom = d3.zoom()
            .extent([[0, 0], [width, height]])
            .scaleExtent([minZoom, maxZoom])
            .on("zoom", zoomed)

        function zoomed({transform}) {
            g.attr("transform", transform);
            g.selectAll(".country-edge")    
                .attr("stroke-width", 1 / transform.k)
        }

        svg.call(zoom);

        d3.select("#zoom-in")
            .on("click", ({ transform }) => {
                svg.transition().call(zoom.scaleBy, 2);
            });

        d3.select("#zoom-out")
            .on("click", ({ transform }) => {
                svg.transition().call(zoom.scaleBy, 0.5);
            });

        d3.select("#zoom-reset")
            .on("click", () => {
                svg.call(zoom.transform, d3.zoomIdentity);
            });

        function updateRightPanel() {
            countriesString.html(countriesLabel);
            d3.select("#budget-bar").style("width", paidBudgetWidth);
            d3.select("#budget-legend").html(paidBudgetLabel);
            d3.select("#revenue-bar").style("width", revenueWidth);
            d3.select("#revenue-legend").html(revenueLabel);
            d3.select("#arppu-bar")
                .style("left", x(minARPPU) + '%')
                .style("width", (x(maxARPPU) - x(minARPPU)) + '%');
            d3.select("#arppu-legend").html(minMaxLabel);
            d3.select("#selected-tier-name").html(groupLabels[selectedGroup]);
            d3.select("#selected-tier-info").html(`<p style="font-family: Montserrat; color: #000; letter-spacing: 0px; font-size: 14px">${groupInfo[selectedGroup]}</p>`);
        }

        function updatePlot() {
            const groupCountries = values.filter(value => (value.Tier === selectedGroup) & (value.Genre === selectedGenre));
            countriesLabel = groupCountries.map(d => d['Market full name']).join(comma);
            const paidBudget = (groupCountries.reduce((a,b) => a + b['UA Spend'], 0) * 100).toFixed(0);
            paidBudgetWidth = paidBudget + '%';
            paidBudgetLabel = paidBudget < 1 ? '<1%' : paidBudget + '%';
            const revenueTotal = (groupCountries.reduce((a,b) => a + b['Revenue'], 0) * 100).toFixed(0);
            revenueWidth = revenueTotal + '%';
            revenueLabel = revenueTotal < 1 ? '<1%' : revenueTotal + '%';
            [minARPPU, maxARPPU] = d3.extent(groupCountries, d => d.ARPPU);
            minMaxLabel = `$${minARPPU.toFixed(1)}-$${maxARPPU.toFixed(1)}`;

            updateRightPanel();

            const abbvCountries = groupCountries.map(d => d.Market);
            const paddingRows = 36;

            g.selectAll(".country-path")
                .data(countries.features)
                .join("path")
                    .attr("class", "country-path")
                    // .attr("fill", d => color(valuemap.get(d.properties.name)))
                    .attr("fill", d => abbvCountries.indexOf(d.properties.a3) >= 0 ? blue : gray)
                    .attr("d", path)
                    .on("mousemove", (evt, d) => {
                        if (abbvCountries.indexOf(d.properties.a3) >= 0){
                            const thisCountry = values.filter(v => (v.Market === d.properties.a3) & (v.Genre === selectedGenre))[0];
                            d3.select(evt.target).attr("fill", "#C368F9");

                            const thisCountrySpend = (thisCountry['UA Spend'] * 100).toFixed(1);
                            const thisCountryRevenue = (thisCountry.Revenue * 100).toFixed(1);

                            const spendLabel = d.properties.a3 === 'HKG' ? 'N/A' : thisCountrySpend < 0.1 ? '<0.1%' : thisCountrySpend + '%'; 
                            const revenueLabel = thisCountryRevenue < 0.1 ? '<0.1%' : thisCountryRevenue + '%'; 

                            tooltip.style("display", "inline-block")
                                .html(`
                                    <table>
                                        <tr colspan="3">
                                            <td style="font-weight: 700;padding-bottom: 24px;">${thisCountry['Market full name']}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right: ${paddingRows}px;font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">${spendLabel}
                                            </td>
                                            <td style="padding-right: ${paddingRows}px;font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">${revenueLabel}
                                            </td>
                                            <td style="font-family: 'Spacegrotesk';font-size: 14px;font-weight: 500;padding-bottom: 6px">$${thisCountry.ARPPU}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right: ${paddingRows}px">${uaText}
                                            </td>
                                            <td style="padding-right: ${paddingRows}px">${revenueText}
                                            </td>
                                            <td>${arppuText}
                                            </td>   
                                        </tr>
                                    </table>`);

                            const tooltipWidth = tooltip.node().getBoundingClientRect().width;
                            const tooltipHeight = tooltip.node().getBoundingClientRect().height;

                            let xPos = Math.max(0, evt.layerX - tooltipWidth/2);
                            if (xPos + tooltipWidth > width) {
                                xPos = Math.max(0, width - tooltipWidth - 48);
                            }

                            tooltip.style("left", `${xPos}px`)
                                .style("top", `${evt.layerY - tooltipHeight - 18}px`);
                        }
                    })
                    .on("mouseout", (evt, d) => {
                        if (abbvCountries.indexOf(d.properties.a3) >= 0){
                            d3.select(evt.target).attr("fill", blue);
                            tooltip.style("display", "none");
                        }
                    })
        
        
            g.append("path")
                .datum(countrymesh)
                .attr("class", 'country-edge')
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("d", path);
        }

        updatePlot();

        addSources(divId, sources)

        d3.select(`${divId} .sources`)
            .style("max-width", "700px")
            .style("margin", "16px auto 0 auto");
        
    })

}

const urlPath6 = window.location.pathname;
if (urlPath6.includes('/ja/')) {
    drawViz6(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz6-ja.csv',
        divId = "#geo-viz6",
        title = "グローバル機会のマッピング",
        subtitle = "この視覚化ツールを操作して、地域別にユーザー価値、ユーザー獲得、収益のダイナミクスの詳細を把握できます。それぞれの国にカーソルを合わせると、市場レベルの概要が表示されます。",
        selectCountry = "地域を選択",
        countriesAndRegions = "対象国",
        uaText = "有料ユーザー獲得予算",
        revenueText = "ゲームIAP収益",
        arppuText = "D7 ARPPU",
        groupLabels = { // No need to change Tier names in data
            'US and English Language': "米国および英語圏", 
            'East Asia Pacific': "東アジア・太平洋地域",
            'Europe & Middle East (Group 1)': "欧州・中東（グループ1）", 
            'Europe & Middle East (Group 2)': "欧州・中東（グループ2）", 
            'LATAM Spanish Speaking': "中南米スペイン語圏", 
            'Global Developing Markets': "世界の新興市場"
        },
        groupInfo = {
            'US and English Language': "米国およびその他の多くの英語圏諸国は、モバイルゲーム市場全体における最大の市場であり、ユーザー獲得の予算と収益の大半を占めています。IAP収益の総額は米国が圧倒的ですが、これらの市場全体にユーザー獲得のチャンスが存在し、類似した市場参入への障壁と、ジャンルを問わず一貫したユーザー価値が見られます。", 
            'East Asia Pacific': "東アジア・太平洋地域市場は、ほとんどのジャンルで最も高い平均ユーザー価値を示しています。 ローカリゼーションの必要性や文化の違いにより、国外のマーケッターにとっては参入障壁が高い可能性があります。 この地域では、ミッドコアゲーム（RPG、戦略ゲーム、シミュレーションゲーム）において、ユーザー価値とIAPの総収益が比較的高い傾向が見られます。",
            'Europe & Middle East (Group 1)': "欧州・中東地域は、ユーザー価値とIAPの総収益に基づいて2つの市場グループに分けることができます。グループ1は、ユーザー価値とIAP収益が高く、この地域内で最も大きなビジネスチャンスが存在する市場が含まれます。 さらに、人口に占める英語話者の割合が高いため、多くのアプリにとって参入障壁が低くなる可能性があります。", 
            'Europe & Middle East (Group 2)': "欧州・中東地域は、ユーザー価値とIAPの総収益に基づいて2つの市場グループに分けることができます。グループ2は、IAPの総収益に占めるシェアが小さく、ユーザー価値に大きなばらつき見られる多様な市場で構成されています。 市場規模が大きいため、これらの市場への参入は容易ではないかもしれませんが、主要な市場をグループ化してリーチを最大化することで、大きなチャンスが生まれる可能性があります。", 
            'LATAM Spanish Speaking': "中南米（LATAM）市場は、ユーザー価値とIAPの収益全体に占める比率が比較的低い傾向が見られます。 一方、人口の大部分がスペイン語を話すため、ローカリゼーションを効率的に行うことができます。 マーケターにとって、これらの国のグループ化は、ユーザー獲得の機会拡大に役立ちます。", 
            'Global Developing Markets': "さまざまな発展途上国からなるこれらの市場は、ユーザー価値のばらつきが最も大きく、ジャンルによって大きな違いが見られました。 しかしマーケターにとって、潜在的にコスト効率の高い価格で価値の高いユーザーを獲得するチャンスが存在します。"
        },
        selectGenre = "ジャンルを選択",
        selectedGenre ='すべてのジャンル',
        sources = "データソース：Molocoによる2025年のモバイルゲーム （アプリ内購入）におけるユーザー獲得コストの推定および2023年8月～2024年8月におけるMoloco広告主の市場別ゲームアプリ内購入による総収益（オーガニックおよび有料）。中国本土での支出は分析の対象外ですが、中国を拠点とするモバイルゲームアプリによる国外市場での支出は含まれています。",
        comma = '、',
    );
} else if (urlPath6.includes('/zh/')) {
    drawViz6(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz6-zh.csv',
        divId = "#geo-viz6",
        title = "绘制全球机会",
        subtitle = "点击下方的可视化数据图，了解各地区的用户价值、用户获取及收益机制。将鼠标悬停在国家/地区上可查看当地市场概况。",
        selectCountry = "按组别选择国家",
        countriesAndRegions = "国家及地区",
        uaText = "用户获取支出",
        revenueText = "应用内购买收入",
        arppuText = "每付费用户平均收益",
        groupLabels = { // No need to change Tier names in data
            'US and English Language': "美国及英语国家", 
            'East Asia Pacific': "东亚与亚太",
            'Europe & Middle East (Group 1)': "欧洲与中东（第一组）", 
            'Europe & Middle East (Group 2)': "欧洲与中东（第二组）", 
            'LATAM Spanish Speaking': "拉丁美洲西语国家", 
            'Global Developing Markets': "全球发展中国家市场"
        },
        groupInfo = {
            'US and English Language': "美国及许多英语国家是全球最大的移动游戏市场，占据了大部分的用户获取（UA）支出和收入。尽管美国在总应用内购买（IAP）收入上占主导地位，但其他市场中依然存在着覆盖各种游戏类型，具有的相似市场进入壁垒和稳定的用户价值的机会。", 
            'East Asia Pacific': "东亚与亚太市场在大多数游戏类型中平均用户价值最高。由于本土化和文化差异，非本土市场营销人员可能面临着更高的进入壁垒。中核游戏（角色扮演类游戏（RPG）、策略类游戏、模拟类游戏）在该地区的用户价值和总应用内购买（IAP）收入方面表现相对强劲。",
            'Europe & Middle East (Group 1)': "欧洲与中东可以根据用户价值和总应用内购买（IAP）收入分为两组市场。第一组代表该地区一些机会最大的市场，具有较高的用户价值和总应用内购买（IAP）收入。此外，该地区英语使用者比例较大，可能会降低许多 App 的市场进入壁垒。", 
            'Europe & Middle East (Group 2)': "欧洲与中东可以根据用户价值和总应用内购买（IAP）收入分为两组市场。第二组代表一些多样化的市场，总应用内购买（IAP）收入份额较低，且用户价值差异较大。由于这些市场的规模较大，它们可能更难进入，但通过整合关键市场，可以将触达范围最大化，从而可能带来显著的机会。", 
            'LATAM Spanish Speaking': "拉丁美洲市场的用户价值和总应用内购买（IAP）收入贡献相对较低。然而，由于该地区人口大多讲西班牙语，本地化流程可以简化。对于市场营销人员来说，将这些国家归为一组有助于提高用户获取（UA）的可行性。", 
            'Global Developing Markets': "这些市场由众多发展中国家组成，用户价值差异最大，不同游戏类型之间存在显著差异。然而，对于市场营销人员来说，仍有一些机会可以在性价比相对较高的情况下吸引高价值用户。"
        },
        selectGenre = "选择类型",
        selectedGenre ='所有类型',
        sources = "来源：Moloco 预估的移动游戏 应用内购买（IAP）用户获取支出（2025年） & Moloco 广告主在各市场的总游戏应用内购买（IAP）收益（包括自然和付费渠道）数据（2023 年 8 月到 2024 年 8 月）。本分析不包含在中国大陆的投放，但包括中国本土的移动游戏 App 在海外市场的投放。",
        comma = '、',
    );
} else if (urlPath6.includes('/ko/')) {
    drawViz6(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz6-ko.csv',
        divId = "#geo-viz6",
        title = "글로벌 확장 기회 탐색",
        subtitle = "해당 자료를 통해 지역별 유저 가치, UA, 매출 특징에 대해 자세히 알아보세요. 각 국가 위에 마우스를 올려 해당 시장에 대한 개요를 확인해보세요.",
        selectCountry = "국가 그룹 선택",
        countriesAndRegions = "국가",
        uaText = "UA 지출",
        revenueText = "IAP 매출",
        arppuText = "ARPPU",
        groupLabels = { // No need to change Tier names in data
            'US and English Language': "미국 및 영어권 시장", 
            'East Asia Pacific': "동아시아 태평양",
            'Europe & Middle East (Group 1)': "유럽 및 중동 (그룹 1)", 
            'Europe & Middle East (Group 2)': "유럽 및 중동 (그룹 2)", 
            'LATAM Spanish Speaking': "라틴아메리카 스페인어 사용 국가", 
            'Global Developing Markets': "글로벌 개발도상국 시장"
        },
        groupInfo = {
            'US and English Language': "미국과 많은 영어권 국가는 모바일 게임 시장에서 가장 큰 규모를 자랑하며, UA 지출 및 매출에서 주요한 비중을 차지합니다. 미국은 총 IAP 매출에서 절대적인 우위를 보이지만, 다른 영어권 국가들에서도 많은 기회가 존재합니다. 해당 시장은 전반적으로 비슷한 진입 장벽과 일관된 장르별 유저 가치를 보입니다.", 
            'East Asia Pacific': "동아시아 태평양 시장은 대부분의 장르에서 평균 유저 가치가 가장 높습니다. 그러나 현지화와 문화적 차이로 인해 비현지 마케터들에게 진입 장벽이 높을 수 있습니다. 이 지역에서는 미드코어 장르(RPG, 전략, 시뮬레이션)가 유저 가치와 총 IAP 매출에서 상대적으로 강세를 보입니다.",
            'Europe & Middle East (Group 1)': "유럽과 중동은 유저 가치와 총 IAP 매출액을 기준으로 두 가지 그룹으로 나눌 수 있습니다. 그룹 1은 해당 지역에서 유저 가치와 IAP 매출이 상대적으로 높은 큰 시장들로 구성됩니다. 또한, 영어를 구사하는 인구 비율이 상당히 높아 많은 앱들에게 진입 장벽이 낮을 수 있습니다.", 
            'Europe & Middle East (Group 2)': "유럽과 중동은 유저 가치와 총 IAP 매출액을 기준으로 두 가지 그룹으로 나눌 수 있습니다. 그룹 2는 총 IAP 매출의 비율이 낮고, 유저 가치에 큰 차이가 있는 다양한 시장들로 구성됩니다. 시장 크기로 인해 진입이 더 어려울 수 있지만, 주요 시장을 묶어 도달 범위를 극대화하면 상당한 기회를 창출할 수 있습니다.", 
            'LATAM Spanish Speaking': "라틴 아메리카 시장은 유저 가치와 총 IAP 매출에 대한 기여도가 상대적으로 낮습니다. 그러나 스페인어를 사용하는 인구가 대부분이므로 현지화가 비교적 수월합니다. 이 지역의 국가들을 함께 묶어 공략하면 유저 확보가 용이해질 수 있습니다.", 
            'Global Developing Markets': "광범위한 개발도상국들로 구성된 이 시장은 장르별로 유저 가치 편차가 가장 큽니다. 그럼에도 불구하고, 마케터들은 곳곳에서 비용 효율적인 가격으로 고가치 유저들을 확보할 수 있는 기회를 찾을 수 있습니다."
        },
        selectGenre = "장르 선택",
        selectedGenre ='모든 장르',
        sources = "출처: 몰로코의 모바일 게임(IAP) 유저 확보 지출 추정치(2025년) 및 몰로코 광고주 시장별 총 게임 IAP 매출 (오가닉 및 페이드, 2023년 9월~2024년 9월 기준). 중국 본토 내 광고 비용은 제외되었으나 중국 기반 모바일 게임 앱의 해외 시장 광고 비용은 포함합니다.",
        comma = ', ',
    );
} else {
    drawViz6(
        dataSource = 'https://raw.githubusercontent.com/fbecerra/moloco-visualizations/refs/heads/master/data/data-viz6.csv',
        divId = "#geo-viz6",
        title = "Mapping global opportunities",
        subtitle = "Interact with this visualization to learn more about user value, user acquisition, and revenue dynamics by region. Hover over individual countries or regions for a market-level overview.",
        selectCountry = "Select country/region group",
        countriesAndRegions = "Countries and regions",
        uaText = "paid UA budget",
        revenueText = "gaming IAP revenue",
        arppuText = "D7 ARPPU",
        groupLabels = { // No need to change Tier names in data
            'US and English Language': "US and English Language", 
            'East Asia Pacific': "East Asia Pacific",
            'Europe & Middle East (Group 1)': "Europe & Middle East (Group 1)", 
            'Europe & Middle East (Group 2)': "Europe & Middle East (Group 2)", 
            'LATAM Spanish Speaking': "LATAM Spanish Speaking", 
            'Global Developing Markets': "Global Developing Markets"
        },
        groupInfo = {
            'US and English Language': "The U.S. and many English-language countries are the largest overall mobile gaming market, representing the majority of UA spend and revenue. While the U.S. dominates in total IAP revenue, opportunities exist across these markets, representing similar barriers to entry and consistent user value across genres.", 
            'East Asia Pacific': "East Asia Pacific markets have the highest average user value across most genres. Potentially a higher barrier to entry for non-domestic marketers due to localization and cultural differences. Midcore (RPG, Strategy, Simulation) sees relative strength in this region for user value and total IAP revenue.",
            'Europe & Middle East (Group 1)': "Europe and the Middle East can be grouped into two sets of markets based on user value and total IAP revenue. Group 1 represents some of the largest markets of opportunity within the region with higher user value and IAP revenue. Moreover, a significant percentage of English speakers among the population potentially lowering the barrier of entry for many apps.", 
            'Europe & Middle East (Group 2)': "Europe and the Middle East can be grouped into two sets of markets based on user value and total IAP revenue. Group 2 represents diverse markets with a lower share of the total IAP revenue and high variance in user value. Due to their size, these markets can perhaps be more challenging to enter, but may represent a significant opportunity by grouping key markets to maximize reach.", 
            'LATAM Spanish Speaking': "Latin America (LATAM) markets have relatively low user value and overall IAP revenue contribution. However, localization can be streamlined due to the population being largely Spanish speaking. For marketers, grouping these countries can help with UA viability.", 
            'Global Developing Markets': "Consisting of a wide range of developing countries, these markets have the largest variability of user value with significant differences across genres. However, there are pockets of opportunity for marketers to capture high-value users at a potentially cost efficient price."
        },
        selectGenre = "Select genre",
        selectedGenre ='All genres',
        sources = "Source: Moloco estimates of mobile gaming (IAP) user acquisition spend (2025) & Moloco advertiser total gaming IAP revenue (organic and paid) by market (Aug 2023 to Aug 2024). Spend in Mainland China is excluded from this analysis, but spend by Chinese marketers in non-domestic markets is included.",
        comma = ', ',
    );
}


