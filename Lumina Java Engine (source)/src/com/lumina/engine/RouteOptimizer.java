package com.lumina.engine;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Finds the shortest walking route for a picking batch: start at the warehouse's starting point,
 * visit every stop, and (by default) walk back to the starting point to drop off the cart.
 *
 * A stop can usually be picked from more than one walkway square (for example the aisle on either
 * side of a rack), so the optimizer chooses both the order of the stops and where to stand at each.
 * Stops marked {@code last} (fragile items) are always visited after every other stop, so they end
 * up on top of the cart.
 *
 * <ul>
 *   <li>Up to {@value #EXACT_LIMIT} stops: Held-Karp dynamic programming, which is guaranteed to
 *       find the shortest possible route that respects the fragile-last rule.</li>
 *   <li>Larger batches: nearest-neighbour construction improved with 2-opt (within each group),
 *       which is fast and usually close to optimal.</li>
 * </ul>
 */
public final class RouteOptimizer {
    public static final int EXACT_LIMIT = 12;

    /** A visiting order plus, for each position, which access square is used. */
    record Tour(int[] order, int[] access, double cost) {}

    private final Warehouse warehouse;
    private final WarehouseGraph graph;
    private final Map<Integer, ShortestPaths> searches = new HashMap<>();
    private final int exactLimit;

    // filled in by optimize()
    private int startNode;
    private List<Warehouse.Stop> stops;     // reachable stops
    private int[][] options;                // options[stop][k] = access node index
    private double[][] fromStart;           // fromStart[stop][k] (also the walk back, the graph is undirected)
    private double[][][][] between;         // between[i][a][j][b]
    private boolean[] last;                 // last[stop]: must come after all non-last stops
    private double returnWeight;            // 1 when the route returns to the start, else 0

    public RouteOptimizer(Warehouse warehouse) { this(warehouse, EXACT_LIMIT); }

    /** Package-private: lets tests force the heuristic on small batches. */
    RouteOptimizer(Warehouse warehouse, int exactLimit) {
        this.warehouse = warehouse;
        this.graph = new WarehouseGraph(warehouse);
        this.exactLimit = exactLimit;
    }

    private ShortestPaths searchFrom(int node) {
        return searches.computeIfAbsent(node, n -> new ShortestPaths(graph, n));
    }

    public RoutePlan optimize() {
        long started = System.nanoTime();
        startNode = graph.indexOf(warehouse.start());
        stops = new ArrayList<>();
        List<String> unreachable = new ArrayList<>();
        List<int[]> optionList = new ArrayList<>();

        if (startNode < 0) {
            warehouse.stops().forEach(s -> unreachable.add(s.id()));
            return RoutePlan.failed("The starting point is not on a walkway square.", unreachable);
        }
        ShortestPaths start = searchFrom(startNode);
        for (Warehouse.Stop stop : warehouse.stops()) {
            int[] access = graph.accessPoints(stop.location()).stream().filter(start::reaches).mapToInt(Integer::intValue).toArray();
            if (access.length == 0) { unreachable.add(stop.id()); continue; }
            stops.add(stop);
            optionList.add(access);
        }
        options = optionList.toArray(new int[0][]);
        last = new boolean[stops.size()];
        for (int i = 0; i < stops.size(); i++) last[i] = stops.get(i).last();
        returnWeight = warehouse.returnToStart() ? 1 : 0;
        buildDistanceTables(start);

        int n = stops.size();
        Tour best = n == 0 ? new Tour(new int[0], new int[0], 0)
                : n <= exactLimit ? heldKarp() : improveWithTwoOpt(nearestNeighbour());
        Tour baseline = n == 0 ? best : bestAccessFor(baselineOrder());

        List<String> order = new ArrayList<>();
        for (int s : best.order()) order.add(stops.get(s).id());
        order.addAll(unreachable);
        long micros = (System.nanoTime() - started) / 1000;
        return new RoutePlan(true, null, order, unreachable, buildLegs(best), best.cost(), baseline.cost(),
                n <= exactLimit ? "exact" : "heuristic", micros);
    }

    private void buildDistanceTables(ShortestPaths start) {
        int n = stops.size();
        fromStart = new double[n][];
        between = new double[n][][][];
        for (int i = 0; i < n; i++) {
            fromStart[i] = new double[options[i].length];
            between[i] = new double[options[i].length][n][];
            for (int a = 0; a < options[i].length; a++) {
                fromStart[i][a] = start.distanceTo(options[i][a]);
                ShortestPaths from = searchFrom(options[i][a]);
                for (int j = 0; j < n; j++) {
                    between[i][a][j] = new double[options[j].length];
                    for (int b = 0; b < options[j].length; b++) between[i][a][j][b] = from.distanceTo(options[j][b]);
                }
            }
        }
    }

    /** Fragile-last rule: may stop {@code next} be visited when {@code visited} stops are done? */
    private boolean allowed(int visited, int next, int lastMask) {
        int normalMask = ((1 << stops.size()) - 1) & ~lastMask;
        return last[next] ? (visited & normalMask) == normalMask : (visited & lastMask) == 0;
    }

    /** Held-Karp: best[mask][stop*W + access] = shortest walk covering mask, ending there. */
    private Tour heldKarp() {
        int n = stops.size();
        int width = Arrays.stream(options).mapToInt(o -> o.length).max().orElse(1);
        int full = (1 << n) - 1;
        int lastMask = 0;
        for (int i = 0; i < n; i++) if (last[i]) lastMask |= 1 << i;
        double[][] best = new double[1 << n][n * width];
        int[][] parent = new int[1 << n][n * width];
        for (double[] row : best) Arrays.fill(row, Double.POSITIVE_INFINITY);
        for (int i = 0; i < n; i++) {
            if (!allowed(0, i, lastMask)) continue;
            for (int a = 0; a < options[i].length; a++) best[1 << i][i * width + a] = fromStart[i][a];
        }
        for (int mask = 1; mask <= full; mask++) {
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) == 0) continue;
                for (int a = 0; a < options[i].length; a++) {
                    double here = best[mask][i * width + a];
                    if (here == Double.POSITIVE_INFINITY) continue;
                    for (int j = 0; j < n; j++) {
                        if ((mask & (1 << j)) != 0 || !allowed(mask, j, lastMask)) continue;
                        int next = mask | (1 << j);
                        for (int b = 0; b < options[j].length; b++) {
                            double cost = here + between[i][a][j][b];
                            if (cost < best[next][j * width + b]) {
                                best[next][j * width + b] = cost;
                                parent[next][j * width + b] = i * width + a;
                            }
                        }
                    }
                }
            }
        }
        // close the tour: add the walk back to the start
        int end = -1;
        double cost = Double.POSITIVE_INFINITY;
        for (int s = 0; s < n * width; s++) {
            if (best[full][s] == Double.POSITIVE_INFINITY) continue;
            double total = best[full][s] + returnWeight * fromStart[s / width][s % width];
            if (total < cost) { cost = total; end = s; }
        }
        int[] order = new int[n];
        int[] access = new int[n];
        int mask = full, state = end;
        for (int pos = n - 1; pos >= 0; pos--) {
            order[pos] = state / width;
            access[pos] = state % width;
            int previous = parent[mask][state];
            mask &= ~(1 << order[pos]);
            state = previous;
        }
        return new Tour(order, access, cost);
    }

    /** Greedy construction: always walk to the nearest stop that the fragile-last rule allows. */
    private Tour nearestNeighbour() {
        int n = stops.size();
        boolean[] used = new boolean[n];
        int[] order = new int[n];
        int lastStop = -1, lastAccess = -1, normalLeft = 0;
        for (boolean l : last) if (!l) normalLeft++;
        for (int pos = 0; pos < n; pos++) {
            int pick = -1, pickAccess = -1;
            double pickCost = Double.POSITIVE_INFINITY;
            for (int j = 0; j < n; j++) {
                if (used[j] || (last[j] && normalLeft > 0)) continue;
                for (int b = 0; b < options[j].length; b++) {
                    double d = lastStop < 0 ? fromStart[j][b] : between[lastStop][lastAccess][j][b];
                    if (d < pickCost) { pickCost = d; pick = j; pickAccess = b; }
                }
            }
            used[pick] = true;
            if (!last[pick]) normalLeft--;
            order[pos] = pick;
            lastStop = pick;
            lastAccess = pickAccess;
        }
        return bestAccessFor(order);
    }

    /** 2-opt: reverse stretches of the route while that makes it shorter, never mixing the two groups. */
    private Tour improveWithTwoOpt(Tour tour) {
        Tour best = tour;
        boolean improved = true;
        int rounds = 0;
        while (improved && rounds++ < 50) {
            improved = false;
            for (int i = 0; i < best.order().length - 1; i++) {
                for (int k = i + 1; k < best.order().length; k++) {
                    if (last[best.order()[i]] != last[best.order()[k]]) continue; // segment would cross groups
                    int[] candidate = best.order().clone();
                    for (int a = i, b = k; a < b; a++, b--) { int t = candidate[a]; candidate[a] = candidate[b]; candidate[b] = t; }
                    Tour t = bestAccessFor(candidate);
                    if (t.cost() < best.cost() - 1e-9) { best = t; improved = true; }
                }
            }
        }
        return best;
    }

    /** For a fixed visiting order, choose the best access square at each stop (dynamic programming). */
    Tour bestAccessFor(int[] order) {
        int n = order.length;
        if (n == 0) return new Tour(order, new int[0], 0);
        double[][] cost = new double[n][];
        int[][] back = new int[n][];
        cost[0] = fromStart[order[0]].clone();
        back[0] = new int[cost[0].length];
        for (int p = 1; p < n; p++) {
            int prev = order[p - 1], cur = order[p];
            cost[p] = new double[options[cur].length];
            back[p] = new int[options[cur].length];
            for (int b = 0; b < options[cur].length; b++) {
                cost[p][b] = Double.POSITIVE_INFINITY;
                for (int a = 0; a < options[prev].length; a++) {
                    double c = cost[p - 1][a] + between[prev][a][cur][b];
                    if (c < cost[p][b]) { cost[p][b] = c; back[p][b] = a; }
                }
            }
        }
        int lastPos = order[n - 1];
        int[] access = new int[n];
        int end = 0;
        double total = Double.POSITIVE_INFINITY;
        for (int b = 0; b < cost[n - 1].length; b++) {
            double t = cost[n - 1][b] + returnWeight * fromStart[lastPos][b];
            if (t < total) { total = t; end = b; }
        }
        access[n - 1] = end;
        for (int p = n - 1; p > 0; p--) access[p - 1] = back[p][access[p]];
        return new Tour(order, access, total);
    }

    /** The order Lumina's built-in routing would use, restricted to reachable stops. */
    private int[] baselineOrder() {
        List<Integer> order = new ArrayList<>();
        for (String id : warehouse.baselineOrder())
            for (int i = 0; i < stops.size(); i++)
                if (stops.get(i).id().equals(id) && !order.contains(i)) order.add(i);
        for (int i = 0; i < stops.size(); i++) if (!order.contains(i)) order.add(i);
        // the built-in routing follows the same fragile-last rule: keep its order within each group
        return order.stream().sorted((x, y) -> Boolean.compare(last[x], last[y])).mapToInt(Integer::intValue).toArray();
    }

    /** The walking path for each leg of the route, as squares and corridor points. */
    private List<RoutePlan.Leg> buildLegs(Tour tour) {
        List<RoutePlan.Leg> legs = new ArrayList<>();
        int from = startNode;
        for (int p = 0; p < tour.order().length; p++) {
            int stop = tour.order()[p];
            int to = options[stop][tour.access()[p]];
            legs.add(new RoutePlan.Leg(stops.get(stop).id(), pathPoints(from, to), false));
            from = to;
        }
        if (returnWeight > 0 && tour.order().length > 0) legs.add(new RoutePlan.Leg(null, pathPoints(from, startNode), true));
        return legs;
    }

    private List<Map<String, Object>> pathPoints(int from, int to) {
        List<Map<String, Object>> points = new ArrayList<>();
        for (int node : searchFrom(from).pathTo(to)) points.add(point(graph.node(node)));
        return points;
    }

    private static Map<String, Object> point(WarehouseGraph.Node node) {
        Map<String, Object> p = new LinkedHashMap<>();
        if (node.isCorridor()) {
            p.put("corridor", node.corridorIndex());
        } else {
            p.put("zone", node.square().zone());
            p.put("row", node.square().row());
            p.put("col", node.square().col());
        }
        return p;
    }
}
