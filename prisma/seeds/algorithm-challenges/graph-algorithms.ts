import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GRAPH ALGORITHMS - Detailed Algorithm Visualization Challenges
 *
 * These challenges provide step-by-step visual explanations of fundamental graph algorithms
 * with detailed analysis, path finding, and interactive learning objectives.
 */

export const graphAlgorithmChallenges = [
  // 1) DIJKSTRA'S ALGORITHM - Shortest Path Finding
  {
    id: "dijkstra-shortest-path-detailed-viz",
    title: "Dijkstra's Algorithm: Finding Shortest Paths",
    slug: "dijkstra-shortest-path-step-by-step",
    description:
      "Master Dijkstra's shortest path algorithm through detailed visualization - see how it finds optimal paths in weighted graphs using greedy approach.",
    content: {
      algorithm: "Dijkstra's Shortest Path",
      description:
        "Watch how Dijkstra's algorithm finds shortest paths from source to all vertices using priority queue and relaxation",
      timeComplexity: "O((V + E) log V) with binary heap",
      spaceComplexity: "O(V)",
      explanation:
        "Dijkstra's algorithm finds shortest paths from a source vertex to all other vertices in a weighted graph with non-negative edge weights using greedy approach.",
      steps: [
        {
          id: 1,
          description: "Initialize graph with weighted edges",
          data: [
            { id: "A", distance: Infinity, previous: null, visited: false },
            { id: "B", distance: Infinity, previous: null, visited: false },
            { id: "C", distance: Infinity, previous: null, visited: false },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [],
          comparison: [],
          action:
            "Graph: A-B(4), A-C(2), B-C(1), B-D(5), C-D(8), C-E(10), D-E(2)",
        },
        {
          id: 2,
          description: "Set source vertex A distance to 0",
          data: [
            { id: "A", distance: 0, previous: null, visited: false },
            { id: "B", distance: Infinity, previous: null, visited: false },
            { id: "C", distance: Infinity, previous: null, visited: false },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [0],
          comparison: [],
          action:
            "Source A initialized to distance 0, all others remain infinity",
        },
        {
          id: 3,
          description: "Priority queue: [A(0)]",
          data: [
            { id: "A", distance: 0, previous: null, visited: false },
            { id: "B", distance: Infinity, previous: null, visited: false },
            { id: "C", distance: Infinity, previous: null, visited: false },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [0],
          comparison: [0],
          action: "Priority queue contains only source A with distance 0",
        },
        {
          id: 4,
          description: "Extract A (distance 0) - mark as visited",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: Infinity, previous: null, visited: false },
            { id: "C", distance: Infinity, previous: null, visited: false },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [0],
          comparison: [],
          action: "Extracted A from priority queue, marked as visited",
        },
        {
          id: 5,
          description: "Relax edge A-B: distance 0 + 4 = 4",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 4, previous: "A", visited: false },
            { id: "C", distance: Infinity, previous: null, visited: false },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [1],
          comparison: [0, 1],
          action:
            "Updated B: distance = 4, previous = A (relaxation successful)",
        },
        {
          id: 6,
          description: "Relax edge A-C: distance 0 + 2 = 2",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 4, previous: "A", visited: false },
            { id: "C", distance: 2, previous: "A", visited: false },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [2],
          comparison: [0, 2],
          action: "Updated C: distance = 2, previous = A (better path found)",
        },
        {
          id: 7,
          description: "Priority queue: [C(2), B(4)]",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 4, previous: "A", visited: false },
            { id: "C", distance: 2, previous: "A", visited: false },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [2, 1],
          comparison: [2, 1],
          action: "Priority queue ordered by distance: C has minimum distance",
        },
        {
          id: 8,
          description: "Extract C (distance 2) - mark as visited",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 4, previous: "A", visited: false },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [2],
          comparison: [],
          action:
            "Extracted C from priority queue, now processing its neighbors",
        },
        {
          id: 9,
          description: "Relax edge C-B: distance 2 + 1 = 3 < 4",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: false },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: Infinity, previous: null, visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [1],
          comparison: [2, 1],
          action: "Updated B: distance = 3, previous = C (shorter path via C)",
        },
        {
          id: 10,
          description: "Relax edge C-D: distance 2 + 8 = 10",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: false },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 10, previous: "C", visited: false },
            { id: "E", distance: Infinity, previous: null, visited: false },
          ],
          highlights: [3],
          comparison: [2, 3],
          action: "Updated D: distance = 10, previous = C (first path to D)",
        },
        {
          id: 11,
          description: "Relax edge C-E: distance 2 + 10 = 12",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: false },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 10, previous: "C", visited: false },
            { id: "E", distance: 12, previous: "C", visited: false },
          ],
          highlights: [4],
          comparison: [2, 4],
          action: "Updated E: distance = 12, previous = C (first path to E)",
        },
        {
          id: 12,
          description: "Priority queue: [B(3), D(10), E(12)]",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: false },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 10, previous: "C", visited: false },
            { id: "E", distance: 12, previous: "C", visited: false },
          ],
          highlights: [1, 3, 4],
          comparison: [1, 3, 4],
          action: "B has minimum distance in queue, will be processed next",
        },
        {
          id: 13,
          description: "Extract B (distance 3) - mark as visited",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 10, previous: "C", visited: false },
            { id: "E", distance: 12, previous: "C", visited: false },
          ],
          highlights: [1],
          comparison: [],
          action: "Extracted B, now checking its outgoing edges for relaxation",
        },
        {
          id: 14,
          description: "Relax edge B-D: distance 3 + 5 = 8 < 10",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 8, previous: "B", visited: false },
            { id: "E", distance: 12, previous: "C", visited: false },
          ],
          highlights: [3],
          comparison: [1, 3],
          action: "Updated D: distance = 8, previous = B (shorter path via B)",
        },
        {
          id: 15,
          description: "Priority queue: [D(8), E(12)]",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 8, previous: "B", visited: false },
            { id: "E", distance: 12, previous: "C", visited: false },
          ],
          highlights: [3, 4],
          comparison: [3, 4],
          action: "D has minimum distance, will be extracted next",
        },
        {
          id: 16,
          description: "Extract D (distance 8) - mark as visited",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 8, previous: "B", visited: true },
            { id: "E", distance: 12, previous: "C", visited: false },
          ],
          highlights: [3],
          comparison: [],
          action: "Extracted D, checking edge D-E for potential improvement",
        },
        {
          id: 17,
          description: "Relax edge D-E: distance 8 + 2 = 10 < 12",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 8, previous: "B", visited: true },
            { id: "E", distance: 10, previous: "D", visited: false },
          ],
          highlights: [4],
          comparison: [3, 4],
          action: "Updated E: distance = 10, previous = D (better path found!)",
        },
        {
          id: 18,
          description: "Priority queue: [E(10)]",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 8, previous: "B", visited: true },
            { id: "E", distance: 10, previous: "D", visited: false },
          ],
          highlights: [4],
          comparison: [4],
          action: "Only E remains in priority queue with final distance 10",
        },
        {
          id: 19,
          description: "Extract E (distance 10) - algorithm complete",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 8, previous: "B", visited: true },
            { id: "E", distance: 10, previous: "D", visited: true },
          ],
          highlights: [4],
          comparison: [],
          action: "All vertices processed, shortest paths computed",
        },
        {
          id: 20,
          description: "Final shortest path tree from A",
          data: [
            { id: "A", distance: 0, previous: null, visited: true },
            { id: "B", distance: 3, previous: "C", visited: true },
            { id: "C", distance: 2, previous: "A", visited: true },
            { id: "D", distance: 8, previous: "B", visited: true },
            { id: "E", distance: 10, previous: "D", visited: true },
          ],
          highlights: [0, 1, 2, 3, 4],
          comparison: [],
          action: "Paths: A→C(2), A→C→B(3), A→C→B→D(8), A→C→B→D→E(10)",
        },
      ],
    },
    difficulty: 3,
    order: 1,
    duration: 25,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Dijkstra's Algorithm with Detailed Visualization
