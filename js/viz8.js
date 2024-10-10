function drawViz7() {
    const gray = '#ECEDEE';
    const blue = '#0280FB';

    d3.select("#geo-viz8")
        .style('font-family', 'Montserrat')
        .style('font-size', '14px')
    
    addTitle("#geo-viz8", "By leveraging paid UA, you can unlock opportunities in </br>markets you might not have considered")
    addSubtitle("#geo-viz8", "Benchmarked performance for each market by Cost, Payer Acquisition, Value, </br>and overall Revenue Potential, Aug 2023-Aug 2024")

    const legendWrapper = d3.select("#geo-viz8")
        .append("div")
            .attr("id", "legend-wrapper")
            .style("padding", "12px 24px")
            .style("border", "2px solid #ECEDEE")
            .style("display", 'inline-block')
            .style("margin-bottom", '24px');

    addBoldText("#legend-wrapper", "How to read this graphic");
    addSubtitle("#legend-wrapper", "High and low values can have different meanings for each metric. </br>The icons help you interpret them.")

    const legendItems = ['Good', 'Moderate', 'Limited', 'Opportunity'];
    const legendSvg = {
        'Good': '<svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 0.499999C5.59644 0.499998 1.69631e-06 6.09644 1.09278e-06 13C4.89256e-07 19.9036 5.59644 25.5 12.5 25.5C19.4036 25.5 25 19.9036 25 13C25 6.09644 19.4036 0.5 12.5 0.499999ZM5.40541 17.3919L20.2703 17.3919L12.8378 5.90541L5.40541 17.3919Z" fill="#50B650"/></svg>',
        'Moderate': '<svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0.5C5.6 0.5 0 6.1 0 13C0 19.9 5.6 25.5 12.5 25.5C19.4 25.5 25 19.9 25 13C25 6.1 19.4 0.5 12.5 0.5ZM18.75 14.25H6.25V11.75H18.75V14.25Z" fill="#AEABAB"/></svg>',
        'Limited': '<svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 25.5C19.4036 25.5 25 19.9036 25 13C25 6.09644 19.4036 0.5 12.5 0.5C5.59644 0.5 0 6.09644 0 13C0 19.9036 5.59644 25.5 12.5 25.5ZM19.5946 8.60811L4.72973 8.60811L12.1622 20.0946L19.5946 8.60811Z" fill="black"/></svg>',
        'Opportunity': '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15ZM14.7165 5.09622C14.9994 4.8483 15.4222 4.8483 15.7051 5.09622L21.0339 9.76603C21.1964 9.90844 21.2896 10.114 21.2896 10.3301V18.4586L21.2905 18.4591L21.2896 18.4606V19.6697C21.2896 19.8858 21.1964 20.0914 21.0339 20.2338L15.7051 24.9036C15.4222 25.1515 14.9994 25.1515 14.7165 24.9036L9.38768 20.2338C9.22517 20.0914 9.13198 19.8858 9.13198 19.6697V10.3301C9.13198 10.114 9.22517 9.90844 9.38768 9.76603L13.7107 5.97762V5.87999H13.8221L14.7165 5.09622ZM13.7107 7.97209L10.6711 10.6358L11.5896 11.2788C11.5992 11.2673 11.6092 11.256 11.6195 11.245L13.9757 8.73682H13.7107V7.97209ZM15.2107 7.76709V6.65759L15.2108 6.65751L18.7688 9.77553L17.9077 10.2922L15.7578 8.00358C15.616 7.85268 15.4182 7.76709 15.2112 7.76709C15.211 7.76709 15.2108 7.76709 15.2107 7.76709ZM19.7896 10.9124V17.504L19.0062 17.0055V11.7585C19.0062 11.6431 18.9796 11.5302 18.9296 11.4283L19.7896 10.9124ZM10.632 19.1254V12.4394L11.4161 12.9884V18.2413C11.4161 18.3818 11.4556 18.5185 11.5286 18.6363L10.632 19.1254ZM11.69 20.2569L14.991 23.1497V22.1996C14.8675 22.1617 14.7547 22.0922 14.6645 21.9962L12.5764 19.7734L11.69 20.2569ZM19.7896 19.3297L16.491 22.2204V21.2629H16.4467L18.8028 18.7548C18.8225 18.7339 18.8409 18.7119 18.8579 18.6891L19.7896 19.282V19.3297ZM12.9161 17.9443V12.0555L15.2112 9.61248L17.5062 12.0555V17.9443L15.2112 20.3873L12.9161 17.9443Z" fill="#C368F9"/></svg>'
    }

    const legend = d3.select("#legend-wrapper")
        .append("div")

    legendItems.forEach(li => {
        const item = legend.append("div")
            .style("display", 'inline-block')
            .style("margin-right", '24px')
            .style("line-height", '24px');

        item.append("span")
            .style("vertical-align", "bottom")
            .style("margin-right", "8px")
            .html(legendSvg[li])

        item.append("span")
            .html(li)
    });

    addBoldText("#geo-viz8", 'Select genre');

    const buttons = d3.select("#geo-viz8")
        .append("div")
            .style("margin-top", '12px');

    Promise.all([
        d3.csv('./data/data-viz8.csv')
    ]).then((data) => {
        const markets = data[0];

        markets.forEach(market => {
            market.value = +market.value
        })

        let selectedGenre = 'All genres';
        const genres = getUniquesMenu(markets, 'genre');

        buttons.selectAll(".button")
            .data(genres)
            .join("div")
                .attr("class", 'button')
                .style("background-color", d => d === selectedGenre ? blue : gray)
                .style("color", d => d === selectedGenre ? "#FFFFFF" : "#000000")
                .style("font-weight", d => d === selectedGenre ? 700 : 400)
                .style("cursor", "pointer")
                .style("padding", "10px 16px")
                .style("display", 'inline-block')
                .style("margin-right", "8px")
                .style("margin-bottom", "32px")
                .html(d => d)
                .on("click", (evt, d) => {
                    if (selectedGenre !== d) {
                        selectedGenre = d;
                        d3.selectAll(".button")
                            .style("background-color", d => d === selectedGenre ? blue : gray)
                            .style("color", d => d === selectedGenre ? "#FFFFFF" : "#000000")
                            .style("font-weight", d => d === selectedGenre ? 700 : 400);
                        updatePlot();
                    }
                });

        const nameGrid = d3.select("#geo-viz8")
                .append("div")
                .attr("class", 'grid-wrapper')

        const columnLabels = ['', 'Geography', 'CPP', 'ARPPU', 'Revenue'];

        nameGrid.selectAll(".column-name")
            .data(columnLabels)
            .join("div")
                .attr("class", 'column-name')
                .html(d => d);

        const groups = ['US and English Language Markets', 'Europe & Middle East (Tier 1)', 
            'LATAM Spanish Speaking', 'East Asia Pacific',
            'Europe & Middle East (Tier 2)', 'Global Developing Markets'];
        const groupLabels = {
            'US and English Language Markets': "US and English Language", 
            'Europe & Middle East (Tier 1)': "Tier 1 European & Middle East", 
            'LATAM Spanish Speaking': "LATAM Spanish Language", 
            'East Asia Pacific': "East Asia Pacific",
            'Europe & Middle East (Tier 2)': "Tier 2 European & Middle East", 
            'Global Developing Markets': "Global Developing Markets"
        }

        function getUniques(df, thisVariable) {

            var thisList = df.map(o => o[thisVariable]);
        
            function uniq(a) {
                return a.filter(function(item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });
            }
        
            var uniqueList = uniq(thisList);
        
            return uniqueList;
        }

        function nameNoSpaces(name) {
            return name.toLowerCase().split(" ").join("")
                .replace('(', '').replace(')', '').replace("&", '');
          }

        const dataGrid = d3.select("#geo-viz8")
            .selectAll(".data-grid")
            .data(groups)
            .join("div")
                .attr("class", 'data-grid')

        function updatePlot() {
            const gridRow = dataGrid.selectAll(".grid-row")
                .data(d => getUniques(markets.filter(market => (market.Tier === d) & (market.genre === selectedGenre)), 'Market full name').map((market, i) => {
                    return {
                        'Tier': d,
                        'Market full name': market,
                        'data': markets.filter(e => (e.Tier === d) & (e['Market full name'] === market) & (e.genre === selectedGenre)),
                        'index': i
                    }
                }))
                .join("div")
                    // .attr("class", (d, i) => groupLabels[d.Tier] === d['Market full name'] ? 'grid-row grid-wrapper row-head' : `grid-row grid-wrapper row-name row-${nameNoSpaces(d.Tier)}`)
                    .attr("class", (d, i) => i === 0 ? 'grid-row grid-wrapper row-head' : `grid-row grid-wrapper row-item row-${nameNoSpaces(d.Tier)}`)
                    .on("click", (evt, d) => {
                        if (d.index === 0) {
                            let row = gridRow.filter(gr => gr === d);
                            let clicked = row.classed("clicked");
                            d3.selectAll(`.row-${nameNoSpaces(d.Tier)}`) 
                                .style("display", clicked === false ? "grid" : "none");

                            row.classed("clicked", !clicked);
                    }
                    })

            gridRow.selectAll(".row-opportunity")
                .data(d => [d.data[0].OPPORTUNITY])
                .join("div")
                    .attr("class", 'row-opportunity')
                    .html(d => d === 'YES' ? legendSvg['Opportunity'] : '');

            gridRow.selectAll(".row-name")
                .data(d => [d])
                .join("div")
                    .attr("class", 'row-name')
                    .style("font-weight", d => d.index === 0 ? 700 : 400)
                    .html(d => d['Market full name']);

            gridRow.selectAll(".row-cpp")
                .data(d => {
                    const thisValue = d.data.filter(d => d['type of value'] === '(Paid UA) CPP')[0];
                    const squaresHtml = d3.range(5).map(e => {
                        const color = e < thisValue.value ? blue : gray;
                        return `<div class="square" style="display: inline-block;margin-right:2px;width: 15px;height: 15px; background-color: ${color}"></div>`
                    }).join("");
                    const svgHtml = thisValue['good/bad'] === 'good' ? legendSvg['Good']: thisValue['good/bad'] === 'bad' ? legendSvg['Limited'] : legendSvg['Moderate'];
                    const levelHtml = thisValue.value === 3 ? 'medium' : thisValue.value < 3 ? 'low' : 'high';
                    return [squaresHtml + svgHtml + '</br>' + levelHtml]
                })
                .join("div")
                    .attr("class", 'row-cpp')
                    .html(d => d)

            gridRow.selectAll(".row-arppu")
                .data(d => {
                    const thisValue = d.data.filter(d => d['type of value'] === '(Paid UA) D7 ARPPU')[0];
                    const squaresHtml = d3.range(5).map(e => {
                        const color = e < thisValue.value ? blue : gray;
                        return `<div class="square" style="display: inline-block;margin-right:2px;width: 15px;height: 15px; background-color: ${color}"></div>`
                    }).join("");
                    const svgHtml = thisValue['good/bad'] === 'good' ? legendSvg['Good']: thisValue['good/bad'] === 'bad' ? legendSvg['Limited'] : legendSvg['Moderate'];
                    const levelHtml = thisValue.value === 3 ? 'medium' : thisValue.value < 3 ? 'low' : 'high';
                    return [squaresHtml + svgHtml + '</br>' + levelHtml]
                })
                .join("div")
                    .attr("class", 'row-arppu')
                    .html(d => d)

            const maxWidthBar = 100;
            
            gridRow.selectAll(".row-revenue")
                .data(d => {
                    const thisValue = d.data.filter(d => d['type of value'] === 'Revenue Potential')[0];
                    const rectHtml = `<div class="bar" style="display: inline-block;margin-right:10px;width: ${thisValue.value * maxWidthBar}px;height: 15px; background-color: ${blue}"></div>`;
                    const numberHtml = `<div class='bar-value'>${(thisValue.value * 100).toFixed(0)}%</div>`;
                    return [rectHtml + numberHtml];
                })
                .join("div")
                    .attr("class", 'row-revenue')
                    .html(d => d)
        }

        updatePlot();

        
        
    })
};

drawViz7();