'use client'
// app/dashboard/DashboardClient.tsx
// Painel admin interativo — gerencia agendamentos e faturamento

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'

type Barbearia   = { id: string; nome: string; slug: string; plano: string; telefone?: string }
type Agendamento = { id: number; nome: string; telefone?: string; data: string; servico: string; status: string }
type Faturamento = { id: number; data: string; valor: string }

interface Props {
  barbearia:        Barbearia
  agendamentos:     Agendamento[]
  faturamentos:     Faturamento[]
  totalMes:         number
  agendamentosHoje: number
}

type Aba = 'agenda' | 'faturamento' | 'config'

const STATUS_LABEL: Record<string, string> = {
  confirmado: 'Confirmado',
  cancelado:  'Cancelado',
  concluido:  'Concluído',
}

const STATUS_CLASS: Record<string, string> = {
  confirmado: styles.statusConfirmado,
  cancelado:  styles.statusCancelado,
  concluido:  styles.statusConcluido,
}

export default function DashboardClient({ barbearia, agendamentos, faturamentos, totalMes, agendamentosHoje }: Props) {
  const router    = useRouter()
  const supabase  = createClient()
  const [aba, setAba]           = useState<Aba>('agenda')
  const [loading, setLoading]   = useState<number | null>(null)

  // ── Faturamento manual ───────────────────────────────────
  const [fatData, setFatData]   = useState(new Date().toISOString().split('T')[0])
  const [fatValor, setFatValor] = useState('')
  const [fatLoading, setFatLoading] = useState(false)
  const [fatMsg, setFatMsg]     = useState('')

  // ── Atualiza status do agendamento ───────────────────────
  const atualizarStatus = async (id: number, status: string) => {
    setLoading(id)
    await supabase
      .from('agendamentos')
      .update({ status })
      .eq('id', id)
      .eq('barbearia_id', barbearia.id) // redundante, mas explícito
    setLoading(null)
    router.refresh()
  }

  // ── Cancela agendamento ──────────────────────────────────
  const cancelar = async (id: number) => {
    if (!confirm('Cancelar este agendamento?')) return
    await atualizarStatus(id, 'cancelado')
  }

  // ── Marca como concluído e registra faturamento ──────────
  const concluir = async (ag: Agendamento, valor: number) => {
    await atualizarStatus(ag.id, 'concluido')
    const data = new Date(ag.data).toISOString().split('T')[0]
    await supabase.from('faturamentos').upsert(
      { barbearia_id: barbearia.id, data, valor },
      { onConflict: 'barbearia_id,data', ignoreDuplicates: false }
    )
    router.refresh()
  }

  // ── Faturamento manual ───────────────────────────────────
  const registrarFaturamento = async (e: React.FormEvent) => {
    e.preventDefault()
    setFatLoading(true); setFatMsg('')
    const { error } = await supabase.from('faturamentos').upsert(
      { barbearia_id: barbearia.id, data: fatData, valor: Number(fatValor) },
      { onConflict: 'barbearia_id,data', ignoreDuplicates: false }
    )
    setFatMsg(error ? 'Erro ao registrar.' : 'Faturamento salvo!')
    setFatLoading(false)
    setFatValor('')
    router.refresh()
  }

  // ── Logout ───────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const formatData = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', {
      weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    })

  const formatMoeda = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className={styles.page}>
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>✦ BarberOS</div>

        <div className={styles.tenantInfo}>
          <div className={styles.tenantAvatar}>{barbearia.nome[0]}</div>
          <div>
            <p className={styles.tenantNome}>{barbearia.nome}</p>
            <span className={`${styles.planoBadge} ${barbearia.plano === 'pro' ? styles.planoPro : ''}`}>
              {barbearia.plano.toUpperCase()}
            </span>
          </div>
        </div>

        <nav className={styles.nav}>
          {(['agenda', 'faturamento', 'config'] as Aba[]).map(a => (
            <button
              key={a}
              className={`${styles.navItem} ${aba === a ? styles.navActive : ''}`}
              onClick={() => setAba(a)}
            >
              {a === 'agenda'       && '📅 Agenda'}
              {a === 'faturamento'  && '💰 Faturamento'}
              {a === 'config'       && '⚙️ Configurações'}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a
            href={`/${barbearia.slug}`}
            target="_blank"
            rel="noopener"
            className={styles.linkPublico}
          >
            🔗 Ver página pública
          </a>
          <button className={`btn btn-ghost ${styles.logoutBtn}`} onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className={styles.main}>

        {/* ── ABA: AGENDA ─────────────────────────────── */}
        {aba === 'agenda' && (
          <div className={styles.fadeIn}>
            <div className={styles.pageHeader}>
              <div>
                <h2>Agenda</h2>
                <p className="text-muted">Próximos 30 dias</p>
              </div>
              <div className={styles.metricSmall}>
                <span className={styles.metricNum}>{agendamentosHoje}</span>
                <span className={styles.metricLabel}>agendamentos hoje</span>
              </div>
            </div>

            {agendamentos.length === 0 ? (
              <div className={styles.empty}>
                <p>Nenhum agendamento nos próximos 30 dias.</p>
                <p className="text-muted">Compartilhe seu link público para receber reservas.</p>
              </div>
            ) : (
              <div className={styles.agendaList}>
                {agendamentos.map(ag => (
                  <div key={ag.id} className={`${styles.agendaCard} ${ag.status === 'cancelado' ? styles.cardCancelado : ''}`}>
                    <div className={styles.agendaInfo}>
                      <div className={styles.agendaData}>{formatData(ag.data)}</div>
                      <div className={styles.agendaCliente}>{ag.nome}</div>
                      <div className={styles.agendaDetalhes}>
                        {ag.servico}
                        {ag.telefone && <> · <a href={`https://wa.me/55${ag.telefone.replace(/\D/g,'')}`} target="_blank" rel="noopener">{ag.telefone}</a></>}
                      </div>
                    </div>
                    <div className={styles.agendaActions}>
                      <span className={`${styles.status} ${STATUS_CLASS[ag.status]}`}>
                        {STATUS_LABEL[ag.status]}
                      </span>
                      {ag.status === 'confirmado' && (
                        <>
                          <button
                            className={`btn btn-primary ${styles.btnSm}`}
                            disabled={loading === ag.id}
                            onClick={() => {
                              const valor = prompt(`Valor cobrado por "${ag.servico}" (R$)?`, '35')
                              if (valor) concluir(ag, Number(valor.replace(',', '.')))
                            }}
                          >
                            ✓ Concluir
                          </button>
                          <button
                            className={`btn btn-ghost ${styles.btnSm}`}
                            disabled={loading === ag.id}
                            onClick={() => cancelar(ag.id)}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: FATURAMENTO ────────────────────────── */}
        {aba === 'faturamento' && (
          <div className={styles.fadeIn}>
            <div className={styles.pageHeader}>
              <div>
                <h2>Faturamento</h2>
                <p className="text-muted">Últimos 30 dias</p>
              </div>
              <div className={styles.metricSmall}>
                <span className={`${styles.metricNum} text-gold`}>{formatMoeda(totalMes)}</span>
                <span className={styles.metricLabel}>total no período</span>
              </div>
            </div>

            {/* Registro manual */}
            <div className={`card ${styles.fatForm}`}>
              <h3>Registrar manualmente</h3>
              <form onSubmit={registrarFaturamento} className={styles.fatRow}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Data</label>
                  <input type="date" value={fatData} onChange={e => setFatData(e.target.value)} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={fatValor}
                    onChange={e => setFatValor(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }} disabled={fatLoading}>
                  {fatLoading ? '...' : 'Registrar'}
                </button>
              </form>
              {fatMsg && <p className={fatMsg.includes('Erro') ? 'text-danger' : 'text-success'} style={{ marginTop: 8, fontSize: 13 }}>{fatMsg}</p>}
            </div>

            {/* Histórico */}
            <div className={styles.fatTable}>
              <div className={styles.fatHeader}>
                <span>Data</span>
                <span>Valor</span>
              </div>
              {faturamentos.length === 0 ? (
                <div className={styles.empty}><p>Nenhum registro ainda.</p></div>
              ) : (
                faturamentos.map(f => (
                  <div key={f.id} className={styles.fatRow2}>
                    <span>{new Date(f.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
                    <span className="text-gold">{formatMoeda(Number(f.valor))}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ABA: CONFIG ─────────────────────────────── */}
        {aba === 'config' && (
          <div className={styles.fadeIn}>
            <div className={styles.pageHeader}>
              <div>
                <h2>Configurações</h2>
                <p className="text-muted">Dados da sua barbearia</p>
              </div>
            </div>

            <div className={`card ${styles.configCard}`}>
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Link público</span>
                <a href={`/${barbearia.slug}`} target="_blank" rel="noopener" className={styles.configVal}>
                  barberos.com.br/{barbearia.slug} ↗
                </a>
              </div>
              <hr className="divider" />
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Plano atual</span>
                <span className={`${styles.planoBadge} ${barbearia.plano === 'pro' ? styles.planoPro : ''}`}>
                  {barbearia.plano.toUpperCase()}
                </span>
              </div>
              <hr className="divider" />
              <div className={styles.configRow}>
                <span className={styles.configLabel}>WhatsApp</span>
                <span className={styles.configVal}>{barbearia.telefone ?? '—'}</span>
              </div>

              {barbearia.plano === 'free' && (
                <div className={styles.upgradeBanner}>
                  <strong>🚀 Upgrade para Pro</strong> — desbloqueie agendamentos ilimitados, relatórios e notificações WhatsApp por <strong>R$ 49/mês</strong>.
                  <button className="btn btn-primary" style={{ marginTop: 12, width: '100%' }}>
                    Fazer upgrade
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