import heapq
from collections import defaultdict

class DijkstraVisualized:
    """
    Dijkstra's shortest path algorithm with step-by-step tracking for visualization
    """
    
    def __init__(self):
        # TODO: Initialize graph structure
        # - Use adjacency list representation
        # - Track steps for visualization
        pass
    
    def add_edge(self, u, v, weight):
        """Add weighted edge between vertices u and v"""
        # TODO: Implement bidirectional edge addition
        # - Add edge u -> v with weight
        # - Add edge v -> u with weight (for undirected graph)
        pass
    
    def dijkstra(self, source):
        """
        Find shortest paths from source to all other vertices
        Returns dictionary with distances and previous vertices
        """
        # TODO: Implement Dijkstra's algorithm
        # - Initialize distances to infinity, source to 0
        # - Use priority queue (min-heap) for vertex selection
        # - Implement relaxation of edges
        # - Track each step for visualization
        # - Return final distances and previous vertices
        pass
    
    def get_shortest_path(self, source, target, previous):
        """Reconstruct shortest path from source to target"""
        # TODO: Implement path reconstruction
        # - Backtrack from target using previous vertices
        # - Build path list in reverse order
        # - Return complete path from source to target
        pass
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        # TODO: Return steps list for visualization
        pass
    
    def print_results(self, source, distances, previous):
        """Print formatted results of Dijkstra's algorithm"""
        # TODO: Display shortest distances and paths
        # - Show distance from source to each vertex
        # - Show actual path taken
        # - Format output clearly
        pass

# Test your Dijkstra implementation
print("🗺️ DIJKSTRA'S SHORTEST PATH VISUALIZATION")
print("=" * 60)

# Create graph from the example
graph = DijkstraVisualized()

# Add edges: (vertex1, vertex2, weight)
edges = [
    ('A', 'B', 4),
    ('A', 'C', 2),
    ('B', 'C', 1),
    ('B', 'D', 5),
    ('C', 'D', 8),
    ('C', 'E', 10),
    ('D', 'E', 2)
]

print("\\n📊 Building Graph:")
for u, v, w in edges:
    graph.add_edge(u, v, w)
    print(f"   Added edge {u} -- {v} (weight: {w})")

print("\\n🚀 Running Dijkstra's Algorithm from source 'A':")
print("-" * 50)

# Run Dijkstra's algorithm
distances, previous = graph.dijkstra('A')

# Print results
graph.print_results('A', distances, previous)

# Show specific shortest paths
print("\\n🛤️ SHORTEST PATHS FROM A:")
print("-" * 30)
targets = ['B', 'C', 'D', 'E']
for target in targets:
    if target in distances:
        path = graph.get_shortest_path('A', target, previous)
        print(f"A → {target}: {' → '.join(path)} (distance: {distances[target]})")

# Show all visualization steps
print("\\n" + "=" * 60)
print("📊 COMPLETE ALGORITHM STEPS:")
steps = graph.get_visualization_steps()
for i, step in enumerate(steps, 1):
    print(f"Step {i}: {step}")`,
    solutionCode: `import heapq
from collections import defaultdict

