import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AnalyzePage } from "@/pages/AnalyzePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DocsPage } from "@/pages/DocsPage";
import { IngestPage } from "@/pages/IngestPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="ingest" element={<IngestPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
