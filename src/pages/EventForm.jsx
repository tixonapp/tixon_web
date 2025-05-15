import React, { useState, useRef } from 'react'
import { supabase } from '../supabase/supabaseClient'
import StepIndicator from '../components/Event_form/StepIndicator'
import Step1CreatorInfo from '../components/Event_form/Step1CreatorInfo'
import Step2EventDetails from '../components/Event_form/Step2EventDetails'
import Step3Organizers from '../components/Event_form/Step3Organizers'
import Step4Registration from '../components/Event_form/Step4Registration'
import Step5Review from '../components/Event_form/Step5Review'
import NavButtons from '../components/Event_form/NavButtons'
import './EventForm.css'

export default function EventForm() {
  const [step, setStep] = useState(1)
  const formRef = useRef(null)
  // In EventForm.jsx, update the formData state to include location_data
const [formData, setFormData] = useState({
  creator_name: '',
  phone: '',
  personal_email: '',
  professional_email: '',
  event_name: '',
  mode: 'In-person',
  start_datetime: '',
  end_datetime: '',
  poster_url: '',
  location: '',
  // location_data: '', // Add this field to store detailed location data
  description: '',
  category: '',
  agenda: '',
  organizers: [{ name: '', personal_email: '', college_email: '', phone: '' }],
  event_type: 'Free',
  total_tickets: '',
  price: 0,
});


  const next = () => {
    if (formRef.current && !formRef.current.reportValidity()) return
    setStep(s => Math.min(s + 1, 5))
  }

  const prev = () => setStep(s => Math.max(s - 1, 1))

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => {
      const newFormData = { ...fd, [name]: value }
      if (name === 'event_type') {
        newFormData.price = value === 'Free' ? 0 : newFormData.price
      }
      return newFormData
    })
  }

  const handleOrganizerChange = (idx, e) => {
    const { name, value } = e.target
    const newOrgs = [...formData.organizers]
    newOrgs[idx][name] = value
    setFormData(fd => ({ ...fd, organizers: newOrgs }))
  }

  const addOrganizer = () => {
    setFormData(fd => ({
      ...fd,
      organizers: [...fd.organizers, { name: '', personal_email: '', college_email: '', phone: '' }],
    }))
  }

  const handleSubmit = async () => {
    try {
      const { data: creator, error: err1 } = await supabase
        .from('event_creators')
        .insert({
          name: formData.creator_name,
          phone: formData.phone,
          personal_email: formData.personal_email,
          professional_email: formData.professional_email,
        })
        .select()
        .single()

      if (err1 || !creator) throw err1 || new Error('Failed to create creator')

      const { data: event, error: err2 } = await supabase
        .from('events')
        .insert({
          creator_id: creator.id,
          name: formData.event_name,
          mode: formData.mode,
          start_datetime: formData.start_datetime,
          end_datetime: formData.end_datetime,
          poster_url: formData.poster_url,
          location: formData.location,
          location_data: formData.location_data,
          description: formData.description,
          category: formData.category,
          agenda: formData.agenda,
        })
        .select()
        .single()

      if (err2 || !event) throw err2 || new Error('Failed to create event')

      const organizersErrors = (
        await Promise.all(
          formData.organizers.map(async org => {
            const { error } = await supabase.from('event_organizers').insert({
              event_id: event.id,
              name: org.name,
              personal_email: org.personal_email,
              college_email: org.college_email,
              phone: org.phone,
            })
            return error
          })
        )
      ).filter(Boolean)
      if (organizersErrors.length > 0) throw organizersErrors[0]

      const { error: err4 } = await supabase.from('event_registrations').insert({
        event_id: event.id,
        event_type: formData.event_type,
        total_tickets: parseInt(formData.total_tickets, 10) || 0,
        price: parseInt(formData.price, 10) || 0,
        ticket_types: formData.ticketTypes
      })

      if (err4) throw err4

      alert('Event created successfully!')
    } catch (error) {
      console.error('Submission error:', error)
      alert(`Error creating event: ${error.message}`)
    }
  }

  return (
    <div className="form-container">
      <StepIndicator step={step} />
      {step === 1 && (
        <Step1CreatorInfo formRef={formRef} formData={formData} handleChange={handleChange} />
      )}
      {step === 2 && (
        <Step2EventDetails formRef={formRef} formData={formData} handleChange={handleChange} />
      )}
      {step === 3 && (
        <Step3Organizers
          formRef={formRef}
          organizers={formData.organizers}
          handleOrganizerChange={handleOrganizerChange}
          addOrganizer={addOrganizer}
        />
      )}
      {step === 4 && (
        <Step4Registration
          formRef={formRef}
          formData={formData}
          handleChange={handleChange}
        />
      )}
      {step === 5 && (
        <Step5Review formData={formData} />
      )}
      <NavButtons step={step} prev={prev} next={next} handleSubmit={handleSubmit} />
    </div>
  )
}