class DijkstraVisualized:
    """
    Dijkstra's shortest path algorithm with step-by-step tracking for visualization
    """
    
    def __init__(self):
        self.graph = defaultdict(list)  # Adjacency list
        self.vertices = set()
        self.steps = []
        self.step_count = 0
    
    def add_edge(self, u, v, weight):
        """Add weighted edge between vertices u and v"""
        self.graph[u].append((v, weight))
        self.graph[v].append((u, weight))  # Undirected graph
        self.vertices.add(u)
        self.vertices.add(v)
        
        step = {
            'operation': 'add_edge',
            'edge': (u, v),
            'weight': weight,
            'description': f"Added edge {u} -- {v} with weight {weight}"
        }
        self.steps.append(step)
    
    def dijkstra(self, source):
        """Find shortest paths from source to all other vertices"""
        if source not in self.vertices:
            raise ValueError(f"Source vertex {source} not found in graph")
        
        # Initialize distances and previous vertices
        distances = {vertex: float('infinity') for vertex in self.vertices}
        previous = {vertex: None for vertex in self.vertices}
        distances[source] = 0
        
        # Priority queue: (distance, vertex)
        pq = [(0, source)]
        visited = set()
        
        step = {
            'operation': 'initialize',
            'source': source,
            'distances': distances.copy(),
            'previous': previous.copy(),
            'description': f"Initialized distances, source {source} set to 0"
        }
        self.steps.append(step)
        
        while pq:
            current_distance, current_vertex = heapq.heappop(pq)
            
            if current_vertex in visited:
                continue
            
            visited.add(current_vertex)
            
            step = {
                'operation': 'visit_vertex',
                'vertex': current_vertex,
                'distance': current_distance,
                'visited': list(visited),
                'description': f"Visiting vertex {current_vertex} with distance {current_distance}"
            }
            self.steps.append(step)
            
            # Check all neighbors
            for neighbor, weight in self.graph[current_vertex]:
                if neighbor not in visited:
                    new_distance = current_distance + weight
                    
                    if new_distance < distances[neighbor]:
                        distances[neighbor] = new_distance
                        previous[neighbor] = current_vertex
                        heapq.heappush(pq, (new_distance, neighbor))
                        
                        step = {
                            'operation': 'relax_edge',
                            'edge': (current_vertex, neighbor),
                            'old_distance': distances[neighbor] if new_distance < distances[neighbor] else float('infinity'),
                            'new_distance': new_distance,
                            'description': f"Relaxed edge {current_vertex} → {neighbor}: distance updated to {new_distance}"
                        }
                        self.steps.append(step)
        
        step = {
            'operation': 'complete',
            'final_distances': distances.copy(),
            'final_previous': previous.copy(),
            'description': "Algorithm completed - all shortest paths found"
        }
        self.steps.append(step)
        
        return distances, previous
    
    def get_shortest_path(self, source, target, previous):
        """Reconstruct shortest path from source to target"""
        if target not in previous or previous[target] is None and target != source:
            return []
        
        path = []
        current = target
        
        while current is not None:
            path.append(current)
            current = previous[current]
        
        path.reverse()
        
        if path[0] == source:
            return path
        else:
            return []  # No path exists
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        return self.steps.copy()
    
    def print_results(self, source, distances, previous):
        """Print formatted results of Dijkstra's algorithm"""
        print(f"\\n📍 Shortest distances from {source}:")
        for vertex in sorted(self.vertices):
            if vertex != source:
                distance = distances[vertex]
                if distance == float('infinity'):
                    print(f"   {source} → {vertex}: No path")
                else:
                    path = self.get_shortest_path(source, vertex, previous)
                    print(f"   {source} → {vertex}: {distance} (path: {' → '.join(path)})")`,
    testCases: [
      {
        input: [
          ["add_edge", "A", "B", 1],
          ["add_edge", "B", "C", 2],
          ["dijkstra", "A"],
        ],
        expected: [null, null, { A: 0, B: 1, C: 3 }],
        description: "Simple linear graph A-B-C",
      },
      {
        input: [
          ["add_edge", "A", "B", 4],
          ["add_edge", "A", "C", 2],
          ["add_edge", "B", "C", 1],
          ["dijkstra", "A"],
        ],
        expected: [null, null, null, { A: 0, B: 3, C: 2 }],
        description: "Triangle graph with shorter path A→C→B",
      },
      {
        input: [
          ["add_edge", "A", "B", 1],
          ["dijkstra", "A"],
          ["get_path", "A", "B"],
        ],
        expected: [null, { A: 0, B: 1 }, ["A", "B"]],
        description: "Single edge shortest path reconstruction",
      },
      {
        input: [["dijkstra", "X"]],
        expected: ["error"],
        description: "Source vertex not in graph should raise error",
      },
    ],
    diamondReward: 80,
    experienceReward: 150,
    isPublished: true,
    tags: [
      "Graph Algorithms",
      "Dijkstra",
      "Shortest Path",
      "Greedy",
      "Priority Queue",
      "Advanced",
    ],
    learningObjectives: [
      "Understand shortest path problems in weighted graphs",
      "Master Dijkstra's greedy approach and optimality",
      "Learn priority queue usage for efficient vertex selection",
      "Practice edge relaxation and distance updates",
      "Visualize shortest path tree construction",
      "Recognize real-world applications in routing and navigation",
    ],
  },

  // 2) KRUSKAL'S ALGORITHM - Minimum Spanning Tree
  {
    id: "kruskal-mst-detailed-viz",
    title: "Kruskal's Algorithm: Minimum Spanning Tree",
    slug: "kruskal-mst-step-by-step",
    description:
      "Master Kruskal's minimum spanning tree algorithm through detailed visualization - see how it builds MST using edge sorting and Union-Find.",
    content: {
      algorithm: "Kruskal's Minimum Spanning Tree",
      description:
        "Watch how Kruskal's algorithm builds minimum spanning tree by sorting edges and using Union-Find to avoid cycles",
      timeComplexity: "O(E log E) for edge sorting",
      spaceComplexity: "O(V)",
      explanation:
        "Kruskal's algorithm finds minimum spanning tree by sorting all edges and greedily adding edges that don't create cycles using Union-Find data structure.",
      steps: [
        {
          id: 1,
          description: "Initialize graph with weighted edges",
          data: [
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["A", "C"], weight: 2, selected: false },
            { edge: ["B", "C"], weight: 1, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
            { edge: ["D", "E"], weight: 2, selected: false },
          ],
          highlights: [],
          comparison: [],
          action: "Graph with 5 vertices, 7 edges. MST will have 4 edges.",
        },
        {
          id: 2,
          description: "Sort edges by weight (ascending order)",
          data: [
            { edge: ["B", "C"], weight: 1, selected: false },
            { edge: ["A", "C"], weight: 2, selected: false },
            { edge: ["D", "E"], weight: 2, selected: false },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [0, 1, 2, 3, 4, 5, 6],
          comparison: [],
          action: "Sorted: BC(1), AC(2), DE(2), AB(4), BD(5), CD(8), CE(10)",
        },
        {
          id: 3,
          description: "Initialize Union-Find: each vertex is its own set",
          data: [
            { edge: ["B", "C"], weight: 1, selected: false },
            { edge: ["A", "C"], weight: 2, selected: false },
            { edge: ["D", "E"], weight: 2, selected: false },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [],
          comparison: [],
          action: "Union-Find: {A}, {B}, {C}, {D}, {E} - 5 separate sets",
        },
        {
          id: 4,
          description: "Process edge BC (weight 1) - smallest edge",
          data: [
            { edge: ["B", "C"], weight: 1, selected: false },
            { edge: ["A", "C"], weight: 2, selected: false },
            { edge: ["D", "E"], weight: 2, selected: false },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [0],
          comparison: [0],
          action: "Checking BC: Find(B) ≠ Find(C), no cycle detected",
        },
        {
          id: 5,
          description: "Add edge BC to MST - first edge selected",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: false },
            { edge: ["D", "E"], weight: 2, selected: false },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [0],
          comparison: [],
          action: "Union(B, C): {A}, {B, C}, {D}, {E} - MST edges: 1",
        },
        {
          id: 6,
          description: "Process edge AC (weight 2) - second smallest",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: false },
            { edge: ["D", "E"], weight: 2, selected: false },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [1],
          comparison: [1],
          action: "Checking AC: Find(A) ≠ Find(C), no cycle detected",
        },
        {
          id: 7,
          description: "Add edge AC to MST - connects A to BC component",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: false },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [1],
          comparison: [],
          action: "Union(A, C): {A, B, C}, {D}, {E} - MST edges: 2",
        },
        {
          id: 8,
          description: "Process edge DE (weight 2) - tie with AC",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: false },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [2],
          comparison: [2],
          action: "Checking DE: Find(D) ≠ Find(E), no cycle detected",
        },
        {
          id: 9,
          description: "Add edge DE to MST - connects D and E",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: true },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [2],
          comparison: [],
          action: "Union(D, E): {A, B, C}, {D, E} - MST edges: 3",
        },
        {
          id: 10,
          description: "Process edge AB (weight 4)",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: true },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [3],
          comparison: [3],
          action: "Checking AB: Find(A) = Find(B), cycle detected!",
        },
        {
          id: 11,
          description: "Reject edge AB - would create cycle",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: true },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [],
          comparison: [],
          action: "AB rejected: A and B already connected via path A-C-B",
        },
        {
          id: 12,
          description: "Process edge BD (weight 5)",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: true },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: false },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [4],
          comparison: [4],
          action: "Checking BD: Find(B) ≠ Find(D), connects components",
        },
        {
          id: 13,
          description: "Add edge BD to MST - final edge needed",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: true },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: true },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [4],
          comparison: [],
          action: "Union(B, D): {A, B, C, D, E} - MST complete with 4 edges",
        },
        {
          id: 14,
          description: "MST complete - remaining edges not needed",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: true },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: true },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [],
          comparison: [],
          action: "4 edges selected for 5 vertices, MST property satisfied",
        },
        {
          id: 15,
          description: "Final MST: total weight = 1 + 2 + 2 + 5 = 10",
          data: [
            { edge: ["B", "C"], weight: 1, selected: true },
            { edge: ["A", "C"], weight: 2, selected: true },
            { edge: ["D", "E"], weight: 2, selected: true },
            { edge: ["A", "B"], weight: 4, selected: false },
            { edge: ["B", "D"], weight: 5, selected: true },
            { edge: ["C", "D"], weight: 8, selected: false },
            { edge: ["C", "E"], weight: 10, selected: false },
          ],
          highlights: [0, 1, 2, 4],
          comparison: [],
          action: "Minimum Spanning Tree: BC(1), AC(2), DE(2), BD(5)",
        },
      ],
    },
    difficulty: 3,
    order: 2,
    duration: 22,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Kruskal's Algorithm with Union-Find
class UnionFind:
    """Union-Find (Disjoint Set) data structure for cycle detection"""
    
    def __init__(self, vertices):
        # TODO: Initialize Union-Find structure
        # - Each vertex is initially its own parent
        # - Initialize rank for union by rank optimization
        pass
    
    def find(self, vertex):
        """Find root of the set containing vertex (with path compression)"""
        # TODO: Implement find with path compression
        # - Recursively find root
        # - Compress path for optimization
        pass
    
    def union(self, vertex1, vertex2):
        """Union two sets containing vertex1 and vertex2"""
        # TODO: Implement union by rank
        # - Find roots of both vertices
        # - Union smaller tree under larger tree
        # - Return True if union performed, False if already connected
        pass

class KruskalMSTVisualized:
    """
    Kruskal's MST algorithm with step-by-step tracking for visualization
    """
    
    def __init__(self):
        # TODO: Initialize graph structure
        # - List to store edges (vertex1, vertex2, weight)
        # - Set to store vertices
        # - Track steps for visualization
        pass
    
    def add_edge(self, u, v, weight):
        """Add weighted edge between vertices u and v"""
        # TODO: Implement edge addition
        # - Add edge to edge list
        # - Add vertices to vertex set
        # - Record step for visualization
        pass
    
    def kruskal_mst(self):
        """
        Find Minimum Spanning Tree using Kruskal's algorithm
        Returns list of MST edges and total weight
        """
        # TODO: Implement Kruskal's algorithm
        # - Sort edges by weight
        # - Initialize Union-Find structure
        # - Process edges in ascending order
        # - Add edge if it doesn't create cycle
        # - Track each step for visualization
        # - Return MST edges and total weight
        pass
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        # TODO: Return steps list for visualization
        pass
    
    def print_mst(self, mst_edges, total_weight):
        """Print formatted MST results"""
        # TODO: Display MST edges and total weight
        # - Show each edge in MST
        # - Display total weight
        # - Format output clearly
        pass

# Test your Kruskal implementation
print("🌲 KRUSKAL'S MINIMUM SPANNING TREE VISUALIZATION")
print("=" * 65)

# Create graph from the example
graph = KruskalMSTVisualized()

# Add edges: (vertex1, vertex2, weight)
edges = [
    ('A', 'B', 4),
    ('A', 'C', 2),
    ('B', 'C', 1),
    ('B', 'D', 5),
    ('C', 'D', 8),
    ('C', 'E', 10),
    ('D', 'E', 2)
]

print("\\n📊 Building Graph:")
for u, v, w in edges:
    graph.add_edge(u, v, w)
    print(f"   Added edge {u} -- {v} (weight: {w})")

print(f"\\n🚀 Running Kruskal's Algorithm:")
print("-" * 40)

# Run Kruskal's algorithm
mst_edges, total_weight = graph.kruskal_mst()

# Print results
graph.print_mst(mst_edges, total_weight)

# Show all visualization steps
print("\\n" + "=" * 65)
print("📊 COMPLETE ALGORITHM STEPS:")
steps = graph.get_visualization_steps()
for i, step in enumerate(steps, 1):
    print(f"Step {i}: {step}")`,
    solutionCode: `class UnionFind:
    """Union-Find (Disjoint Set) data structure for cycle detection"""
    
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}
    
    def find(self, vertex):
        """Find root of the set containing vertex (with path compression)"""
        if self.parent[vertex] != vertex:
            self.parent[vertex] = self.find(self.parent[vertex])  # Path compression
        return self.parent[vertex]
    
    def union(self, vertex1, vertex2):
        """Union two sets containing vertex1 and vertex2"""
        root1 = self.find(vertex1)
        root2 = self.find(vertex2)
        
        if root1 == root2:
            return False  # Already in same set (would create cycle)
        
        # Union by rank
        if self.rank[root1] < self.rank[root2]:
            self.parent[root1] = root2
        elif self.rank[root1] > self.rank[root2]:
            self.parent[root2] = root1
        else:
            self.parent[root2] = root1
            self.rank[root1] += 1
        
        return True

class KruskalMSTVisualized:
    """
    Kruskal's MST algorithm with step-by-step tracking for visualization
    """
    
    def __init__(self):
        self.edges = []  # List of (u, v, weight) tuples
        self.vertices = set()
        self.steps = []
        self.step_count = 0
    
    def add_edge(self, u, v, weight):
        """Add weighted edge between vertices u and v"""
        self.edges.append((u, v, weight))
        self.vertices.add(u)
        self.vertices.add(v)
        
        step = {
            'operation': 'add_edge',
            'edge': (u, v),
            'weight': weight,
            'description': f"Added edge {u} -- {v} with weight {weight}"
        }
        self.steps.append(step)
    
    def kruskal_mst(self):
        """Find Minimum Spanning Tree using Kruskal's algorithm"""
        if len(self.vertices) == 0:
            return [], 0
        
        # Step 1: Sort edges by weight
        sorted_edges = sorted(self.edges, key=lambda x: x[2])
        
        step = {
            'operation': 'sort_edges',
            'sorted_edges': sorted_edges,
            'description': f"Sorted {len(sorted_edges)} edges by weight"
        }
        self.steps.append(step)
        
        # Step 2: Initialize Union-Find
        union_find = UnionFind(self.vertices)
        mst_edges = []
        total_weight = 0
        
        step = {
            'operation': 'initialize_union_find',
            'vertices': list(self.vertices),
            'description': f"Initialized Union-Find for {len(self.vertices)} vertices"
        }
        self.steps.append(step)
        
        # Step 3: Process edges in order
        for u, v, weight in sorted_edges:
            step = {
                'operation': 'process_edge',
                'edge': (u, v),
                'weight': weight,
                'description': f"Processing edge {u} -- {v} (weight: {weight})"
            }
            self.steps.append(step)
            
            # Check if adding this edge creates a cycle
            if union_find.union(u, v):
                mst_edges.append((u, v, weight))
                total_weight += weight
                
                step = {
                    'operation': 'add_to_mst',
                    'edge': (u, v),
                    'weight': weight,
                    'mst_edges_count': len(mst_edges),
                    'total_weight': total_weight,
                    'description': f"Added {u} -- {v} to MST (total weight: {total_weight})"
                }
                self.steps.append(step)
                
                # MST is complete when we have V-1 edges
                if len(mst_edges) == len(self.vertices) - 1:
                    break
            else:
                step = {
                    'operation': 'reject_edge',
                    'edge': (u, v),
                    'weight': weight,
                    'description': f"Rejected {u} -- {v} (would create cycle)"
                }
                self.steps.append(step)
        
        step = {
            'operation': 'complete',
            'mst_edges': mst_edges,
            'total_weight': total_weight,
            'description': f"MST complete with {len(mst_edges)} edges, total weight: {total_weight}"
        }
        self.steps.append(step)
        
        return mst_edges, total_weight
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        return self.steps.copy()
    
    def print_mst(self, mst_edges, total_weight):
        """Print formatted MST results"""
        print(f"\\n🌲 MINIMUM SPANNING TREE:")
        print("-" * 30)
        for i, (u, v, weight) in enumerate(mst_edges, 1):
            print(f"   {i}. {u} -- {v} (weight: {weight})")
        print(f"\\n📊 Total Weight: {total_weight}")
        print(f"📈 Edges in MST: {len(mst_edges)}")
        print(f"🔢 Vertices: {len(self.vertices)}")`,
    testCases: [
      {
        input: [
          ["add_edge", "A", "B", 1],
          ["add_edge", "B", "C", 2],
          ["kruskal_mst"],
        ],
        expected: [
          null,
          null,
          [
            ["A", "B", 1],
            ["B", "C", 2],
          ],
          3,
        ],
        description: "Simple linear graph MST",
      },
      {
        input: [
          ["add_edge", "A", "B", 4],
          ["add_edge", "A", "C", 2],
          ["add_edge", "B", "C", 1],
          ["kruskal_mst"],
        ],
        expected: [
          null,
          null,
          null,
          [
            ["B", "C", 1],
            ["A", "C", 2],
          ],
          3,
        ],
        description: "Triangle graph - select two lightest edges",
      },
      {
        input: [["kruskal_mst"]],
        expected: [[], 0],
        description: "Empty graph should return empty MST",
      },
    ],
    diamondReward: 75,
    experienceReward: 140,
    isPublished: true,
    tags: [
      "Graph Algorithms",
      "Kruskal",
      "MST",
      "Union-Find",
      "Greedy",
      "Advanced",
    ],
    learningObjectives: [
      "Understand minimum spanning tree problems",
      "Master Kruskal's greedy edge selection approach",
      "Learn Union-Find data structure for cycle detection",
      "Practice edge sorting and systematic processing",
      "Visualize MST construction step by step",
      "Recognize applications in network design and clustering",
    ],
  },

  // 3) BINARY TREE TRAVERSAL - Tree Algorithm
  {
    id: "binary-tree-traversal-detailed-viz",
    title: "Binary Tree Traversal: In-order, Pre-order, Post-order",
    slug: "binary-tree-traversal-step-by-step",
    description:
      "Master binary tree traversal algorithms through detailed visualization - see how different traversal orders visit nodes systematically.",
    content: {
      algorithm: "Binary Tree Traversal",
      description:
        "Watch how different tree traversal algorithms visit nodes in specific orders: in-order, pre-order, and post-order",
      timeComplexity: "O(n) where n is number of nodes",
      spaceComplexity: "O(h) where h is height of tree",
      explanation:
        "Tree traversal algorithms visit every node exactly once in different systematic orders, useful for various tree operations and applications.",
      steps: [
        {
          id: 1,
          description: "Initialize binary tree structure",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: false,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [],
          comparison: [],
          action: "Tree structure: Root F, with subtrees B and G",
        },
        {
          id: 2,
          description: "IN-ORDER TRAVERSAL: Left → Root → Right",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: false,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [],
          comparison: [],
          action:
            "Starting in-order: process left subtree, then root, then right",
        },
        {
          id: 3,
          description: "Visit A (leftmost leaf) - first in-order node",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: false,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [3],
          comparison: [],
          action: "In-order sequence: A (leftmost node, no left child)",
        },
        {
          id: 4,
          description: "Visit B (parent of A) - process root after left",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [1],
          comparison: [],
          action:
            "In-order sequence: A, B (processed left child A, now root B)",
        },
        {
          id: 5,
          description: "Visit C (left child of D) - continue left subtree",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [6],
          comparison: [],
          action: "In-order sequence: A, B, C (processing B's right subtree)",
        },
        {
          id: 6,
          description: "Visit D (parent of C) - root after left child",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [4],
          comparison: [],
          action:
            "In-order sequence: A, B, C, D (processed left C, now root D)",
        },
        {
          id: 7,
          description: "Visit E (right child of D) - complete D's subtree",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [7],
          comparison: [],
          action: "In-order sequence: A, B, C, D, E (completed B's subtree)",
        },
        {
          id: 8,
          description: "Visit F (root) - process root after left subtree",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [0],
          comparison: [],
          action:
            "In-order sequence: A, B, C, D, E, F (root after left subtree)",
        },
        {
          id: 9,
          description: "Visit G (right child of F) - start right subtree",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: true,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [2],
          comparison: [],
          action:
            "In-order sequence: A, B, C, D, E, F, G (G has no left child)",
        },
        {
          id: 10,
          description: "Visit H (left child of I) - continue right subtree",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: true,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
          ],
          highlights: [8],
          comparison: [],
          action: "In-order sequence: A, B, C, D, E, F, G, H (left child of I)",
        },
        {
          id: 11,
          description: "Visit I (final node) - complete in-order traversal",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: true,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
          ],
          highlights: [5],
          comparison: [],
          action:
            "In-order complete: A, B, C, D, E, F, G, H, I (all nodes visited)",
        },
        {
          id: 12,
          description: "PRE-ORDER TRAVERSAL: Root → Left → Right",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: false,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [],
          comparison: [],
          action:
            "Starting pre-order: process root first, then left, then right",
        },
        {
          id: 13,
          description: "Visit F (root first) - pre-order starts with root",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: false,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [0],
          comparison: [],
          action: "Pre-order sequence: F (visit root before children)",
        },
        {
          id: 14,
          description: "Visit B (left child) - process left subtree",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [1],
          comparison: [],
          action: "Pre-order sequence: F, B (root B of left subtree)",
        },
        {
          id: 15,
          description: "Visit A (left child of B)",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [3],
          comparison: [],
          action: "Pre-order sequence: F, B, A (leaf node, no children)",
        },
        {
          id: 16,
          description: "Visit D (right child of B) - continue pre-order",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [4],
          comparison: [],
          action: "Pre-order sequence: F, B, A, D (root D before its children)",
        },
        {
          id: 17,
          description: "Visit remaining nodes: C, E, G, H, I",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: true,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
          ],
          highlights: [6, 7, 2, 8, 5],
          comparison: [],
          action: "Pre-order complete: F, B, A, D, C, E, G, I, H",
        },
        {
          id: 18,
          description: "POST-ORDER TRAVERSAL: Left → Right → Root",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: false,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: false,
              level: 3,
            },
          ],
          highlights: [],
          comparison: [],
          action: "Starting post-order: process children before root",
        },
        {
          id: 19,
          description: "Post-order visits leaves first: A, C, E, H",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: false,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: false,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: false,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: false,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: false,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
          ],
          highlights: [3, 6, 7, 8],
          comparison: [],
          action: "Post-order sequence: A, C, E, H (all leaf nodes first)",
        },
        {
          id: 20,
          description: "Complete post-order: A, C, E, D, B, H, I, G, F",
          data: [
            {
              id: "F",
              value: "F",
              left: "B",
              right: "G",
              visited: true,
              level: 0,
            },
            {
              id: "B",
              value: "B",
              left: "A",
              right: "D",
              visited: true,
              level: 1,
            },
            {
              id: "G",
              value: "G",
              left: null,
              right: "I",
              visited: true,
              level: 1,
            },
            {
              id: "A",
              value: "A",
              left: null,
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "D",
              value: "D",
              left: "C",
              right: "E",
              visited: true,
              level: 2,
            },
            {
              id: "I",
              value: "I",
              left: "H",
              right: null,
              visited: true,
              level: 2,
            },
            {
              id: "C",
              value: "C",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "E",
              value: "E",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
            {
              id: "H",
              value: "H",
              left: null,
              right: null,
              visited: true,
              level: 3,
            },
          ],
          highlights: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          comparison: [],
          action: "Post-order: children before parents, root F visited last",
        },
      ],
    },
    difficulty: 2,
    order: 3,
    duration: 20,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Binary Tree Traversal Algorithms
