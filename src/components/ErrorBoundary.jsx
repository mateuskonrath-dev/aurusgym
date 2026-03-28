import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
          color: '#fff',
          padding: '20px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ marginBottom: '10px' }}>Algo deu errado</h1>
          <p style={{ color: '#aaa', marginBottom: '30px', textAlign: 'center', maxWidth: '500px' }}>
            O aplicativo encontrou um erro inesperado. Tente recarregar a página.
          </p>
          <details style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', maxWidth: '500px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Detalhes do erro</summary>
            <pre style={{ marginTop: '10px', fontSize: '0.8rem', overflow: 'auto', maxHeight: '200px', color: '#ff6b6b' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
              border: 'none',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginRight: '10px'
            }}
          >
            Recarregar Página
          </button>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '2px solid #00d4ff',
              color: '#00d4ff',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
