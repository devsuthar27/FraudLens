function Loader() {
  return (
    <div
      style={{
        marginTop: "30px",
        maxWidth: "700px",
        background: "#1E293B",
        padding: "25px",
        borderRadius: "12px",
      }}
    >
      <h3 style={{ color: "#60A5FA" }}>
        🤖 FraudLens Engine
      </h3>

      <p>✔ Checking phishing indicators...</p>

      <p>✔ Comparing threat database...</p>

      <p>✔ Running AI prediction...</p>

      <p>✔ Generating report...</p>

      <div
        style={{
          marginTop: "20px",
          width: "100%",
          height: "10px",
          background: "#334155",
          borderRadius: "20px",
        }}
      >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#2563EB",
            }}
          />
      </div>
    </div>
  );
}

export default Loader;