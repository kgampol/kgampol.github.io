import FlightScene from "./scene/FlightScene";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";

export default function App() {
  return (
    <>
      <FlightScene />
      <Nav />
      <main id="top" className="relative">
        <Hero />
        {/* scroll runway until the remaining sections land */}
        <div className="h-[400dvh]" />
      </main>
    </>
  );
}
