import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { login } from '../authSlice'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface LoginForm { email: string; password: string }

export default function LoginPage() {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const loading   = useAppSelector((s) => s.auth.loading)
  const [role, setRole] = useState<'admin' | 'platform'>('admin')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: 'admin@dermis.clinic', password: 'demo1234' },
  })

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(login({ ...data, role }))
    if (login.fulfilled.match(result)) {
      navigate(role === 'platform' ? '/platform' : '/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto shadow-lg shadow-brand-200">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Dermis Platform</h1>
          <p className="text-gray-500 text-sm mt-1">Aesthetic clinic management & loyalty</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
          {/* Role switcher */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(['admin', 'platform'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === r ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {r === 'admin' ? 'Clinic Admin' : 'Platform Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@dermis.clinic"
              error={errors.email?.message}
              {...register('email', { required: 'Email required' })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password required' })}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <a href="#" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign in as {role === 'admin' ? 'Clinic Admin' : 'Platform Admin'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New clinic?{' '}
            <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-medium">Apply for access</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Demo credentials pre-filled · Click Sign in to explore
        </p>
      </div>
    </div>
  )
}
