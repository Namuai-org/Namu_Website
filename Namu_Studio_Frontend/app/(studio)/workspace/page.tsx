import { Suspense } from "react";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

export default function WorkspacePage(): JSX.Element {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <WorkspaceShell />
      </Suspense>
    </ErrorBoundary>
  );
}
