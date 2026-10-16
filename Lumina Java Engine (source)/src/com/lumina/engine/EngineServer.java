package com.lumina.engine;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Entry point. Lumina starts this program once and keeps it running in the background.
 *
 * Protocol: Lumina writes one JSON request per line to standard input, and the engine answers
 * with one JSON line on standard output, echoing the request's "requestId".
 * Supported request types: "optimize" (plan a picking route) and "ping" (health check).
 */
public final class EngineServer {
    public static final String VERSION = "1.0";

    public static void main(String[] args) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8));
        PrintStream out = new PrintStream(System.out, true, StandardCharsets.UTF_8);
        String line;
        while ((line = in.readLine()) != null) {
            if (line.isBlank()) continue;
            out.println(Json.write(handle(line)));
        }
    }

    /** Handles one request line and always returns a response (errors included). */
    @SuppressWarnings("unchecked")
    static Map<String, Object> handle(String line) {
        Object requestId = null;
        Map<String, Object> response;
        try {
            Map<String, Object> request = (Map<String, Object>) Json.parse(line);
            requestId = request.get("requestId");
            String type = String.valueOf(request.getOrDefault("type", "optimize"));
            response = switch (type) {
                case "ping" -> new LinkedHashMap<>(Map.of("ok", true));
                case "optimize" -> new RouteOptimizer(Warehouse.fromJson(request)).optimize().toJson();
                default -> new LinkedHashMap<>(Map.of("ok", false, "error", "Unknown request type: " + type));
            };
        } catch (RuntimeException ex) {
            response = new LinkedHashMap<>();
            response.put("ok", false);
            response.put("error", ex.getClass().getSimpleName() + ": " + ex.getMessage());
        }
        response.put("engine", "Lumina Route Engine " + VERSION + " · Java " + Runtime.version().feature());
        response.put("requestId", requestId);
        return response;
    }
}
