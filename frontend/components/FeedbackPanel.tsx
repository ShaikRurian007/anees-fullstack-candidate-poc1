'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { springSoft } from './ui/motion'

export default function FeedbackPanel({ feedback }: { feedback: any }) {
  const [decision, setDecision] = useState<'approved'|'rejected'|null>(null)

  return (
    <div>
      <h3 className="font-semibold mb-3">Mini-App AI Simulation</h3>
      <motion.pre
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1, transition: springSoft }}
        className="text-xs bg-black/40 p-3 rounded border border-white/10 overflow-auto"
      >
{feedback.codeSnippet}
      </motion.pre>
      <div className="mt-3 text-sm text-gray-200">{feedback.summary}</div>

      <div className="flex gap-2 mt-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="btn"
          onClick={() => setDecision('approved')}
        >
          Approve
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="btn"
          onClick={() => setDecision('rejected')}
        >
          Reject
        </motion.button>
      </div>

      <AnimatePresence>
        {decision && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: springSoft }}
            exit={{ opacity: 0, y: 6 }}
            className="mt-3 text-sm"
          >
            Decision:{' '}
            <span className={decision === 'approved' ? 'text-green-400' : 'text-red-400'}>
              {decision}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}