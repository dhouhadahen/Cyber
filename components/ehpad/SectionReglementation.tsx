'use client'

import { ExternalLink, Scale, Shield, Lock, FileText, Network, BookOpen } from 'lucide-react'

const REGS = [
  {
    id: 'rgpd',
    icon: Scale,
    title: 'RGPD — Règlement Général sur la Protection des Données',
    ref: 'Règlement UE 2016/679',
    color: '#0C447C',
    items: [
      { label: 'Article 32', text: 'Obligation de sécurité des traitements — mesures techniques et organisationnelles appropriées' },
      { label: 'Article 33', text: 'Notification de violation de données à la CNIL dans les 72 heures' },
      { label: 'Article 28', text: 'Contrat de sous-traitance obligatoire (DPA) avec tout prestataire accédant aux données' },
      { label: 'Article 37', text: 'Désignation obligatoire d\'un Délégué à la Protection des Données (DPO) dans les EHPAD' },
    ],
    sanction: 'Jusqu\'à 4 % du chiffre d\'affaires annuel mondial ou 20 M€',
  },
  {
    id: 'nis2',
    icon: Network,
    title: 'NIS 2 — Directive Sécurité des Réseaux et des Systèmes d\'Information',
    ref: 'Directive UE 2022/2555 — transposition FR 2024',
    color: '#1A6BAA',
    items: [
      { label: 'Article 21', text: 'Gestion des risques : politiques de sécurité, gestion des incidents, continuité d\'activité, gestion de la chaîne d\'approvisionnement' },
      { label: 'Article 23', text: 'Signalement des incidents significatifs à l\'ANSSI dans les 24h (alerte précoce) et 72h (rapport initial)' },
      { label: 'Entités essentielles', text: 'Les EHPAD de grande taille sont potentiellement classifiés en entités essentielles du secteur santé' },
    ],
    sanction: 'Entités essentielles : jusqu\'à 10 M€ ou 2 % du CA annuel mondial',
  },
  {
    id: 'hds',
    icon: Lock,
    title: 'HDS — Hébergement de Données de Santé',
    ref: 'Loi n° 2016-41 / Décret 2018-137',
    color: '#C0392B',
    items: [
      { label: 'Certification obligatoire', text: 'Tout hébergeur de données de santé doit être certifié HDS par un organisme accrédité COFRAC' },
      { label: 'Champ d\'application', text: 'S\'applique à NetSoins / Orisha et à tout prestataire cloud traitant des données patients' },
      { label: 'Vérification prestataires', text: 'L\'établissement est responsable de vérifier la certification HDS de ses sous-traitants avant tout accès aux données' },
    ],
    sanction: '3 ans d\'emprisonnement et 45 000 € d\'amende (personne physique) — Art. L. 1111-8 CSP',
  },
  {
    id: 'anssi',
    icon: Shield,
    title: 'ANSSI — Référentiel et recommandations',
    ref: 'Programme CaRE 2023–2027',
    color: '#E67E22',
    items: [
      { label: 'Programme CaRE', text: 'Cybersécurité Accélérée pour le secteur de la santé — financement et accompagnement des établissements 2023–2027' },
      { label: 'Guide hygiène informatique', text: '42 mesures fondamentales applicables immédiatement — référence pour les audits internes' },
      { label: 'SecNumAcadémie', text: 'Formation en ligne gratuite pour sensibiliser les collaborateurs — déploiement recommandé dès 2026' },
      { label: 'Homologation SI', text: 'Procédure d\'homologation sécurité recommandée pour NetSoins et les systèmes critiques' },
    ],
    sanction: null,
  },
  {
    id: 'care',
    icon: FileText,
    title: 'Programme CaRE — Cybersécurité Accélérée',
    ref: 'Ministère de la Santé 2023',
    color: '#27500A',
    items: [
      { label: 'Enveloppes financières', text: 'Financement dédié aux EHPAD pour la mise en conformité — à solliciter auprès de l\'ARS Occitanie' },
      { label: 'Accompagnement ANAP', text: 'L\'ANAP propose des outils d\'auto-évaluation et des guides sectoriels gratuits' },
      { label: 'CERT Santé', text: 'Centre de réponse aux incidents cyber santé — 09 72 72 09 09 — disponible 24h/24' },
      { label: 'Vague 2 2025–2026', text: 'Priorité : EHPAD et SSR — déposer un dossier de financement avant décembre 2026' },
    ],
    sanction: null,
  },
  {
    id: 'anap',
    icon: BookOpen,
    title: 'ANAP & CERT Santé — Ressources sectorielles',
    ref: 'Agence Nationale d\'Appui à la Performance',
    color: '#5F5E5A',
    items: [
      { label: 'Bilan CERT Santé 2024', text: '749 incidents majeurs déclarés — 29 % de hausse — 1 incident sur 3 a perturbé les soins aux patients' },
      { label: 'Kit phishing gratuit', text: 'Exercice clé en main de simulation de phishing pour les équipes — téléchargeable sur le portail CERT Santé' },
      { label: 'Indicateurs ANAP', text: 'Tableau de bord national de maturité cyber — positionnement de l\'établissement par rapport aux pairs' },
      { label: 'Signalement incidents', text: 'Tout incident significatif doit être signalé via le portail cyberveille.sante.gouv.fr' },
    ],
    sanction: null,
  },
]

