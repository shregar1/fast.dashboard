import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import HealthPage from "@/pages/Health";
import ApiPage from "@/pages/ApiActivity";
import QueuesPage from "@/pages/Queues";
import SecretsPage from "@/pages/Secrets";
import TenantsPage from "@/pages/Tenants";
import WorkflowsPage from "@/pages/Workflows";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/health" replace />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/queues" element={<QueuesPage />} />
        <Route path="/secrets" element={<SecretsPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="*" element={<Navigate to="/health" replace />} />
      </Routes>
    </AppShell>
  );
}
