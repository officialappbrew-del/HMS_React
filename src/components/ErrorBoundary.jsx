import { Component } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Optional: Send error to external logging service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // This can be extended to send errors to Sentry, LogRocket, etc.
    const errorData = {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Example: Send to logging service
    // fetch('/api/logs/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData),
    // }).catch(err => console.log('Failed to log error:', err));
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-l-4 border-red-600">
              {/* Header */}
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-full p-4 mr-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Something Went Wrong
                  </h1>
                  <p className="text-slate-600">
                    We encountered an unexpected error while processing your request.
                  </p>
                </div>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-red-800 hover:text-red-900">
                      Error Details (Development)
                    </summary>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="bg-white p-2 rounded border border-red-100">
                        <p className="font-mono text-red-700 break-words">
                          {this.state.error.toString()}
                        </p>
                      </div>
                      {this.state.errorInfo && (
                        <div className="bg-white p-2 rounded border border-red-100 max-h-40 overflow-y-auto">
                          <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap break-words">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Production Message */}
              {process.env.NODE_ENV === 'production' && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    Error ID: <span className="font-mono font-semibold">{this.state.errorCount}</span>
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Our team has been notified. Please try refreshing the page or return to the dashboard.
                  </p>
                </div>
              )}

              {/* Suggested Actions */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 mb-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">What you can try:</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">1.</span>
                    <span>Refresh the page to see if the issue resolves itself</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">2.</span>
                    <span>Clear your browser cache and cookies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">3.</span>
                    <span>Return to the dashboard and try again</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">4.</span>
                    <span>Contact support if the problem persists</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retry
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 rounded-lg hover:from-slate-300 hover:to-slate-400 font-semibold transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </button>
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Error timestamp: {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Support Contact Card */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-3">
                If this error continues to occur, please contact our support team with the error details above.
              </p>
              <div className="flex gap-2 flex-wrap">
                <a
                  href="mailto:support@smartcarehms.com"
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Email Support
                </a>
                <span className="text-slate-300">•</span>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Contact IT
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
