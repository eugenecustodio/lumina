package com.lumina.engine;

import java.util.*;

/**
 * Self-checking tests for the route engine (not shipped with Lumina).
 *
 * 1. Exactness: on random small warehouses, the engine's route length equals a brute-force search
 *    over every visiting order and every access square, using an independently built graph.
 * 2. Walkability: every returned leg is a real walk (adjacent walkway squares / corridor) whose
 *    length adds up to the reported distance, starting at the start and ending next to each stop.
 * 3. Heuristic quality on larger batches, timing, and the line protocol.
 */
public final class EngineTest {
    static int failures = 0, checks = 0;
    static final Random random = new Random(20261016);

    static void check(boolean ok, String message) {
        checks++;
        if (!ok) { failures++; if (failures < 20) System.out.println("FAIL: " + message); }
    }

    public static void main(String[] args) {
        handcraftedLuminaLayout();
        randomizedExactness(500);
        heuristicQuality(120);
        performance();
        protocol();
        System.out.println(checks + " checks, " + failures + " failures");
        System.out.println(failures == 0 ? "ALL TESTS PASSED" : "TESTS FAILED");
        System.exit(failures == 0 ? 0 : 1);
    }

    // ---------- random warehouse generation (as JSON, like Lumina sends) ----------

    static Map<String, Object> randomRequest(int zoneCount, int rows, int cols, int stopCount, double walkwayShare) {
        List<Object> zones = new ArrayList<>(), corridor = new ArrayList<>(), stops = new ArrayList<>();
        List<boolean[][]> grids = new ArrayList<>();
        for (int z = 0; z < zoneCount; z++) {
            String name = String.valueOf((char) ('A' + z));
            boolean[][] walk = new boolean[rows + 1][cols + 1];
            List<Object> paths = new ArrayList<>();
            for (int r = 1; r <= rows; r++)
                for (int c = 1; c <= cols; c++) {
                    walk[r][c] = r == rows || random.nextDouble() < walkwayShare;
                    if (walk[r][c]) paths.add(List.of(r, c));
                }
            grids.add(walk);
            zones.add(Map.of("name", name, "rows", rows, "cols", cols, "paths", paths));
            // start zone links all bottom squares to the corridor, other zones only the middle one
            int mid = (cols + 1) / 2;
            for (int c = 1; c <= cols; c++)
                if (z == 0 || c == mid) corridor.add(Map.of("zone", name, "row", rows, "col", c, "pos", z * (cols + 3) + c + 0.5 * random.nextInt(2)));
        }
        List<int[]> storage = new ArrayList<>();
        for (int z = 0; z < zoneCount; z++)
            for (int r = 1; r <= rows; r++) for (int c = 1; c <= cols; c++) if (!grids.get(z)[r][c]) storage.add(new int[] {z, r, c});
        Collections.shuffle(storage, random);
        for (int[] cell : storage.subList(0, Math.min(stopCount, storage.size())))
            stops.add(Map.of("id", "S" + stops.size(), "zone", String.valueOf((char) ('A' + cell[0])), "row", cell[1], "col", cell[2], "last", random.nextDouble() < 0.3));
        List<Object> baseline = new ArrayList<>();
        for (int i = stops.size() - 1; i >= 0; i--) baseline.add("S" + i);
        Map<String, Object> req = new LinkedHashMap<>();
        req.put("type", "optimize");
        req.put("zones", zones);
        req.put("start", Map.of("zone", "A", "row", rows, "col", (cols + 1) / 2));
        req.put("corridor", corridor);
        req.put("stops", stops);
        req.put("baselineOrder", baseline);
        req.put("returnToStart", random.nextDouble() < 0.8);
        return req;
    }

    @SuppressWarnings("unchecked")
    static Warehouse viaJson(Map<String, Object> request) {
        return Warehouse.fromJson((Map<String, Object>) Json.parse(Json.write(request)));
    }

    // ---------- independent reference model ----------

    /** All-pairs shortest distances over an independently built graph (Floyd-Warshall). */
    static final class Reference {
        final Map<String, Integer> id = new HashMap<>();
        final double[][] d;
        final Map<String, Double> linkPos = new HashMap<>();