class TreeNode:
    """Binary tree node with value and left/right children"""
    def __init__(self, value):
        # TODO: Initialize tree node
        # - Store the value
        # - Initialize left and right children to None
        pass
    
    def __str__(self):
        return f"TreeNode({self.value})"

class BinaryTreeTraversalVisualized:
    """
    Binary tree traversal algorithms with step-by-step tracking for visualization
    """
    
    def __init__(self):
        # TODO: Initialize tree structure
        # - Root node pointer
        # - Track steps for visualization
        pass
    
    def insert(self, value):
        """Insert value into binary search tree"""
        # TODO: Implement BST insertion for building tree
        # - If root is None, create new root
        # - Otherwise, recursively insert in correct position
        # - Record step for visualization
        pass
    
    def inorder_traversal(self, node=None, result=None):
        """
        In-order traversal: Left → Root → Right
        For BST, this gives sorted order
        """
        # TODO: Implement in-order traversal
        # - Process left subtree
        # - Process current node
        # - Process right subtree
        # - Record each visit for visualization
        # - Return list of visited values
        pass
    
    def preorder_traversal(self, node=None, result=None):
        """
        Pre-order traversal: Root → Left → Right
        Useful for tree copying and prefix expressions
        """
        # TODO: Implement pre-order traversal
        # - Process current node first
        # - Process left subtree
        # - Process right subtree
        # - Record each visit for visualization
        # - Return list of visited values
        pass
    
    def postorder_traversal(self, node=None, result=None):
        """
        Post-order traversal: Left → Right → Root
        Useful for tree deletion and postfix expressions
        """
        # TODO: Implement post-order traversal
        # - Process left subtree
        # - Process right subtree
        # - Process current node last
        # - Record each visit for visualization
        # - Return list of visited values
        pass
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        # TODO: Return steps list for visualization
        pass
    
    def print_tree(self, node=None, level=0, prefix="Root: "):
        """Print tree structure visually"""
        # TODO: Create visual representation of tree
        # - Use indentation to show levels
        # - Show left and right relationships
        pass

