import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cocoa text-cream-50/85">
      {/* Brand crown — the Edelweiss flower, large and centered */}
      <div className="border-b border-cream-50/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-12 flex flex-col items-center text-center">
          <Image
            src="/images/edelweiss-logo.png"
            alt="Edelweiss Pastry Shop emblem"
            width={140}
            height={140}
            className="w-24 h-24 sm:w-28 sm:h-28 animate-floaty"
          />
          <div className="mt-5 font-display text-3xl sm:text-4xl tracking-wide text-cream-50">
            Edelweiss Pastry Shop
          </div>
          <div className="mt-3 text-[0.65rem] uppercase tracking-[0.34em] text-mustard">
            Swiss-inspired · Biddeford, Maine
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <p className="max-w-sm text-sm leading-relaxed text-cream-50/65">
            A Swiss-inspired bakery in downtown Biddeford, Maine. Hand-made
            daily, served with quiet hospitality.
          </p>
          <div className="mt-5 space-y-2.5">
            <a
              href="tel:+12077706945"
              className="inline-flex items-center gap-2 text-cream-50/85 hover:text-mustard text-sm tracking-[0.18em] uppercase"
            >
              <Phone size={14} />
              207 770-6945
            </a>
            <a
              href="mailto:info@edelweissconfections.com"
              className="flex items-center gap-2 text-cream-50/85 hover:text-mustard text-sm tracking-[0.06em] lowercase"
            >
              <Mail size={14} />
              info@edelweissconfections.com
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-[0.22em] text-mustard">
            Visit
          </div>
          <address className="mt-4 not-italic text-sm text-cream-50/75 leading-relaxed">
            <a
              href="https://maps.google.com/?q=5+Alfred+Street+%23103+Biddeford+Maine+04005"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mustard transition-colors"
            >
              5 Alfred Street #103
              <br />
              Biddeford, ME 04005
            </a>
            <br />
            <span className="text-cream-50/55">Tue – Sun · Closed Mondays</span>
          </address>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs uppercase tracking-[0.22em] text-mustard">
            Navigate
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/#shop" className="hover:text-cream-50">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/menu" className="hover:text-cream-50">
                Full menu
              </Link>
            </li>
            <li>
              <Link href="/chocolates" className="hover:text-cream-50">
                Chocolates
              </Link>
            </li>
            <li>
              <Link href="/surprise-bag" className="hover:text-cream-50">
                Surprise Bag
              </Link>
            </li>
            <li>
              <Link href="/#visit" className="hover:text-cream-50">
                Visit
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs uppercase tracking-[0.22em] text-mustard">
            Follow
          </div>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://www.instagram.com/edelweissmaine"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/20 hover:border-mustard hover:text-mustard transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/20 hover:border-mustard hover:text-mustard transition-colors"
            >
              <Facebook size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-50/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-50/55">
          <p>© {new Date().getFullYear()} Edelweiss Confections LLC · All Rights Reserved</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-cream-50">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-cream-50">
              Cookie Policy
            </Link>
            <p className="uppercase tracking-[0.22em] hidden sm:block">
              Crafted with Swiss patience.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
