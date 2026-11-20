import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070B14] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#0E1726] border border-rose-500/30 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white mb-2">
              An unexpected interface error occurred
            </h2>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              {this.state.error?.message || 'Component failed to render'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={this.handleReload} variant="primary" size="sm" icon={RefreshCw} iconPosition="left">
                Reload Application
              </Button>
              <Button href="/" variant="secondary" size="sm" icon={Home} iconPosition="left">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
