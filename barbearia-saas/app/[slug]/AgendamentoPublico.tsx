'use client'
// app/[slug]/AgendamentoPublico.tsx
// Formulário público de agendamento com todas as validações do backend original

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './publico.module.css'

type Barbearia = { id: string; nome: string; slug: string; telefone?: string; endereco?: string }

const SERVICOS = [
  { label: 'Corte Clássico / Degradê',  valor: 35 },
  { label: 'Barboterapia VIP',           valor: 20 },
  { label: 'Corte + Barba',              valor: 55 },
  { label: 'Nevou / Platinado',          valor: 80 },
  { label: 'Sobrancelha',               valor: 15 },
]

export default function AgendamentoPublico({ barbearia }: { barbearia: Barbearia }) {
  const supabase = createClient()

  const [nome, setNome]         = useState('')
  const [telefone, setTelefone] = useState('')
  const [data, setData]         = useState('')
  const [servico, setServico]   = useState(SERVICOS[0].label)
  const [loading, setLoading]   = useState(false)
  const [msg, setMsg]           = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setMsg(null)

    const dataEscolhida = new Date(data)
    const diaSemana     = dataEscolhida.getDay()
    const hora          = dataEscolhida.getHours()

    // ── Validações (replicam a lógica do Express original) ──
    if (diaSemana === 0) {
      setMsg({ tipo: 'erro', texto: 'A barbearia está fechada aos domingos. Escolha outro dia!' })
      setLoading(false); return
    }

    if (hora < 9 || hora >= 19) {
      setMsg({ tipo: 'erro', texto: 'Atendimento das 09:00 às 19:00.' })
      setLoading(false); return
    }

    // Choque de horário — verifica por barbearia_id E data exata
    const { data: conflito } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('barbearia_id', barbearia.id)
      .eq('data', dataEscolhida.toISOString())
      .eq('status', 'confirmado')
      .maybeSingle()

    if (conflito) {
      setMsg({ tipo: 'erro', texto: 'Este horário já está reservado. Escolha outro.' })
      setLoading(false); return
    }

    // Insere o agendamento
    const { error } = await supabase.from('agendamentos').insert({
      barbearia_id: barbearia.id,
      nome,
      telefone,
      data: dataEscolhida.toISOString(),
      servico,
    })

    if (error) {
      setMsg({ tipo: 'erro', texto: 'Erro ao agendar. Tente novamente.' })
    } else {
      setMsg({ tipo: 'ok', texto: `Agendado! Até lá, ${nome.split(' ')[0]} ✓` })
      setNome(''); setTelefone(''); setData(''); setServico(SERVICOS[0].label)
    }
    setLoading(false)
  }

  // Data mínima = agora + 30min, em formato datetime-local
  const dataMin = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString().slice(0, 16)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1>{barbearia.nome}</h1>
          {barbearia.endereco && <p className={styles.endereco}>📍 {barbearia.endereco}</p>}
          <p className={styles.horario}>⏰ Seg–Sáb &nbsp;·&nbsp; 09:00 às 19:00</p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>

          <div className={styles.servicosGrid}>
            {SERVICOS.map(s => (
              <button
                key={s.label}
                type="button"
                className={`${styles.servicoCard} ${servico === s.label ? styles.servicoAtivo : ''}`}
                onClick={() => setServico(s.label)}
              >
                <span className={styles.servicoNome}>{s.label}</span>
                <span className={styles.servicoValor}>R$ {s.valor}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>Reserve seu horário</h2>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Nome completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(83) 99999-0000"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Data e horário</label>
              <input
                type="datetime-local"
                min={dataMin}
                value={data}
                onChange={e => setData(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Serviço</label>
              <select value={servico} onChange={e => setServico(e.target.value)}>
                {SERVICOS.map(s => (
                  <option key={s.label} value={s.label}>
                    {s.label} — R$ {s.valor}
                  </option>
                ))}
              </select>
            </div>

            {msg && (
              <div className={`${styles.msg} ${msg.tipo === 'ok' ? styles.msgOk : styles.msgErro}`}>
                {msg.texto}
              </div>
            )}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Verificando...' : 'Confirmar reserva'}
            </button>
          </form>

          {barbearia.telefone && (
            <a
              href={`https://wa.me/55${barbearia.telefone.replace(/\D/g,'')}?text=Olá! Gostaria de tirar uma dúvida.`}
              target="_blank"
              rel="noopener"
              className={styles.whatsapp}
            >
              💬 Falar pelo WhatsApp
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
