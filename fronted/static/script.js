$(document).ready(function () {
    function fetchData(url) {
        return $.getJSON(url);
    }

    function buildNode(node) {
        let $li = $("<li>");
        let btnClass = node.tp === 0 ? "btn-book" : (node.tp === 1 ? "btn-title" : "btn-node");
        let $button = $("<button>")
            .addClass(`btn btn-sm ${btnClass}`)
            .text(node.name)
            .attr("data-id", node.id)
            .attr("data-tp", node.tp)
            .attr("data-next", JSON.stringify(node.next_node))
            .attr("data-data", JSON.stringify(node.data))
            .on("click", function () {
                let $this = $(this);
                if ($this.hasClass("expanded")) {
                    $this.siblings("ul").remove();
                    $this.removeClass("expanded");
                } else {
                    let data = JSON.parse($(this).attr("data-data"));
                    let dataHtml = "";
                    for (let key in data) {
                        dataHtml += `<span class="key">${key}:</span> ${data[key]}<br>`;
                    }
                    $("#data-display").html(dataHtml);

                    let nextNode = JSON.parse($(this).attr("data-next"));
                    let $ul = $("<ul>").addClass("list-unstyled ml-4");
                    nextNode.forEach(function (item) {
                        let apiUrl = item.tp === 1 ? `/api/get_title/${item.id}` : `/api/get_node/${item.id}`;
                        fetchData(apiUrl).done(function (nodeData) {
                            if (nodeData.status === 0) {
                                let $node = buildNode(nodeData);
                                $ul.append($node);
                            } else {
                                console.error("API 请求失败");
                            }
                        });
                    });

                    $(this).parent().append($ul);
                    $(this).off("click");
                    $this.addClass("expanded");
                }
            });

        $li.append($button);

        return $li;
    }

    fetchData("/api/get_book").done(function (data) {
        if (data.status === 0) {
            let $rootNode = buildNode(data);
            $("#graph").append($rootNode);
        } else {
            console.error("API 请求失败");
        }
    });
});
