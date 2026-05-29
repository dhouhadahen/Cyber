'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronDown, AlertTriangle, Eye } from 'lucide-react'

type RiskLevel = 'CRITIQUE' | 'ÉLEVÉ' | 'MOYEN'

interface Choice {
  text: string
  correct: boolean
  feedback: string
}

interface Risk {
  id: string
  level: RiskLevel
  title: string
  ref: string
  situation: string
  question: string
  choices: Choice[]
  actions: string[]
  vigilance: string
}

const RISKS: Risk[] = [
  {
    id: 'sessions',
    level: 'CRITIQUE',
    title: 'Sessions NetSoins ouvertes sans surveillance',
    ref: 'RGPD Art. 32 / HDS',
    situation:
      "Des sessions NetSoins restent ouvertes sur les postes de travail partagés, même en l'absence du soignant. N'importe quel personnel passant à proximité peut accéder aux dossiers patients en clair. Les enquêtes de terrain ont confirmé que la déconnexion manuelle est rarement pratiquée.",
    question: "Quelle est l'action prioritaire ?",
    choices: [
      { text: 'Configurer la déconnexion automatique après 5 min d\'inactivité', correct: true, feedback: 'Correct. La déconnexion automatique est la mesure immédiate, simple et efficace pour supprimer ce risque d\'accès non autorisé.' },
      { text: 'Former le personnel une fois par an', correct: false, feedback: 'La formation seule est insuffisante. Une mesure technique préventive doit impérativement être mise en place en parallèle.' },
      { text: 'Installer des caméras de surveillance', correct: false, feedback: 'Les caméras ne protègent pas les données. La mesure technique sur les sessions est prioritaire.' },
    ],
    actions: [
      "Paramétrer le timeout de session NetSoins à 5 minutes d'inactivité",
      'Déployer la politique de verrouillage automatique sur tous les postes Windows',
      'Sensibiliser les équipes au verrouillage manuel (Win+L)',
      "Auditer les journaux d'accès NetSoins pour détecter les connexions anormales",
    ],
    vigilance: "Obligation légale : l'accès aux données de santé doit être tracé et sécurisé (RGPD Art. 32, HDS). Une violation peut entraîner une sanction CNIL allant jusqu'à 4 % du CA annuel.",
  },
  {
    id: 'tablettes',
    level: 'CRITIQUE',
    title: 'Prestataire tablettes non qualifié HDS',
    ref: 'HDS / RGPD Art. 28',
    situation:
      "Les tablettes soignantes sont gérées par un prestataire externe non certifié HDS (Hébergeur de Données de Santé). Ce prestataire accède potentiellement aux données de santé hébergées sans que les garanties contractuelles et techniques réglementaires soient en place.",
    question: 'Que faire en premier ?',
    choices: [
      { text: 'Notifier le DPO et initier un DPA conforme RGPD / HDS avec ce prestataire', correct: true, feedback: 'Exact. Un contrat de sous-traitance (DPA) conforme est obligatoire avant tout accès à des données de santé.' },
      { text: "Attendre le prochain renouvellement de contrat pour régulariser", correct: false, feedback: 'Toute journée sans DPA conforme constitue une infraction continue au RGPD. Une action immédiate est nécessaire.' },
      { text: 'Bloquer immédiatement les accès prestataire', correct: false, feedback: 'Bloquer sans alternative peut paralyser les soins. La priorité est la contractualisation, puis la mise en conformité technique.' },
    ],
    actions: [
      'Notifier le Délégué à la Protection des Données (DPO) sous 48h',
      'Initier un Data Processing Agreement (DPA) conforme RGPD Art. 28 et HDS',
      "Vérifier l'éligibilité HDS du prestataire ou identifier un substitut certifié",
      "Documenter le risque dans le registre des activités de traitement de l'établissement",
    ],
    vigilance: "En l'absence de DPA, l'établissement est responsable solidairement de toute violation de données commise par ce prestataire. Risque pénal et financier direct pour le Directeur.",
  },
  {
    id: 'miseajour',
    level: 'ÉLEVÉ',
    title: 'Mises à jour systèmes absentes (> 6 mois)',
    ref: 'ANSSI / NIS2 Art. 21',
    situation:
      "Les postes clients et le serveur hébergeant NetSoins affichent des versions Windows et des correctifs de sécurité datant de plus de 6 mois. Les vulnérabilités connues (CVE critiques) ne sont pas corrigées, exposant l'établissement aux ransomwares exploitant ces failles publiques.",
    question: 'Quelle mesure technique est prioritaire ?',
    choices: [
      { text: 'Planifier un cycle de patches mensuels via WSUS ou Intune', correct: true, feedback: 'Bonne réponse. Un processus de gestion des correctifs structuré (WSUS, GPO ou MDM) est la réponse technique systémique.' },
      { text: 'Acheter un antivirus plus récent', correct: false, feedback: "Un antivirus ne remplace pas les correctifs. Les ransomwares modernes exploitent des failles système, pas seulement des signatures virales." },
      { text: 'Désactiver les mises à jour automatiques pour éviter les redémarrages intempestifs', correct: false, feedback: 'Désactiver les MAJ aggrave considérablement le risque. Les redémarrages doivent être planifiés hors heures de soin.' },
    ],
    actions: [
      'Déployer WSUS ou activer Windows Update for Business sur tous les postes',
      'Planifier les redémarrages hors plage horaire de soins (ex : 2h–5h)',
      "Établir un inventaire des versions logicielles et un tableau de bord des patches",
      "Vérifier la version de NetSoins et appliquer les correctifs Orisha disponibles",
    ],
    vigilance: "NIS2 impose une gestion proactive des vulnérabilités pour les entités du secteur santé. Un ransomware exploitant un CVE non patché engage la responsabilité de l'établissement vis-à-vis de l'ARS.",
  },
  {
    id: 'imprimantes',
    level: 'ÉLEVÉ',
    title: 'Imprimantes connectées non isolées',
    ref: 'ANSSI — Cloisonnement réseau',
    situation:
      "Les imprimantes multifonctions (MFP) partagent le même réseau LAN que les postes soignants et le serveur NetSoins. Ces équipements disposent de firmwares rarement mis à jour, de ports ouverts non filtrés, et peuvent être utilisés comme point d'entrée pour pivoter vers les systèmes critiques.",
    question: "Comment traiter ce vecteur d'attaque ?",
    choices: [
      { text: "Isoler les imprimantes dans un VLAN dédié, sans accès direct au segment serveurs", correct: true, feedback: "Correct. Le cloisonnement VLAN est la bonne pratique ANSSI pour limiter la surface d'attaque des équipements périphériques." },
      { text: 'Débrancher toutes les imprimantes réseau', correct: false, feedback: "Trop radical. L'isolement VLAN préserve la fonctionnalité d'impression tout en limitant le risque." },
      { text: 'Changer les mots de passe des interfaces d\'administration des imprimantes', correct: false, feedback: "Nécessaire mais insuffisant. Sans isolation réseau, un attaquant peut toujours y accéder depuis le LAN." },
    ],
    actions: [
      "Créer un VLAN dédié aux équipements d'impression (ex : VLAN 30)",
      'Appliquer des ACL interdisant tout flux direct VLAN imprimantes → VLAN serveurs',
      "Mettre à jour les firmwares de toutes les MFP",
      "Modifier les mots de passe d'administration par défaut",
    ],
    vigilance: "Les imprimantes MFP stockent localement les documents imprimés et peuvent exfiltrer des données de santé. Ce vecteur est régulièrement utilisé lors des exercices de red team en établissements de santé.",
  },
  {
    id: 'droits',
    level: 'ÉLEVÉ',
    title: 'Droits d\'accès excessifs dans NetSoins',
    ref: 'RGPD / Principe du moindre privilège',
    situation:
      "L'audit des comptes utilisateurs NetSoins révèle que 14 agents disposent de droits d'administration, alors que seuls 2 à 3 sont nécessaires pour les usages métier. Des comptes d'anciens salariés restent actifs. Ce manque de contrôle des accès constitue un risque majeur de fuite interne et de compromission en cascade.",
    question: 'Par où commencer la remédiation ?',
    choices: [
      { text: "Désactiver immédiatement les comptes des salariés partis et réviser les droits selon le principe du moindre privilège", correct: true, feedback: "Exactement. Les comptes orphelins sont la première priorité : ils représentent des accès non surveillés sans propriétaire actif." },
      { text: 'Créer de nouveaux comptes pour les agents qui en ont besoin', correct: false, feedback: "Créer de nouveaux comptes sans supprimer les anciens aggrave la situation. Il faut d'abord assainir l'existant." },
      { text: "Demander à chaque agent de changer son mot de passe", correct: false, feedback: "Le changement de mot de passe ne traite pas les comptes orphelins ni l'excès de privilèges. C'est une mesure hygiénique insuffisante ici." },
    ],
    actions: [
      "Désactiver tous les comptes d'anciens salariés (liste RH à croiser avec la base NetSoins)",
      "Réviser les droits selon les rôles métier réels (principe du moindre privilège)",
      "Réduire les comptes administrateurs à 2–3 personnes identifiées",
      "Instaurer un processus de revue trimestrielle des accès (IAM)",
    ],
    vigilance: "Obligation légale RGPD : les droits d'accès doivent être proportionnés à la mission. La CNIL sanctionne spécifiquement les comptes orphelins actifs dans les systèmes traitant des données de santé.",
  },
  {
    id: 'hameconnage',
    level: 'MOYEN',
    title: 'Absence de protection anti-hameçonnage',
    ref: 'CERT Santé / ANAP — Sensibilisation',
    situation:
      "Aucune solution de filtrage des courriels malveillants (anti-phishing) n'est déployée sur la messagerie professionnelle. 90 % des cyberattaques dans le secteur santé débutent par un courriel frauduleux. Aucun exercice de simulation de phishing n'a été réalisé à ce jour.",
    question: "Quelle est la combinaison d'actions la plus efficace ?",
    choices: [
      { text: "Déployer un filtre anti-phishing sur la messagerie ET conduire un exercice de simulation auprès des équipes", correct: true, feedback: "Parfait. La défense en profondeur combine la protection technique (filtre) et humaine (sensibilisation). Les deux sont nécessaires." },
      { text: "Interdire l'utilisation de la messagerie professionnelle pour les communications externes", correct: false, feedback: "Disproportionné et contre-productif. L'objectif est de sécuriser l'usage, non de le supprimer." },
      { text: "Afficher une note de service rappelant de ne pas cliquer sur les liens suspects", correct: false, feedback: "Une note de service seule est insuffisante. Sans exercice pratique et filtre technique, le risque reste entier." },
    ],
    actions: [
      "Activer la protection anti-phishing avancée (Microsoft Defender for Office 365 ou équivalent)",
      "Configurer les enregistrements SPF, DKIM et DMARC du domaine de messagerie",
      "Conduire un exercice annuel de simulation de phishing (CERT Santé propose des kits gratuits)",
      "Mettre en place un bouton de signalement 'Signaler un courriel suspect' dans Outlook",
    ],
    vigilance: "Le CERT Santé recense que 90 % des incidents débutent par un courriel frauduleux. La sensibilisation doit être annuelle et inclure les nouveaux arrivants dans les 30 premiers jours.",
  },
]

