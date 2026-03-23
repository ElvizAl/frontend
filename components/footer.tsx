"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-auto">
            {/* Main Footer — Biru */}
            <div className="bg-[#3D3DE8] px-6 md:px-12 lg:px-24 py-12 rounded-t-[28px]">
                <div className="mx-auto max-w-[1200px]">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

                        {/* Brand */}
                        <div className="md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V12L18.5 7H5.5L4 12V16Z" fill="#3D3DE8" />
                                        <circle cx="7.5" cy="14.5" r="1.5" fill="white" />
                                        <circle cx="16.5" cy="14.5" r="1.5" fill="white" />
                                        <path d="M6 10H18" stroke="white" strokeWidth="2" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">Glotomotif</span>
                            </Link>
                            <p className="text-sm leading-relaxed text-white/70">
                                Glotomotif adalah platform website jual beli mobil bekas terpercaya.
                            </p>
                            <p className="mt-6 text-sm font-bold text-white">Powered by</p>
                        </div>

                        {/* Spacer */}
                        <div />

                        {/* Telusuri */}
                        <div>
                            <h3 className="mb-5 text-sm font-bold text-white">Telusuri</h3>
                            <ul className="space-y-3 text-sm text-white/70">
                                <li>
                                    <Link href="/beli-mobil" className="hover:text-white transition-colors">Beli Mobil</Link>
                                </li>
                                <li>
                                    <Link href="/jual-mobil" className="hover:text-white transition-colors">Jual Mobil</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Bantuan + Kontak */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="mb-5 text-sm font-bold text-white">Bantuan</h3>
                                <ul className="space-y-3 text-sm text-white/70">
                                    <li>
                                        <Link href="/panduan" className="hover:text-white transition-colors">Panduan</Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-5 text-sm font-bold text-white">Kontak Kami</h3>
                                <ul className="space-y-3 text-sm text-white/70">
                                    <li className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 shrink-0" />
                                        <span>085156714674</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        <span>021-12345678</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-[#3D3DE8] border-t border-white/10 px-6 py-4">
                <p className="text-center text-sm text-white/70">
                    @{new Date().getFullYear()} www.glotomotif.my.id - All Rights Reserved
                </p>
            </div>
        </footer>
    );
}
