'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { cleanupConflictingVendorSlots } from '@/lib/vendorRegistration'

export default function CleanupVendorSlotsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string; cleanedCount?: number } | null>(null)

  const handleCleanup = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const cleanupResult = await cleanupConflictingVendorSlots()
      setResult(cleanupResult)

      if (cleanupResult.success) {
        toast({
          title: 'Success',
          description: `Cleanup completed successfully! ${cleanupResult.cleanedCount} vendors cleaned.`,
        })
      } else {
        toast({
          title: 'Error',
          description: cleanupResult.error || 'Cleanup failed',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Cleanup error:', error)
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Cleanup Vendor Slots</h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              This utility will clean up conflicting vendor slots in the database. 
              For vendors who have selected "24 Hours", it will remove any other time slots 
              to ensure data consistency.
            </p>
            
            <Button 
              onClick={handleCleanup} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Cleaning up...' : 'Run Cleanup'}
            </Button>

            {result && (
              <div className={`p-4 rounded-md ${
                result.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <h3 className="font-semibold mb-2">
                  {result.success ? 'Cleanup Completed' : 'Cleanup Failed'}
                </h3>
                <p>
                  {result.success 
                    ? `Successfully cleaned ${result.cleanedCount} vendors.`
                    : result.error
                  }
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
} 