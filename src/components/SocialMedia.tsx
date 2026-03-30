const socialNetworks = [
  {
    name: 'Facebook',
    icon: () => (
      <svg
        width="48"
        height="48"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    handle: '@MatheoIndustrial',
    followers: '5.2K',
    color: 'from-blue-600 to-blue-700',
    hoverColor: 'hover:from-blue-700 hover:to-blue-800',
    link: 'https://facebook.com',
  },
  {
    name: 'Instagram',
    icon: () => (
      <svg
        width="48"
        height="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    handle: '@matheo_industrial',
    followers: '3.8K',
    color: 'from-pink-600 to-purple-600',
    hoverColor: 'hover:from-pink-700 hover:to-purple-700',
    link: 'https://instagram.com',
  },
  {
    name: 'YouTube',
    icon: () => (
      <svg
        width="48"
        height="48"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
    handle: 'MATHEO Industrial',
    followers: '1.5K',
    color: 'from-red-600 to-red-700',
    hoverColor: 'hover:from-red-700 hover:to-red-800',
    link: 'https://youtube.com',
  },
  {
    name: 'LinkedIn',
    icon: () => (
      <svg
        width="48"
        height="48"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
    handle: 'MATHEO Company',
    followers: '2.1K',
    color: 'from-blue-700 to-blue-800',
    hoverColor: 'hover:from-blue-800 hover:to-blue-900',
    link: 'https://linkedin.com',
  },
]

export default function SocialMedia() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-matheo-red mb-4">
            ¡Recuerda seguirnos
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            en todas nuestras redes sociales!
          </p>
          <p className="text-lg text-gray-600">
            Conéctate con nosotros: ofertas, sorteos, tips, noticias y
            más al alcance de un clic
          </p>
        </div>

        {/* Social Networks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {socialNetworks.map((network) => (
            <a
              key={network.name}
              href={network.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-gradient-to-br ${network.color} ${network.hoverColor} rounded-2xl p-8 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <network.icon
                    size={48}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {network.followers}
                    </div>
                    <div className="text-sm opacity-90">
                      Seguidores
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-2xl font-bold mb-1">
                    {network.name}
                  </div>
                  <div className="text-sm opacity-90">
                    {network.handle}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Síguenos</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Hover Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
