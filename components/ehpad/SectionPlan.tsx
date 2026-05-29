'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  closestCenter,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, GripVertical, CheckCircle } from 'lucide-react'

type Priority = 'critique' | 'important' | 'normal'
type Column = 'immediate' | 'three-six' | 'six-twelve'

interface Action {
  id: string
  title: string
  priority: Priority
  ref: string
  correctColumn: Column
}

const INITIAL_ACTIONS: Action[] = [
  // Critiques — should be in immediate
  { id: 'a1', title: 'Désactiver les comptes des anciens salariés dans NetSoins', priority: 'critique', ref: 'RGPD Art. 32', correctColumn: 'immediate' },
  { id: 'a2', title: 'Initier le DPA avec le prestataire tablettes (RGPD Art. 28)', priority: 'critique', ref: 'RGPD / HDS', correctColumn: 'immediate' },
  { id: 'a3', title: 'Configurer le timeout de session NetSoins (5 min)', priority: 'critique', ref: 'HDS / ANSSI', correctColumn: 'immediate' },
  { id: 'a4', title: 'Notifier le DPO et documenter les risques identifiés', priority: 'critique', ref: 'RGPD Art. 37', correctColumn: 'immediate' },
  // Importants — 3-6 months
  { id: 'a5', title: 'Déployer WSUS et planifier les patches systèmes mensuels', priority: 'important', ref: 'NIS2 Art. 21', correctColumn: 'three-six' },
  { id: 'a6', title: 'Créer un VLAN dédié aux imprimantes MFP', priority: 'important', ref: 'ANSSI', correctColumn: 'three-six' },
  { id: 'a7', title: 'Déployer le filtrage anti-phishing sur la messagerie', priority: 'important', ref: 'CERT Santé', correctColumn: 'three-six' },
  { id: 'a8', title: 'Mettre en place le MFA pour les accès administrateurs', priority: 'important', ref: 'ANSSI / NIS2', correctColumn: 'three-six' },
  { id: 'a9', title: 'Actualiser et faire signer la charte informatique', priority: 'important', ref: 'RGPD / RH', correctColumn: 'three-six' },
  { id: 'a10', title: 'Configurer SPF, DKIM et DMARC sur le domaine', priority: 'important', ref: 'ANSSI', correctColumn: 'three-six' },
  // Normal — 6-12 months
  { id: 'a11', title: 'Rédiger et tester le Plan de Continuité d\'Activité (PCA)', priority: 'normal', ref: 'CaRE / ANAP', correctColumn: 'six-twelve' },
  { id: 'a12', title: 'Déployer la formation SecNumAcadémie ANSSI pour le personnel', priority: 'normal', ref: 'ANSSI', correctColumn: 'six-twelve' },
  { id: 'a13', title: 'Conduire un exercice de simulation de phishing', priority: 'normal', ref: 'CERT Santé', correctColumn: 'six-twelve' },
  { id: 'a14', title: 'Finaliser l\'inventaire des actifs numériques (CMDB)', priority: 'normal', ref: 'ANSSI / NIS2', correctColumn: 'six-twelve' },
  { id: 'a15', title: 'Auditer et renouveler la politique de mots de passe (GPO)', priority: 'normal', ref: 'ANSSI', correctColumn: 'six-twelve' },
  { id: 'a16', title: 'Migrer vers une solution EDR managée (remplacement antivirus)', priority: 'normal', ref: 'NIS2', correctColumn: 'six-twelve' },
  { id: 'a17', title: 'Tester la restauration complète des sauvegardes NetSoins', priority: 'normal', ref: 'CaRE', correctColumn: 'six-twelve' },
  { id: 'a18', title: 'Mettre en place une revue trimestrielle des accès (IAM)', priority: 'normal', ref: 'RGPD', correctColumn: 'six-twelve' },
]

// Scramble initial placement
const INITIAL_COLUMNS: Record<Column, string[]> = {
  immediate: ['a1', 'a2', 'a3', 'a4', 'a11', 'a13'],
  'three-six': ['a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a17'],
  'six-twelve': ['a12', 'a14', 'a15', 'a16', 'a18'],
}

