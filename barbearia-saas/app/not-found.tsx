// app/not-found.tsx
// Página 404 — barbearia com slug inválido ou rota inexistente

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      textAlign: 'center',
      padding: '24px',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'var(--gold)', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)' }}>
        Página não encontrada
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: 360 }}>
        O endereço que você acessou não existe ou esta barbearia ainda não está ativa na plataforma.
      </p>
      <a href="/" className="btn btn-ghost" style={{ marginTop: 8 }}>
        Voltar ao início
      </a>
    </div>
  )
}
