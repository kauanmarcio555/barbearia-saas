'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

type Tab  = 'login' | 'cadastro'
type Step = 'auth' | 'onboarding' | 'confirmar-email'

export default function LoginPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [tab, setTab]     = useState<Tab>('login')
  const [step, setStep]   = useState<Step>('auth')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')

  const [nomeBarbearia, setNomeBarbearia] = useState('')
  const [slug, setSlug]                   = useState('')
  const [telefone, setTelefone]           = useState('')
  const [endereco, setEndereco]           = useState('')

  const handleNome = (v: string) => {
    setNomeBarbearia(v)
    setSlug(v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,'').trim().replace(/\s+/g,'-'))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleCadastroAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('As senhas não coincidem.')
    setLoading(true)

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` }
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    if (data.user) {
      setUserId(data.user.id)
      if (data.session) {
        setStep('onboarding')
      } else {
        setStep('confirmar-email')
      }
    }
    setLoading(false)
  }

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!slug) return setError('URL da barbearia inválida.')
    setLoading(true)

    const { data: existe } = await supabase.from('barbearias').select('id').eq('slug', slug).maybeSingle()
    if (existe) {
      setError('Este endereço/slug já está em uso por outra barbearia.')
      setLoading(false)
      return
    }

    const { error: err } = await supabase.from('barbearias').insert([{
      owner_id: userId,
      nome: nomeBarbearia,
      slug,
      telefone,
      endereco,
      plano: 'free',
      ativo: true
    }])

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>BARBEROS</div>

        {step === 'auth' && (
          <>
            <h1 className={styles.title}>Acesse o painel</h1>
            <p className={styles.subtitle}>Gerencie seus agendamentos e faturamento.</p>

            <div className={styles.tabs}>
              <button className={`${styles.tab} ${tab==='login'?styles.tabActive:''}`} onClick={()=>{setTab('login'); setError('')}}>Entrar</button>
              <button className={`${styles.tab} ${tab==='cadastro'?styles.tabActive:''}`} onClick={()=>{setTab('cadastro'); setError('')}}>Cadastrar</button>
            </div>

            <form onSubmit={tab === 'login' ? handleLogin : handleCadastroAuth} className={styles.form}>
              <div className={styles.field}>
                <label>E-mail comercial</label>
                <input type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" className="input-padrao" />
              </div>
              <div className={styles.field}>
                <label>Senha</label>
                <input type="password" placeholder={tab==='cadastro'?'Mínimo 8 caracteres':'••••••••'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={tab==='cadastro'?8:1} autoComplete={tab==='login'?'current-password':'new-password'} className="input-padrao" />
              </div>
              {tab==='cadastro' && (
                <div className={styles.field}>
                  <label>Confirmar senha</label>
                  <input type="password" placeholder="Repita a senha" value={confirm} onChange={e=>setConfirm(e.target.value)} required autoComplete="new-password" className="input-padrao" />
                </div>
              )}
              {error && <div className={styles.error}>{error}</div>}
              
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? 'Aguarde...' : tab==='login' ? 'Entrar no painel' : 'Criar minha conta'}
              </button>
            </form>

            {tab==='login' && (
              <div className={styles.footer}>
                <button className={styles.link} onClick={async()=> {
                  if(!email){setError('Digite seu e-mail primeiro para recuperar.');return}
                  await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/auth/callback?next=/dashboard/config`})
                  setError('Link de redefinição enviado para seu e-mail.')
                }}>
                  Esqueceu sua senha?
                </button>
              </div>
            )}
          </>
        )}

        {step === 'confirmar-email' && (
          <div className={styles.form}>
            <h1 className={styles.title}>Verifique seu e-mail</h1>
            <p className={styles.subtitle}>Enviamos um link de confirmação para <strong>{email}</strong>.</p>
            <button className={`btn btn-secondary ${styles.submitBtn}`} onClick={()=>setStep('onboarding')}>Já confirmei meu e-mail</button>
          </div>
        )}

        {step === 'onboarding' && (
          <>
            <h1 className={styles.title}>Configure sua Barbearia</h1>
            <p className={styles.subtitle}>Preencha os dados abaixo para criar o seu link exclusivo de agendamento.</p>

            <form onSubmit={handleOnboarding} className={styles.form}>
              <div className={styles.field}>
                <label>Nome do Estabelecimento</label>
                <input type="text" placeholder="Ex: Barbearia do Kauan" value={nomeBarbearia} onChange={e=>handleNome(e.target.value)} required className="input-padrao" />
              </div>

              <div className={styles.field}>
                <label>Seu Link Exclusivo</label>
                <div className={styles.slugWrapper}>
                  <span className={styles.slugPrefix}>seusite.com/</span>
                  <input type="text" value={slug} onChange={e=>setSlug(e.target.value)} required className={styles.slugInput} placeholder="sua-barbearia" />
                </div>
                <p className={styles.hint}>Os clientes usarão este link para agendar.</p>
              </div>

              <div className={styles.field}>
                <label>WhatsApp / Telefone</label>
                <input type="tel" placeholder="Ex: (11) 99999-9999" value={telefone} onChange={e=>setTelefone(e.target.value)} required className="input-padrao" />
              </div>

              {error && <div className={styles.error}>{error}</div>}
              
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? 'Configurando...' : 'Finalizar Configuração 🎉'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}