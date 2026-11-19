import Navbar from "./Navbar";

function PageLayout({ children }) {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "calc(100vh - 72px)",
          position: "relative",
          overflow: "hidden",
          background: "#0F172A",
          color: "white",
        }}
      >
        {/* TOP BLUE GLOW */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "520px",
            background:
              "radial-gradient(ellipse, rgba(37, 99, 235, 0.28) 0%, rgba(37, 99, 235, 0.14) 35%, rgba(37, 99, 235, 0.04) 60%, transparent 75%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* SECOND SOFT GLOW */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "500px",
            background:
              "linear-gradient(180deg, rgba(30, 64, 175, 0.08) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* PAGE CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "calc(100vh - 72px)",
          }}
        >
          {children}
        </div>
      </main>
    </>
  );
}

export default PageLayout;