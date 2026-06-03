import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AlpineHeritage } from "@/components/AlpineHeritage";
import { About } from "@/components/About";
import { Showcase } from "@/components/Showcase";
import { Discover } from "@/components/Discover";
import { Reviews } from "@/components/Reviews";
import { OrderingGuide } from "@/components/OrderingGuide";
import { Visit } from "@/components/Visit";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { NewsletterModal } from "@/components/NewsletterModal";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <Hero />
      <Showcase />
      <AlpineHeritage />
      <About />
      <Discover />
      <Reviews />
      <OrderingGuide />
      <Visit />
      <Newsletter />
      <Footer />
      <NewsletterModal />
    </main>
  );
}
