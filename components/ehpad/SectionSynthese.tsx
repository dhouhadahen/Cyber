'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, AlertTriangle, BookOpen, Info } from 'lucide-react'

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return <span>{value}</span>
}

export default function SectionSynthese() {
  return (
    <section id="synthese" className="pt-16" aria-labelledby="synthese-title">
      {/* Hero */}
      <div
        className="w-full px-4 py-10"
        style={{
          background: 'linear-gradient(135deg, #0C447C 0%, #0E5494 60%, #1A6BAA 100%)',
        }}
      >
        <div className="max-w-[900px] mx-auto">
          <div className="mb-1">
            <span
              className="section-label"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Diagnostic — Mai 2026
            </span>
          </div>
          <h1
            id="synthese-title"
            className="text-3xl font-bold text-white mb-1 text-balance"
          >
            Diagnostic Cybersécurité
          </h1>
          <p className="text-white/75 text-base mb-8">
            EHPAD Les 7 Fontaines — France Horizon | Gaillac (81)
          </p>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <motion.div
              className="bg-white rounded-[6px] p-5 border-l-4 card-shadow"
              style={{ borderLeftColor: '#E67E22' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={14} style={{ color: '#E67E22' }} aria-hidden />
                <span className="section-label" style={{ color: '#5F5E5A' }}>
                  Niveau de maturité global
                </span>
              </div>
              <p
                className="text-4xl font-bold leading-none mb-1"
                style={{ color: '#E67E22' }}
              >
                <AnimatedCounter target={34} />%
              </p>
              <p className="text-xs" style={{ color: '#5F5E5A' }}>
                Insuffisant — Score à améliorer
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-white rounded-[6px] p-5 border-l-4 card-shadow"
              style={{ borderLeftColor: '#C0392B' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} style={{ color: '#C0392B' }} aria-hidden />
                <span className="section-label" style={{ color: '#5F5E5A' }}>
                  Risques critiques identifiés
                </span>
              </div>
              <p
                className="text-4xl font-bold leading-none mb-1"
                style={{ color: '#C0392B' }}
              >
                3
              </p>
              <p className="text-xs" style={{ color: '#5F5E5A' }}>
                Action immédiate requise
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-white rounded-[6px] p-5 border-l-4 card-shadow"
              style={{ borderLeftColor: '#0C447C' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} style={{ color: '#0C447C' }} aria-hidden />
                <span className="section-label" style={{ color: '#5F5E5A' }}>
                  Référentiel
                </span>
              </div>
              <p
                className="text-xl font-bold leading-tight mb-1"
                style={{ color: '#0C447C' }}
              >
                ANSSI / ANAP
              </p>
              <p className="text-xs" style={{ color: '#5F5E5A' }}>
                Programme CaRE 2023–2027
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="max-w-[900px] mx-auto px-4 py-10 space-y-10">
        {/* Prose summary */}
        <div
          className="rounded-[6px] p-6 border-l-4 card-shadow"
          style={{ backgroundColor: '#E6F1FB', borderLeftColor: '#1A6BAA' }}
        >
          <div className="flex gap-3">
            <Info size={18} style={{ color: '#1A6BAA', flexShrink: 0, marginTop: 2 }} aria-hidden />
            <p className="text-sm leading-relaxed" style={{ color: '#1A1A18' }}>
              Ce rapport interactif présente les résultats du diagnostic de cybersécurité conduit à
              l&apos;EHPAD Les 7 Fontaines en mai 2026. Parcourez les scénarios et manipulez les données
              pour comprendre les vulnérabilités de l&apos;établissement au regard des obligations
              réglementaires (RGPD, NIS 2, HDS) et construire votre plan d&apos;actions hiérarchisé.
            </p>
          </div>
        </div>

        {/* Context block */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left — prose */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-lg font-bold" style={{ color: '#0C447C' }}>
              Pourquoi les EHPAD sont ciblés
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
              Les établissements médico-sociaux traitent des données parmi les plus sensibles qui
              soient : antécédents médicaux, prescriptions, identifiants nationaux de santé (INS),
              dossiers de liaison d&apos;urgence (DLU). Ces informations ont une valeur élevée sur les
              marchés illicites et font des EHPAD des cibles prioritaires.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
              Le secteur a enregistré une hausse de{' '}
              <strong style={{ color: '#C0392B' }}>29 % des incidents majeurs en 2024</strong>{' '}
              (CERT Santé 2024), dont un tiers a entraîné une interruption directe de la prise en
              charge des patients. La combinaison d&apos;une digitalisation rapide et de ressources
              informatiques limitées fait des EHPAD une cible de choix pour les cybercriminels.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
              Le logiciel métier <strong>NetSoins / Orisha</strong>, utilisé quotidiennement par
              toutes les équipes soignantes, centralise l&apos;intégralité du dossier patient numérique
              — une indisponibilité, même temporaire, paralyse la continuité des soins.
            </p>
          </div>

          {/* Right — stats table */}
          <div className="md:col-span-2">
            <table className="w-full text-sm rounded-[6px] overflow-hidden border border-border-gray">
              <tbody>
                {[
                  { stat: '749 incidents majeurs', src: 'secteur santé en 2024 (CERT Santé)' },
                  { stat: '1 incident sur 3', src: 'a interrompu la prise en charge médicale' },
                  { stat: '90 % des attaques', src: "commencent par un e-mail frauduleux" },
                  { stat: 'Source', src: 'CERT Santé 2024 / ANAP' },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{ backgroundColor: i % 2 === 0 ? '#F1EFE8' : '#FFFFFF' }}
                  >
                    <td
                      className="px-3 py-2.5 font-semibold text-xs w-2/5"
                      style={{ color: '#0C447C' }}
                    >
                      {row.stat}
                    </td>
                    <td
                      className="px-3 py-2.5 text-xs"
                      style={{ color: '#5F5E5A' }}
                    >
                      {row.src}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
