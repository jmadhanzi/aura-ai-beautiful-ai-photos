import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; message?: string; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err?.message };
  }

  componentDidCatch(err: Error) {
    console.error('[ErrorBoundary]', err);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return this.props.fallback ?? (
      <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center" style={{ background: 'var(--ink)' }}>
        <div className="text-4xl mb-4">⚡</div>
        <h2 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Something went wrong
        </h2>
        <p className="font-body text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {this.state.message ?? 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
          className="rounded-xl px-6 py-3 font-body text-sm font-semibold"
          style={{ background: 'var(--rose)', color: '#fff' }}
        >
          Reload App
        </button>
      </div>
    );
  }
}
