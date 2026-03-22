import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Interests from './sections/Interests'
import About from './sections/About'
import Projects from './sections/Projects'
import TechArsenal from './sections/TechArsenal'
import WhatIBring from './sections/WhatIBring'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Interests />
        <About />
        <Projects />
        <TechArsenal />
        <WhatIBring />
        <Contact />
      </main>
    </div>
  )
}
