"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-12 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">

                    {/* Brand & Info */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E31818]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V12L18.5 7H5.5L4 12V16Z" fill="white" />
                                    <circle cx="7.5" cy="14.5" r="1.5" fill="#E31818" />
                                    <circle cx="16.5" cy="14.5" r="1.5" fill="#E31818" />
                                    <path d="M6 10H18" stroke="#E31818" strokeWidth="2" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-[#E31818]">
                                Glotomotif
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500 mb-6">
                            Platform terpercaya untuk jual, beli, dan tukar tambah mobil bekas bergaransi dengan harga transparan dan proses yang super mudah.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#E31818] hover:text-white">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#E31818] hover:text-white">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#E31818] hover:text-white">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#E31818] hover:text-white">
                                <Youtube className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Perusahaan</h3>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li><Link href="/tentang-kami" className="hover:text-[#E31818] transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/karir" className="hover:text-[#E31818] transition-colors">Karir</Link></li>
                            <li><Link href="/artikel" className="hover:text-[#E31818] transition-colors">Artikel & Berita</Link></li>
                            <li><Link href="/hubungi-kami" className="hover:text-[#E31818] transition-colors">Hubungi Kami</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Layanan</h3>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li><Link href="/beli-mobil" className="hover:text-[#E31818] transition-colors">Beli Mobil Bekas</Link></li>
                            <li><Link href="/jual-mobil" className="hover:text-[#E31818] transition-colors">Jual Mobil</Link></li>
                            <li><Link href="/tukar-tambah" className="hover:text-[#E31818] transition-colors">Tukar Tambah</Link></li>
                            <li><Link href="/inspeksi" className="hover:text-[#E31818] transition-colors">Inspeksi Mobil</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Kontak</h3>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 shrink-0 text-gray-400" />
                                <span>Jl. Jendral Sudirman No. 123, Jakarta Selatan, 12190, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-gray-400" />
                                <span>0800-1-999-999 (Toll Free)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-gray-400" />
                                <span>support@glotomotif.id</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-100 pt-8 sm:flex-row text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Glotomotif. All rights reserved.</p>
                    <div className="mt-4 flex gap-6 sm:mt-0">
                        <Link href="/syarat-ketentuan" className="hover:text-gray-900 transition-colors">Syarat & Ketentuan</Link>
                        <Link href="/kebijakan-privasi" className="hover:text-gray-900 transition-colors">Kebijakan Privasi</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
