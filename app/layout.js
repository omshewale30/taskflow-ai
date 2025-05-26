import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskFlow AI',
  description: 'AI-powered meeting notes processor and task manager',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-dark text-text-primary min-h-screen`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#2C2F33',
                color: '#E1E1E1',
                border: '1px solid #3F4447',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}