const LEVEL_STYLES: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  CRITIQUE: { bg: '#FCEBEB', text: '#C0392B', border: '#C0392B' },
  ÉLEVÉ: { bg: '#FAEEDA', text: '#E67E22', border: '#E67E22' },
  MOYEN: { bg: '#EAF3DE', text: '#27500A', border: '#27500A' },
}

function RiskCard({ risk }: { risk: Risk }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const levelStyle = LEVEL_STYLES[risk.level]

  const handleChoice = (idx: number) => {
    if (revealed) return
    setSelected(idx)
    setTimeout(() => setRevealed(true), 600)
  }

  return (
    <article
      className="bg-white rounded-[6px] card-shadow overflow-hidden"
      aria-labelledby={`risk-title-${risk.id}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-border-gray">
        <span
          className="section-label px-2 py-0.5 rounded-[4px]"
          style={{
            backgroundColor: levelStyle.bg,
            color: levelStyle.text,
            border: `1px solid ${levelStyle.border}`,
          }}
        >
          {risk.level}
        </span>
        <h3
          id={`risk-title-${risk.id}`}
          className="font-bold text-sm flex-1"
          style={{ color: '#0C447C' }}
        >
          {risk.title}
        </h3>
        <span
          className="section-label px-2 py-0.5 rounded-[4px] text-white"
          style={{ backgroundColor: '#1A6BAA' }}
        >
          {risk.ref}
        </span>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left — situation */}
        <div className="p-5 border-r border-border-gray/50">
          <p className="section-label mb-2" style={{ color: '#5F5E5A' }}>
            Situation observée
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#1A1A18' }}>
            {risk.situation}
          </p>
        </div>

        {/* Right — decision test */}
        <div className="p-5">
          <p className="section-label mb-3" style={{ color: '#0C447C' }}>
            {risk.question}
          </p>
          <div className="space-y-2">
            {risk.choices.map((choice, idx) => {
              const isSelected = selected === idx
              const isCorrect = choice.correct
              let bg = '#F7F6F2'
              let border = '#D3D1C7'
              let textColor = '#1A1A18'

              if (isSelected) {
                if (isCorrect) { bg = '#EAF3DE'; border = '#27500A'; textColor = '#27500A' }
                else { bg = '#FCEBEB'; border = '#C0392B'; textColor = '#C0392B' }
              }
              if (revealed && isCorrect && !isSelected) {
                bg = '#EAF3DE'; border = '#27500A'; textColor = '#27500A'
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleChoice(idx)}
                  disabled={revealed}
                  className="w-full text-left text-sm rounded-[6px] px-3 py-2.5 transition-all border"
                  style={{ backgroundColor: bg, borderColor: border, color: textColor }}
                  whileHover={!revealed ? { scale: 1.01 } : {}}
                  whileTap={!revealed ? { scale: 0.99 } : {}}
                  animate={{ backgroundColor: bg }}
                  transition={{ duration: 0.3 }}
                  aria-pressed={isSelected}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && isCorrect && <CheckCircle size={14} aria-label="Correct" />}
                    {isSelected && !isCorrect && <XCircle size={14} aria-label="Incorrect" />}
                    {revealed && isCorrect && !isSelected && <CheckCircle size={14} aria-label="Bonne réponse" />}
                    {choice.text}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-xs rounded-[4px] px-3 py-2"
                style={{
                  backgroundColor: risk.choices[selected].correct ? '#EAF3DE' : '#FAEEDA',
                  color: risk.choices[selected].correct ? '#27500A' : '#E67E22',
                  border: `1px solid ${risk.choices[selected].correct ? '#27500A' : '#E67E22'}`,
                }}
              >
                {risk.choices[selected].feedback}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Revealed actions */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border-gray"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-5 border-r border-border-gray/50">
                <p className="section-label mb-3" style={{ color: '#27500A' }}>
                  <CheckCircle size={12} className="inline mr-1" aria-hidden />
                  Actions recommandées
                </p>
                <ul className="space-y-1.5">
                  {risk.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#1A1A18' }}>
                      <span
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-[2px] text-white flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: '#27500A' }}
                      >
                        {i + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5">
                <p className="section-label mb-2" style={{ color: '#E67E22' }}>
                  <AlertTriangle size={12} className="inline mr-1" aria-hidden />
                  Point de vigilance
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#5F5E5A' }}>
                  {risk.vigilance}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal button if not yet triggered */}
      {!revealed && selected === null && (
        <div className="px-5 py-3 border-t border-border-gray/50 flex justify-end">
          <button
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: '#1A6BAA' }}
            onClick={() => { setSelected(0); setTimeout(() => setRevealed(true), 100) }}
          >
            <Eye size={12} aria-hidden />
            Voir directement les recommandations
          </button>
        </div>
      )}
    </article>
  )
}

export default function SectionRisques() {
  return (
    <section id="risques" className="py-14" aria-labelledby="risques-title">
      <div className="max-w-[900px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2
            id="risques-title"
            className="text-2xl font-bold mb-1 pb-3 border-b-2"
            style={{ color: '#0C447C', borderColor: '#0C447C' }}
          >
            Risques identifiés &amp; Décisions
          </h2>
          <p className="text-sm mt-3" style={{ color: '#5F5E5A' }}>
            Six vulnérabilités ont été identifiées. Pour chaque situation, testez votre jugement de
            dirigeant avant de découvrir la recommandation.
          </p>
        </div>

        {/* Risk cards */}
        <div className="space-y-5">
          {RISKS.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </div>
    </section>
  )
}
