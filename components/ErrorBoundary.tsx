"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleTryAgain = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="scrapbook-card p-6 tilt-left">
          <h2 className="burn-heading text-2xl mb-3">the burn book had a meltdown 💀</h2>
          <p className="handwritten text-lg text-gray-700 mb-4">
            something broke and we can&apos;t even right now...
          </p>
          <button onClick={this.handleTryAgain} className="burn-btn px-5 py-2 text-sm">
            try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
