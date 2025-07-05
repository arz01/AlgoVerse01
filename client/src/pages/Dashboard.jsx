import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import GeminiChat from "./components/GeminiChat";

const dataStructures = [
    {
        title: "Arrays",
        image: "arrays.png",
        description: "Arrays store elements in contiguous memory locations, allowing constant-time access by index. They are ideal for situations where fast lookups and sequential processing are important, but resizing can be costly."
    },
    {
        title: "Linked Lists",
        image: "linkedlist.png",
        description: "Linked lists are collections of nodes, each containing data and a reference to the next node. They enable efficient insertions and deletions at any position but require sequential access to find elements."
    },
    {
        title: "Stacks",
        image: "stack.png",
        description: "Stacks follow the Last-In, First-Out (LIFO) principle. Elements are added and removed from the top, making them ideal for undo operations, function call management, and backtracking algorithms."
    },
    {
        title: "Queues",
        image: "queue.png",
        description: "Queues operate on a First-In, First-Out (FIFO) basis. Elements are added at the rear and removed from the front, making them suitable for scheduling, buffering, and breadth-first search."
    },
    {
        title: "Trees",
        image: "tree.png",
        description: "Trees are hierarchical structures with nodes connected in parent-child relationships. They are used to represent data with a natural hierarchy, such as file systems and organizational charts."
    },
    {
        title: "Graphs",
        image: "graph.png",
        description: "Graphs consist of nodes (vertices) connected by edges. They are powerful for modeling complex relationships and networks, such as social connections, transportation systems, and web links."
    }
];



function Dashboard() {
    return (
        <div>
            <div className="dashboard-header-bg">
                <div className="dashboard-header-content">
                    <h1 className="dashboard-title">algo verse</h1>
                    <p className="dashboard-desc">
                        Welcome to Algo Verse – your visual playground for exploring classic data structures. Dive in, interact, and master the building blocks of algorithms!
                    </p>
                </div>
            </div>
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard-main">
                    <h2
                        className="dashboard-subtitle"
                        style={{ paddingTop: "2rem", textAlign: "center" }}
                    >
                        AlgoVerse:<br />
                        <span style={{ fontWeight: 400 }}>
                            Choose the topic you want to continue your study in
                        </span>
                    </h2>

                    <div className="card-grid">
                        {dataStructures.map((ds) => (
                            <Card key={ds.title} title={ds.title} image={ds.image} description={ds.description} />
                        ))}
                    </div>
                </div>
            </div>
            <GeminiChat />
        </div>
    );
}

export default Dashboard;