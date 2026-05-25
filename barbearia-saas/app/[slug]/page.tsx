// app/[slug]/page.tsx
// Página PÚBLICA de agendamento — acessível sem login

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AgendamentoPublico from './AgendamentoPublico'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = createClient()
  const { data } = await supabase
    .from('barbearias')
    .select('nome')
    .eq('slug', params.slug)
    .eq('ativo', true)
    .single()
  return { title: data ? `${data.nome} — Agendamento Online` : 'Barbearia' }
}

export default async function BarbeariaPage({ params }: Props) {
  const supabase = createClient()

  const { data: barbearia } = await supabase
    .from('barbearias')
    .select('id, nome, slug, telefone, endereco, plano')
    .eq('slug', params.slug)
    .eq('ativo', true)
    .single()

  if (!barbearia) notFound()

  return <AgendamentoPublico barbearia={barbearia} />
}
