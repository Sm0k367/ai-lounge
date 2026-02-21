import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 shadow-2xl">
            <div className="text-center">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h1 className="text-2xl font-bold text-white mb-2">
                SYSTEM ERROR
              </h1>
              <p className="text-white/60 text-sm mb-6">
                Something went wrong. The AI Lounge encountered an unexpected error.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
              >
                RESTART SESSION
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
