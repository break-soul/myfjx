$(document).ready(function () {
    const apiUrl = "/api/";

    function fetchData(endpoint, callback) {
        $.getJSON(apiUrl + endpoint, function (data) {
            callback(data);
        });
    }

    function displayNodeInfo(data) {
        $("#sidebar").empty();
        for (const key in data) {
            $("#sidebar").append(`
                <div class="sidebar-entry">
                    <span class="sidebar-key">${key}:</span>
                    <span>${data[key]}</span>
                </div>
            `);
        }
    }

    // ... 上面的代码

    function createGraph(data) {
        const graph = d3.select("#knowledge-graph");
        graph.selectAll("g").remove();

        const nodes = data;
        const links = [];

        nodes.forEach((node, i) => {
            node.next_node.forEach((nextNode) => {
                links.push({
                    source: node.id,
                    target: nextNode.id,
                });
            });
        });

        const width = graph.node().getBoundingClientRect().width;
        const height = 500;

        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-200))
            .force("link", d3.forceLink(links).distance(100))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2));

        const svg = graph.append("svg")
            .attr("width", width)
            .attr("height", height);

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6);

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter().append("g");

        node.append("circle")
            .attr("r", 10)
            .attr("fill", (d) => d.tp === 0 ? "#69b3a2" : "#4299e1")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("text")
            .text((d) => d.name)
            .attr("dy", "0.35em")
            .attr("dx", "1em");

        node.on("click", function (event, d) {
            fetchData("get_node/" + d.id, (data) => {
                displayNodeInfo(data.data);
                if (data.next_node.length > 0) {
                    createGraph(nodes.concat(data.next_node));
                }
            });
        });

        simulation.on("tick", () => {
            link
                .attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            node
                .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    // ... 其他代码

    fetchData("get_book", (data) => {
        $("#title").text(data.name);
        $("#author").text(data.data.author);
        displayNodeInfo(data.data);

        data.next_node.unshift({
            name: data.name,
            id: data.id,
            tp: data.tp,
            next_node: data.next_node,
        });

        createGraph(data.next_node);
    });
});
