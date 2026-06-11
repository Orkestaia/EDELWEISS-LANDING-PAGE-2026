import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SubPageHeader } from "@/components/SubPageHeader";

export const metadata: Metadata = {
  title: "Cookie Policy · Edelweiss Pastry Shop",
  description: "How Edelweiss Pastry Shop uses cookies on edelweisspastryshop.ch.",
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

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <SubPageHeader eyebrow="Legal" title="Cookie Policy" />
      <section className="mx-auto max-w-3xl px-5 sm:px-8 pb-28">
        <p className="text-sm text-cocoa/55">Last updated: June 11, 2026</p>

        <H2>1. Introduction</H2>
        <P>
          This Cookie Policy explains how Edelweiss Confections LLC
          (&quot;Edelweiss&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) uses cookies and similar technologies on{" "}
          <strong>edelweisspastryshop.ch</strong> (the &quot;Site&quot;). By
          using our Site, you agree to the use of cookies as described here.
          For more on how we handle personal information, see our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </P>

        <H2>2. What are cookies?</H2>
        <P>
          Cookies are small text files placed on your device when you visit a
          website. They help the site function correctly, remember your
          preferences, and — when you allow it — help us understand how
          visitors use the Site so we can improve it.
        </P>

        <H2>3. Cookies we use</H2>
        <P>
          When you first visit the Site, a cookie banner lets you{" "}
          <strong>Accept All</strong> or <strong>Reject Non-Essential</strong>{" "}
          cookies. Analytics and marketing cookies are only set if you choose
          &quot;Accept All&quot;.
        </P>

        <div className="mt-5 overflow-x-auto rounded-xl border border-cocoa/10">
          <table className="w-full min-w-[560px] text-sm text-left">
            <thead className="bg-cream-100 text-cocoa">
              <tr>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Cookies</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-cocoa/75">
              <tr className="border-t border-cocoa/10">
                <td className="px-4 py-3 align-top font-medium text-cocoa">
                  Essential
                </td>
                <td className="px-4 py-3 align-top">
                  <code>edelweiss_cart_v1</code>,{" "}
                  <code>edelweiss_cookie_consent</code>
                </td>
                <td className="px-4 py-3 align-top">
                  Remember items in your cart and your cookie preferences.
                  Always active — the Site cannot function without these.
                </td>
              </tr>
              <tr className="border-t border-cocoa/10">
                <td className="px-4 py-3 align-top font-medium text-cocoa">
                  Analytics
                </td>
                <td className="px-4 py-3 align-top">
                  <code>_ga</code>, <code>_ga_*</code>, <code>_gid</code>
                </td>
                <td className="px-4 py-3 align-top">
                  Set by Google Analytics to understand how visitors use the
                  Site (pages viewed, time on site, traffic source) so we can
                  improve it. Only set if you click &quot;Accept All&quot;.
                </td>
              </tr>
              <tr className="border-t border-cocoa/10">
                <td className="px-4 py-3 align-top font-medium text-cocoa">
                  Marketing
                </td>
                <td className="px-4 py-3 align-top">
                  <code>_fbp</code>, <code>fr</code>
                </td>
                <td className="px-4 py-3 align-top">
                  Set by Meta (Facebook/Instagram) Pixel to measure the
                  effectiveness of our ads and show relevant ads to people who
                  have visited our Site. Only set if you click &quot;Accept
                  All&quot;.
                </td>
              </tr>
              <tr className="border-t border-cocoa/10">
                <td className="px-4 py-3 align-top font-medium text-cocoa">
                  Payments
                </td>
                <td className="px-4 py-3 align-top">Clover cookies</td>
                <td className="px-4 py-3 align-top">
                  When you choose to pay online, you are securely redirected
                  to Clover&apos;s payment page. Clover may set its own
                  cookies to process your payment — these are governed by
                  Clover&apos;s own privacy policy, not ours.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <H2>4. Your choices</H2>
        <P>
          You can change your cookie preferences at any time by clearing your
          browser&apos;s cookies for this Site, which will show the cookie
          banner again on your next visit. Most browsers also let you block
          or delete cookies through their settings:
        </P>
        <ul className="mt-3 space-y-1.5 text-cocoa/75 leading-relaxed list-disc pl-5">
          <li>
            <strong>Chrome:</strong> Settings → Privacy and security → Cookies
            and other site data
          </li>
          <li>
            <strong>Safari:</strong> Settings → Privacy → Manage Website Data
          </li>
          <li>
            <strong>Firefox:</strong> Settings → Privacy &amp; Security →
            Cookies and Site Data
          </li>
          <li>
            <strong>Edge:</strong> Settings → Cookies and site permissions
          </li>
        </ul>
        <P>
          Please note that blocking essential cookies may affect how the Site
          functions, such as remembering items in your cart.
        </P>

        <H2>5. Changes to this policy</H2>
        <P>
          We may update this Cookie Policy from time to time to reflect
          changes in the cookies we use or for legal reasons. We encourage
          you to review this page periodically.
        </P>

        <H2>6. Contact us</H2>
        <P>
          If you have questions about this Cookie Policy, please contact us:
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
