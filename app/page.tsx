import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Showcase } from "@/components/Showcase";
import { Discover } from "@/components/Discover";
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
      <About />
      <Discover />
      <OrderingGuide />
      <Visit />
      <Newsletter />
      <Footer />
      <NewsletterModal />
    </main>
  );
}
