// app/page.tsx
// Landing page do SaaS — quem acessa barberos.com.br vê isso

import styles from './home.module.css'

export default function Home() {
  return (
    <main className={styles.page}>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>✦ SaaS para Barbearias</div>
          <h1 className={styles.heroTitle}>
            Sua barbearia online<br />
            <em>em menos de 5 minutos</em>
          </h1>
          <p className={styles.heroSub}>
            Página de agendamento profissional, painel de controle e controle de caixa.
            Tudo num link que você manda pro cliente.
          </p>
          <div className={styles.heroCtas}>
            <a href="/login" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
              Criar conta grátis
            </a>
            <a href="/kauan-barber" className="btn btn-ghost" target="_blank" rel="noopener">
              Ver demonstração →
            </a>
          </div>
        </div>
        <div className={styles.heroGlow} aria-hidden />
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          {[
            { icon: '📅', title: 'Agendamento online',    desc: 'Seus clientes agendam 24h pelo celular. Sem ligação, sem confusão.' },
            { icon: '🔒', title: 'Bloqueio inteligente',  desc: 'Domingos, fora do horário e choque de agenda bloqueados automaticamente.' },
            { icon: '💰', title: 'Controle de caixa',     desc: 'Feche o dia em segundos. Histórico de faturamento por data.' },
            { icon: '💬', title: 'WhatsApp integrado',    desc: 'Link direto pro seu WhatsApp em todas as páginas.' },
            { icon: '🔗', title: 'Link personalizado',    desc: 'barberos.com.br/seu-nome — compartilhe no Instagram.' },
            { icon: '🔐', title: 'Dados isolados',        desc: 'Sua barbearia só acessa os próprios dados. Segurança de banco garantida.' },
          ].map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Planos ───────────────────────────────────── */}
      <section className={styles.planos}>
        <h2 className={styles.sectionTitle}>Planos simples, sem pegadinha</h2>
        <div className={styles.planosGrid}>
          {[
            {
              nome: 'Free', preco: 'R$ 0', periodo: '/mês',
              desc: 'Para começar',
              itens: ['Até 30 agendamentos/mês', '1 barbeiro', 'Painel básico'],
              bloq: ['Sem relatórios', 'Sem WhatsApp automático'],
              cta: 'Começar grátis', destaque: false,
            },
            {
              nome: 'Pro', preco: 'R$ 49', periodo: '/mês',
              desc: 'Para quem quer crescer',
              itens: ['Agendamentos ilimitados', 'Até 5 barbeiros', 'Relatórios de faturamento', 'Link personalizado', 'WhatsApp automático'],
              bloq: [],
              cta: 'Assinar Pro', destaque: true,
            },
            {
              nome: 'Business', preco: 'R$ 99', periodo: '/mês',
              desc: 'Para redes e franquias',
              itens: ['Tudo do Pro', 'Barbeiros ilimitados', 'Domínio próprio', 'Suporte prioritário', 'API pública'],
              bloq: [],
              cta: 'Falar com a equipe', destaque: false,
            },
          ].map(p => (
            <div key={p.nome} className={`${styles.planoCard} ${p.destaque ? styles.planoDestaque : ''}`}>
              {p.destaque && <div className={styles.planoBadge}>Mais popular</div>}
              <div className={styles.planoNome}>{p.nome}</div>
              <div className={styles.planoPreco}>{p.preco}<span>{p.periodo}</span></div>
              <div className={styles.planoDesc}>{p.desc}</div>
              <ul className={styles.planoItens}>
                {p.itens.map(i => <li key={i}><span className={styles.check}>✓</span>{i}</li>)}
                {p.bloq.map(i => <li key={i} className={styles.bloq}><span>✕</span>{i}</li>)}
              </ul>
              <a href="/login" className={`btn ${p.destaque ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', marginTop: 'auto' }}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>✦ BarberOS</span>
        <p>Desenvolvido por Kauan · Solânea, PB</p>
      </footer>
    </main>
  )
}
