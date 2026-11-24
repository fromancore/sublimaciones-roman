import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AdminDashboard from '../components/AdminDashboard'

describe('AdminDashboard', () => {
  it('bloquea a un usuario no autorizado aunque se le pase el rol admin', () => {
    render(
      <AdminDashboard
        currentRole="admin"
        currentUser={{
          email: 'intruso@ejemplo.com',
          emailVerified: true,
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
