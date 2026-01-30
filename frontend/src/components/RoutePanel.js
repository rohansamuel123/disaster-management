function RoutePanel({ directions, risk }) {
  if (!directions) return null;
  if (!Array.isArray(directions) || directions.length === 0) {
    return (
      <div style={{ padding: "15px" }}>
        <h3>🚑 Evacuation Instructions</h3>
        <p>No route calculated yet.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 60,
        width: "300px",
        background: "white",
        padding: "15px",
        zIndex: 1500,
        height: "calc(100vh - 60px)",
        overflowY: "auto",
      }}>
      <h3>🚑 Evacuation Instructions</h3>
      <p>
        <b>Risk Reduced:</b> {risk}
      </p>
      <ol>
        {directions.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ol>
    </div>
  );
}

export default RoutePanel;
