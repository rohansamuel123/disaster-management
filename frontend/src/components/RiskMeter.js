function RiskMeter({ risk }) {
  const percent = risk === "HIGH" ? 80 : risk === "MEDIUM" ? 50 : 20;

  return (
    <div>
      <h4>⚠ Risk Level</h4>
      <div
        style={{
          height: "10px",
          width: "100%",
          background: "#ddd",
        }}>
        <div
          style={{
            height: "10px",
            width: `${percent}%`,
            background: percent > 60 ? "red" : "orange",
          }}
        />
      </div>
    </div>
  );
}

export default RiskMeter;
