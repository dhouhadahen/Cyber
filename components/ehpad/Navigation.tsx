'use client'

import { useEffect, useState } from 'react'
import { Shield } from 'lucide-react'

const SECTIONS = [
  { id: 'synthese', label: 'Synthèse' },
  { id: 'risques', label: 'Risques' },
  { id: 'conformite', label: 'Conformité' },
  { id: 'plan', label: "Plan d'action" },
  { id: 'crise', label: 'Protocole de crise' },
  { id: 'reglementation', label: 'Réglementation' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('synthese')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 64
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 no-print"
      style={{ backgroundColor: '#0C447C' }}
      aria-label="Navigation principale"
    >
      <div className="max-w-[960px] mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Shield className="text-white" size={20} aria-hidden="true" />
          <div>
            <p className="text-white font-semibold text-sm leading-tight">EHPAD Les 7 Fontaines</p>
            <p className="text-white/60 text-xs leading-tight">Rapport Cybersécurité 2026</p>
          </div>
        </div>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors relative ${
                  activeSection === id
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                aria-current={activeSection === id ? 'page' : undefined}
              >
                {label}
                {activeSection === id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
        >
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden" style={{ backgroundColor: '#0B3B6E' }}>
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`block w-full text-left px-6 py-3 text-sm font-medium border-b border-white/10 ${
                activeSection === id ? 'text-white bg-white/10' : 'text-white/75'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
