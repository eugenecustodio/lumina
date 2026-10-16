package com.lumina.engine;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * A weighted graph of everywhere a picker can walk.
 *
 * Every walkway square is a node, joined to the walkway squares above, below, left and right
 * (cost 1). Each corridor link adds a corridor node, joined to its walkway square (cost 1) and to
 * the neighbouring corridor nodes along the dispatch edge (cost = distance between them).
 */
public final class WarehouseGraph {

    /** A node is either a walkway square or a point on the corridor (corridorIndex >= 0). */
    public record Node(Warehouse.Square square, int corridorIndex) {
        public boolean isCorridor() { return corridorIndex >= 0; }
    }

    /** A one-way half of an undirected edge. */
    public record Edge(int to, double cost) {}

    private final List<Node> nodes = new ArrayList<>();
    private final List<List<Edge>> adjacency = new ArrayList<>();
    private final Map<Warehouse.Square, Integer> squareIndex = new HashMap<>();
    private final Map<String, Warehouse.Zone> zones = new HashMap<>();

    public WarehouseGraph(Warehouse warehouse) {
        for (Warehouse.Zone zone : warehouse.zones()) {
            zones.put(zone.name(), zone);
            for (int row = 1; row <= zone.rows(); row++)
                for (int col = 1; col <= zone.cols(); col++)
                    if (zone.isWalkway(row, col)) addNode(new Node(new Warehouse.Square(zone.name(), row, col), -1));
        }
        // walkway squares connect to their four neighbours
        for (int i = 0; i < nodes.size(); i++) {
            Warehouse.Square s = nodes.get(i).square();
            for (Warehouse.Square n : List.of(s.neighbour(0, 1), s.neighbour(1, 0))) {
                Integer j = squareIndex.get(n);
                if (j != null) connect(i, j, 1);
            }
        }
        // corridor nodes, linked to their walkway square and to each other in order along the corridor
        List<int[]> placed = new ArrayList<>(); // {nodeIndex, linkIndex}
        List<Warehouse.CorridorLink> links = warehouse.corridor();
        for (int k = 0; k < links.size(); k++) {
            Integer squareNode = squareIndex.get(links.get(k).square());
            if (squareNode == null) continue;
            int corridorNode = addNode(new Node(links.get(k).square(), k));
            connect(corridorNode, squareNode, 1);
            placed.add(new int[] {corridorNode, k});
        }
        placed.sort(Comparator.comparingDouble(p -> links.get(p[1]).position()));
        for (int k = 1; k < placed.size(); k++) {
            double gap = Math.abs(links.get(placed.get(k)[1]).position() - links.get(placed.get(k - 1)[1]).position());
            connect(placed.get(k - 1)[0], placed.get(k)[0], gap);
        }
    }

    private int addNode(Node node) {
        nodes.add(node);
        adjacency.add(new ArrayList<>());
        if (!node.isCorridor()) squareIndex.put(node.square(), nodes.size() - 1);
        return nodes.size() - 1;
    }

    private void connect(int a, int b, double cost) {
        adjacency.get(a).add(new Edge(b, cost));
        adjacency.get(b).add(new Edge(a, cost));
    }

    public int size() { return nodes.size(); }
    public Node node(int index) { return nodes.get(index); }
    public List<Edge> edges(int index) { return adjacency.get(index); }

    /** The node index of a walkway square, or -1 if that square is not a walkway. */
    public int indexOf(Warehouse.Square square) {
        Integer i = square == null ? null : squareIndex.get(square);
        return i == null ? -1 : i;
    }

    /** Walkway squares next to a storage location: where a picker can stand to pick from it. */
    public List<Integer> accessPoints(Warehouse.Square location) {
        List<Integer> result = new ArrayList<>();
        if (location == null || !zones.containsKey(location.zone())) return result;
        for (int[] d : new int[][] {{-1, 0}, {1, 0}, {0, -1}, {0, 1}}) {
            int i = indexOf(location.neighbour(d[0], d[1]));
            if (i >= 0) result.add(i);
        }
        return result;
    }
}
