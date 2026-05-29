import Navigation from '@/components/ehpad/Navigation'
import SectionSynthese from '@/components/ehpad/SectionSynthese'
import SectionRisques from '@/components/ehpad/SectionRisques'
import SectionConformite from '@/components/ehpad/SectionConformite'
import SectionPlan from '@/components/ehpad/SectionPlan'
import SectionCrise from '@/components/ehpad/SectionCrise'
import SectionReglementation from '@/components/ehpad/SectionReglementation'

export default function Page() {
  return (
    <>
      <Navigation />
      <main className="max-w-[960px] mx-auto pb-16">
        <SectionSynthese />

        <div style={{ height: '1px', backgroundColor: '#D3D1C7', margin: '0 1rem' }} role="separator" aria-hidden />

        <SectionRisques />

        <div style={{ height: '1px', backgroundColor: '#D3D1C7', margin: '0 1rem' }} role="separator" aria-hidden />

        <SectionConformite />

        <div style={{ height: '1px', backgroundColor: '#D3D1C7', margin: '0 1rem' }} role="separator" aria-hidden />

        <SectionPlan />

        <div style={{ height: '1px', backgroundColor: '#D3D1C7', margin: '0 1rem' }} role="separator" aria-hidden />

        <SectionCrise />

        <div style={{ height: '1px', backgroundColor: '#D3D1C7', margin: '0 1rem' }} role="separator" aria-hidden />

        <SectionReglementation />
      </main>

      <footer
        className="border-t no-print"
        style={{ borderColor: '#D3D1C7', backgroundColor: '#F1EFE8', padding: '1.5rem 1rem' }}
      >
        <div className="max-w-[960px] mx-auto flex flex-wrap justify-between gap-3">
          <p className="text-xs" style={{ color: '#5F5E5A' }}>
            EHPAD Les 7 Fontaines — France Horizon, Gaillac (81)
          </p>
          <p className="text-xs" style={{ color: '#5F5E5A' }}>
            Rapport Cybersécurité — Mai 2026 · Référentiels ANSSI / ANAP / CERT Santé
          </p>
          <p className="text-xs" style={{ color: '#5F5E5A' }}>
            Document confidentiel — Usage interne
          </p>
        </div>
      </footer>
    </>
  )
}