        @SuppressWarnings("unchecked")
        Reference(Map<String, Object> req) {
            List<String> names = new ArrayList<>();
            Map<String, Set<String>> walk = new HashMap<>();
            for (Object o : (List<Object>) req.get("zones")) {
                Map<String, Object> z = (Map<String, Object>) o;
                Set<String> w = new HashSet<>();
                for (Object p : (List<Object>) z.get("paths")) {
                    List<Object> rc = (List<Object>) p;
                    String key = z.get("name") + ":" + rc.get(0) + ":" + rc.get(1);
                    w.add(key); id.put(key, names.size()); names.add(key);
                }
                walk.put((String) z.get("name"), w);
            }
            List<Object> corridor = (List<Object>) req.get("corridor");
            for (int k = 0; k < corridor.size(); k++) { id.put("K" + k, names.size()); names.add("K" + k); }
            int n = names.size();
            d = new double[n][n];
            for (double[] row : d) Arrays.fill(row, Double.POSITIVE_INFINITY);
            for (int i = 0; i < n; i++) d[i][i] = 0;
            for (String key : names) {
                if (key.startsWith("K")) continue;
                String[] p = key.split(":");
                int r = Integer.parseInt(p[1]), c = Integer.parseInt(p[2]);
                for (String nb : List.of(p[0] + ":" + (r + 1) + ":" + c, p[0] + ":" + r + ":" + (c + 1)))
                    if (id.containsKey(nb)) link(id.get(key), id.get(nb), 1);
            }
            List<Integer> order = new ArrayList<>();
            for (int k = 0; k < corridor.size(); k++) {
                Map<String, Object> c = (Map<String, Object>) corridor.get(k);
                String key = c.get("zone") + ":" + num(c.get("row")) + ":" + num(c.get("col"));
                linkPos.put("K" + k, ((Number) c.get("pos")).doubleValue());
                if (id.containsKey(key)) { link(id.get("K" + k), id.get(key), 1); order.add(k); }
            }
            order.sort(Comparator.comparingDouble(k -> linkPos.get("K" + k)));
            for (int i = 1; i < order.size(); i++)
                link(id.get("K" + order.get(i - 1)), id.get("K" + order.get(i)), Math.abs(linkPos.get("K" + order.get(i)) - linkPos.get("K" + order.get(i - 1))));
            for (int k = 0; k < n; k++) for (int i = 0; i < n; i++) for (int j = 0; j < n; j++)
                if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
        }

        void link(int a, int b, double w) { d[a][b] = Math.min(d[a][b], w); d[b][a] = Math.min(d[b][a], w); }

        List<Integer> access(String zone, int r, int c) {
            List<Integer> out = new ArrayList<>();
            for (int[] dd : new int[][] {{-1, 0}, {1, 0}, {0, -1}, {0, 1}}) {
                Integer i = id.get(zone + ":" + (r + dd[0]) + ":" + (c + dd[1]));
                if (i != null) out.add(i);
            }
            return out;
        }
    }

    static int num(Object o) { return ((Number) o).intValue(); }

    /** Brute force over every order and every access choice, with the fragile-last rule and the walk back. */
    @SuppressWarnings("unchecked")
    static double bruteForce(Map<String, Object> req, Reference ref) {
        Map<String, Object> start = (Map<String, Object>) req.get("start");
        int s = ref.id.get(start.get("zone") + ":" + num(start.get("row")) + ":" + num(start.get("col")));
        boolean back = !Boolean.FALSE.equals(req.get("returnToStart"));
        List<List<Integer>> acc = new ArrayList<>();
        List<Boolean> fragile = new ArrayList<>();
        for (Object o : (List<Object>) req.get("stops")) {
            Map<String, Object> st = (Map<String, Object>) o;
            List<Integer> a = ref.access((String) st.get("zone"), num(st.get("row")), num(st.get("col")));
            a.removeIf(x -> ref.d[s][x] == Double.POSITIVE_INFINITY);
            if (!a.isEmpty()) { acc.add(a); fragile.add(Boolean.TRUE.equals(st.get("last"))); }
        }
        double[] best = {acc.isEmpty() ? 0 : Double.POSITIVE_INFINITY};
        permute(acc, fragile, new boolean[acc.size()], 0, s, s, back, 0, ref, best);
        return best[0];
    }