const CHARTE_ITEMS = [
  'Utiliser uniquement le matériel informatique de l\'établissement pour les données patients',
  'Ne jamais partager ses identifiants NetSoins avec un collègue',
  'Verrouiller sa session lors de tout déplacement du poste (Win+L)',
  'Signaler immédiatement tout comportement anormal du système à l\'encadrement',
  'Ne pas cliquer sur les liens ou pièces jointes d\'e-mails non sollicités',
  'Ne pas connecter de supports USB personnels sur les postes de travail',
  'Ne pas utiliser les messageries personnelles pour transmettre des données patients',
  'Respecter la procédure de départ (remise des accès, désactivation des comptes)',
]

export default function SectionReglementation() {
  return (
    <section id="reglementation" className="py-14" aria-labelledby="reg-title">
      <div className="max-w-[900px] mx-auto px-4 space-y-10">
        {/* Header */}
        <div>
          <h2
            id="reg-title"
            className="text-2xl font-bold mb-1 pb-3 border-b-2"
            style={{ color: '#0C447C', borderColor: '#0C447C' }}
          >
            Cadre réglementaire applicable
          </h2>
          <p className="text-sm mt-3" style={{ color: '#5F5E5A' }}>
            Obligations légales et référentiels opposables à l&apos;EHPAD Les 7 Fontaines dans le cadre
            de son activité d&apos;hébergement et de soins.
          </p>
        </div>

        {/* Regulatory blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {REGS.map((reg) => {
            const Icon = reg.icon
            return (
              <article
                key={reg.id}
                className="bg-white rounded-[6px] card-shadow overflow-hidden"
                aria-labelledby={`reg-${reg.id}-title`}
              >
                <div
                  className="px-5 py-4 flex items-start gap-3"
                  style={{ borderLeft: `4px solid ${reg.color}` }}
                >
                  <Icon size={18} style={{ color: reg.color, flexShrink: 0, marginTop: 1 }} aria-hidden />
                  <div>
                    <h3
                      id={`reg-${reg.id}-title`}
                      className="font-bold text-sm leading-snug"
                      style={{ color: '#0C447C' }}
                    >
                      {reg.title}
                    </h3>
                    <p className="section-label mt-0.5" style={{ color: '#5F5E5A' }}>
                      {reg.ref}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <ul className="mt-3 space-y-2">
                    {reg.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="section-label px-1.5 py-0.5 rounded-[4px] flex-shrink-0 mt-0.5"
                          style={{
                            backgroundColor: reg.color + '18',
                            color: reg.color,
                            border: `1px solid ${reg.color}40`,
                            fontSize: '10px',
                          }}
                        >
                          {item.label}
                        </span>
                        <p className="text-xs leading-relaxed" style={{ color: '#5F5E5A' }}>
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {reg.sanction && (
                    <div
                      className="mt-4 rounded-[4px] px-3 py-2"
                      style={{ backgroundColor: '#FCEBEB', border: '1px solid #C0392B' }}
                    >
                      <p className="text-xs font-semibold" style={{ color: '#C0392B' }}>
                        Sanction maximale : {reg.sanction}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Charte numérique */}
        <div
          className="rounded-[6px] p-6"
          style={{ backgroundColor: '#0C447C' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-white" aria-hidden />
            <h3 className="font-bold text-base text-white">
              Charte d&apos;hygiène numérique — À signer par l&apos;ensemble du personnel
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {CHARTE_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="w-5 h-5 rounded-[4px] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}
                >
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span>EHPAD Les 7 Fontaines — France Horizon</span>
            <span>Version Mai 2026</span>
            <span>Référence : ANSSI Guide d&apos;hygiène informatique</span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="rounded-[6px] p-5"
          style={{ backgroundColor: '#F1EFE8', border: '1px solid #D3D1C7' }}
        >
          <h4 className="font-semibold text-sm mb-3" style={{ color: '#0C447C' }}>
            Contacts et ressources utiles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'CERT Santé', info: '09 72 72 09 09 — 24h/24 7j/7', url: 'https://cyberveille.sante.gouv.fr' },
              { label: 'CNIL — Notification violation', info: 'notifications.cnil.fr', url: 'https://notifications.cnil.fr' },
              { label: 'ANSSI — SecNumAcadémie', info: 'secnumacademie.gouv.fr', url: 'https://secnumacademie.gouv.fr' },
              { label: 'ANAP — Outils cyber', info: 'anap.fr/cybersecurite', url: 'https://www.anap.fr' },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-2">
                <ExternalLink size={12} style={{ color: '#1A6BAA', flexShrink: 0, marginTop: 2 }} aria-hidden />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#0C447C' }}>{c.label}</p>
                  <p className="text-xs" style={{ color: '#5F5E5A' }}>{c.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
