import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Carbon Footprint Tracker",
  description: "Track and reduce your carbon footprint with AI insights"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