    static void permute(List<List<Integer>> acc, List<Boolean> fragile, boolean[] used, int depth, int at, int start, boolean back,
                        double cost, Reference ref, double[] best) {
        if (cost >= best[0]) return;
        if (depth == acc.size()) { best[0] = Math.min(best[0], cost + (back ? ref.d[at][start] : 0)); return; }
        boolean normalLeft = false;
        for (int i = 0; i < acc.size(); i++) if (!used[i] && !fragile.get(i)) normalLeft = true;
        for (int i = 0; i < acc.size(); i++) {
            if (used[i] || (fragile.get(i) && normalLeft)) continue;
            used[i] = true;
            for (int node : acc.get(i)) permute(acc, fragile, used, depth + 1, node, start, back, cost + ref.d[at][node], ref, best);
            used[i] = false;
        }
    }

    // ---------- tests ----------

    @SuppressWarnings("unchecked")
    static void checkLegs(Map<String, Object> req, RoutePlan plan, String label) {
        Map<String, Object> start = (Map<String, Object>) req.get("start");
        List<Object> corridor = (List<Object>) req.get("corridor");
        Map<String, Map<String, Object>> stops = new HashMap<>();
        for (Object o : (List<Object>) req.get("stops")) stops.put((String) ((Map<String, Object>) o).get("id"), (Map<String, Object>) o);
        Map<String, Object> prev = start;
        double walked = 0;
        boolean back = !Boolean.FALSE.equals(req.get("returnToStart"));
        boolean seenFragile = false;
        for (int li = 0; li < plan.legs().size(); li++) {
            RoutePlan.Leg leg = plan.legs().get(li);
            List<Map<String, Object>> pts = leg.points();
            check(!pts.isEmpty() && samePlace(pts.get(0), prev), label + ": leg starts where the last one ended");
            for (int i = 1; i < pts.size(); i++) {
                double step = stepCost(pts.get(i - 1), pts.get(i), corridor);
                check(step >= 0, label + ": consecutive points are adjacent " + pts.get(i - 1) + " -> " + pts.get(i));
                walked += Math.max(step, 0);
            }
            Map<String, Object> end = pts.get(pts.size() - 1);
            if (leg.isReturn()) {
                check(back && li == plan.legs().size() - 1 && samePlace(end, start), label + ": the return leg is last and ends at the start");
                prev = end;
                continue;
            }
            Map<String, Object> stop = stops.get(leg.stopId());
            boolean fragile = Boolean.TRUE.equals(stop.get("last"));
            check(fragile || !seenFragile, label + ": fragile stops come after all other stops");
            seenFragile |= fragile;
            check(end.get("zone") != null && end.get("zone").equals(stop.get("zone"))
                    && Math.abs(num(end.get("row")) - num(stop.get("row"))) + Math.abs(num(end.get("col")) - num(stop.get("col"))) == 1,
                    label + ": leg ends next to its stop");
            prev = end;
        }
        check(Math.abs(walked - plan.distance()) < 1e-6, label + ": legs add up to the distance (" + walked + " vs " + plan.distance() + ")");
        boolean hasReturn = !plan.legs().isEmpty() && plan.legs().get(plan.legs().size() - 1).isReturn();
        check(plan.legs().isEmpty() || hasReturn == back, label + ": return leg present exactly when requested");
    }

    static boolean samePlace(Map<String, Object> a, Map<String, Object> b) {
        return Objects.equals(a.get("zone"), b.get("zone")) && num(a.get("row")) == num(b.get("row")) && num(a.get("col")) == num(b.get("col"));
    }

