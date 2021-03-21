
var ol = window.onload;

var TP = ["condition", "outcome", "yes", "no", ""];

var inodes = [
    {
        id: 0,
        text: "START",
        c: "#8ffbb8",
        t: TP[4]
    },
    {
        id: 1,
        text: "Build a product",
        c: "#fe997e",
        t: TP[0]
    },
    {
        id: 2,
        text: "Product complete with bugs",
        c: "#fe997e",
        t: TP[0]
    },
    {
        id: 3,
        text: "Client say no",
        c: "#fe997e",
        t: TP[0]
    },
    {
        id: 4,
        text: "Lose job",
        c: "#999",
        t: TP[1]
    },
    {
        id: 5,
        text: "Endless day of fix bugs",
        c: "#999",
        t: TP[1]
    },
    {
        id: 6,
        text: "Build a useless tool",
        c: "#fe997e",
        t: TP[0]
    },
    {
        id: 7,
        text: "Nobody use it",
        c: "#999",
        t: TP[1]
    },
    {
        id: 8,
        text: "Useless life :D",
        c: "#999",
        t: TP[1]
    }
];
var ilinks = [
    {
        id: 0,
        source: 0,
        target: 1,
        l: TP[4]
    },
    {
        id: 1,
        source: 1,
        target: 2,
        l: TP[2]
    },
    {
        id: 2,
        source: 2,
        target: 3,
        l: TP[2]
    },
    {
        id: 3,
        source: 3,
        target: 4,
        l: TP[2]
    },
    {
        id: 4,
        source: 3,
        target: 5,
        l: TP[3]
    },
    {
        id: 5,
        source: 1,
        target: 6,
        l: TP[3]
    },
    {
        id: 6,
        source: 6,
        target: 7,
        l: TP[2]
    },
    {
        id: 7,
        source: 6,
        target: 8,
        l: TP[3]
    }
];

var t2c = function() {
    var nodes = inodes;
    var links = ilinks;
    var width = 400;
    var height = 200;

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var svg = d3.select("#dis").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("defs")
        .selectAll("marker")
        .data(["arrow"])
        .enter()
            .append("marker")
                .attr("id", "ar")
                .attr("viewBox", "0 0 4 4")
                .attr("refX", 9)
                .attr("refY", 2)
                .attr("markerWidth", 4)
                .attr("markerHeight", 4)
                .attr("orient", "auto")
            .append("path")
                .attr("d", "M 0 0 L 4 2 L 0 4")
                .attr("stroke", "#999")
                .attr("stroke-width", 0.5)
                .attr("stroke-opacity", 0.3)
                .attr("fill", "none");

    /*
    var link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.3)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1)
        .attr("marker-end", "url(#ar)")
    ;
    */
    var link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3)
        .selectAll("g")
        .data(links)
        .join("g")
    ;
    var line = link.append("line")
        .attr("stroke-width", 1)
        .attr("marker-end", "url(#ar)");
    var text = link.append("text")
                .attr("font-size", 4)
                .text(d => d.l);

    var drag = function(simulation) {
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    };

    var node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation))
        .attr("transform", d => "translate("+d.x+","+d.y+")");
    ;
    var nodeShape = node.append("circle")
        .attr("r", 5)
        .attr("fill", d => d.c)
    ;
    var nodeText = node.append("text")
                        .attr("font-size", 4)
                        .text(d => d.text);


    simulation.on("tick", () => {
        text
            .attr("x", d => (d.source.x + d.target.x)/2)
            .attr("y", d => (d.source.y + d.target.y)/2)
        line
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => "translate("+d.x+","+d.y+")");
    });

    //invalidation.then(() => simulation.stargetp());
};

var dah = {
    name: "Build a product",
    children: [
        {
            name: "Product complete with bugs",
            children: [
                {
                    name: "Client say no",
                    children: [
                        {
                            name: "Lose job"
                        },{
                            name: "Endless day of fix bugs"
                        }
                    ]
                }
            ]
        },
        {
            name: "Build a useless tool",
            children: [
                {
                    name: "Nobody use it"
                },{
                    name: "Useless life"
                }
            ]
        }
    ]
};

var t2cv2 = function() {
    var root = d3.hierarchy(dah);
    var cluster = d3.cluster().nodeSize([50, 30])(root);

    var width = 300;
    var height = 200;

    var svg = d3.select("#dis").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("defs")
            .append("marker")
                .attr("id", "aar")
                .attr("viewBox", "0 0 4 4")
                .attr("refX", 6)
                .attr("refY", 2)
                .attr("markerWidth", 4)
                .attr("markerHeight", 4)
                .attr("orient", "auto")
            .append("path")
                .attr("d", "M 0 0 L 4 2 L 0 4")
                .attr("stroke", "#999")
                .attr("stroke-width", 0.5)
                .attr("stroke-opacity", 0.3)
                .attr("fill", "none");

    var g = svg.append("g")
            .attr("transform", "translate(150,30)");

    const link = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1)
        .selectAll("path")
        .data(root.links())
        .join("path")
            .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y))
            .attr("marker-end", "url(#aar)");

    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);
    node.append("text")
        .attr("font-size", 4)
        .attr("y", 5)
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .text(d => d.data.name);
};

window.onload = function() {
    if (ol instanceof Function) {
        ol();
    }
    t2c();
    t2cv2()
};

