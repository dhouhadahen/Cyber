'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCenter,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Phone, FileText, Shield, Printer, Wifi, Clock } from 'lucide-react'

const CORRECT_ORDER = [
  { id: 'step1', label: 'Isoler l\'appareil suspect', detail: 'Débrancher le câble réseau et/ou désactiver le Wi-Fi', icon: Wifi },
  { id: 'step2', label: 'Alerter la direction et le référent cybersécurité', detail: 'Ne pas éteindre la machine — préserver les traces forensiques', icon: Phone },
  { id: 'step3', label: 'Contacter le CERT Santé', detail: '09 72 72 09 09 — disponible 24h/24, 7j/7', icon: Shield },
  { id: 'step4', label: 'Notifier la CNIL', detail: 'Dans les 72 heures — obligation légale RGPD Art. 33', icon: FileText },
  { id: 'step5', label: 'Déposer plainte', detail: 'Auprès de la gendarmerie ou du commissariat', icon: AlertTriangle },
]

// Shuffled initial order
const SHUFFLED = ['step3', 'step1', 'step5', 'step2', 'step4']

function DraggableStep({ id, label, detail, icon: Icon, isPlaced }: {
  id: string; label: string; detail: string; icon: React.ElementType; isPlaced: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing bg-white rounded-[6px] border border-border-gray p-3 flex items-center gap-3 card-shadow transition-opacity ${isDragging ? 'opacity-30' : ''}`}
    >
      <div className="w-8 h-8 rounded-[4px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E6F1FB' }}>
        <Icon size={14} style={{ color: '#0C447C' }} aria-hidden />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold" style={{ color: '#1A1A18' }}>{label}</p>
        <p className="text-xs" style={{ color: '#5F5E5A' }}>{detail}</p>
      </div>
    </div>
  )
}

function DropSlot({ slotId, children, isCorrect, isEmpty }: {
  slotId: string; children?: React.ReactNode; isCorrect?: boolean; isEmpty: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: slotId })
  return (
    <div
      ref={setNodeRef}
      className="rounded-[6px] min-h-[60px] border-2 transition-all"
      style={{
        borderStyle: 'dashed',
        borderColor: isOver ? '#1A6BAA' : isCorrect ? '#27500A' : '#D3D1C7',
        backgroundColor: isOver ? '#E6F1FB' : isCorrect ? '#EAF3DE' : isEmpty ? '#F7F6F2' : 'transparent',
      }}
    >
      {children || (
        <div className="flex items-center justify-center h-full py-4">
          <p className="text-xs" style={{ color: '#D3D1C7' }}>Déposez ici</p>
        </div>
      )}
    </div>
  )
}

function CrisisSequencer() {
  // L'ASTUCE EST ICI : On crée la variable pour vérifier si on est sur le navigateur
  const [isMounted, setIsMounted] = useState(false)

  const [available, setAvailable] = useState<string[]>(SHUFFLED)
  const [slots, setSlots] = useState<Record<string, string | null>>({
    slot1: null, slot2: null, slot3: null, slot4: null, slot5: null,
  })
  const [validated, setValidated] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // On valide le montage uniquement côté client (navigateur)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const draggedId = active.id as string
    const targetId = over.id as string

    if (!targetId.startsWith('slot')) return

    const sourceSlot = Object.keys(slots).find((k) => slots[k] === draggedId)

    setSlots((prev) => {
      const newSlots = { ...prev }
      if (newSlots[targetId] && newSlots[targetId] !== draggedId) {
        setAvailable((a) => [...a, newSlots[targetId]!])
      }
      newSlots[targetId] = draggedId
      if (sourceSlot) newSlots[sourceSlot] = null
      return newSlots
    })

    if (sourceSlot) {
      // moving between slots, no need to remove from available
    } else {
      setAvailable((prev) => prev.filter((id) => id !== draggedId))
    }
  }

  const validate = () => setValidated(true)
  const reset = () => {
    setAvailable(SHUFFLED)
    setSlots({ slot1: null, slot2: null, slot3: null, slot4: null, slot5: null })
    setValidated(false)
  }

  const isSlotCorrect = (slotIndex: number, itemId: string | null) => {
    if (!itemId || !validated) return false
    return CORRECT_ORDER[slotIndex - 1].id === itemId
  }

  const isAllCorrect = validated && Object.entries(slots).every(([key, val], i) => {
    const slotNum = parseInt(key.replace('slot', ''))
    return val !== null && CORRECT_ORDER[slotNum - 1].id === val
  })

  const getStepById = (id: string) => CORRECT_ORDER.find((s) => s.id === id)

  // LA SÉCURITÉ VERCEL : Si la page est en train d'être construite sur le serveur, on n'affiche pas le composant
  if (!isMounted) {
    return null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available steps */}
        <div>
          <p className="section-label mb-3" style={{ color: '#5F5E5A' }}>
            Actions disponibles — glissez dans l&apos;ordre
          </p>
          <div className="space-y-2">
            {available.map((id) => {
              const step = getStepById(id)!
              return (
                <DraggableStep
                  key={id}
                  id={id}
                  label={step.label}
                  detail={step.detail}
                  icon={step.icon}
                  isPlaced={false}
                />
              )
            })}
            {available.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: '#D3D1C7' }}>
                Toutes les actions ont été placées
              </p>
            )}
          </div>
        </div>

        {/* Slots */}
        <div>
          <p className="section-label mb-3" style={{ color: '#0C447C' }}>
            Séquence des 30 premières minutes
          </p>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((num) => {
              const slotKey = `slot${num}`
              const itemId = slots[slotKey]
              const step = itemId ? getStepById(itemId) : null
              const correct = isSlotCorrect(num, itemId)

              return (
                <div key={slotKey} className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-[4px] flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: correct ? '#27500A' : '#0C447C', color: '#FFFFFF' }}
                  >
                    {num}
                  </span>
                  <div className="flex-1">
                    <DropSlot slotId={slotKey} isCorrect={correct} isEmpty={!itemId}>
                      {step && (
                        <div className="p-3 flex items-center gap-3">
                          <step.icon size={14} style={{ color: correct ? '#27500A' : '#0C447C' }} aria-hidden />
                          <div className="flex-1">
                            <p className="text-xs font-semibold" style={{ color: correct ? '#27500A' : '#1A1A18' }}>
                              {step.label}
                            </p>
                            {validated && !correct && (
                              <p className="text-xs mt-0.5" style={{ color: '#C0392B' }}>
                                Position incorrecte
                              </p>
                            )}
                          </div>
                          {validated && correct && <CheckCircle size={14} style={{ color: '#27500A' }} aria-hidden />}
                          {validated && !correct && <AlertTriangle size={14} style={{ color: '#C0392B' }} aria-hidden />}
                        </div>
                      )}
                    </DropSlot>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={validate}
              disabled={Object.values(slots).some((v) => v === null)}
              className="px-4 py-2 rounded-[6px] text-xs font-semibold text-white disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: '#0C447C' }}
            >
              Valider la séquence
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-[6px] text-xs font-medium transition-opacity"
              style={{ backgroundColor: '#F1EFE8', color: '#5F5E5A', border: '1px solid #D3D1C7' }}
            >
              Recommencer
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAllCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-[6px] p-4 flex items-center gap-3"
            style={{ backgroundColor: '#EAF3DE', border: '1px solid #27500A' }}
            role="alert"
          >
            <CheckCircle size={18} style={{ color: '#27500A' }} aria-hidden />
            <div>
              <p className="font-bold text-sm" style={{ color: '#27500A' }}>
                Protocole validé !
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#5F5E5A' }}>
                Séquence correcte. Ce protocole doit être affiché et connu de tous les cadres de l&apos;établissement.
              </p>
            </div>
          </motion.div>
        )}
        {validated && !isAllCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-[6px] p-4 flex items-center gap-3"
            style={{ backgroundColor: '#FAEEDA', border: '1px solid #E67E22' }}
            role="alert"
          >
            <AlertTriangle size={18} style={{ color: '#E67E22' }} aria-hidden />
            <div>
              <p className="font-bold text-sm" style={{ color: '#E67E22' }}>
                Séquence à revoir
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#5F5E5A' }}>
                Certaines étapes ne sont pas dans le bon ordre. Pensez à isoler l&apos;appareil en premier, avant toute communication.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DragOverlay>
        {activeId && (() => {
          const step = getStepById(activeId)
          if (!step) return null
          return <DraggableStep id={activeId} label={step.label} detail={step.detail} icon={step.icon} isPlaced={false} />
        })()}
      </DragOverlay>
    </DndContext>
  )
}

function BackupToggle() {
  const [offline, setOffline] = useState<boolean | null>(null)

  return (
    <div className="mt-6 pt-5 border-t border-border-gray">
      <h4 className="font-semibold text-sm mb-3" style={{ color: '#0C447C' }}>
        Calculez votre robustesse
      </h4>
      <p className="text-xs mb-4" style={{ color: '#5F5E5A' }}>
        Vos sauvegardes incluent-elles une copie hors-ligne (disque déconnecté ou bande) ?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setOffline(true)}
          className={`px-5 py-2 rounded-[6px] text-xs font-semibold border transition-all ${offline === true ? 'text-white' : 'text-foreground'}`}
          style={{
            backgroundColor: offline === true ? '#27500A' : '#F7F6F2',
            borderColor: offline === true ? '#27500A' : '#D3D1C7',
            color: offline === true ? '#FFFFFF' : '#1A1A18',
          }}
          aria-pressed={offline === true}
        >
          Oui
        </button>
        <button
          onClick={() => setOffline(false)}
          className={`px-5 py-2 rounded-[6px] text-xs font-semibold border transition-all`}
          style={{
            backgroundColor: offline === false ? '#C0392B' : '#F7F6F2',
            borderColor: offline === false ? '#C0392B' : '#D3D1C7',
            color: offline === false ? '#FFFFFF' : '#1A1A18',
          }}
          aria-pressed={offline === false}
        >
          Non
        </button>
      </div>
      <AnimatePresence>
        {offline === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 rounded-[6px] p-3"
            style={{ backgroundColor: '#EAF3DE', border: '1px solid #27500A' }}
          >
            <p className="text-xs font-medium" style={{ color: '#27500A' }}>
              Bonne pratique. La copie hors-ligne est le seul rempart certain contre les ransomwares qui chiffrent aussi les sauvegardes connectées. Vérifiez que cette copie est testée au moins trimestriellement.
            </p>
          </motion.div>
        )}
        {offline === false && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 rounded-[6px] p-3"
            style={{ backgroundColor: '#FCEBEB', border: '1px solid #C0392B' }}
          >
            <p className="text-xs font-medium" style={{ color: '#C0392B' }}>
              Risque critique : Sans copie hors-ligne, un ransomware peut chiffrer simultanément vos données et toutes vos sauvegardes connectées. Ajoutez impérativement une copie déconnectée (bande LTO, disque externe stocké hors site).
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SectionCrise() {
  return (
    <section id="crise" className="py-14" aria-labelledby="crise-title">
      <div className="max-w-[900px] mx-auto px-4 space-y-10">
        {/* Header */}
        <div>
          <h2
            id="crise-title"
            className="text-2xl font-bold mb-1 pb-3 border-b-2"
            style={{ color: '#0C447C', borderColor: '#0C447C' }}
          >
            Protocole de gestion de crise
          </h2>
          <p className="text-sm mt-3" style={{ color: '#5F5E5A' }}>
            Ce document doit être imprimé et affiché. Avant tout, testez vos réflexes en cas de
            cyberattaque avérée sur NetSoins.
          </p>
        </div>

        {/* 5.1 — Sequencer game */}
        <div className="bg-white rounded-[6px] p-6 card-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} style={{ color: '#C0392B' }} aria-hidden />
            <h3 className="font-bold text-base" style={{ color: '#0C447C' }}>
              Les 30 premières minutes — Classez les actions dans l&apos;ordre
            </h3>
          </div>
          <p className="text-xs mb-5" style={{ color: '#5F5E5A' }}>
            Glissez chaque action depuis la liste vers les cases numérotées dans la séquence correcte.
          </p>
          <CrisisSequencer />
        </div>

        {/* 5.2 — Continuité des soins */}
        <div className="bg-white rounded-[6px] p-6 card-shadow">
          <h3 className="font-bold text-base mb-4" style={{ color: '#0C447C' }}>
            Continuité des soins en mode dégradé
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#0C447C' }}>
                  {['Système', 'Fonction critique', 'Procédure de secours', 'Délai tolérable'].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 font-semibold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['NetSoins', 'Dossier patient numérique', 'Fiche patient papier (modèle en armoire rouge, bureau IDE)', '4 heures'],
                  ['Messagerie', 'Communications internes', 'Téléphone fixe + répertoire papier', '1 heure'],
                  ['Prescriptions', 'Ordonnances médicales', 'Carnet de prescriptions papier avec validation médecin', '2 heures'],
                  ['Badges accès', 'Contrôle d\'accès physique', 'Clés mécaniques de secours (coffre direction)', '15 minutes'],
                  ['Internet', 'Connexion réseau externe', 'Partage de connexion 4G (téléphone professionnel direction)', '30 minutes'],
                ].map(([sys, fonc, proc, delai], i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F7F6F2' }}>
                    <td className="px-3 py-2.5 font-semibold" style={{ color: '#0C447C' }}>{sys}</td>
                    <td className="px-3 py-2.5" style={{ color: '#1A1A18' }}>{fonc}</td>
                    <td className="px-3 py-2.5" style={{ color: '#5F5E5A' }}>{proc}</td>
                    <td className="px-3 py-2.5 font-medium" style={{ color: '#C0392B' }}>{delai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5.3 — Timeline de reprise */}
        <div className="bg-white rounded-[6px] p-6 card-shadow">
          <h3 className="font-bold text-base mb-6" style={{ color: '#0C447C' }}>
            Calendrier de reprise d&apos;activité
          </h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#D3D1C7' }} aria-hidden />
            <div className="space-y-6">
              {[
                { phase: 'H+0 à H+4', title: 'Confinement & évaluation', detail: 'Isoler les systèmes, évaluer l\'étendue de l\'incident, activer le mode dégradé', color: '#C0392B' },
                { phase: 'H+4 à J+1', title: 'Notification & investigation', detail: 'Notifier CNIL (72h), contacter CERT Santé, déposer plainte, mandater un expert forensique si besoin', color: '#E67E22' },
                { phase: 'J+1 à J+7', title: 'Restauration technique', detail: 'Restaurer depuis sauvegardes hors-ligne validées, reconstruire l\'environnement sain, tester NetSoins avant reconnexion', color: '#1A6BAA' },
                { phase: 'J+7 et +', title: 'Retex & renforcement', detail: 'Conduire une analyse post-incident, documenter les leçons apprises, renforcer les mesures de sécurité identifiées', color: '#27500A' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 pl-0">
                  <div
                    className="w-10 h-10 rounded-[6px] flex items-center justify-center flex-shrink-0 relative z-10 text-white text-xs font-bold"
                    style={{ backgroundColor: step.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="section-label mb-0.5" style={{ color: step.color }}>
                      {step.phase}
                    </p>
                    <p className="font-semibold text-sm" style={{ color: '#1A1A18' }}>{step.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: '#5F5E5A' }}>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5.4 — Règle 3-2-1 + backup toggle */}
        <div className="bg-white rounded-[6px] p-6 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Printer size={16} style={{ color: '#0C447C' }} aria-hidden />
            <h3 className="font-bold text-base" style={{ color: '#0C447C' }}>
              Règle 3-2-1 — Stratégie de sauvegarde robuste
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            {[
              { num: '3', label: '3 copies des données', detail: 'La copie de production + 2 sauvegardes indépendantes', color: '#0C447C' },
              { num: '2', label: '2 supports différents', detail: 'Ex : disque dur externe ET sauvegarde cloud chiffrée', color: '#1A6BAA' },
              { num: '1', label: '1 copie hors site', detail: 'Copie déconnectée, stockée physiquement hors de l\'établissement', color: '#C0392B' },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-[6px] p-4 border-l-4"
                style={{ backgroundColor: '#F7F6F2', borderLeftColor: item.color }}
              >
                <p className="text-3xl font-bold leading-none mb-2" style={{ color: item.color }}>
                  {item.num}
                </p>
                <p className="font-semibold text-xs mb-1" style={{ color: '#1A1A18' }}>{item.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#5F5E5A' }}>{item.detail}</p>
              </div>
            ))}
          </div>
          <BackupToggle />
        </div>
      </div>
    </section>
  )
}