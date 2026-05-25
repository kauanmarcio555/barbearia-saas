'use client';

import { useState } from 'react';
import Link from 'next/link';

const SERVICOS = [
  { 
    id: '1', 
    nome: 'Corte de Cabelo', 
    preco: 45, 
    tempo: '30 min', 
    icone: '✂️',
    imagem: 'https://images.unsplash.com/photo-1621841957884-1210fe19d66d?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: '2', 
    nome: 'Barba Premium', 
    preco: 35, 
    tempo: '25 min', 
    icone: '🪒',
    imagem: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: '3', 
    nome: 'Combo Completo', 
    preco: 70, 
    tempo: '50 min', 
    icone: '🔥',
    imagem: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: '4', 
    nome: 'Sobrancelha', 
    preco: 15, 
    tempo: '15 min', 
    icone: '✨',
    imagem: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=400&auto=format&fit=crop'
  },
];

export default function AgendamentoPage() {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(null);
  
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState<string>('');

  const servicoAtual = SERVICOS.find(s => s.id === servicoSelecionado);

  const formatarDataHoraBR = (datetimeLocal: string) => {
    if (!datetimeLocal) return { data: null, horario: null };
    const [dataParte, horaParte] = datetimeLocal.split('T');
    const [ano, mes, dia] = dataParte.split('-');
    return {
      data: `${dia}/${mes}/${ano}`,
      horario: horaParte
    };
  };

  const { data: dataFormatada, horario: horarioFormatado } = formatarDataHoraBR(dataHoraSelecionada);

  const handleFinalizarAgendamento = () => {
    if (!servicoAtual || !dataHoraSelecionada) return;

    // Seu WhatsApp atualizado com o DDD 83
    const seuNumeroWhatsapp = "5583991397274"; 

    const mensagem = encodeURIComponent(
      `Olá! Gostaria de confirmar um agendamento pelo site da *BarberOS*:\n\n` +
      `💇‍♂️ *Serviço:* ${servicoAtual.nome}\n` +
      `📅 *Data:* ${dataFormatada}\n` +
      `⏰ *Horário:* ${horarioFormatado}h\n` +
      `💰 *Valor:* R$ ${servicoAtual.preco.toFixed(2)}\n\n` +
      `Pode confirmar para mim?`
    );

    window.open(`https://api.whatsapp.com/send?phone=${seuNumeroWhatsapp}&text=${mensagem}`, '_blank');
  };

  const obterDataMinima = () => {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-24">
      <header className="border-b border-zinc-800 bg-black/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-4xl font-extrabold">
            Barber<span className="text-amber-500">OS</span>
          </Link>
          <Link href="/" className="border border-amber-500 text-amber-400 px-5 py-2 rounded-xl hover:bg-amber-500 hover:text-black transition">
            Voltar ao Site
          </Link>
        </div>
      </header>

      <section className="border-b border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${etapa >= 1 ? 'bg-amber-500 text-black' : 'border border-zinc-700 text-zinc-500'}`}>
              1
            </div>
            <span className={`${etapa >= 1 ? 'text-amber-400 font-semibold' : 'text-zinc-500'}`}>
              Serviço
            </span>
          </div>

          <div className="w-12 sm:w-24 h-[1px] bg-zinc-800 shrink-0"></div>

          <div className={`flex items-center gap-3 whitespace-nowrap transition-opacity ${etapa >= 2 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${etapa >= 2 ? 'bg-amber-500 text-black' : 'border border-zinc-700 text-zinc-300'}`}>
              2
            </div>
            <span className={`${etapa >= 2 ? 'text-amber-400 font-semibold' : 'text-white'}`}>
              Data e Horário
            </span>
          </div>

          <div className="w-12 sm:w-24 h-[1px] bg-zinc-800 shrink-0"></div>

          <div className="flex items-center gap-3 opacity-30 whitespace-nowrap">
            <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
              3
            </div>
            <span>Confirmação</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            
            {etapa === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl sm:text-5xl font-bold mb-3">Escolha o serviço</h2>
                <p className="text-zinc-400 mb-10">Selecione o que deseja realizar hoje.</p>

                <div className="space-y-4">
                  {SERVICOS.map((servico) => (
                    <div 
                      key={servico.id}
                      onClick={() => setServicoSelecionado(servico.id)}
                      className={`bg-[#141414]/75 backdrop-blur-md border rounded-3xl p-5 flex items-center justify-between transition-all cursor-pointer ${
                        servicoSelecionado === servico.id 
                          ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] scale-[1.01]' 
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        {/* Imagem do Serviço */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={servico.imagem} 
                            alt={servico.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold">{servico.nome}</h3>
                          <p className="text-zinc-400 mt-1 text-sm">⏱ {servico.tempo}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl sm:text-2xl text-amber-400 font-bold">R$ {servico.preco}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {etapa === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <button onClick={() => setEtapa(1)} className="text-amber-500 mb-6 hover:underline flex items-center gap-2">
                  ← Voltar para Serviços
                </button>
                <h2 className="text-4xl sm:text-5xl font-bold mb-3">Data e Horário</h2>
                <p className="text-zinc-400 mb-10">Selecione o melhor momento para o seu atendimento utilizando o campo abaixo.</p>

                <div className="bg-[#141414]/75 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 max-w-md">
                  <label htmlFor="datetime" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                    Selecione Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    id="datetime"
                    min={obterDataMinima()}
                    value={dataHoraSelecionada}
                    onChange={(e) => setDataHoraSelecionada(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white text-lg font-sans focus:outline-none focus:border-amber-500 transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            )}

          </div>

          <div className="relative">
            <div className="bg-[#141414]/75 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 lg:sticky lg:top-28">
              <div className="text-center">
                {servicoAtual ? (
                  <div className="w-24 h-24 rounded-full border border-amber-500 mx-auto overflow-hidden bg-amber-500/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={servicoAtual.imagem} alt={servicoAtual.nome} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full border border-zinc-800 mx-auto flex items-center justify-center text-5xl text-zinc-600">
                    ✂️
                  </div>
                )}
                <h3 className="text-2xl font-bold mt-6">
                  {servicoAtual ? servicoAtual.nome : 'Nenhum serviço'}
                </h3>
              </div>

              <div className="border-t border-zinc-800 my-8"></div>

              <div className="space-y-5">
                <div className="flex justify-between text-zinc-400">
                  <span>Duração</span>
                  <span className="text-white">{servicoAtual ? servicoAtual.tempo : '--'}</span>
                </div>
                
                {etapa === 2 && dataFormatada && (
                  <div className="flex justify-between text-zinc-400 animate-in fade-in">
                    <span>Data</span>
                    <span className="text-white">{dataFormatada}</span>
                  </div>
                )}
                
                {etapa === 2 && horarioFormatado && (
                  <div className="flex justify-between text-zinc-400 animate-in fade-in">
                    <span>Horário</span>
                    <span className="text-white">{horarioFormatado}h</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Valor</span>
                  <span className="text-amber-400 font-bold">
                    R$ {servicoAtual ? servicoAtual.preco.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-800 my-8"></div>

              <div className="flex items-center justify-between">
                <span className="text-xl text-zinc-300">Total</span>
                <span className="text-4xl font-bold text-amber-400">
                  R$ {servicoAtual ? servicoAtual.preco.toFixed(2) : '0.00'}
                </span>
              </div>

              {etapa === 1 ? (
                <button 
                  onClick={() => setEtapa(2)}
                  disabled={!servicoAtual}
                  className={`w-full mt-8 font-bold text-lg py-5 rounded-2xl transition-all ${
                    servicoAtual 
                      ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Avançar para Data e Horário
                </button>
              ) : (
                <button 
                  onClick={handleFinalizarAgendamento}
                  disabled={!dataHoraSelecionada}
                  className={`w-full mt-8 font-bold text-lg py-5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                    dataHoraSelecionada 
                      ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar no WhatsApp
                </button>
              )}

              <p className="text-center text-zinc-600 text-sm mt-5 flex items-center justify-center gap-2">
                🔒 Seus dados estão protegidos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}