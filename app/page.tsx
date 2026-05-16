import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Showcase } from "@/components/Showcase";
import { OrderingGuide } from "@/components/OrderingGuide";
import { Visit } from "@/components/Visit";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <Hero />
      <Showcase />
      <About />
      <OrderingGuide />
      <Visit />
      <Newsletter />
      <Footer />
    </main>
  );
}
