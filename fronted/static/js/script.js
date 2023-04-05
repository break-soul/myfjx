$(document).ready(function () {
    function fetchData(url) {
        return $.getJSON(url);
    }

    function sortNodes(a, b) {
        let aNumber = parseInt(a.name.match(/^\d+/));
        let bNumber = parseInt(b.name.match(/^\d+/));

        if (!isNaN(aNumber) && !isNaN(bNumber)) {
            return aNumber - bNumber;
        } else {
            return a.name.localeCompare(b.name);
        }
    }

    function buildNode(node) {
        let $li = $("<li>");
        let btnClass = node.tp === 0 ? "btn-book" : (node.tp === 1 ? "btn-title" : "btn-node");
        let $button = $("<button>")
            .addClass(`btn btn-sm ${btnClass}`)
            .text(node.name)
            .attr("data-id", node.id)
            .attr("data-tp", node.tp)
            .attr("data-data", JSON.stringify(node.data))
            .attr("data-next", JSON.stringify(node.next_node));
        $button.on("click", function () {
            let $this = $(this);
            if ($this.hasClass("expanded")) {
                $this.siblings("ul").remove();
                $this.removeClass("expanded");
            } else {
                let data = JSON.parse($this.attr("data-data"));
                let dataHtml = "";
                for (let key in data) {
                    dataHtml += `<span class="key">${key}:</span> ${data[key]}<br>`;
                }
                $("#data-display").html(dataHtml);

                let nextNode = JSON.parse($this.attr("data-next"));

                // 对 nextNode 数组进行排序
                nextNode.sort(sortNodes);

                // 构建下一层节点并添加到 DOM
                let $ul = $("<ul>").addClass("list-unstyled ml-4");
                nextNode.forEach(function (item) {
                    let apiUrl = item.tp === 1 ? `/api/get_title/${item.id}` : `/api/get_node/${item.id}`;
                    fetchData(apiUrl).done(function (data) {
                        if (data.status === 0) {
                            let $node = buildNode(data);
                            $ul.append($node);
                        } else {
                            console.error("API 请求失败");
                        }
                    });
                });

                $this.parent().append($ul);
                $this.addClass("expanded");
            }
        });

        $li.append($button);

        return $li;
    }

    fetchData("/api/get_book").done(function (data) {
        if (data.status === 0) {
            // 对直接链接到 book 的节点进行排序
            data.next_node.sort(sortNodes);

            let $rootNode = buildNode(data);
            $("#graph").append($rootNode);
        } else {
            console.error("API 请求失败");
        }
    });

    $("#toggle-theme").on("click", function () {
        $("body").toggleClass("night-mode");
        if ($("body").hasClass("dark-mode")) {
            $("#data-display").css({
                "background-color": "#343a40",
                color: "#f8f9fa",
            });
        } else {
            $("#data-display").css({
                "background-color": "#f8f9fa",
                color: "#343a40",
            });
        }
    });
});

(function () {
    let dataDisplay = document.getElementById("data-display");
    let isMouseDown = false;
    let startX, startY, initialX, initialY;

    dataDisplay.addEventListener("mousedown", function (event) {
        event.preventDefault();
        isMouseDown = true;
        startX = event.clientX;
        startY = event.clientY;
        initialX = dataDisplay.getBoundingClientRect().left;
        initialY = dataDisplay.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", function (event) {
        if (!isMouseDown) return;
        event.preventDefault();
        let dx = event.clientX - startX;
        let dy = event.clientY - startY;
        dataDisplay.style.left = initialX + dx + "px";
        dataDisplay.style.top = initialY + dy + "px";
    });

    document.addEventListener("mouseup", function () {
        isMouseDown = false;
    });
})();
