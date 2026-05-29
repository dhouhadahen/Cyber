'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Status = 'conforme' | 'partiel' | 'non-conforme'

interface ComplianceRow {
  id: string
  exigence: string
  statut: Status
  action: string
}

interface ComplianceGroup {
  title: string
  rows: ComplianceRow[]
}

const INITIAL_GROUPS: ComplianceGroup[] = [
  {
    title: 'Réseau et sécurité physique',
    rows: [
      { id: 'r1', exigence: 'Segmentation réseau (VLAN)', statut: 'non-conforme', action: 'Mettre en place un VLAN soins / administration / IoT' },
      { id: 'r2', exigence: 'Pare-feu et filtrage sortant', statut: 'partiel', action: 'Configurer des règles de filtrage outbound restrictives' },
      { id: 'r3', exigence: 'Wi-Fi sécurisé (WPA2/WPA3)', statut: 'partiel', action: 'Migrer les points d\'accès vers WPA3 entreprise' },
      { id: 'r4', exigence: 'Verrouillage des locaux techniques', statut: 'conforme', action: 'Maintenir la politique de contrôle d\'accès physique' },
    ],
  },
  {
    title: 'Identités et gestion des sessions',
    rows: [
      { id: 'i1', exigence: 'Politique de mots de passe robuste', statut: 'non-conforme', action: 'Imposer 12 caractères min. + complexité via GPO' },
      { id: 'i2', exigence: 'Authentification multi-facteurs (MFA)', statut: 'non-conforme', action: 'Déployer MFA pour les accès VPN et administrateurs' },
      { id: 'i3', exigence: 'Timeout de session automatique', statut: 'non-conforme', action: 'Configurer le timeout à 5 min sur NetSoins et Windows' },
      { id: 'i4', exigence: 'Gestion des comptes à privilèges', statut: 'partiel', action: 'Réduire les comptes admins à 2–3 personnes identifiées' },
    ],
  },
  {
    title: 'Matériel et maintien en condition',
    rows: [
      { id: 'm1', exigence: 'Patches et mises à jour OS', statut: 'non-conforme', action: 'Déployer WSUS et planifier les patches mensuels' },
      { id: 'm2', exigence: 'Inventaire des actifs numériques', statut: 'partiel', action: 'Finaliser l\'inventaire (serveurs, postes, tablettes, imprimantes)' },
      { id: 'm3', exigence: 'Antivirus/EDR déployé et à jour', statut: 'partiel', action: 'Migrer vers une solution EDR managée' },
      { id: 'm4', exigence: 'Imprimantes isolées du réseau serveurs', statut: 'non-conforme', action: 'Créer un VLAN dédié aux MFP (VLAN 30)' },
    ],
  },
  {
    title: 'Conformité RGPD et gouvernance',
    rows: [
      { id: 'g1', exigence: 'DPO désigné et opérationnel', statut: 'conforme', action: 'Maintenir et documenter les interactions avec le DPO' },
      { id: 'g2', exigence: 'Registre des traitements tenu à jour', statut: 'partiel', action: 'Mettre à jour le registre avec les traitements NetSoins' },
      { id: 'g3', exigence: 'DPA avec tous les sous-traitants', statut: 'non-conforme', action: 'Signer un DPA conforme avec le prestataire tablettes' },
      { id: 'g4', exigence: 'Procédure de notification de violation', statut: 'non-conforme', action: 'Rédiger et tester la procédure CNIL (72h) et CERT Santé' },
    ],
  },
  {
    title: 'Sensibilisation et gouvernance humaine',
    rows: [
      { id: 's1', exigence: 'Formation cybersécurité du personnel', statut: 'non-conforme', action: 'Déployer le module e-learning SecNumAcadémie ANSSI' },
      { id: 's2', exigence: 'Charte informatique signée', statut: 'partiel', action: 'Actualiser et faire signer la charte à tout le personnel' },
      { id: 's3', exigence: 'Exercice de simulation phishing', statut: 'non-conforme', action: 'Conduire un exercice annuel (kit CERT Santé disponible)' },
      { id: 's4', exigence: 'Référent cybersécurité identifié', statut: 'partiel', action: 'Formaliser la mission et les contacts du référent' },
    ],
  },
  {
    title: "Continuité d'activité",
    rows: [
      { id: 'c1', exigence: 'Sauvegardes 3-2-1 opérationnelles', statut: 'partiel', action: 'Ajouter une copie hors-ligne (disque déconnecté ou cloud chiffré)' },
      { id: 'c2', exigence: 'Plan de continuité (PCA) rédigé', statut: 'non-conforme', action: 'Rédiger le PCA avec scénarios de défaillance NetSoins' },
      { id: 'c3', exigence: 'Test de restauration effectué', statut: 'non-conforme', action: 'Planifier un test de restauration complet (trimestriel)' },
      { id: 'c4', exigence: 'Protocole de crise documenté', statut: 'partiel', action: 'Finaliser le protocole (voir section Crise de ce rapport)' },
    ],
  },
]

const STATUS_STYLES: Record<Status, { label: string; bg: string; text: string; border: string }> = {
  conforme: { label: 'Conforme', bg: '#EAF3DE', text: '#27500A', border: '#27500A' },
  partiel: { label: 'Partiel', bg: '#FAEEDA', text: '#E67E22', border: '#E67E22' },
  'non-conforme': { label: 'Non conforme', bg: '#FCEBEB', text: '#C0392B', border: '#C0392B' },
}

