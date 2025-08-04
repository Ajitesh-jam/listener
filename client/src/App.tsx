import { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/inter";
import HomePage from "./pages/HomePage";
import ForestPage from "./pages/ForestPage";
import SharedWhisperPage from "./pages/SharedWhisperPage";
import SharedWhispersPage from "./pages/SharedWhispersPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
          {showCanvas && (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shared" element={<SharedWhispersPage />} />
              <Route path="/forest" element={<ForestPage />} />
              <Route path="/share/:shareCode" element={<SharedWhisperPage />} />
            </Routes>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
