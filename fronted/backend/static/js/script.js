import { Data, Node } from "./data.js";
// import * as echarts from 'echarts';

// main.js
// 基于准备好的 DOM，初始化 ECharts 实例
var chartDom = document.getElementById('graph');
var myChart = echarts.init(chartDom);
var option;

var data = [{ id: 0, name: '苗药方剂', fixed: true, category: 0 }];
var links = [];
var loaded = [];
var kv = {0:0};
var kv_l = 1;

// 配置 ECharts 的图谱样式
option = {
    title: {
        text: '知识图谱'
    },
    tooltip: {},
    series: [
        {
            type: 'graph',
            layout: 'force',
            symbolSize: 50,
            roam: true,
            label: {
                normal: { show: true },
                formatter: '{b}'
            },
            force: {
                initLayout: 'circular', // 初始化节点位置
                // 调整斥力参数来控制节点间距
                repulsion: 400, // 增加斥力大小，使得节点间距更大
                gravity: 0.1,
                fixed:false
            },
            data: data,
            links: links,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                show: true,
                formatter: function (params) {
                    return params.data.label; // 使用连接数据中的 label 属性作为线上的内容
                },
                fontSize: 12,
                color: "#000",
            },
            lineStyle: {
                // 设置线的颜色
                color: "rgba(255, 0, 0, 1)", // 红色线
            },
            categories: [0, 1, 2]
        }
    ]
};



// 获取初始节点数据并设置初始图表选项
myChart.setOption(option);

async function addNode(id) {
    const node = await Data.getData(id);

    if (node) {
        // 添加新的节点和连接
        node.next_node.forEach((nextNode) => {
            data.push({
                id: nextNode.id,
                name: nextNode.name,
                category: nextNode.tp,
                select: { disabled: false }
            });
            kv[nextNode.id] = kv_l;
            if (nextNode.tp === 2) var label = "用方"; else var label = "属于";
            links.push({
                source: kv[node.id],
                target: kv_l,
                label: label
                // select: { disabled: true }
            });
            kv_l++;
            // 更新图谱
            myChart.setOption(option);
        });

    }
}

async function rmNode(id) {
}


// 点击事件处理函数
myChart.on('click', function (params) {
    if (loaded.includes(params.data.id)) { rmNode(params.data.id); }
    else {
        addNode(params.data.id);
        loaded.push(params.data.id);
    }

});

// 拖拽事件处理函数
let infoBox = document.getElementById('info-box');
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

infoBox.addEventListener('mousedown', function(event) {
    isDragging = true;
    offsetX = event.clientX - infoBox.offsetLeft;
    offsetY = event.clientY - infoBox.offsetTop;
});

document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        infoBox.style.left = (event.clientX - offsetX) + 'px';
        infoBox.style.top = (event.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