export default function SectionConformite() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const allRows = INITIAL_GROUPS.flatMap((g) => g.rows)

  const getStatus = (row: ComplianceRow): Status => {
    if (checked[row.id]) return 'conforme'
    return row.statut
  }

  const conformeCount = allRows.filter((r) => getStatus(r) === 'conforme').length
  const partielCount = allRows.filter((r) => getStatus(r) === 'partiel').length
  const nonConformeCount = allRows.filter((r) => getStatus(r) === 'non-conforme').length
  const total = allRows.length
  const score = Math.round((conformeCount / total) * 100)

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section id="conformite" className="py-14" aria-labelledby="conformite-title">
      <div className="max-w-[900px] mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h2
            id="conformite-title"
            className="text-2xl font-bold mb-1 pb-3 border-b-2"
            style={{ color: '#0C447C', borderColor: '#0C447C' }}
          >
            État de conformité interactif
          </h2>
          <p className="text-sm mt-3" style={{ color: '#5F5E5A' }}>
            Évaluation au regard des obligations réglementaires. Cochez les cases pour voir
            l&apos;impact sur votre jauge de conformité globale.
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-[6px] p-5 card-shadow mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-sm" style={{ color: '#0C447C' }}>
                Jauge de conformité globale
              </p>
              <p className="text-xs" style={{ color: '#5F5E5A' }}>
                Simulez vos actions pour visualiser la progression
              </p>
            </div>
            <motion.span
              className="text-3xl font-bold"
              style={{ color: score >= 70 ? '#27500A' : score >= 40 ? '#E67E22' : '#C0392B' }}
              key={score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {score}%
            </motion.span>
          </div>
          <div className="h-3 rounded-[2px] overflow-hidden" style={{ backgroundColor: '#D3D1C7' }}>
            <motion.div
              className="h-full rounded-[2px]"
              style={{ backgroundColor: score >= 70 ? '#27500A' : score >= 40 ? '#E67E22' : '#C0392B' }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          {/* Live summary */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border-gray">
            <span className="text-xs font-semibold" style={{ color: '#27500A' }}>
              {conformeCount} Conformes
            </span>
            <span className="text-xs font-semibold" style={{ color: '#E67E22' }}>
              {partielCount} Partiels
            </span>
            <span className="text-xs font-semibold" style={{ color: '#C0392B' }}>
              {nonConformeCount} Non conformes
            </span>
            <span className="text-xs ml-auto" style={{ color: '#5F5E5A' }}>
              Total : {total} exigences
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[6px] card-shadow overflow-hidden">
          <table className="w-full text-sm" role="table" aria-label="Tableau de conformité">
            <thead>
              <tr style={{ backgroundColor: '#F1EFE8' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#5F5E5A', width: '35%' }}>Exigence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#5F5E5A', width: '15%' }}>Statut actuel</th>
                <th className="text-left px-4 py-3 text-xs font-semibold hidden md:table-cell" style={{ color: '#5F5E5A' }}>Action prioritaire</th>
                <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: '#5F5E5A', width: '130px' }}>Simulation</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_GROUPS.map((group) => (
                <>
                  {/* Group header row */}
                  <tr key={`group-${group.title}`} style={{ backgroundColor: '#0C447C' }}>
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-xs font-semibold text-white uppercase tracking-wide"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((row, i) => {
                    const currentStatus = getStatus(row)
                    const style = STATUS_STYLES[currentStatus]
                    return (
                      <tr
                        key={row.id}
                        style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F7F6F2' }}
                        className="border-b border-border-gray/40"
                      >
                        <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1A1A18' }}>
                          {row.exigence}
                        </td>
                        <td className="px-4 py-3">
                          <motion.span
                            className="section-label px-2 py-0.5 rounded-[4px] inline-block"
                            style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                            key={currentStatus}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                          >
                            {style.label}
                          </motion.span>
                        </td>
                        <td className="px-4 py-3 text-xs hidden md:table-cell" style={{ color: '#5F5E5A' }}>
                          {row.action}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.statut !== 'conforme' && (
                            <label className="flex items-center justify-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!checked[row.id]}
                                onChange={() => toggle(row.id)}
                                className="w-4 h-4 rounded-[2px] accent-green-700"
                                aria-label={`Marquer "${row.exigence}" comme réalisée`}
                              />
                              <span className="text-xs" style={{ color: '#5F5E5A' }}>
                                Réalisée
                              </span>
                            </label>
                          )}
                          {row.statut === 'conforme' && (
                            <span className="text-xs" style={{ color: '#27500A' }}>—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Score interpretation */}
        <div className="mt-4 p-4 rounded-[6px] card-shadow" style={{ backgroundColor: score >= 70 ? '#EAF3DE' : score >= 40 ? '#FAEEDA' : '#FCEBEB' }}>
          <p className="text-xs font-semibold" style={{ color: score >= 70 ? '#27500A' : score >= 40 ? '#E67E22' : '#C0392B' }}>
            {score >= 70
              ? `Bonne progression : ${score}% de conformité atteint. Poursuivez les actions en cours.`
              : score >= 40
              ? `Progression en cours : ${score}%. Des actions critiques restent à engager.`
              : `Niveau insuffisant : ${score}% — Des actions immédiates sont requises pour se conformer aux obligations RGPD / HDS.`}
          </p>
        </div>
      </div>
    </section>
  )
}
