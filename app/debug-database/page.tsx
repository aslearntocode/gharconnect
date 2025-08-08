'use client'

import { DatabaseDebug } from '@/components/DatabaseDebug'

export default function DebugDatabasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Database Debug Page</h1>
        <DatabaseDebug />
      </div>
    </div>
  )
} 