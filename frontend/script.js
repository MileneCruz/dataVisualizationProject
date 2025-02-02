// Configurações do gráfico
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Criar o SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Escalas
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Eixos
const xAxis = d3.axisBottom(x).ticks(10);
const yAxis = d3.axisLeft(y);

// Carregar os dados
d3.json("data.json").then(data => {
    // Formatando os dados
    data.forEach(d => {
        d.year = +d.year;
        d.inflation_adjusted_gross = +d.inflation_adjusted_gross;
    });

    // Definir os domínios das escalas
    x.domain(d3.extent(data, d => d.year));
    y.domain([0, d3.max(data, d => d.inflation_adjusted_gross)]);

    // Adicionar os eixos
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    // Linhas
    const genres = [...new Set(data.map(d => d.genre))];
    genres.forEach(genre => {
        const genreData = data.filter(d => d.genre === genre);
        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.inflation_adjusted_gross));

        svg.append("path")
            .datum(genreData)
            .attr("fill", "none")
            .attr("stroke", color(genre))
            .attr("stroke-width", 2)
            .attr("d", line);
    });

    // Legenda
    svg.selectAll(".legend")
        .data(genres)
        .enter()
        .append("text")
        .attr("x", width - 100)
        .attr("y", (d, i) => 20 + i * 20)
        .text(d => d)
        .style("fill", d => color(d));
});