const PRIORITY_STYLES: Record<Priority, { bg: string; text: string; border: string; label: string }> = {
  critique: { bg: '#FCEBEB', text: '#C0392B', border: '#C0392B', label: 'Critique' },
  important: { bg: '#FAEEDA', text: '#E67E22', border: '#E67E22', label: 'Important' },
  normal: { bg: '#EAF3DE', text: '#27500A', border: '#27500A', label: 'Normal' },
}

const COLUMN_META: Record<Column, { label: string; sub: string; headerBg: string; headerText: string; dropBg: string }> = {
  immediate: { label: 'Actions immédiates', sub: '0–3 mois', headerBg: '#C0392B', headerText: '#FFFFFF', dropBg: '#FCEBEB' },
  'three-six': { label: 'Actions à 3–6 mois', sub: '', headerBg: '#E67E22', headerText: '#FFFFFF', dropBg: '#FAEEDA' },
  'six-twelve': { label: 'Actions à 6–12 mois', sub: '', headerBg: '#27500A', headerText: '#FFFFFF', dropBg: '#EAF3DE' },
}

function ActionCard({ action, isDragging = false }: { action: Action; isDragging?: boolean }) {
  const style = PRIORITY_STYLES[action.priority]
  return (
    <div
      className={`bg-white rounded-[6px] border border-border-gray p-3 ${isDragging ? 'opacity-50' : ''} card-shadow`}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#D3D1C7' }} aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium leading-snug" style={{ color: '#1A1A18' }}>
            {action.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="section-label px-1.5 py-0.5 rounded-[4px]"
              style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}`, fontSize: '10px' }}
            >
              {style.label}
            </span>
            <span className="section-label" style={{ color: '#5F5E5A', fontSize: '10px' }}>
              {action.ref}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DraggableActionCard({ action, activeId }: { action: Action; activeId: string | null }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: action.id })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : ''}`}
    >
      <ActionCard action={action} />
    </div>
  )
}

