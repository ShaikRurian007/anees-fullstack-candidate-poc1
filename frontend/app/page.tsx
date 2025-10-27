import CandidateTable from '@/components/CandidateTable'
import candidates from '@/../data/candidates.json'

export default function Page() {
  return (
    <main className="space-y-6">
      <section className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Select a Candidate</h2>
        <p className="text-sm text-gray-300 mb-4">
          Choose a candidate to run AI evaluation. Results appear in the detail screen.
        </p>
        <CandidateTable candidates={candidates} />
      </section>
    </main>
  )
}
