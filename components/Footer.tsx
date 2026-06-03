import Link from "next/link";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";

export function Footer() {
  return (
    <footer className="bg-cocoa text-cream-50/85">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 text-cream-50">
            <EdelweissMark size={36} />
            <span className="font-display text-2xl tracking-wide">
              Edelweiss Pastry Shop
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-50/65">
            A Swiss-inspired bakery in Biddeford, Maine. Hand-made daily,
            served with quiet hospitality.
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
          <p className="uppercase tracking-[0.22em]">
            Crafted with Swiss patience.
          </p>
        </div>
      </div>
    </footer>
  );
}
