import Link from 'next/link';

export default function BarberOS() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      
      <header className="border-b border-zinc-900 bg-black/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
              ✂️
            </div>
            <h1 className="text-4xl font-extrabold tracking-wide">
              Barber<span className="text-amber-500">OS</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-zinc-300 font-medium">
            <Link href="/" className="hover:text-amber-400 transition">Início</Link>
            <a href="#servicos" className="hover:text-amber-400 transition">Serviços</a>
            <a href="#barbeiros" className="hover:text-amber-400 transition">Barbeiros</a>
            <a href="#contato" className="hover:text-amber-400 transition">Contato</a>
          </nav>

          <Link href="/login" className="border border-amber-500 text-amber-400 px-6 py-3 rounded-2xl hover:bg-amber-500 hover:text-black transition font-semibold">
            Área do Barbeiro
          </Link>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-20 pb-32">
          <span className="uppercase tracking-[0.4em] text-amber-400 text-sm font-semibold">
            Barbearia Premium
          </span>

          <h2 className="text-6xl md:text-8xl font-extrabold leading-tight mt-8">
            Estilo e Precisão
            <br />
            para o seu{' '}
            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
              Visual
            </span>
          </h2>

          <p className="text-zinc-400 text-xl mt-10 max-w-3xl mx-auto leading-relaxed">
            Reserve seu horário online na melhor barbearia da região.
            Atendimento premium, rápido e sem filas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-12">
            <Link href="/agendamento" className="bg-amber-500 hover:bg-amber-400 transition text-black font-bold px-10 py-5 rounded-2xl text-xl shadow-2xl shadow-amber-500/20">
              Agendar um Horário
            </Link>
            <a href="#servicos" className="border border-zinc-700 hover:border-amber-500 hover:text-amber-400 transition px-10 py-5 rounded-2xl text-xl">
              Ver Serviços
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-500 transition rounded-3xl p-10">
              <div className="text-5xl mb-6">⏰</div>
              <h3 className="text-3xl font-bold text-amber-400">Horário</h3>
              <p className="text-zinc-400 mt-5 text-lg leading-relaxed">Terça à Sábado<br />09h às 20h</p>
            </div>

            <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-500 transition rounded-3xl p-10">
              <div className="text-5xl mb-6">📍</div>
              <h3 className="text-3xl font-bold text-amber-400">Localização</h3>
              <p className="text-zinc-400 mt-5 text-lg leading-relaxed">Av. Principal da Cidade,<br />Centro</p>
            </div>

            <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-500 transition rounded-3xl p-10">
              <div className="text-5xl mb-6">⭐</div>
              <h3 className="text-3xl font-bold text-amber-400">Atendimento</h3>
              <p className="text-zinc-400 mt-5 text-lg leading-relaxed">Profissionais especializados<br />e experiência premium</p>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="uppercase tracking-[0.4em] text-amber-400 text-sm font-semibold">
              Serviços
            </span>
            <h2 className="text-5xl font-extrabold mt-6">
              Excelência em cada detalhe
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-500 transition rounded-3xl p-10 flex flex-col justify-between">
              <div>
                <div className="text-6xl mb-8">✂️</div>
                <h3 className="text-3xl font-bold">Corte Masculino</h3>
                <p className="text-zinc-400 mt-5 leading-relaxed">
                  Cortes modernos e clássicos com acabamento impecável.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-amber-400 text-3xl font-bold">R$ 45</p>
                <Link href="/agendamento" className="text-sm border border-amber-500 text-amber-500 px-4 py-2 rounded-xl hover:bg-amber-500 hover:text-black transition font-bold">
                  Agendar
                </Link>
              </div>
            </div>

            <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-500 transition rounded-3xl p-10 flex flex-col justify-between">
              <div>
                <div className="text-6xl mb-8">🪒</div>
                <h3 className="text-3xl font-bold">Barba Premium</h3>
                <p className="text-zinc-400 mt-5 leading-relaxed">
                  Modelagem completa com toalha quente e hidratação.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-amber-400 text-3xl font-bold">R$ 35</p>
                <Link href="/agendamento" className="text-sm border border-amber-500 text-amber-500 px-4 py-2 rounded-xl hover:bg-amber-500 hover:text-black transition font-bold">
                  Agendar
                </Link>
              </div>
            </div>

            <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 hover:border-amber-500 transition rounded-3xl p-10 flex flex-col justify-between">
              <div>
                <div className="text-6xl mb-8">🔥</div>
                <h3 className="text-3xl font-bold">Combo Premium</h3>
                <p className="text-zinc-400 mt-5 leading-relaxed">
                  Corte + barba com atendimento VIP completo.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-amber-400 text-3xl font-bold">R$ 70</p>
                <Link href="/agendamento" className="text-sm border border-amber-500 text-amber-500 px-4 py-2 rounded-xl hover:bg-amber-500 hover:text-black transition font-bold">
                  Agendar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}