    @SuppressWarnings("unchecked")
    static double stepCost(Map<String, Object> a, Map<String, Object> b, List<Object> corridor) {
        boolean ca = a.containsKey("corridor"), cb = b.containsKey("corridor");
        if (!ca && !cb) return a.get("zone").equals(b.get("zone"))
                && Math.abs(num(a.get("row")) - num(b.get("row"))) + Math.abs(num(a.get("col")) - num(b.get("col"))) == 1 ? 1 : -1;
        if (ca && cb) {
            double pa = ((Number) ((Map<String, Object>) corridor.get(num(a.get("corridor")))).get("pos")).doubleValue();
            double pb = ((Number) ((Map<String, Object>) corridor.get(num(b.get("corridor")))).get("pos")).doubleValue();
            return Math.abs(pa - pb);
        }
        Map<String, Object> cell = ca ? b : a;
        Map<String, Object> link = (Map<String, Object>) corridor.get(num((ca ? a : b).get("corridor")));
        return samePlace(cell, link) ? 1 : -1;
    }

    static void handcraftedLuminaLayout() {
        // Lumina's default zone: 8 x 7, walkways on the bottom row and every even column.
        List<Object> paths = new ArrayList<>();
        for (int r = 1; r <= 8; r++) for (int c = 1; c <= 7; c++) if (r == 8 || c % 2 == 0) paths.add(List.of(r, c));
        Map<String, Object> req = new LinkedHashMap<>();
        req.put("zones", List.of(Map.of("name", "A", "rows", 8, "cols", 7, "paths", paths)));
        req.put("start", Map.of("zone", "A", "row", 8, "col", 4));
        req.put("corridor", List.of());
        // rack at row 1 col 1 (reachable from walkway 1,2) and rack at row 3 col 5 (from 3,4 or 3,6)
        req.put("stops", List.of(Map.of("id", "far", "zone", "A", "row", 1, "col", 1), Map.of("id", "near", "zone", "A", "row", 3, "col", 5)));
        RoutePlan plan = new RouteOptimizer(viaJson(req)).optimize();
        double ref = bruteForce(req, new Reference(req));
        check(plan.ok() && Math.abs(plan.distance() - ref) < 1e-9, "handcrafted: optimal distance " + plan.distance() + " vs " + ref);
        check(plan.legs().get(plan.legs().size() - 1).isReturn(), "handcrafted: route returns to the start");
        // marking the nearer stop fragile forces it to be picked last
        req.put("stops", List.of(Map.of("id", "far", "zone", "A", "row", 1, "col", 1), Map.of("id", "near", "zone", "A", "row", 3, "col", 5, "last", true)));
        RoutePlan fragilePlan = new RouteOptimizer(viaJson(req)).optimize();
        check(fragilePlan.order().equals(List.of("far", "near")), "handcrafted: fragile stop is picked last " + fragilePlan.order());
        checkLegs(req, fragilePlan, "handcrafted fragile");
        req.put("stops", List.of(Map.of("id", "far", "zone", "A", "row", 1, "col", 1), Map.of("id", "near", "zone", "A", "row", 3, "col", 5)));
        checkLegs(req, plan, "handcrafted");
        // a stop with no walkway next to it is unreachable
        req.put("stops", List.of(Map.of("id", "boxed", "zone", "A", "row", 4, "col", 9)));
        RoutePlan none = new RouteOptimizer(viaJson(req)).optimize();
        check(none.unreachable().equals(List.of("boxed")) && none.legs().isEmpty(), "handcrafted: unreachable stop reported");
    }

    static void randomizedExactness(int instances) {
        int compared = 0;
        for (int t = 0; t < instances; t++) {
            int zones = 1 + random.nextInt(3), rows = 4 + random.nextInt(4), cols = 3 + random.nextInt(5);
            int stops = 1 + random.nextInt(6);
            Map<String, Object> req = randomRequest(zones, rows, cols, stops, 0.45 + random.nextDouble() * 0.3);
            RoutePlan plan = new RouteOptimizer(viaJson(req)).optimize();
            Reference ref = new Reference(req);
            double expected = bruteForce(req, ref);
            check(plan.ok() && Math.abs(plan.distance() - expected) < 1e-6, "random #" + t + ": exact " + plan.distance() + " vs brute force " + expected);
            check(plan.baselineDistance() >= plan.distance() - 1e-9, "random #" + t + ": optimized is never longer than baseline");
            check(plan.order().size() == ((List<?>) req.get("stops")).size(), "random #" + t + ": every stop appears in the order");
            checkLegs(req, plan, "random #" + t);
            compared++;
        }
        System.out.println("exactness: " + compared + " random warehouses matched brute force");
    }

