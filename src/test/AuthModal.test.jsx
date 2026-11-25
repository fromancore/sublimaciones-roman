import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AuthModal from '../components/AuthModal'

const iniciarSesion = async correo => {
  const onLoginExitoso = vi.fn()
  render(<AuthModal isOpen onClose={vi.fn()} onLoginExitoso={onLoginExitoso} />)

  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
  fireEvent.change(screen.getByPlaceholderText('ejemplo@correo.com'), {
    target: { value: correo },
  })
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
    target: { value: 'clave-de-prueba' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Acceder al Portal' }))

  expect(await screen.findByText('¡Sesión iniciada con éxito!')).toBeInTheDocument()

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 1050))
  })

  await waitFor(() => expect(onLoginExitoso).toHaveBeenCalledOnce())
  return onLoginExitoso.mock.calls[0][0]
}

describe('AuthModal', () => {
  it.each([
    'luisa.roman@admin.sublimacionesroman.com',
    'david.poot@admin.sublimacionesroman.com',
    'cristina.canul@admin.sublimacionesroman.com',
  ])('asigna el rol admin al correo autorizado %s', async correo => {
    const usuario = await iniciarSesion(correo)

    expect(usuario).toEqual(expect.objectContaining({ email: correo, role: 'admin' }))
  })

  it.each(['admin@ejemplo.com', 'admin@sublimacionesroman.com'])(
    'no asigna rol admin al correo no autorizado %s',
    async correo => {
      const usuario = await iniciarSesion(correo)

      expect(usuario).toEqual(expect.objectContaining({ email: correo, role: 'cliente' }))
    }
  )

  it('conserva los datos de registro y determina el rol por el correo permitido', async () => {
    const onLoginExitoso = vi.fn()
    render(<AuthModal isOpen onClose={vi.fn()} onLoginExitoso={onLoginExitoso} />)

    fireEvent.change(screen.getByPlaceholderText('Ej. Carlos Mendiburu'), {
      target: { value: 'Luisa Román' },
    })
    fireEvent.change(screen.getByPlaceholderText('ejemplo@correo.com'), {
      target: { value: 'luisa.roman@admin.sublimacionesroman.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('9371234567'), {
      target: { value: '9991234567' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'clave-segura-123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Crear Mi Cuenta' }))

    expect(
      await screen.findByText('¡Cuenta de demostración creada exitosamente!')
    ).toBeInTheDocument()

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1250))
    })

    expect(onLoginExitoso).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Luisa Román',
        email: 'luisa.roman@admin.sublimacionesroman.com',
        telefono: '9991234567',
        role: 'admin',
      })
    )
  })
})