# Test your tree traversal implementation
print("🌳 BINARY TREE TRAVERSAL VISUALIZATION")
print("=" * 55)

# Create tree and insert values
tree = BinaryTreeTraversalVisualized()

# Build example tree: F as root, then B, G, A, D, I, C, E, H
values = ['F', 'B', 'G', 'A', 'D', 'I', 'C', 'E', 'H']

print("\\n📊 Building Binary Tree:")
for value in values:
    tree.insert(value)
    print(f"   Inserted: {value}")

print("\\n🌳 Tree Structure:")
tree.print_tree()

print("\\n🔄 TRAVERSAL ALGORITHMS:")
print("-" * 40)

# Perform all three traversals
print("\\n1️⃣ IN-ORDER TRAVERSAL (Left → Root → Right):")
inorder_result = tree.inorder_traversal()
print(f"   Result: {' → '.join(inorder_result)}")
print(f"   Use case: Sorted order for BST")

print("\\n2️⃣ PRE-ORDER TRAVERSAL (Root → Left → Right):")
preorder_result = tree.preorder_traversal()
print(f"   Result: {' → '.join(preorder_result)}")
print(f"   Use case: Tree copying, prefix expressions")

print("\\n3️⃣ POST-ORDER TRAVERSAL (Left → Right → Root):")
postorder_result = tree.postorder_traversal()
print(f"   Result: {' → '.join(postorder_result)}")
print(f"   Use case: Tree deletion, postfix expressions")

