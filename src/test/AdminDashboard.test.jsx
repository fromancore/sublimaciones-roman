import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AdminDashboard from '../components/AdminDashboard'

describe('AdminDashboard', () => {
  it.each([
    'luisa.roman@admin.sublimacionesroman.com',
    'david.poot@admin.sublimacionesroman.com',
    'cristina.canul@admin.sublimacionesroman.com',
  ])('permite entrar al panel al administrador autorizado %s', email => {
    render(<AdminDashboard currentRole="admin" currentUser={{ email, role: 'admin' }} />)

    expect(screen.getByText('Total de Ventas Acumuladas')).toBeInTheDocument()
  })

  it('bloquea a un usuario no autorizado aunque se le pase el rol admin', () => {
    render(
      <AdminDashboard
        currentRole="admin"
        currentUser={{
          email: 'intruso@ejemplo.com',
          role: 'admin',
        }}
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No tienes autorización para acceder al panel operativo.'
    )
    expect(screen.queryByText('Total de Ventas Acumuladas')).not.toBeInTheDocument()
  })
})
