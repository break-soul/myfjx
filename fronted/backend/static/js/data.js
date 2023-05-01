class Node {
    constructor(id, name, tp, data, pre_node, next_node) {
        this.name = name,
            this.id = id,
            this.tp = tp,
            this.data = data,
            this.pre_node = pre_node,
            this.next_node = next_node
    }
};

async function loadData(url) {
    return $.get(url);
}

var Data = {};

Data.loadData = [];
Data.getData = async function (id) {
    const rawData = await loadData("/api/node/" + id)
    const data = JSON.parse(rawData);
    if (data.status == 0) {
        return new Node(data.id, data.name, data.tp, data.data, data.pre_node, data.next_node);
    }
    else {
        console.error("API 请求失败");
    }
}

export { Node, Data };