    static void heuristicQuality(int instances) {
        double totalGap = 0, worst = 0;
        for (int t = 0; t < instances; t++) {
            Map<String, Object> req = randomRequest(1 + random.nextInt(4), 8, 7, 8 + random.nextInt(5), 0.5);
            RoutePlan exact = new RouteOptimizer(viaJson(req), 12).optimize();
            RoutePlan heuristic = new RouteOptimizer(viaJson(req), 0).optimize();
            check(heuristic.distance() >= exact.distance() - 1e-9, "heuristic never beats exact");
            checkLegs(req, heuristic, "heuristic #" + t);
            double gap = exact.distance() == 0 ? 0 : heuristic.distance() / exact.distance() - 1;
            totalGap += gap; worst = Math.max(worst, gap);
        }
        System.out.printf("heuristic: average %.1f%% longer than optimal, worst %.1f%% (%d batches of 8-12 stops)%n",
                100 * totalGap / instances, 100 * worst, instances);
        check(totalGap / instances < 0.10, "heuristic average gap under 10%");
    }

    static void performance() {
        Map<String, Object> exactReq = randomRequest(4, 20, 20, 12, 0.6);
        Map<String, Object> bigReq = randomRequest(4, 20, 20, 40, 0.6);
        for (int warm = 0; warm < 3; warm++) new RouteOptimizer(viaJson(exactReq)).optimize();
        long t0 = System.nanoTime();
        RoutePlan exact = new RouteOptimizer(viaJson(exactReq)).optimize();
        long t1 = System.nanoTime();
        RoutePlan big = new RouteOptimizer(viaJson(bigReq)).optimize();
        long t2 = System.nanoTime();
        System.out.printf("performance: 12 stops exact in %d ms; 40 stops heuristic in %d ms%n", (t1 - t0) / 1_000_000, (t2 - t1) / 1_000_000);
        check(exact.method().equals("exact") && (t1 - t0) < 3_000_000_000L, "12-stop exact plan under 3 s");
        check(big.method().equals("heuristic") && (t2 - t1) < 5_000_000_000L, "40-stop heuristic plan under 5 s");
        checkLegs(bigReq, big, "big batch");
    }

    @SuppressWarnings("unchecked")
    static void protocol() {
        Map<String, Object> req = randomRequest(2, 6, 5, 4, 0.6);
        req.put("requestId", 42);
        Map<String, Object> ok = EngineServer.handle(Json.write(req));
        check(Boolean.TRUE.equals(ok.get("ok")) && num(ok.get("requestId")) == 42, "protocol: optimize echoes requestId");
        Map<String, Object> roundTrip = (Map<String, Object>) Json.parse(Json.write(ok));
        check(roundTrip.containsKey("legs") && roundTrip.containsKey("engine"), "protocol: response is valid JSON with legs and engine name");
        Map<String, Object> bad = EngineServer.handle("{not json");
        check(Boolean.FALSE.equals(bad.get("ok")) && bad.get("error") != null, "protocol: malformed input gives an error response");
        Map<String, Object> ping = EngineServer.handle("{\"type\":\"ping\",\"requestId\":\"p\"}");
        check(Boolean.TRUE.equals(ping.get("ok")) && "p".equals(ping.get("requestId")), "protocol: ping");
        Map<String, Object> noStart = new LinkedHashMap<>(req);
        noStart.put("start", Map.of("zone", "Z", "row", 1, "col", 1));
        Map<String, Object> failed = EngineServer.handle(Json.write(noStart));
        check(Boolean.FALSE.equals(failed.get("ok")) && String.valueOf(failed.get("error")).contains("starting point"), "protocol: bad start reported");
    }
}
