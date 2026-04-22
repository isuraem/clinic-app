import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CheckCircleIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { signupStep1, signupStep2 } from '../authSlice'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const TIMEZONES = ['Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney']
const COUNTRIES  = ['United Kingdom', 'United States', 'UAE', 'Singapore', 'Australia', 'Canada', 'Ireland']

interface Step1Form { email: string; name: string; password: string; confirmPassword: string }
interface Step2Form { clinicName: string; phone: string; timezone: string; country: string; city: string }

export default function SignupWizard() {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const { signupStep, loading, clinic } = useAppSelector((s) => s.auth)

  const form1 = useForm<Step1Form>()
  const form2 = useForm<Step2Form>({ defaultValues: { timezone: 'Europe/London', country: 'United Kingdom' } })

  const onStep1 = async (data: Step1Form) => {
    if (data.password !== data.confirmPassword) {
      form1.setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }
    await dispatch(signupStep1({ email: data.email, password: data.password, name: data.name }))
  }

  const onStep2 = async (data: Step2Form) => {
    const result = await dispatch(signupStep2(data))
    if (signupStep2.fulfilled.match(result)) {
      // stays on page to show ManualReview state
    }
  }

  // Review pending screen
  if (clinic?.reviewStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Application Under Review</h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Our team is reviewing <strong>{clinic.name}</strong>'s application. This typically takes <strong>1–3 business days</strong>.
            We'll email you at <strong>{clinic.businessEmail}</strong> once approved.
          </p>

          <div className="mt-6 space-y-3 text-left bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Application submitted</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              </div>
              <span className="text-sm text-gray-700">Identity & business verification</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              <span className="text-sm text-gray-400">Account activation</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button variant="outline" fullWidth onClick={() => navigate('/login')}>Back to Login</Button>
            <p className="text-xs text-gray-400">Questions? Email support@dermis.clinic</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto shadow-lg shadow-brand-200">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Apply for Access</h1>
          <p className="text-gray-500 text-sm mt-1">Step {signupStep} of 2</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= signupStep ? 'bg-brand-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
          {signupStep === 1 ? (
            <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
                <p className="text-sm text-gray-500">Use your business email to register.</p>
              </div>
              <Input label="Full Name"      placeholder="Dr. Jane Smith"       error={form1.formState.errors.name?.message}            {...form1.register('name',            { required: 'Name required' })} />
              <Input label="Business Email" type="email" placeholder="jane@yourclinic.com" error={form1.formState.errors.email?.message}  {...form1.register('email',           { required: 'Email required' })} />
              <Input label="Password"       type="password" placeholder="Min. 8 characters" error={form1.formState.errors.password?.message} {...form1.register('password',        { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} />
              <Input label="Confirm Password" type="password" placeholder="Re-enter password" error={form1.formState.errors.confirmPassword?.message} {...form1.register('confirmPassword', { required: 'Required' })} />
              <Button type="submit" fullWidth size="lg" loading={loading}>Continue</Button>
            </form>
          ) : (
            <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Clinic Information</h2>
                <p className="text-sm text-gray-500">Tell us about your clinic.</p>
              </div>
              <Input label="Clinic Name" placeholder="Dermis Aesthetic Clinic" error={form2.formState.errors.clinicName?.message} {...form2.register('clinicName', { required: 'Clinic name required' })} />
              <Input label="Phone Number" placeholder="+44 20 1234 5678" error={form2.formState.errors.phone?.message} {...form2.register('phone', { required: 'Phone required' })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                <select className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400" {...form2.register('timezone')}>
                  {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                <select className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400" {...form2.register('country')}>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Input label="City" placeholder="London" error={form2.formState.errors.city?.message} {...form2.register('city', { required: 'City required' })} />
              <Button type="submit" fullWidth size="lg" loading={loading}>Submit Application</Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
