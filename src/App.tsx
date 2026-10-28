import FlightScene from "./scene/FlightScene";

export default function App() {
  return (
    <>
      <FlightScene />
      <main className="relative">
        {Array.from({ length: 6 }, (_, i) => (
          <section key={i} className="grid min-h-dvh place-items-center">
            <h1 className="font-serif text-6xl">Kenneth Gampol {i}</h1>
          </section>
        ))}
      </main>
    </>
  );
}
