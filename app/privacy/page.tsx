import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SubPageHeader } from "@/components/SubPageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy · Edelweiss Pastry Shop",
  description: "How Edelweiss Pastry Shop collects and uses information on edelweisspastryshop.ch.",
  robots: { index: false, follow: true },
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 font-display text-2xl text-cocoa first:mt-0">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-cocoa/75 leading-relaxed">{children}</p>;
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <SubPageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl px-5 sm:px-8 pb-28">
        <p className="text-sm text-cocoa/55">Last updated: June 11, 2026</p>

        <H2>1. Introduction</H2>
        <P>
          Edelweiss Confections LLC (&quot;Edelweiss&quot;, &quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) operates{" "}
          <strong>edelweisspastryshop.ch</strong> (the &quot;Site&quot;). This
          Privacy Policy explains what information we collect when you visit
          the Site or place an order for in-store pick-up, how we use it, and
          the choices you have. For details on cookies specifically, see our{" "}
          <a href="/cookies" className="underline underline-offset-2">
            Cookie Policy
          </a>
          .
        </P>

        <H2>2. Information we collect</H2>
        <P>When you place an order for pick-up, we collect:</P>
        <ul className="mt-3 space-y-1.5 text-cocoa/75 leading-relaxed list-disc pl-5">
          <li>Your name, email address, and phone number</li>
          <li>Your order details and chosen pick-up date and time</li>
          <li>Any notes you add for the bakery (e.g. allergy information)</li>
        </ul>
        <P>
          <strong>We never see or store your card details.</strong> When you
          choose to pay online, you are securely redirected to our payment
          processor, Clover, to enter your card information directly. Card
          numbers, expiry dates and security codes are handled entirely by
          Clover and never touch our servers.
        </P>
        <P>
          If you accept analytics and marketing cookies, Google Analytics and
          Meta Pixel may also collect information about how you browse the
          Site (pages viewed, device type, approximate location, referring
          site) — see our{" "}
          <a href="/cookies" className="underline underline-offset-2">
            Cookie Policy
          </a>{" "}
          for details and how to opt out.
        </P>

        <H2>3. How we use your information</H2>
        <ul className="mt-3 space-y-1.5 text-cocoa/75 leading-relaxed list-disc pl-5">
          <li>To prepare and fulfil your order for pick-up</li>
          <li>To send you an order confirmation and updates about your order</li>
          <li>To respond to questions or special requests you send us</li>
          <li>
            To understand how visitors use the Site and improve our menu,
            content and online ordering experience
          </li>
          <li>
            To measure the performance of our advertising (only if you accept
            marketing cookies)
          </li>
        </ul>
        <P>We do not sell your personal information to third parties.</P>

        <H2>4. Who we share information with</H2>
        <P>We share information only as needed to run the Site and our bakery:</P>
        <ul className="mt-3 space-y-1.5 text-cocoa/75 leading-relaxed list-disc pl-5">
          <li>
            <strong>Clover</strong> — our point-of-sale and payment processor.
            Order details and payment information are sent to Clover to
            process your order and charge your card.
          </li>
          <li>
            <strong>Google Analytics</strong> — website analytics, only if you
            accept analytics cookies.
          </li>
          <li>
            <strong>Meta (Facebook/Instagram) Pixel</strong> — advertising
            measurement, only if you accept marketing cookies.
          </li>
          <li>
            <strong>Vercel</strong> — our website hosting provider, which
            processes standard web traffic to deliver the Site to your
            browser.
          </li>
        </ul>

        <H2>5. Data retention</H2>
        <P>
          Order information is retained in our Clover account for as long as
          needed for accounting, tax, and customer service purposes. Cart
          information stored in your browser stays on your device until you
          clear it or place an order.
        </P>

        <H2>6. Your rights</H2>
        <P>
          You can ask us what personal information we hold about you, request
          a correction, or ask us to delete it, by contacting us using the
          details below. Some information (e.g. completed transactions) may
          need to be retained for legal or accounting reasons.
        </P>

        <H2>7. Children&apos;s privacy</H2>
        <P>
          The Site is not directed at children under 13, and we do not
          knowingly collect personal information from children.
        </P>

        <H2>8. Changes to this policy</H2>
        <P>
          We may update this Privacy Policy from time to time. Changes will
          be posted on this page with an updated &quot;Last updated&quot;
          date.
        </P>

        <H2>9. Contact us</H2>
        <P>
          If you have questions about this Privacy Policy or your
          information, please contact us:
        </P>
        <ul className="mt-3 space-y-1.5 text-cocoa/75 leading-relaxed">
          <li>Edelweiss Confections LLC</li>
          <li>5 Alfred Street #103, Biddeford, Maine 04005</li>
          <li>
            <a
              href="mailto:info@edelweissconfections.com"
              className="underline underline-offset-2"
            >
              info@edelweissconfections.com
            </a>
          </li>
          <li>
            <a href="tel:+12077706945" className="underline underline-offset-2">
              +1 (207) 770-6945
            </a>
          </li>
        </ul>
      </section>
      <Footer />
    </main>
  );
}
