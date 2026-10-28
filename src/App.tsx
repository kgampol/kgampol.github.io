import { lazy, Suspense } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Education } from "./components/Education";
import { Skills } from "./components/Skills";
import { Leadership } from "./components/Leadership";
import { Contact } from "./components/Contact";

// three.js is most of the bundle, so the scene loads after the copy paints
const FlightScene = lazy(() => import("./scene/FlightScene"));

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <FlightScene />
      </Suspense>
      <Nav />
      <main id="top" className="relative">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Education />
        <Skills />
        <Leadership />
        <Contact />
      </main>
    </>
  );
}
