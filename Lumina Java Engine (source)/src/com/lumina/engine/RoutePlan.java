package com.lumina.engine;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * The engine's answer: the visiting order, the walking path for each leg, and how the route
 * compares with Lumina's built-in routing.
 *
 * @param order            stop ids in visiting order (unreachable stops last)
 * @param unreachable      stop ids that no walkway leads to
 * @param legs             one walking path per reachable stop
 * @param distance         length of the optimized route in square-widths, including the walk back to the start
 * @param baselineDistance length of the built-in route for the same stops
 * @param method           "exact" or "heuristic"
 * @param micros           time spent optimizing, in microseconds
 */
public record RoutePlan(boolean ok, String error, List<String> order, List<String> unreachable, List<Leg> legs,
                        double distance, double baselineDistance, String method, long micros) {

    /** The walk from the previous position to one stop (or, for the return leg, back to the start). */
    public record Leg(String stopId, List<Map<String, Object>> points, boolean isReturn) {}

    public static RoutePlan failed(String error, List<String> unreachable) {
        return new RoutePlan(false, error, new ArrayList<>(unreachable), unreachable, List.of(), 0, 0, "none", 0);
    }

    public Map<String, Object> toJson() {
        Map<String, Object> json = new LinkedHashMap<>();
        json.put("ok", ok);
        if (error != null) json.put("error", error);
        json.put("order", order);
        json.put("unreachable", unreachable);
        List<Object> legJson = new ArrayList<>();
        for (Leg leg : legs) {
            Map<String, Object> l = new LinkedHashMap<>();
            l.put("stop", leg.stopId());
            if (leg.isReturn()) l.put("return", true);
            l.put("points", leg.points());
            legJson.add(l);
        }
        json.put("legs", legJson);
        json.put("distance", Math.round(distance * 10) / 10.0);
        json.put("baselineDistance", Math.round(baselineDistance * 10) / 10.0);
        json.put("method", method);
        json.put("micros", micros);
        return json;
    }
}
