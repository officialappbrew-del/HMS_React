import { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('Page Error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="max-w-2xl mx-auto">
            {/* Error Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
              {/* Header */}
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full p-4 mr-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Page Loading Error
                  </h2>
                  <p className="text-slate-600">
                    This page encountered an error while loading. Try refreshing or go back.
                  </p>
                </div>
              </div>

              {/* Error Details (Development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <details>
                    <summary className="font-semibold text-yellow-800 cursor-pointer">
                      Error Details
                    </summary>
                    <div className="mt-3 text-sm">
                      <div className="bg-white p-2 rounded border border-yellow-100 mb-2">
                        <p className="font-mono text-yellow-700 break-words">
                          {this.state.error?.toString()}
                        </p>
                      </div>
                      {this.state.errorInfo && (
                        <div className="bg-white p-2 rounded border border-yellow-100 max-h-32 overflow-y-auto">
                          <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
