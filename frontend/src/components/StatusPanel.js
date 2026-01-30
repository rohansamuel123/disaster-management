function StatusPanel({ alertMsg, riskReduced }) {
  let riskText = "LOW";
  let color = "green";
  let recommendation = "Remain alert";

  if (alertMsg) {
    riskText = "HIGH";
    color = "red";
    recommendation = "Evacuate immediately";
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "70px",
        left: 0,
        width: "260px",
        height: "calc(100vh - 70px)",
        background: "#f9fafb",
        borderRight: "1px solid #ddd",
        padding: "15px",
        zIndex: 1200,
        boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
      }}>
      <h3>📊 Situation Status</h3>

      <p>
        <b>Status:</b>{" "}
        <span style={{ color, fontWeight: "bold" }}>
          {alertMsg ? "ALERT" : "NORMAL"}
        </span>
      </p>

      <p>
        <b>Disaster Type:</b>
        <br />
        Flood (Rain & Water-level based)
      </p>

      <p>
        <b>Risk Level:</b> <span style={{ color }}>{riskText}</span>
      </p>

      {riskReduced && (
        <p>
          <b>Post-Evacuation Risk:</b>{" "}
          <span style={{ color: "green" }}>{riskReduced}</span>
        </p>
      )}

      <hr />

      <p>
        <b>Recommendation:</b>
        <br />
        {recommendation}
      </p>
    </div>
  );
}

export default StatusPanel;
