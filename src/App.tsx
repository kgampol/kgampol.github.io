import FlightScene from "./scene/FlightScene";
import { Nav } from "./components/Nav";

export default function App() {
  return (
    <>
      <FlightScene />
      <Nav />
      <main id="top" className="relative">
        {Array.from({ length: 6 }, (_, i) => (
          <section key={i} className="grid min-h-dvh place-items-center">
            <h1 className="font-serif text-6xl">Kenneth Gampol {i}</h1>
          </section>
        ))}
      </main>
    </>
  );
}
