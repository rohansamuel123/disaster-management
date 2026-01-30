function Header({ alertMsg }) {
  return (
    <div
      style={{
        height: "50px",
        background: "#1f2933",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}>
      <b>🌊 Disaster Evacuation System</b>
      {alertMsg && (
        <span style={{ color: "red", fontWeight: "bold" }}>
          ALERT: {alertMsg}
        </span>
      )}
    </div>
  );
}

export default Header;