# Show all visualization steps
print("\\n" + "=" * 55)
print("📊 COMPLETE TRAVERSAL STEPS:")
steps = tree.get_visualization_steps()
for i, step in enumerate(steps, 1):
    print(f"Step {i}: {step}")`,
    solutionCode: `class TreeNode:
    """Binary tree node with value and left/right children"""
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
    
    def __str__(self):
        return f"TreeNode({self.value})"

class BinaryTreeTraversalVisualized:
    """
    Binary tree traversal algorithms with step-by-step tracking for visualization
    """
    
    def __init__(self):
        self.root = None
        self.steps = []
        self.step_count = 0
    
    def insert(self, value):
        """Insert value into binary search tree"""
        if self.root is None:
            self.root = TreeNode(value)
            step = {
                'operation': 'insert',
                'value': value,
                'position': 'root',
                'description': f"Inserted {value} as root node"
            }
            self.steps.append(step)
        else:
            self._insert_recursive(self.root, value)
    
    def _insert_recursive(self, node, value):
        """Helper method for recursive insertion"""
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
                step = {
                    'operation': 'insert',
                    'value': value,
                    'position': f'left child of {node.value}',
                    'description': f"Inserted {value} as left child of {node.value}"
                }
                self.steps.append(step)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
                step = {
                    'operation': 'insert',
                    'value': value,
                    'position': f'right child of {node.value}',
                    'description': f"Inserted {value} as right child of {node.value}"
                }
                self.steps.append(step)
            else:
                self._insert_recursive(node.right, value)
    
    def inorder_traversal(self, node=None, result=None):
        """In-order traversal: Left → Root → Right"""
        if result is None:
            result = []
            node = self.root
            step = {
                'operation': 'start_inorder',
                'description': "Starting in-order traversal (Left → Root → Right)"
            }
            self.steps.append(step)
        
        if node is not None:
            # Traverse left subtree
            self.inorder_traversal(node.left, result)
            
            # Visit root
            result.append(node.value)
            step = {
                'operation': 'visit_inorder',
                'value': node.value,
                'description': f"Visited {node.value} in in-order traversal"
            }
            self.steps.append(step)
            
            # Traverse right subtree
            self.inorder_traversal(node.right, result)
        
        return result
    
    def preorder_traversal(self, node=None, result=None):
        """Pre-order traversal: Root → Left → Right"""
        if result is None:
            result = []
            node = self.root
            step = {
                'operation': 'start_preorder',
                'description': "Starting pre-order traversal (Root → Left → Right)"
            }
            self.steps.append(step)
        
        if node is not None:
            # Visit root
            result.append(node.value)
            step = {
                'operation': 'visit_preorder',
                'value': node.value,
                'description': f"Visited {node.value} in pre-order traversal"
            }
            self.steps.append(step)
            
            # Traverse left subtree
            self.preorder_traversal(node.left, result)
            
            # Traverse right subtree
            self.preorder_traversal(node.right, result)
        
        return result
    
    def postorder_traversal(self, node=None, result=None):
        """Post-order traversal: Left → Right → Root"""
        if result is None:
            result = []
            node = self.root
            step = {
                'operation': 'start_postorder',
                'description': "Starting post-order traversal (Left → Right → Root)"
            }
            self.steps.append(step)
        
        if node is not None:
            # Traverse left subtree
            self.postorder_traversal(node.left, result)
            
            # Traverse right subtree
            self.postorder_traversal(node.right, result)
            
            # Visit root
            result.append(node.value)
            step = {
                'operation': 'visit_postorder',
                'value': node.value,
                'description': f"Visited {node.value} in post-order traversal"
            }
            self.steps.append(step)
        
        return result
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        return self.steps.copy()
    
    def print_tree(self, node=None, level=0, prefix="Root: "):
        """Print tree structure visually"""
        if node is None:
            node = self.root
        
        if node is not None:
            print("  " * level + prefix + str(node.value))
            if node.left is not None or node.right is not None:
                if node.left:
                    self.print_tree(node.left, level + 1, "L--- ")
                else:
                    print("  " * (level + 1) + "L--- None")
                
                if node.right:
                    self.print_tree(node.right, level + 1, "R--- ")
                else:
                    print("  " * (level + 1) + "R--- None")`,
    testCases: [
      {
        input: [
          ["insert", "B"],
          ["insert", "A"],
          ["insert", "C"],
          ["inorder_traversal"],
        ],
        expected: [null, null, null, ["A", "B", "C"]],
        description: "In-order traversal gives sorted sequence for BST",
      },
      {
        input: [
          ["insert", "F"],
          ["insert", "B"],
          ["insert", "G"],
          ["preorder_traversal"],
        ],
        expected: [null, null, null, ["F", "B", "G"]],
        description: "Pre-order traversal visits root first",
      },
      {
        input: [["insert", "A"], ["insert", "B"], ["postorder_traversal"]],
        expected: [null, null, ["B", "A"]],
        description: "Post-order traversal visits children before parent",
      },
      {
        input: [["inorder_traversal"]],
        expected: [[]],
        description: "Empty tree traversal returns empty list",
      },
    ],
    diamondReward: 65,
    experienceReward: 120,
    isPublished: true,
    tags: [
      "Tree Algorithms",
      "Binary Tree",
      "Traversal",
      "Recursion",
      "DFS",
      "Intermediate",
    ],
    learningObjectives: [
      "Understand different tree traversal strategies and their applications",
      "Master recursive thinking for tree algorithms",
      "Learn when to use in-order, pre-order, and post-order traversals",
      "Practice binary tree navigation and node visiting",
      "Visualize recursive call stack for tree operations",
      "Recognize traversal patterns in expression trees and file systems",
    ],
  },
];

export async function seedGraphAlgorithms() {
  console.log("🔄 Seeding Graph Algorithm Challenges...");

  try {
    for (const challenge of graphAlgorithmChallenges) {
      const learningActivityData = {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        content:
          typeof challenge.content === "string"
            ? challenge.content
            : JSON.stringify(challenge.content),
        activityType: "algorithm_visualization",
        category: challenge.category || "Algorithms",
        difficulty: challenge.difficulty || 1,
        diamondReward: challenge.diamondReward || 40,
        experienceReward: challenge.experienceReward || 80,
        estimatedMinutes: challenge.duration || 15,
        sortOrder: challenge.order || 0,
        isActive: challenge.isPublished !== false,
        tags: JSON.stringify(challenge.tags || []),
        settings: JSON.stringify({
          slug: challenge.slug,
          hasCodeExercise: challenge.hasCodeExercise || false,
          starterCode: challenge.starterCode,
          solutionCode: challenge.solutionCode,
          testCases: JSON.stringify(challenge.testCases || []),
          learningObjectives: challenge.learningObjectives || [],
          source: "graph_algorithm_seed",
          migrated_at: new Date().toISOString(),
        }),
      };

      await prisma.learningActivity.upsert({
        where: { id: challenge.id },
        update: learningActivityData,
        create: learningActivityData,
      });
      console.log(`✅ Created graph algorithm challenge: ${challenge.title}`);
    }

    console.log("🎉 Graph algorithm challenges seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding graph algorithms:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedGraphAlgorithms();
    console.log("✅ Graph algorithm seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding graph algorithms:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
