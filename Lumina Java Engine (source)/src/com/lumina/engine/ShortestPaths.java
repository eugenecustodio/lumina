package com.lumina.engine;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

/**
 * Dijkstra's algorithm: the shortest walking distance from one starting node to every other node,
 * plus enough bookkeeping to rebuild the actual path.
 */
public final class ShortestPaths {
    private final double[] distance;
    private final int[] previous;

    public ShortestPaths(WarehouseGraph graph, int source) {
        distance = new double[graph.size()];
        previous = new int[graph.size()];
        Arrays.fill(distance, Double.POSITIVE_INFINITY);
        Arrays.fill(previous, -1);
        distance[source] = 0;

        // queue entries are {distance, node}; stale entries are skipped when popped
        PriorityQueue<double[]> queue = new PriorityQueue<>((a, b) -> Double.compare(a[0], b[0]));
        queue.add(new double[] {0, source});
        while (!queue.isEmpty()) {
            double[] head = queue.poll();
            int node = (int) head[1];
            if (head[0] > distance[node]) continue;
            for (WarehouseGraph.Edge edge : graph.edges(node)) {
                double candidate = distance[node] + edge.cost();
                if (candidate < distance[edge.to()]) {
                    distance[edge.to()] = candidate;
                    previous[edge.to()] = node;
                    queue.add(new double[] {candidate, edge.to()});
                }
            }
        }
    }

    public double distanceTo(int node) { return distance[node]; }

    public boolean reaches(int node) { return distance[node] < Double.POSITIVE_INFINITY; }

    /** The nodes from the source to {@code target}, inclusive; empty if unreachable. */
    public List<Integer> pathTo(int target) {
        if (!reaches(target)) return List.of();
        List<Integer> path = new ArrayList<>();
        for (int node = target; node != -1; node = previous[node]) path.add(node);
        Collections.reverse(path);
        return path;
    }
}
