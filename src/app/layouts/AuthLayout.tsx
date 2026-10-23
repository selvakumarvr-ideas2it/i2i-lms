import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="brand-gradient flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <span className="text-2xl font-extrabold text-white">
          Ideas<span className="text-brand-400">2</span>IT
        </span>
        <p className="mt-1 text-sm text-slate-300">BI Visualization Accelerator</p>
      </div>
      <Outlet />
    </div>
  )
}
