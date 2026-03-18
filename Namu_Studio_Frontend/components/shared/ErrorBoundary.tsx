"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { Logo } from "@/components/shared/Logo";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorId: "" };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
      errorId: crypto.randomUUID()
    };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {}

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-bg-base px-6">
          <div className="text-center">
            <div className="mx-auto w-fit">
              <Logo />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-text-primary">Wani abu ya fita daidai</h1>
            <p className="mt-2 text-sm text-text-secondary">Sake gwadawa domin dawo da aikin.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white"
            >
              Sake gwadawa
            </button>
            <p className="mt-4 text-xs text-text-muted">Error ID: {this.state.errorId}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
