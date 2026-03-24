import Link from "next/link";
import { 
  Store, 
  TrendingUp, 
  ShieldCheck, 
  Wallet,
  ArrowRight,
  CheckCircle2,
  Users,
  Car,
  Clock
} from "lucide-react";

export default function JualMobilLanding() {
  const steps = [
    {
      title: "Daftar Akun Seller",
      desc: "Isi data diri atau nama showroom Anda dengan cepat dan mudah.",
      icon: Store
    },
    {
      title: "Upload Kendaraan",
      desc: "Masukkan detail mobil, kondisi, dan unggah foto-foto terbaik.",
      icon: Car
    },
    {
      title: "Verifikasi Admin",
      desc: "Tim kami mengecek kelengkapan data untuk memastikan keamanan platform.",
      icon: ShieldCheck
    },
    {
      title: "Mulai Berjualan",
      desc: "Mobil Anda tampil di depan ribuan pembeli potensial setiap harinya.",
      icon: TrendingUp
    }
  ];

  const stats = [
    { value: "50rb+", label: "Pembeli Aktif/Bulan" },
    { value: "10rb+", label: "Mobil Terjual" },
    { value: "< 24 Jam", label: "Rata-rata Terjual" },
    { value: "Tahun 2026", label: "Platform Terpercaya" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#4B3BFB]/20">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F4F9] to-white pt-16 pb-24 border-b border-gray-100">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#4B3BFB]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-semibold text-[#4B3BFB] mb-6">
                <Store size={14} /> Pusat Edukasi & Penjualan Seller
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
                Jangkau Ribuan Pembeli, <br />
                <span className="text-[#4B3BFB]">Jual Mobil Lebih Cepat</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Bergabunglah dengan Glotomotif Seller Center. Platform jual beli mobil terpercaya dengan sistem penawaran transparan dan pencairan dana instan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/seller/jual-mobil" 
                  className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[#4B3BFB] text-white font-semibold text-lg hover:bg-[#3B29E3] transition-all shadow-lg hover:shadow-[#4B3BFB]/30 hover:-translate-y-0.5"
                >
                  Mulai Jual Kendaraan
                </Link>
                <Link 
                  href="/register-seller" 
                  className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-white text-gray-700 font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Daftar Akun Seller <ArrowRight size={20} className="text-gray-400" />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-[#4B3BFB]" /> Pendaftaran Gratis</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-[#4B3BFB]" /> Dashboard Lengkap</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-[#4B3BFB]" /> Dukungan Tim Ahli</span>
              </div>
            </div>

            {/* Right Graphic/Image - E-commerce style dashboard mockup */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 p-2 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  {/* Mockup Header */}
                  <div className="h-10 bg-white border-b border-gray-100 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto h-5 w-48 bg-gray-100 rounded-md"></div>
                  </div>
                  {/* Mockup Body */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-24 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-8 w-24 bg-[#4B3BFB]/10 rounded-lg"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="h-24 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="h-3 w-16 bg-gray-100 rounded mb-3"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-24 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="h-3 w-16 bg-gray-100 rounded mb-3"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-32 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                       <div className="h-3 w-24 bg-gray-100 rounded mb-4"></div>
                       <div className="space-y-2">
                         <div className="h-2 w-full bg-gray-50 rounded"></div>
                         <div className="h-2 w-5/6 bg-gray-50 rounded"></div>
                         <div className="h-2 w-4/6 bg-gray-50 rounded"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -left-6 top-20 bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Terjual Hari Ini</p>
                    <p className="text-sm font-bold text-gray-900">+ Rp 155 Juta</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-6 bottom-20 bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#4B3BFB]">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Pembeli Baru</p>
                    <p className="text-sm font-bold text-gray-900">+ 1,204 Viewers</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ─── STATS BANNERS ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 py-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center px-4">
                <p className="text-2xl md:text-3xl font-extrabold text-[#4B3BFB] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY SELL HERE (BENEFITS) ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Berjualan di Glotomotif?</h2>
            <p className="text-lg text-gray-600">Platform kami dirancang khusus untuk memaksimalkan keuntungan dan kemudahan operasional bisnis mobil Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Eksposur Maksimal",
                desc: "Iklan kendaraan Anda dioptimalkan oleh algoritma kami untuk menjangkau pembeli di seluruh Indonesia yang sedang mencari mobil serupa.",
                icon: TrendingUp,
                color: "bg-blue-50 text-blue-600",
                iconBg: "bg-blue-100"
              },
              {
                title: "Dashboard Terpusat",
                desc: "Kelola puluhan hingga ratusan list kendaraan, pantau status evaluasi, dan kelola penawaran harga dalam satu dashboard canggih.",
                icon: Store,
                color: "bg-purple-50 text-purple-600",
                iconBg: "bg-purple-100"
              },
              {
                title: "Pencairan Instan & Aman",
                desc: "Semua transaksi diverifikasi, dan dana akan langsung diteruskan ke rekening pencairan Anda tanpa delay berhari-hari.",
                icon: ShieldCheck,
                color: "bg-emerald-50 text-emerald-600",
                iconBg: "bg-emerald-100"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/30 hover:-translate-y-1 transition-transform">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO START ─── */}
      <section className="py-24 bg-[#F8F9FA] rounded-[2.5rem] mx-4 sm:mx-8 mb-12 border border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="flex-1 w-full relative">
              <div className="aspect-square rounded-[2rem] bg-gray-900 overflow-hidden relative shadow-2xl">
                <img 
                  src="/sky.jpg" 
                  alt="Glotomotif Seller" 
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-10 left-10 pr-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-sm font-semibold text-white mb-4 border border-white/20">
                    <Clock size={16} /> Buka Toko dalam 2 Menit
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-snug">Raih Keuntungan Maksimal Bersama Seller Centre</h3>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">Langkah Mudah Memulai</h2>
              
              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#4B3BFB] font-bold text-xl">
                        {idx + 1}
                      </div>
                      {idx !== steps.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 my-2" />
                      )}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Link 
                  href="/register-seller" 
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[#4B3BFB] text-white font-semibold text-lg hover:bg-[#3B29E3] transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#4B3BFB]/30"
                >
                  Daftar Sekarang <ArrowRight size={20} />
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