function DroppableColumn({
  column,
  items,
  actions,
  activeId,
  toast,
}: {
  column: Column
  items: string[]
  actions: Action[]
  activeId: string | null
  toast: string | null
}) {
  const meta = COLUMN_META[column]
  const { setNodeRef, isOver } = useDroppable({ id: column })

  return (
    <div className="flex flex-col">
      <div
        className="px-4 py-3 rounded-t-[6px]"
        style={{ backgroundColor: meta.headerBg }}
      >
        <p className="font-semibold text-sm" style={{ color: meta.headerText }}>
          {meta.label}
        </p>
        {meta.sub && (
          <p className="text-xs opacity-80" style={{ color: meta.headerText }}>
            {meta.sub}
          </p>
        )}
        <p className="text-xs font-medium mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {items.length} action{items.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 rounded-b-[6px] min-h-[280px] p-3 space-y-2 transition-colors"
        style={{
          backgroundColor: isOver ? meta.dropBg : '#F7F6F2',
          border: `2px dashed ${isOver ? meta.headerBg : '#D3D1C7'}`,
          borderTop: 'none',
        }}
      >
        {items.map((id) => {
          const action = actions.find((a) => a.id === id)
          if (!action) return null
          return <DraggableActionCard key={id} action={action} activeId={activeId} />
        })}
        {items.length === 0 && (
          <div className="flex items-center justify-center h-20">
            <p className="text-xs" style={{ color: '#D3D1C7' }}>
              Déposez ici
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SectionPlan() {
  const [columns, setColumns] = useState<Record<Column, string[]>>(INITIAL_COLUMNS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const actionId = active.id as string
    const targetColumn = over.id as Column
    const action = INITIAL_ACTIONS.find((a) => a.id === actionId)
    if (!action) return

    // Find source column
    const sourceColumn = (Object.keys(columns) as Column[]).find((col) =>
      columns[col].includes(actionId)
    )
    if (!sourceColumn || sourceColumn === targetColumn) return

    // Check if misplaced
    if (action.priority === 'critique' && targetColumn !== 'immediate') {
      showToast(
        "Attention : Cette action est critique et nécessite un traitement immédiat (0–3 mois)."
      )
    } else if (action.priority === 'normal' && targetColumn === 'immediate') {
      showToast(
        "Cette action peut être planifiée à moyen ou long terme. Priorisez les actions critiques dans la première colonne."
      )
    }

    setColumns((prev) => {
      const newCols = { ...prev }
      newCols[sourceColumn] = newCols[sourceColumn].filter((id) => id !== actionId)
      newCols[targetColumn] = [...newCols[targetColumn], actionId]
      return newCols
    })
  }

  const calculateScore = () => {
    let correct = 0
    let total = 0
    ;(Object.keys(columns) as Column[]).forEach((col) => {
      columns[col].forEach((id) => {
        const action = INITIAL_ACTIONS.find((a) => a.id === id)
        if (action) {
          total++
          if (action.correctColumn === col) correct++
        }
      })
    })
    setScore(Math.round((correct / total) * 100))
  }

  const activeAction = activeId ? INITIAL_ACTIONS.find((a) => a.id === activeId) : null

  return (
    <section id="plan" className="py-14" aria-labelledby="plan-title">
      <div className="max-w-[900px] mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h2
            id="plan-title"
            className="text-2xl font-bold mb-1 pb-3 border-b-2"
            style={{ color: '#0C447C', borderColor: '#0C447C' }}
          >
            Plan d&apos;actions recommandées : À vous de prioriser
          </h2>
          <p className="text-sm mt-3" style={{ color: '#5F5E5A' }}>
            Glissez-déposez les actions dans l&apos;horizon temporel adéquat. Attention : les actions
            &quot;Critiques&quot; doivent impérativement être traitées à très court terme (0–3 mois).
          </p>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 px-4 py-3 rounded-[6px] flex items-start gap-3"
              style={{ backgroundColor: '#FAEEDA', border: '1px solid #E67E22' }}
              role="alert"
            >
              <AlertTriangle size={16} style={{ color: '#E67E22', flexShrink: 0, marginTop: 1 }} aria-hidden />
              <p className="text-xs font-medium" style={{ color: '#E67E22' }}>
                {toast}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(COLUMN_META) as Column[]).map((col) => (
              <DroppableColumn
                key={col}
                column={col}
                items={columns[col]}
                actions={INITIAL_ACTIONS}
                activeId={activeId}
                toast={toast}
              />
            ))}
          </div>
          <DragOverlay>
            {activeAction && <ActionCard action={activeAction} />}
          </DragOverlay>
        </DndContext>

        {/* Validate button */}
        <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
          <button
            onClick={calculateScore}
            className="px-5 py-2.5 rounded-[6px] text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#0C447C' }}
          >
            Valider ma priorisation
          </button>
          <button
            onClick={() => { setColumns(INITIAL_COLUMNS); setScore(null) }}
            className="px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#F1EFE8', color: '#5F5E5A', border: '1px solid #D3D1C7' }}
          >
            Réinitialiser
          </button>
        </div>

        {/* Score result */}
        <AnimatePresence>
          {score !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-[6px] p-4"
              style={{
                backgroundColor: score >= 80 ? '#EAF3DE' : score >= 50 ? '#FAEEDA' : '#FCEBEB',
                border: `1px solid ${score >= 80 ? '#27500A' : score >= 50 ? '#E67E22' : '#C0392B'}`,
              }}
              role="status"
            >
              <div className="flex items-start gap-3">
                <CheckCircle
                  size={18}
                  style={{ color: score >= 80 ? '#27500A' : score >= 50 ? '#E67E22' : '#C0392B', flexShrink: 0, marginTop: 1 }}
                  aria-hidden
                />
                <div>
                  <p className="font-bold text-sm" style={{ color: score >= 80 ? '#27500A' : score >= 50 ? '#E67E22' : '#C0392B' }}>
                    Score de priorisation : {score}%
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#5F5E5A' }}>
                    {score >= 80
                      ? "Excellente priorisation. Vos actions critiques sont bien positionnées en urgence."
                      : score >= 50
                      ? "Bonne tentative. Certaines actions critiques doivent être repositionnées dans la colonne 0–3 mois."
                      : "Attention : plusieurs actions critiques ne sont pas placées dans l'horizon immédiat. Révisez votre priorisation."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
