import FlightScene from "./scene/FlightScene";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Hud } from "./components/Hud";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Research } from "./components/Research";

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
        {/* scroll runway until the remaining sections land */}
        <div className="h-[400dvh]" />
      </main>
    </>
  );
}
