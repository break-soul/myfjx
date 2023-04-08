
// 通过 AJAX 请求从 API 获取数
function loadData(url) {
    return $.get(url);
}


// 根据数据创建图谱节点
function createNode(nodeData) {
    const node = d3.select("#knowledge-graph")
        .append("div")
        .attr("class", "node")
        .attr("id", `node-${nodeData.id}`)
        .text(nodeData.name);

    node.on("click", () => {
        expandNode(nodeData);
    });

    return node;
}


// 展开节点
async function expandNode(nodeData) {
    if (nodeData.tp === 0) {
        const bookData = await loadData(`/api/get_book`);
        console.log(bookData); // 添加此行以打印数据
        d3.select("#knowledge-graph").html("");
        if (Array.isArray(bookData.next_node)) {
            bookData.next_node.forEach(childNodeData => {
                createNode(childNodeData);
            });
        }
        bookData.next_node.forEach(childNodeData => {
            createNode(childNodeData);
        });
    } else if (nodeData.tp === 1) {
        const titleData = await loadData(`/api/get_title/${nodeData.id}`);
        d3.select(`#node-${nodeData.id}`).html("");
        titleData.next_node.forEach(childNodeData => {
            const childNode = createNode(childNodeData);
            childNode.style("display", "block");
        });
    } else if (nodeData.tp === 2) {
        const nodeData = await loadData(`/api/get_node/${nodeData.id}`);
        d3.select(`#node-${nodeData.id}`).html("");
        nodeData.next_node.forEach(childNodeData => {
            const childNode = createNode(childNodeData);
            childNode.style("display", "block");
        });
    }

    displayData(nodeData.data);
}


// 在侧边栏显示节点的数据
function displayData(data) {
    let content = '';

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            content += `<strong>${key}</strong>: ${data[key]}<br>`;
        }
    }

    d3.select("#data-content").html(content);
}



// 获取书籍数据并创建图谱
async function init() {
    const bookDataRaw = await loadData("/api/get_book");
    const bookData = JSON.parse(bookDataRaw);
    
    // 创建 book 节点
    createNode(bookData);

    // 处理子节点
    bookData.next_node.forEach(nodeData => {
        createNode(nodeData);
    });
}

init();
