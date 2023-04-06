document.addEventListener("DOMContentLoaded", function () {
    fetchData("/api/get_book", initGraph);

    document.getElementById("toggle-theme").addEventListener("click", function () {
        toggleTheme();
    });
});

function fetchData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = function () {
        callback(xhr.response);
    };
    xhr.send();
}


function initGraph(data) {
    var graph = d3.select("#graph");
    var nodes = graph.selectAll(".node")
        .data(data.next_node)
        .enter()
        .append("button")
        .attr("class", function (d) {
            return getNodeClass(d.tp);
        })
        .text(function (d) {
            return d.name;
        })
        .on("click", function (d) {
            handleClickNode(this, d.tp, d.id);
        });
}

function handleClickNode(node, tp, id) {
    var currentNode = d3.select(node);
    if (currentNode.classed("expanded")) {
        currentNode.classed("expanded", false);
        currentNode.select("div").remove();
        return;
    }

    fetchData(getApiUrl(tp, id), function (data) {
        var nextNodesContainer = d3.select(node)
            .classed("expanded", true)
            .append("div")
            .style("padding-left", "20px");

        var nextNodes = nextNodesContainer.selectAll(".node")
            .data(data.next_node)
            .enter()
            .append("button")
            .attr("class", function (d) {
                return getNodeClass(d.tp);
            })
            .text(function (d) {
                return d.name;
            })
            .on("click", function (d) {
                handleClickNode(this, d.tp, d.id);
            });

        displayData(data.data);
    });
}

function getNodeClass(tp) {
    switch (tp) {
        case 0:
            return "btn btn-book";
        case 1:
            return "btn btn-title";
        case 2:
            return "btn btn-node";
        default:
            return "";
    }
}

function getApiUrl(tp, id) {
    switch (tp) {
        case 1:
            return "/api/get_title/" + id;
        case 2:
            return "/api/get_node/" + id;
        default:
            return "";
    }
}

function displayData(data) {
    var dataDisplay = document.getElementById("data-display");
    dataDisplay.innerHTML = "";
    for (var key in data) {
        var p = document.createElement("p");
        p.innerHTML = "<span class='key'>" + key + ":</span> " + data[key];
        dataDisplay.appendChild(p);
    }
}

function toggleTheme() {
    var root = document.documentElement;
    var isDarkMode = root.style.getPropertyValue("--text-color") === "#f8f9fa";

    if (isDarkMode) {
        root.style.setProperty("--bg-color", "#f8f9fa");
        root.style.setProperty("--bg1-color", "#dee2e6");
        root.style.setProperty("--text-color", "#343a40");
    } else {
        root.style.setProperty("--bg-color", "#343a40");
        root.style.setProperty("--bg1-color", "#495057");
        root.style.setProperty("--text-color", "#f8f9fa");
    }
}
