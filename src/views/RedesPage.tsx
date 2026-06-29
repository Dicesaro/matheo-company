'use client'
import Image from 'next/image'
import Link from 'next/link'

const PHONE = '51922922766'
const WA_URL = `https://wa.me/${PHONE}`

// Clases base compartidas por todos los botones de redes
const btnBase =
  'w-full flex items-center gap-4 px-6 py-4 rounded-[14px] no-underline text-white font-bold text-base cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] active:scale-[0.97]'

const socials = [
  {
    id: 'facebook',
    label: 'Facebook',
    sublabel: 'Síguenos en Facebook',
    href: 'https://www.facebook.com/IndustrialCompanyMatheo',
    bg: 'bg-[#1877F2]',
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    sublabel: 'Mira nuestros videos',
    href: 'https://www.tiktok.com/@industrialcompanymatheo',
    bg: 'bg-[#010101]',
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z" />
      </svg>
    ),
  },
]

const ArrowIcon = ({
  cls = 'w-[18px] h-[18px] opacity-60',
}: {
  cls?: string
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={cls}
  >
    <path
      d="M5 12h14M12 5l7 7-7 7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function RedesPage() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 font-sans"
      style={{
        background:
          'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}
    >
      {/* Card principal */}
      <div className="w-full max-w-105 flex flex-col items-center gap-6 bg-white/6 border border-white/10 backdrop-blur-xl rounded-[20px] px-8 py-10">
        {/* Logo + nombre */}
        <div className="flex flex-col items-center gap-3">
          {/* Avatar con borde degradado */}
          <div
            className="w-24 h-24 rounded-full p-0.75"
            style={{
              background: 'linear-gradient(135deg, #E31B23, #0055A5)',
            }}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
                alt="Industrial Company MATHEO"
                width={80}
                height={80}
                className="w-19.5 h-19.5 object-contain p-1.5"
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-white font-black text-xl m-0 tracking-tight">
              Industrial Company Matheo
            </h1>
            <p className="text-white/55 text-[0.82rem] mt-1 font-medium">
              Importador · Distribuidor · Metalmecánica
            </p>
          </div>
        </div>

        {/* ── WhatsApp (botón destacado) ── */}
        <a
          id="redes-whatsapp-btn"
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} bg-[#25D366] py-5 rounded-2xl shadow-[0_6px_28px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] text-[1.1rem]`}
        >
          {/* Ícono */}
          <div className="w-11.5 h-11.5 rounded-xl flex items-center justify-center bg-white/20 shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          {/* Texto */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              {/* Punto pulsante */}
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-white mr-1 animate-ping opacity-75" />
              <span>WhatsApp</span>
            </div>
            <div className="text-xs font-normal opacity-85 mt-0.5">
              Escríbenos — respondemos rápido
            </div>
          </div>
          <ArrowIcon cls="w-5 h-5 opacity-70" />
        </a>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-0" />

        {/* ── Redes: Facebook, TikTok ── */}
        {socials.map((s) => (
          <a
            key={s.id}
            id={`redes-${s.id}-btn`}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} ${s.bg}`}
          >
            <div className="w-11.5 h-11.5 rounded-xl flex items-center justify-center bg-white/20 shrink-0">
              {s.icon}
            </div>
            <div className="flex-1">
              <div>{s.label}</div>
              <div className="text-xs font-normal opacity-75 mt-0.5">
                {s.sublabel}
              </div>
            </div>
            <ArrowIcon />
          </a>
        ))}

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-0" />

        {/* ── Ver Productos ── */}
        <Link
          id="redes-ver-productos-btn"
          href="/productos"
          className={`${btnBase} bg-[#0055A5]`}
        >
          <div className="w-11.5 h-11.5 rounded-xl flex items-center justify-center bg-white/20 shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="w-7 h-7"
            >
              <path
                d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div>Ver Productos</div>
            <div className="text-xs font-normal opacity-75 mt-0.5">
              Mira nuestro catálogo completo
            </div>
          </div>
          <ArrowIcon />
        </Link>

        {/* Footer mínimo */}
        <p className="text-white/35 text-[0.72rem] text-center leading-relaxed m-0">
          © {new Date().getFullYear()} Industrial Company MATHEO EIRL
          <br />
          Lima, Perú · Importador directo
        </p>
      </div>
    </main>
  )
}
