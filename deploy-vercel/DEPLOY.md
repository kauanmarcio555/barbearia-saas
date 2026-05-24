# Deploy na Vercel — Guia Completo

## Visão geral

```
GitHub (código) → Vercel (Next.js) → Supabase (banco + auth)
                       ↓
               Domínio próprio (barberos.com.br ou outro)
```

---

## Parte 1 — Preparar o repositório no GitHub

### 1.1 Criar o repositório

```bash
# Na pasta do projeto
git init
git add .
git commit -m "feat: scaffold inicial do SaaS"
```

Acesse github.com → New repository → nome: `barberos-saas` → Create.

```bash
git remote add origin https://github.com/SEU_USUARIO/barberos-saas.git
git branch -M main
git push -u origin main
```

### 1.2 Arquivos que precisam estar na raiz

Confirme que estes arquivos existem antes do push:

```
✓ vercel.json
✓ next.config.js        ← use a versão da pasta deploy-vercel/
✓ middleware.ts          ← use a versão da pasta deploy-vercel/
✓ app/page.tsx           ← landing page (home-page.tsx → renomear para page.tsx)
✓ app/home.module.css
✓ app/not-found.tsx
✓ app/auth/callback/route.ts  ← crie essa pasta e cole auth-callback-route.ts
```

---

## Parte 2 — Configurar o Supabase para produção

### 2.1 URL de redirecionamento de e-mail

No painel do Supabase:

```
Authentication → URL Configuration

Site URL:
  https://barberos.com.br    ← (ou seu domínio)

Redirect URLs (adicione todas):
  https://barberos.com.br/auth/callback
  https://barberos.vercel.app/auth/callback   ← URL temporária da Vercel
  http://localhost:3000/auth/callback          ← desenvolvimento local
```

### 2.2 E-mail de confirmação (opcional mas recomendado)

```
Authentication → Email Templates → Confirm signup

Altere o link no template para:
  {{ .SiteURL }}/auth/callback?code={{ .TokenHash }}&type=email
```

### 2.3 Políticas de senha

```
Authentication → Policies
  Minimum password length: 8
  ✓ Require uppercase
  ✓ Require number
```

---

## Parte 3 — Deploy na Vercel

### 3.1 Conectar o repositório

1. Acesse **vercel.com** → New Project
2. Importe o repositório `barberos-saas` do GitHub
3. Framework Preset: **Next.js** (detectado automaticamente)
4. Root Directory: `.` (raiz)
5. **NÃO clique em Deploy ainda** — configure as variáveis primeiro

### 3.2 Variáveis de ambiente

Na tela de configuração do projeto, adicione **todas** estas variáveis:

| Nome | Valor | Onde pegar |
|------|-------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase → Settings → API → service_role **⚠️ nunca no frontend** |
| `NEXT_PUBLIC_APP_URL` | `https://barberos.com.br` | Seu domínio final |

> **Atenção**: `SUPABASE_SERVICE_ROLE_KEY` nunca deve aparecer em código
> client-side. Ela só é usada em Server Actions e Route Handlers.

### 3.3 Fazer o deploy

Clique em **Deploy**. O build leva ~2 minutos.

Você vai receber uma URL temporária no formato:
```
https://barberos-saas-xxxx.vercel.app
```

Teste essa URL antes de configurar o domínio.

---

## Parte 4 — Domínio próprio

### 4.1 No painel da Vercel

```
Project → Settings → Domains → Add Domain

Digite: barberos.com.br
```

A Vercel vai mostrar dois registros DNS para adicionar.

### 4.2 No seu registrador de domínio (Registro.br, Hostinger, etc.)

Adicione estes registros no painel de DNS:

**Se for domínio apex (barberos.com.br sem www):**
```
Tipo: A
Nome: @
Valor: 76.76.21.21    ← IP da Vercel
TTL: 3600
```

**Para o www redirecionar pro apex:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

### 4.3 Verificar propagação

DNS pode levar de 5 minutos a 48h. Para checar:
```bash
dig barberos.com.br A +short
# deve retornar 76.76.21.21
```

Ou use: https://dnschecker.org

### 4.4 SSL

A Vercel provisiona o certificado SSL (HTTPS) automaticamente via Let's Encrypt.
Não precisa fazer nada — fica pronto em minutos após o DNS propagar.

---

## Parte 5 — Checklist pós-deploy

Execute cada item e marque como concluído:

```
[ ] https://barberos.com.br carrega a landing page
[ ] https://barberos.com.br/login abre o formulário de login
[ ] Cadastrar uma conta nova → onboarding cria a barbearia
[ ] Login com a conta criada → redireciona pro /dashboard
[ ] Dashboard carrega agenda, faturamento e config
[ ] https://barberos.com.br/kauan-barber abre a página pública
[ ] Fazer um agendamento pela página pública → aparece no dashboard
[ ] Concluir um agendamento → registra faturamento automaticamente
[ ] Acessar /dashboard sem login → redireciona pro /login ✓
[ ] SSL ativo (cadeado verde no navegador) ✓
```

---

## Parte 6 — CI/CD automático (já funciona de graça)

Depois que o repositório está conectado na Vercel, todo `git push` na
branch `main` dispara um novo deploy automaticamente. Zero configuração extra.

```bash
# Fluxo de trabalho do dia a dia
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# ← Vercel detecta o push e faz deploy em ~1-2 minutos
```

Para **preview de features**:
```bash
git checkout -b feature/mercado-pago
# ... desenvolve ...
git push origin feature/mercado-pago
# Vercel cria automaticamente uma URL de preview:
# https://barberos-saas-git-feature-mercadopago-xxxx.vercel.app
```

---

## Variáveis por ambiente

| Variável | Dev (local) | Produção (Vercel) |
|----------|------------|-------------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://barberos.com.br` |
| `NEXT_PUBLIC_SUPABASE_URL` | mesma do Supabase | mesma do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | mesma | mesma |
| `SUPABASE_SERVICE_ROLE_KEY` | mesma (nunca commitar) | mesma |

---

## Troubleshooting comum

**Build falhou: "Module not found"**
```bash
npm install && npm run build  # teste local primeiro
```

**Login não redireciona após cadastro**
→ Verifique se a URL `/auth/callback` está na lista de Redirect URLs do Supabase.

**RLS bloqueando tudo**
→ No Supabase SQL Editor, confira se as políticas foram criadas:
```sql
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

**Domínio não aponta pra Vercel**
→ Aguarde a propagação do DNS (até 48h). Use dnschecker.org para monitorar.

**Variável de ambiente undefined em produção**
→ Adicione a variável no painel da Vercel (Settings → Environment Variables)
e faça um redeploy manual: Vercel → Deployments → Redeploy.
