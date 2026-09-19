import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import HowItWorks from "@/components/common/HowItWorks";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}
