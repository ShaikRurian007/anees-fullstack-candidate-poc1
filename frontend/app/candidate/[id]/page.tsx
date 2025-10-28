'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import candidates from '../../../../data/candidates.json'
import { generateScore, generateFeedback, sendReportEmail } from '@/lib/api'
import ScoreCard from '@/components/ScoreCard'
import FeedbackPanel from '@/components/FeedbackPanel'
import Skeleton from '@/components/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { springSoft } from '@/components/ui/motion'

export default function CandidateDetailPage() {
  const router = useRouter()
  const params = useParams<{id: string}>()
  const candidate = useMemo(() => (candidates as any[]).find(c => String(c.id) === String(params.id)), [params.id])

  const [score, setScore] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  
  // Refs for auto-scroll
  const scoreRef = useRef<HTMLElement>(null)
  const feedbackRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setScore(null)
    setFeedback(null)
  }, [params.id])

  // Auto-scroll when score is generated
  useEffect(() => {
    if (score && scoreRef.current) {
      // Wait for animation and layout to complete
      setTimeout(() => {
        requestAnimationFrame(() => {
          scoreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      }, 300)
    }
  }, [score])

  // Auto-scroll when feedback is generated - scroll to bottom on mobile
  useEffect(() => {
    if (feedback && feedbackRef.current) {
      // Wait for animation and layout to complete
      setTimeout(() => {
        requestAnimationFrame(() => {
          // On mobile, scroll the element into view with some padding
          const isMobile = window.innerWidth < 640
          if (isMobile) {
            // Scroll to the feedback section with offset for better visibility
            feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          } else {
            feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        })
      }, 300)
    }
  }, [feedback])

  // keyboard shortcut: press "b" to go back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'b' || e.key === 'B') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        router.push('/')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  if (!candidate) return <div className="p-4">Candidate not found.</div>

  const onEvaluate = async () => {
    setLoading(true)
    try { setScore(await generateScore({ candidate })) }
    finally { setLoading(false) }
  }

  const onFeedback = async () => {
    setLoading(true)
    try { 
      const [feedbackResult] = await Promise.all([
        generateFeedback({ candidate, score }),
        sendReportEmail({ candidate, score })
      ])
      setFeedback(feedbackResult)
    }
    finally { setLoading(false) }
  }

  return (
    <main className="space-y-4 sm:space-y-6">
      {/* Header: Back button + breadcrumb + actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="btn transition-transform active:scale-95 text-sm sm:text-base"
            onClick={() => router.push('/')}
            aria-label="Back to dashboard"
            title="Back to dashboard (B)"
          >
            ← Back
          </button>

          <div className="text-xs sm:text-sm text-gray-300 truncate">
            <Link href="/" className="hover:underline">Dashboard</Link>
            <span className="mx-1 sm:mx-2">/</span>
            <span className="text-white truncate">{candidate.name}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            className="btn transition-transform active:scale-95 w-full sm:w-auto text-sm sm:text-base" 
            onClick={onEvaluate} 
            disabled={loading}
          >
            {loading ? 'Evaluating…' : 'Evaluate'}
          </button>
          <button 
            className="btn transition-transform active:scale-95 w-full sm:w-auto text-sm sm:text-base" 
            onClick={onFeedback} 
            disabled={!score || loading}
          >
            {loading ? 'Scoring…' : 'Generate Feedback'}
          </button>
        </div>
      </div>

      <section className="card p-3 sm:p-4">
        <h3 className="font-semibold mb-3 text-base sm:text-lg">Profile</h3>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <div className="text-gray-300 text-xs sm:text-sm">Email</div>
            <div className="break-all">{candidate.email}</div>
          </div>
          <div>
            <div className="text-gray-300 text-xs sm:text-sm">Experience (yrs)</div>
            <div>{candidate.experience}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-gray-300 text-xs sm:text-sm">Skills</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {candidate.skills.map((s: string) => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.section
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card p-3 sm:p-4"
          >
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-11/12 mb-2" />
            <Skeleton className="h-3 w-10/12" />
          </motion.section>
        )}

        {score && !loading && (
          <motion.section
            ref={scoreRef}
            key="score"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: springSoft }}
            exit={{ opacity: 0, y: 6 }}
            className="card p-3 sm:p-4"
          >
            <ScoreCard score={score} />
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.section
            ref={feedbackRef}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: springSoft }}
            exit={{ opacity: 0, y: 6 }}
            className="card p-3 sm:p-4"
          >
            <FeedbackPanel feedback={feedback} />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}
