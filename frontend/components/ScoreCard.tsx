'use client'
import { motion } from 'framer-motion'
import { springSoft } from './ui/motion'

export default function ScoreCard({ score }: { score: any }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="font-semibold">AI Evaluation</h3>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: springSoft }}
          className="text-sm text-gray-300"
        >
          Overall: <span className="font-semibold text-white">{score.overallScore}</span>/100
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Skills</h4>
          <ul className="space-y-3">
            {score.skills.map((s: any, i: number) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div>{s.name}</div>
                  <div className="text-gray-300">{s.score}/100</div>
                </div>
                <div className="progress">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.score}%` }}
                    transition={{ ...springSoft, delay: i * 0.03 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Gaps</h4>
          <motion.div layout className="flex flex-wrap gap-2">
            {score.gaps.map((g: any) => (
              <motion.span
                layout
                key={g}
                className="tag"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                {g}
              </motion.span>
            ))}
          </motion.div>

          <h4 className="font-semibold mt-4 mb-2">Recommendations</h4>
          <ul className="list-disc pl-5 text-sm text-gray-200 space-y-1">
            {score.recommendations.map((r: string, i: number) => (
              <motion.li key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.03 } }}>
                {r}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}