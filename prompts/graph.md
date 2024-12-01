I want to visualize like a graph, the data will get from http://localhost:8000/graph, the format of the data
```{
    "nodes": [
        {
            "id": "LA-S-1",
            "label": "Linear Algebra",
            "type": "subject",
            "tag": "linear-algebra"
        },
        {
            "id": "LA-GT-1",
            "label": "Vector Spaces",
            "type": "general-topic",
            "tag": "vector-spaces"
        },
        {
            "id": "LA-GT-2",
            "label": "Matrices",
            "type": "general-topic",
            "tag": "matrices"
        },
        {
            "id": "LA-GT-3",
            "label": "Determinants",
            "type": "general-topic",
            "tag": "determinants"
        }
    ],
    "links": [
        {
            "src_node_id": "LA-S-1",
            "dst_node_id": "LA-GT-1",
            "label": "contains",
            "bidirectional": false
        },
        {
            "src_node_id": "LA-S-1",
            "dst_node_id": "LA-GT-2",
            "label": "contains",
            "bidirectional": false
        },
        {
            "src_node_id": "LA-S-1",
            "dst_node_id": "LA-GT-3",
            "label": "contains",
            "bidirectional": false
        },
        {
            "src_node_id": "LA-S-1",
            "dst_node_id": "LA-GT-4",
            "label": "contains",
            "bidirectional": false
        }
    ]
}
```

- eche node type have differnetn collor and size
- node type: subject > general-topic > topic > concept
- default small will be hiden unless user click to big node, click again to hiden
- have options to use d3js, cytoscapejs, visjs, sigmajs