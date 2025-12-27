import Footer from '@/components/footer'
import Header from '@/components/header'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex h-full w-full flex-col p-8">
      <Header />

      {/* Main Content */}
      <div className="flex grow flex-col">{children}</div>

      <Footer />
    </main>
  )
}
