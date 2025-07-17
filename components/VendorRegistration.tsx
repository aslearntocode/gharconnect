'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { insertVendorWithoutAuth, PERMANENT_SLOTS } from '@/lib/vendorRegistration'

interface VendorRegistrationData {
  name: string
  mobile_no: string
  services: string
  areas: string[]
  societies: string[]
}

const AREAS = [
  'Parel', 'Worli', 'Bandra', 'Andheri', 'Powai', 'Khar', 'Santacruz', 'Juhu'
]

const SOCIETIES = [
  { area: 'Parel', societies: ['L&T Crescent Bay'] },
  { area: 'Worli', societies: ['Worli Society 1', 'Worli Society 2'] },
  { area: 'Bandra', societies: ['Bandra Society 1', 'Bandra Society 2'] },
  { area: 'Andheri', societies: ['Andheri Society 1', 'Andheri Society 2'] },
  { area: 'Powai', societies: ['Powai Society 1', 'Powai Society 2'] },
  { area: 'Khar', societies: ['Khar Society 1', 'Khar Society 2'] },
  { area: 'Santacruz', societies: ['Santacruz Society 1', 'Santacruz Society 2'] },
  { area: 'Juhu', societies: ['Juhu Society 1', 'Juhu Society 2'] },
]

export default function VendorRegistration() {
  const [formData, setFormData] = useState<VendorRegistrationData>({
    name: '',
    mobile_no: '',
    services: '',
    areas: [],
    societies: [],
  })
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({
    morning: false,
    afternoon: false,
    evening: false,
    '24hours': false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof VendorRegistrationData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSlotToggle = (slotId: string) => {
    if (slotId === '24hours') {
      // If 24 hours is selected, unselect all other slots
      setSelectedSlots({
        morning: false,
        afternoon: false,
        evening: false,
        '24hours': !selectedSlots['24hours'],
      })
    } else {
      // If other slot is selected, unselect 24 hours
      setSelectedSlots(prev => ({
        ...prev,
        [slotId]: !prev[slotId],
        '24hours': false,
      }))
    }
  }

  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area],
      // Clear societies when areas change
      societies: []
    }))
  }

  const handleSocietyToggle = (society: string) => {
    setFormData(prev => ({
      ...prev,
      societies: prev.societies.includes(society)
        ? prev.societies.filter(s => s !== society)
        : [...prev.societies, society]
    }))
  }

  const handleAnyInSocietyToggle = () => {
    setFormData(prev => ({
      ...prev,
      societies: prev.societies.includes('Any in society')
        ? prev.societies.filter(s => s !== 'Any in society')
        : ['Any in society']
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // If 24 hours is selected, only send 24 hours slot
      // Otherwise, send all selected slots except 24 hours
      const selectedSlotIds = selectedSlots['24hours'] 
        ? ['24hours']
        : Object.keys(selectedSlots).filter(slotId => selectedSlots[slotId] && slotId !== '24hours')
      
      // For each selected area, create a registration entry
      const registrationPromises = formData.areas.map(async (area) => {
        return await insertVendorWithoutAuth({
          name: formData.name,
          mobile_no: formData.mobile_no,
          services: formData.services,
          area: area,
          societies: formData.societies,
        }, selectedSlotIds)
      })

      const results = await Promise.all(registrationPromises)
      const allSuccessful = results.every(result => result.success)
      const firstError = results.find(result => !result.success)?.error

      if (allSuccessful) {
        toast({
          title: 'Success',
          description: 'Vendor registration submitted successfully!',
        })

        // Reset form
        setFormData({
          name: '',
          mobile_no: '',
          services: '',
          areas: [],
          societies: [],
        })
        setSelectedSlots({
          morning: false,
          afternoon: false,
          evening: false,
          '24hours': false,
        })
      } else {
        toast({
          title: 'Error',
          description: firstError || 'Failed to submit registration',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit registration',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get all societies for selected areas
  const allSocietiesForSelectedAreas = formData.areas.flatMap(area => 
    SOCIETIES.find(s => s.area === area)?.societies || []
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendor Registration</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile_no">Mobile Number *</Label>
                <Input
                  id="mobile_no"
                  type="tel"
                  value={formData.mobile_no}
                  onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="services">Services Offered *</Label>
                <Input
                  id="services"
                  value={formData.services}
                  onChange={(e) => handleInputChange('services', e.target.value)}
                  placeholder="e.g., Domestic Help, Electrician, Plumber"
                  required
                />
              </div>
            </div>

            {/* Areas and Societies */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Service Areas</h2>
              
              <div>
                <Label>Select Areas *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AREAS.map(area => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.areas.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.areas.length > 0 && (
                <div>
                  <Label>Societies *</Label>
                  <div className="space-y-2 mt-2">
                    {/* Any in society option */}
                    <label className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.societies.includes('Any in society')}
                        onChange={handleAnyInSocietyToggle}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-blue-800">Any in society (Available for any society in selected areas)</span>
                    </label>
                    
                    {/* Individual societies */}
                    {!formData.societies.includes('Any in society') && (
                      <div className="grid grid-cols-2 gap-2">
                        {allSocietiesForSelectedAreas.map(society => (
                          <label key={society} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.societies.includes(society)}
                              onChange={() => handleSocietyToggle(society)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{society}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Available Time Slots *</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 24 Hours option */}
                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-white">
                  <input
                    type="checkbox"
                    id="24hours"
                    checked={selectedSlots['24hours']}
                    onChange={() => handleSlotToggle('24hours')}
                    className="w-5 h-5 accent-blue-600 mr-3"
                  />
                  <label htmlFor="24hours" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">24 Hours</div>
                    <div className="text-sm text-gray-500">Available round the clock</div>
                  </label>
                </div>
                
                {/* Regular time slots */}
                {PERMANENT_SLOTS.map(slot => (
                  <div key={slot.id} className="flex items-center p-4 border border-gray-200 rounded-lg bg-white">
                    <input
                      type="checkbox"
                      id={slot.id}
                      checked={selectedSlots[slot.id]}
                      onChange={() => handleSlotToggle(slot.id)}
                      className="w-5 h-5 accent-blue-600 mr-3"
                    />
                    <label htmlFor={slot.id} className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">{slot.label}</div>
                      <div className="text-sm text-gray-500">{slot.start} - {slot.end}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
} 