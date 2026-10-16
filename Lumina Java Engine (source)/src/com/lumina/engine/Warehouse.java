package com.lumina.engine;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The warehouse as Lumina describes it in a route request.
 *
 * <ul>
 *   <li>Each {@link Zone} is a grid. Walkway ("Path") squares can be walked on; Rack, Shelf and
 *       Bin squares cannot, so a picker stands on a walkway square next to them.</li>
 *   <li>Zones are joined by a shared corridor along the dispatch edge. A {@link CorridorLink} is a
 *       walkway square that opens onto that corridor, with its position along the corridor.</li>
 *   <li>A {@link Stop} is a product location the picker must visit.</li>
 * </ul>
 */
public record Warehouse(List<Zone> zones, Square start, List<CorridorLink> corridor, List<Stop> stops,
                        List<String> baselineOrder, boolean returnToStart) {

    /** A grid square: zone name plus 1-based row and column. */
    public record Square(String zone, int row, int col) {
        public Square neighbour(int dRow, int dCol) { return new Square(zone, row + dRow, col + dCol); }
    }

    /** One zone's grid and the set of walkway squares in it ("row-col" keys). */
    public record Zone(String name, int rows, int cols, Set<String> walkways) {
        public boolean isWalkway(int row, int col) {
            return row >= 1 && row <= rows && col >= 1 && col <= cols && walkways.contains(row + "-" + col);
        }
    }

    /** A walkway square connected to the corridor; {@code position} is measured in square-widths. */
    public record CorridorLink(Square square, double position) {}

    /**
     * A location to visit. {@code id} identifies the stop (product and location); {@code last} marks
     * stops that must be picked after all others (fragile items go on top of the cart).
     */
    public record Stop(String id, Square location, boolean last) {}

    /** Builds a warehouse from the JSON request sent by Lumina. */
    @SuppressWarnings("unchecked")
    public static Warehouse fromJson(Map<String, Object> json) {
        List<Zone> zones = new ArrayList<>();
        for (Object o : list(json, "zones")) {
            Map<String, Object> z = (Map<String, Object>) o;
            Set<String> walkways = new HashSet<>();
            for (Object p : list(z, "paths")) {
                List<Object> rc = (List<Object>) p;
                walkways.add(num(rc.get(0)) + "-" + num(rc.get(1)));
            }
            zones.add(new Zone(str(z, "name"), num(z.get("rows")), num(z.get("cols")), walkways));
        }
        Square start = square((Map<String, Object>) json.get("start"));
        List<CorridorLink> corridor = new ArrayList<>();
        for (Object o : list(json, "corridor")) {
            Map<String, Object> c = (Map<String, Object>) o;
            corridor.add(new CorridorLink(square(c), ((Number) c.get("pos")).doubleValue()));
        }
        List<Stop> stops = new ArrayList<>();
        for (Object o : list(json, "stops")) {
            Map<String, Object> s = (Map<String, Object>) o;
            stops.add(new Stop(str(s, "id"), square(s), Boolean.TRUE.equals(s.get("last"))));
        }
        List<String> baseline = new ArrayList<>();
        if (json.get("baselineOrder") instanceof List<?> b) for (Object id : b) baseline.add(String.valueOf(id));
        boolean returnToStart = !Boolean.FALSE.equals(json.get("returnToStart")); // default: round trip
        return new Warehouse(zones, start, corridor, stops, baseline, returnToStart);
    }

    private static Square square(Map<String, Object> m) {
        if (m == null) return null;
        return new Square(str(m, "zone"), num(m.get("row")), num(m.get("col")));
    }

    @SuppressWarnings("unchecked")
    private static List<Object> list(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v instanceof List<?> ? (List<Object>) v : List.of();
    }

    private static String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v == null ? "" : String.valueOf(v);
    }

    private static int num(Object v) {
        return v instanceof Number n ? n.intValue() : 0;
    }
}
