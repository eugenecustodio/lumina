LUMINA ROUTE ENGINE (Java)

This is the Java part of Lumina. It plans the shortest walking route for each picking batch:
start at S, visit every stop (fragile items last) and walk back to S to drop off the cart.
Lumina starts it in the background and shows its result on the Picking page
("Java route engine · N steps · shortest possible").

HOW IT FITS INTO LUMINA
  Lumina (JavaScript, Electron)  --one JSON line per request-->  Java engine (this code)
                                 <--one JSON line per answer--
  - main.cjs / route-engine.cjs start the engine with the bundled Java 21 runtime.
  - The Picking page sends the warehouse grid, the starting point and the batch's stops.
  - The engine returns the visiting order, the walking path for every leg, and the route length
    compared with Lumina's built-in routing.
  - If Java is unavailable, Lumina falls back to its built-in routing automatically.

FILES (src/com/lumina/engine)
  EngineServer.java    Entry point (main). Reads requests from standard input, writes answers.
  Json.java            Small JSON reader/writer, no external libraries.
  Warehouse.java       The data model, using records: Zone, Square, Stop and CorridorLink.
  WarehouseGraph.java  Turns the grid into a weighted graph: walkway squares plus corridor points.
  ShortestPaths.java   Dijkstra's algorithm, which finds the shortest distance and path from one point.
  RouteOptimizer.java  Chooses the best stop order and the best side to pick each stop from,
                       keeping fragile stops last and including the walk back to the start:
                       - up to 12 stops: Held-Karp dynamic programming (guaranteed shortest)
                       - more stops: nearest-neighbour plus 2-opt improvement (fast heuristic)
  RoutePlan.java       The result, converted back to JSON.
  test/.../EngineTest.java  Self-checking tests, not shipped inside Lumina.

BUILD AND TEST (needs a JDK 21; from this folder, in Command Prompt)
  mkdir out testout
  javac --release 21 -d out src\com\lumina\engine\*.java
  jar --create --file lumina-engine.jar --main-class com.lumina.engine.EngineServer -C out .
  javac --release 21 -cp out -d testout test\com\lumina\engine\EngineTest.java
  java -cp out;testout com.lumina.engine.EngineTest

  The tests compare the engine with a brute-force search on 500 random warehouses, check that
  every route is a real walk (ending at the start, fragile stops last), and measure speed.
  Last run: 22,902 checks, 0 failures; 12 stops solved exactly in about 6 ms.

TRY IT BY HAND
  java -jar lumina-engine.jar
  then paste:  {"type":"ping","requestId":1}
