'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { springSoft } from './ui/motion'

type Candidate = {
  id: number
  name: string
  email: string
  experience: number
  skills: string[]
}

export default function CandidateTable({ candidates }: { candidates: Candidate[] }) {
  return (
    <>
      {/* Desktop table view - hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <motion.table
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
          className="min-w-full text-sm"
        >
          <thead className="text-left text-gray-300">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Experience</th>
              <th className="p-2">Top Skills</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.experience} yrs</td>
                <td className="p-2">
                  <div className="flex gap-2 flex-wrap">
                    {c.skills.slice(0, 4).map(s => <span key={s} className="tag">{s}</span>)}
                  </div>
                </td>
                <td className="p-2">
                  <Link
                    className="btn transition-transform active:scale-95"
                    href={`/candidate/${c.id}`}
                  >
                    Open
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Mobile card view - visible only on mobile */}
      <div className="md:hidden space-y-3">
        {candidates.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
            className="card p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{c.name}</h3>
                <p className="text-sm text-gray-300 truncate">{c.email}</p>
              </div>
              <Link
                className="btn text-sm whitespace-nowrap transition-transform active:scale-95"
                href={`/candidate/${c.id}`}
              >
                Open
              </Link>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-300">Experience:</span> {c.experience} yrs
            </div>
            
            <div>
              <div className="text-sm text-gray-300 mb-2">Top Skills:</div>
              <div className="flex gap-2 flex-wrap">
                {c.skills.slice(0, 4).map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

