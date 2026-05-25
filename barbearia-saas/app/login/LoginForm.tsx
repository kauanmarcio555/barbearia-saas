'use client'
// app/login/LoginForm.tsx
// Formulário de login e cadastro com criação do tenant (barbearia)

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

type Tab = 'login' | 'cadastro'
type Step = 'auth' | 'onboarding'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab]       = useState<Tab>('login')
  const [step, setStep]     = useState<Step>('auth')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [userId, setUserId] = useState('')

  // Campos de auth
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // Campos de onboarding
  const [nomeBarbearia, setNomeBarbearia] = useState('')
  const [slug, setSlug]                   = useState('')
  const [telefone, setTelefone]           = useState('')
  const [endereco, setEndereco]           = useState('')

  // ── Gera slug automático a partir do nome ────────────────
  const handleNomeChange = (v: string) => {
    setNomeBarbearia(v)
    setSlug(
      v.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    )
  }

  // ── LOGIN ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  // ── CADASTRO — passo 1: cria o usuário ──────────────────
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      setUserId(data.user.id)
      setStep('onboarding')
    }
    setLoading(false)
  }

  // ── ONBOARDING — passo 2: cria a barbearia (tenant) ─────
  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')

    // Verifica se slug já existe
    const { data: slugCheck } = await supabase
      .from('barbearias')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (slugCheck) {
      setError('Este endereço já está em uso. Escolha outro.')
      setLoading(false); return
    }

    const { error } = await supabase.from('barbearias').insert({
      owner_id: userId,
      nome: nomeBarbearia,
      slug,
      telefone,
      endereco,
    })

    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  // ── RENDER: onboarding ───────────────────────────────────
  if (step === 'onboarding') {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.logo}>✦ BarberOS</div>
          <h1 className={styles.title}>Configure sua barbearia</h1>
          <p className={styles.subtitle}>Última etapa — personalize como seus clientes vão te encontrar</p>

          <form onSubmit={handleOnboarding} className={styles.form}>
            <div className={styles.field}>
              <label>Nome da barbearia</label>
              <input
                type="text"
                placeholder="Ex: Barbearia do Kauan"
                value={nomeBarbearia}
                onChange={e => handleNomeChange(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Endereço público (URL)</label>
              <div className={styles.slugWrapper}>
                <span className={styles.slugPrefix}>barberos.com.br/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="kauan-barber"
                  className={styles.slugInput}
                  required
                />
              </div>
              <span className={styles.hint}>Seus clientes vão agendar nesse link</span>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>WhatsApp</label>
                <input
                  type="text"
                  placeholder="83991397274"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Endereço físico</label>
                <input
                  type="text"
                  placeholder="Rua, número — cidade"
                  value={endereco}
                  onChange={e => setEndereco(e.target.value)}
                />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Criando sua barbearia...' : 'Entrar no painel →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── RENDER: login / cadastro ─────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>✦ BarberOS</div>
        <h1 className={styles.title}>
          {tab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h1>
        <p className={styles.subtitle}>
          {tab === 'login'
            ? 'Acesse o painel da sua barbearia'
            : 'Leva menos de 2 minutos para começar'}
        </p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            Entrar
          </button>
          <button
            className={`${styles.tab} ${tab === 'cadastro' ? styles.tabActive : ''}`}
            onClick={() => { setTab('cadastro'); setError('') }}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={tab === 'login' ? handleLogin : handleCadastro} className={styles.form}>
          <div className={styles.field}>
            <label>E-mail</label>
            <input
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Senha</label>
            <input
              type="password"
              placeholder={tab === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading
              ? 'Aguarde...'
              : tab === 'login' ? 'Entrar no painel' : 'Continuar →'}
          </button>
        </form>

        <p className={styles.footer}>
          {tab === 'login' ? (
            <>Não tem conta? <button className={styles.link} onClick={() => setTab('cadastro')}>Cadastre-se grátis</button></>
          ) : (
            <>Já tem conta? <button className={styles.link} onClick={() => setTab('login')}>Entrar</button></>
          )}
        </p>
      </div>
    </div>
  )
}
