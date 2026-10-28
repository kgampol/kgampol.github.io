import FlightScene from "./scene/FlightScene";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Hud } from "./components/Hud";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Research } from "./components/Research";
import { Education } from "./components/Education";
import { Skills } from "./components/Skills";
import { Leadership } from "./components/Leadership";
import { Contact } from "./components/Contact";

export default function App() {
  return (
    <>
      <FlightScene />
      <Nav />
      <Hud />
      <main id="top" className="relative">
        <Hero />
        <About />
        <Experience />
        <Research />
        <Education />
        <Skills />
        <Leadership />
        <Contact />
      </main>
    </>
  );
}
