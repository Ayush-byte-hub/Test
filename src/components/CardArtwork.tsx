import React, { useState, useEffect } from 'react';
import { GiftCard, QualityMode } from '../types';

interface CardArtworkProps {
  card: GiftCard;
  className?: string;
}

export const CardArtwork: React.FC<CardArtworkProps> = ({
  card,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [card.id, card.imageUrl]);

  // Always use the photo (enhanced) with 720p/1080p contrast, sharpening & specular glass
  if (card.imageUrl && !imageError) {
    return (
      <div className={`relative w-full h-full overflow-hidden rounded-lg bg-slate-900 ${className}`}>
        {/* Specular plastic gloss gradient reflection */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-white/12 via-transparent to-black/15 pointer-events-none" />
        <img
          src={card.imageUrl}
          alt={`${card.name} Gift Card`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          style={{
            imageRendering: '-webkit-optimize-contrast',
            filter: 'contrast(1.08) brightness(1.02) saturate(1.1)',
          }}
          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-200 group-hover:scale-[1.03]"
        />
        {/* Subpixel sharpening outline */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg pointer-events-none z-10" />
      </div>
    );
  }

  // Fallback vector rendering if photo is missing or fails to load:

  // Render authentic real-looking gift card artwork matching the exact video frames
  switch (card.brandLogoType) {
    case 'roblox':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#0c0d10] flex flex-col justify-end p-2 ${className}`}>
          {/* Authentic Roblox Gift Card Art with 3 Avatars */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/90 to-zinc-950 flex items-center justify-center overflow-hidden">
            {/* Cinematic light ray */}
            <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative w-full h-full flex items-end justify-center gap-1.5 pb-7 px-2">
              {/* Left Avatar: Captain Boing / Pirate */}
              <div className="w-12 h-20 relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-sm bg-[#d49b6a] relative border border-black/60 shadow-sm">
                  {/* Pirate Hat */}
                  <div className="absolute -top-3 -left-1 w-10 h-4 bg-stone-900 rounded-t-lg border-b-2 border-yellow-500" />
                  <div className="absolute top-2 left-1.5 w-1.5 h-1.5 bg-black rounded-full" />
                  <div className="absolute top-2 right-1.5 w-2 h-2 bg-stone-900 rounded-full" />
                  <div className="absolute bottom-1 left-2 w-4 h-1 bg-stone-900 rounded-xs" />
                </div>
                {/* Blue Pirate Coat & Belt */}
                <div className="w-11 h-11 bg-blue-900 rounded-sm mt-0.5 border border-black/40 flex flex-col items-center">
                  <div className="w-full h-2 bg-amber-500 mt-4 border-y border-black" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-xs -mt-2.5 border border-black" />
                </div>
              </div>

              {/* Center Avatar: Iconic Fedora Hero in Red Trenchcoat */}
              <div className="w-14 h-24 relative z-10 flex flex-col items-center">
                {/* Fedora Hat */}
                <div className="w-12 h-3 bg-stone-900 rounded-sm shadow-md" />
                <div className="w-10 h-3 bg-stone-800 -mt-0.5 rounded-t-sm" />
                {/* Classic Roblox Smiling Yellow Face */}
                <div className="w-9 h-8 rounded-sm bg-[#ffcc00] relative border border-stone-800 shadow-sm flex flex-col items-center justify-center">
                  <div className="flex gap-2.5 mb-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                  <div className="w-4 h-2 border-b-2 border-black rounded-b-full" />
                </div>
                {/* Red Coat with Gold Lapels */}
                <div className="w-13 h-13 bg-[#c41e1e] rounded-sm mt-0.5 border border-stone-900 shadow-md flex flex-col items-center">
                  <div className="w-4 h-full bg-stone-900 border-x border-yellow-400/80" />
                </div>
              </div>

              {/* Right Avatar: Futuristic Cyber Warrior / Neon Ninja */}
              <div className="w-12 h-20 relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-sm bg-stone-900 relative border border-cyan-400 shadow-sm">
                  {/* Neon Cyan Visor */}
                  <div className="w-6 h-2 bg-cyan-400 mx-auto mt-2 rounded-xs shadow-[0_0_8px_#00ffff]" />
                </div>
                <div className="w-11 h-11 bg-stone-800 rounded-sm mt-0.5 border border-cyan-500/50 flex flex-col items-center">
                  <div className="w-7 h-7 bg-cyan-900/60 rounded-xs mt-1 border border-cyan-400/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Authentic ROBLOX Wordmark Banner */}
          <div className="relative z-10 bg-black/90 backdrop-blur-xs py-1 px-2.5 rounded-md flex flex-col items-center justify-center border border-white/10 shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-base tracking-widest font-sans drop-shadow-sm">ROBLOX</span>
              <div className="w-3.5 h-3.5 bg-[#e2231a] rotate-12 inline-block border-2 border-white/80 shadow-xs" />
            </div>
            <span className="text-[7.5px] text-zinc-300 font-semibold tracking-wider uppercase -mt-0.5">
              Powering Imagination
            </span>
          </div>
        </div>
      );

    case 'minecraft':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#274824] flex flex-col justify-end p-2 ${className}`}>
          {/* Minecraft Pixel Grassy Field with Creeper & Steve */}
          <div className="absolute inset-0 bg-[#3a7536] flex items-center justify-between px-3">
            {/* Dirt block texture in background */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

            {/* Green Creeper on Left */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-11 h-11 bg-[#47a838] border-2 border-black/70 p-1 grid grid-cols-4 grid-rows-4 gap-0.5 shadow-md">
                <div className="bg-[#24631c] col-span-1" />
                <div className="bg-black col-span-1 row-span-2 col-start-2 row-start-1" />
                <div className="bg-black col-span-1 row-span-2 col-start-4 row-start-1" />
                <div className="bg-black col-span-2 row-span-2 col-start-2 row-start-3" />
                <div className="bg-[#59ca48] col-span-1" />
              </div>
              <div className="w-10 h-7 bg-[#388d2d] border border-black/60 mt-0.5" />
            </div>

            {/* Steve with Armor on Right */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-[#b98462] border border-black/60 relative">
                {/* Brown hair */}
                <div className="w-full h-3 bg-[#422917]" />
                {/* Purple/white pixel eyes */}
                <div className="flex justify-between px-1.5 mt-1">
                  <div className="w-1.5 h-1 bg-white border-r border-indigo-900" />
                  <div className="w-1.5 h-1 bg-white border-r border-indigo-900" />
                </div>
                {/* Nose/mouth */}
                <div className="w-2.5 h-1 bg-[#6c391d] mx-auto mt-1" />
              </div>
              {/* Cyan Shirt */}
              <div className="w-11 h-8 bg-[#00a3a8] border border-black/50" />
            </div>
          </div>

          {/* 3D Stone Block MINECRAFT Logo */}
          <div className="relative z-20 bg-stone-900/90 py-1 px-3 rounded border border-stone-500 shadow-xl text-center">
            <span className="font-black text-stone-200 text-sm tracking-widest font-mono drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
              MINECRAFT
            </span>
          </div>
        </div>
      );

    case 'playstation':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-[#003791] via-[#002466] to-[#001033] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          {/* PlayStation geometric watermark icons */}
          <div className="absolute inset-0 opacity-15 flex flex-wrap gap-4 items-center justify-center p-2 pointer-events-none">
            <span className="text-yellow-400 text-xl font-bold">▲</span>
            <span className="text-red-500 text-xl font-bold">●</span>
            <span className="text-sky-400 text-xl font-bold">✖</span>
            <span className="text-pink-400 text-xl font-bold">■</span>
          </div>

          {/* Glowing 3D Golden Plus Emblem */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e6a100] via-[#ffd54f] to-[#ffb300] flex items-center justify-center shadow-[0_4px_16px_rgba(255,183,0,0.5)] border-2 border-amber-200">
              <span className="text-[#002466] font-black text-3xl leading-none select-none drop-shadow-xs">+</span>
            </div>
            <span className="mt-1 text-xs font-black text-amber-300 tracking-widest drop-shadow-sm">PLUS</span>
          </div>
        </div>
      );

    case 'pubg':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-stone-950 flex flex-col justify-between p-2 ${className}`}>
          {/* Desert Battlefield with Soldiers */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-amber-950/70 to-stone-900 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-transparent to-transparent" />
            <div className="text-amber-500/20 text-3xl font-black italic tracking-tighter uppercase select-none">
              PUBG
            </div>
          </div>

          {/* Top Right "UC PURCHASE" */}
          <div className="relative z-10 flex justify-end">
            <span className="text-[8px] bg-black/80 text-amber-400 font-black px-1.5 py-0.5 rounded border border-amber-500/60 uppercase">
              UC Purchase
            </span>
          </div>

          {/* Yellow PUBG MOBILE Banner */}
          <div className="relative z-10 bg-black/90 py-1 px-2 rounded border border-amber-500/70 flex items-center justify-between shadow-lg">
            <span className="text-[11px] font-black text-amber-400 tracking-wider">PUBG MOBILE</span>
            <span className="text-[9px] bg-amber-500 text-black font-black px-1.5 rounded">6000 UC</span>
          </div>
        </div>
      );

    case 'fortnite':
    case 'fortnite-13k':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-[#1a0933] via-[#2d0e57] to-[#0c0317] flex flex-col justify-end p-2 ${className}`}>
          {/* Stacks of Silver V-Bucks Coins */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Center V-Bucks Coin */}
              <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#00d2ff] via-[#e0f7fa] to-[#0091ea] border-2 border-white flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.6)]">
                <span className="text-[#0c0317] font-black text-2xl italic">V</span>
              </div>
              {/* Left Coin */}
              <div className="absolute -left-4 -bottom-1 w-10 h-10 rounded-full bg-gradient-to-tr from-[#0091ea] to-[#80d8ff] border-2 border-white/80 flex items-center justify-center opacity-90 shadow-md">
                <span className="text-[#0c0317] font-black text-base italic">V</span>
              </div>
              {/* Right Coin */}
              <div className="absolute -right-4 -bottom-1 w-10 h-10 rounded-full bg-gradient-to-tr from-[#0091ea] to-[#80d8ff] border-2 border-white/80 flex items-center justify-center opacity-90 shadow-md">
                <span className="text-[#0c0317] font-black text-base italic">V</span>
              </div>
            </div>
          </div>

          {/* FORTNITE Brand Banner */}
          <div className="relative z-10 bg-[#0c0317]/90 py-1 px-2 rounded border border-cyan-400/50 flex items-center justify-between">
            <span className="font-black text-white text-xs tracking-wider font-sans">FORTNITE</span>
            <span className="text-[9px] font-extrabold text-cyan-300">
              {card.brandLogoType === 'fortnite-13k' ? '13500 V-BUCKS' : '5000 V-BUCKS'}
            </span>
          </div>
        </div>
      );

    case 'apple-music':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg flex flex-col ${className}`}>
          {/* Top Half: Vibrant Rose-Red Gradient with Music note */}
          <div className="w-full h-1/2 bg-gradient-to-r from-[#fc2f5d] via-[#f73859] to-[#ee4b2b] flex items-center justify-center gap-1.5 text-white">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <span className="font-black text-sm tracking-wide">Music</span>
          </div>
          {/* Bottom Half: Royal Violet-Blue with "12 MONTH" */}
          <div className="w-full h-1/2 bg-gradient-to-r from-[#4430e7] to-[#6035f2] flex items-center justify-center text-white">
            <span className="font-black text-xs tracking-widest uppercase">12 MONTH</span>
          </div>
        </div>
      );

    case 'google-play':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#111215] border border-zinc-800 flex flex-col items-center justify-center p-2 ${className}`}>
          <div className="flex items-center gap-2">
            {/* 3D Google Play Triangle */}
            <svg className="w-10 h-10 drop-shadow-[0_2px_10px_rgba(0,230,118,0.3)]" viewBox="0 0 48 48">
              <path fill="#4CAF50" d="M10 6.6L27.4 24 10 41.4z" />
              <path fill="#FFC107" d="M34.5 17L27.4 24l7.1 7 4.5-2.6c1.3-.7 1.3-3.1 0-3.8L34.5 17z" />
              <path fill="#FF3D00" d="M27.4 24L10 6.6C10.7 5.7 12 5.5 13.1 6.1l21.4 10.9L27.4 24z" />
              <path fill="#1976D2" d="M27.4 24l7.1 7-21.4 10.9c-1.1.6-2.4.4-3.1-.5L27.4 24z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Google</span>
              <span className="text-base font-bold text-white tracking-tight -mt-1">Play</span>
            </div>
          </div>
        </div>
      );

    case 'xbox':
    case 'xbox-gold':
    case 'gamepass':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-[#107c10] to-[#0e610e] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          {/* Xbox Sphere */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md mb-1">
            <svg className="w-8 h-8 fill-[#107c10]" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 14.6c-.6.3-1.4.2-2.3-.3-1-.6-1.5-1.5-1.5-1.5s-.5.9-1.5 1.5c-.9.5-1.7.6-2.3.3-.6-.3-.9-1.1-.9-2.1 0-1.8 1.4-3.7 3.5-5.3 1.6-1.2 3.1-1.7 3.9-1.5.3.1.5.2.7.4.3.4.4.9.4 1.5 0 2.4-1.2 5.2-2.3 6.5.6.3 1.3.4 2 .1.3-.1.4.1.3.4-.1.2-.2.4-.4.5z" />
            </svg>
          </div>
          {/* Headset, controller, console icons */}
          <div className="flex items-center gap-3 opacity-90 text-sm">
            <span>🎧</span>
            <span>🎮</span>
            <span>📺</span>
          </div>
        </div>
      );

    case 'itunes':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-tr from-[#00d2ff] via-[#00e5ff] to-[#1de9b6] flex flex-col items-center justify-center p-2 text-white shadow-inner ${className}`}>
          <div className="flex items-center gap-1.5">
            <svg className="w-8 h-8 fill-white" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.66-7.85-11.9-14.42-6-9.15-10.79-19.38-14.37-30.68-3.58-11.3-5.37-22.18-5.37-32.63 0-14.36 3.63-26.24 10.89-35.63 7.26-9.39 16.35-14.17 27.27-14.34 4.58 0 9.87 1.15 15.86 3.44 6 2.3 9.94 3.51 11.83 3.62 1.54 0 5.46-1.3 11.75-3.88 6.29-2.58 11.38-3.8 15.27-3.67 11.32.73 20.24 4.9 26.77 12.51-9.48 5.75-14.1 13.82-13.85 24.23.25 8.16 3.31 14.88 9.17 20.15 5.86 5.28 12.87 8.35 21.03 9.22-2.12 6.52-4.66 13.25-7.61 20.19zm-29.35-102.5c0-6.19 2.24-12.19 6.72-17.98 4.48-5.8 10.08-9.48 16.8-11.04.54 1.34.81 2.82.81 4.45 0 6.07-2.3 12.04-6.9 17.92-4.6 5.87-10.39 9.5-17.38 10.88-.04-1.42-.05-2.83-.05-4.23z" />
            </svg>
            <span className="font-black text-xl tracking-tight text-white font-sans">iTunes</span>
          </div>
        </div>
      );

    case 'steam':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#171a21] border border-slate-700 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          {/* Steam Piston Arm Valve Logo */}
          <div className="flex flex-col items-center">
            <svg className="w-10 h-10 fill-[#66c0f4] mb-1" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.14 6.84 9.46l2.06-2.99c-.43-.37-.78-.85-1-1.41-.65-1.51-.01-3.26 1.46-3.95l2.76-3.97c-.08-.36-.12-.74-.12-1.14 0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5c-.71 0-1.39-.15-2-.42l-3.94 2.76c.03.22.04.44.04.66 0 2.21-1.79 4-4 4-.29 0-.58-.04-.85-.1L8.5 22.9C9.62 23.6 10.95 24 12 24c6.63 0 12-5.37 12-12S18.63 2 12 2z" />
            </svg>
            <span className="font-black text-base tracking-widest text-white">STEAM</span>
          </div>
        </div>
      );

    case 'razer-gold':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-black border border-amber-500/40 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-yellow-200 flex items-center justify-center shadow-[0_0_15px_rgba(255,193,7,0.5)]">
            <span className="font-black text-black text-2xl font-serif">Z</span>
          </div>
          <span className="font-bold text-xs tracking-wider text-amber-400 mt-1">Razer Gold</span>
        </div>
      );

    case 'playstation-store':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#003791] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          {/* PlayStation Shopping Bag */}
          <div className="w-10 h-11 bg-white rounded-md relative flex items-center justify-center shadow-lg">
            <div className="absolute -top-2 w-5 h-4 border-2 border-white rounded-t-full bg-transparent" />
            <div className="flex gap-0.5 text-[#003791] text-[9px] font-bold">
              <span>▲</span><span>●</span><span>✖</span>
            </div>
          </div>
          <span className="text-[10px] font-black tracking-widest mt-1 text-white">STORE</span>
        </div>
      );

    case 'warcraft':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#1c0d02] border border-amber-600/50 flex flex-col items-center justify-center p-2 text-amber-300 ${className}`}>
          <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">World of</span>
          <span className="font-black text-sm tracking-wider uppercase text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">WARCRAFT</span>
          <span className="text-[8px] bg-amber-600 text-black font-extrabold px-1.5 rounded mt-1">60 DAY GAME TIME</span>
        </div>
      );

    case 'riot-games':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#0f1923] border border-red-600/40 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center font-black text-base shadow-md mb-1">
            👊
          </div>
          <span className="font-extrabold text-xs tracking-wider text-red-500">LEAGUE OF LEGENDS</span>
        </div>
      );

    case 'karma-koin':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-stone-900 border border-amber-600/40 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-500 font-black text-xl mb-1 shadow-inner">
            K
          </div>
          <span className="font-black text-xs tracking-wider text-amber-400">KARMA KOIN</span>
        </div>
      );

    case 'nintendo':
    case 'nintendo-online':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#e60012] flex flex-col items-center justify-center p-2 text-white shadow-inner ${className}`}>
          <div className="w-full flex items-center justify-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-sm bg-white text-[#e60012] flex items-center justify-center font-black text-xs">
              ☲
            </div>
            <span className="font-black text-sm tracking-tight text-white">Nintendo</span>
          </div>
          <span className="text-[9px] font-bold text-red-100 uppercase tracking-wider">
            {card.brandLogoType === 'nintendo-online' ? '12 Month Online' : 'eShop Card'}
          </span>
        </div>
      );

    case 'webkinz':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-9 h-9 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-blue-900 font-black text-lg shadow-md mb-1">
            W
          </div>
          <span className="font-black text-sm tracking-wide text-blue-900 font-serif drop-shadow-xs">Webkinz</span>
        </div>
      );

    case 'imvu':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-rose-950 via-purple-950 to-pink-900 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <span className="font-black text-2xl tracking-tighter text-pink-400 italic">imvu</span>
          <span className="text-[8px] text-pink-200 uppercase tracking-widest mt-1">Avatar & Credits</span>
        </div>
      );

    case 'vudu':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#0074e4] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <span className="font-black text-2xl tracking-wider text-white drop-shadow-md">VUDU</span>
          <span className="text-[9px] font-bold text-sky-200 tracking-widest uppercase">FANDANGO</span>
        </div>
      );

    case 'home-depot':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#f96302] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="border-2 border-white/80 p-1 rounded text-center">
            <span className="font-black text-xs tracking-tight uppercase leading-tight block">THE HOME DEPOT</span>
          </div>
          <span className="text-[12px] mt-1">🎁</span>
        </div>
      );

    case 'sephora':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-black flex flex-col justify-center items-center ${className}`}>
          {/* Black & White Horizontal Zebra Stripes */}
          <div className="w-full h-2 bg-white mb-1.5" />
          <div className="w-full bg-black py-1 text-center">
            <span className="font-black text-sm tracking-[0.25em] text-white">SEPHORA</span>
          </div>
          <div className="w-full h-2 bg-white mt-1.5" />
        </div>
      );

    case 'crypto-voucher':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-slate-900 border border-teal-500/40 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black text-xl flex items-center justify-center shadow-md mb-1">
            ₿
          </div>
          <span className="font-bold text-xs text-teal-400">Crypto Voucher</span>
        </div>
      );

    case 'ebay':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#0064d2] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="bg-white px-3 py-1 rounded-md shadow-md flex items-center text-lg font-black tracking-tighter">
            <span className="text-[#e53238]">e</span>
            <span className="text-[#0064d2]">b</span>
            <span className="text-[#f5af02]">a</span>
            <span className="text-[#86b817]">y</span>
          </div>
        </div>
      );

    case 'amazon':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#111] border border-stone-800 flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <span className="font-black text-base text-white tracking-tight">amazon.com</span>
          <div className="w-14 h-2.5 border-b-2 border-[#ff9900] rounded-b-full -mt-0.5" />
        </div>
      );

    case 'spotify':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#121212] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center shadow-md mb-1">
            <svg className="w-7 h-7 fill-black" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.794-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.723 1.115.294.18.386.562.207.855zm1.225-2.724c-.226.367-.706.482-1.072.257-2.69-1.653-6.79-2.131-9.97-1.165-.413.125-.85-.107-.974-.52-.125-.414.108-.85.52-.975 3.633-1.103 8.147-.568 11.239 1.332.366.226.482.707.257 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.165-.623-.15-.493.13-1.016.624-1.165 3.532-1.072 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.282.324z" />
            </svg>
          </div>
          <span className="font-bold text-xs text-[#1db954]">Spotify</span>
        </div>
      );

    case 'netflix':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-black flex flex-col items-center justify-center p-2 ${className}`}>
          <span className="font-black text-3xl tracking-tighter text-[#e50914] font-serif drop-shadow-[0_2px_12px_rgba(229,9,20,0.6)]">
            NETFLIX
          </span>
        </div>
      );

    case 'facebook':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#1877f2] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-9 h-9 bg-white text-[#1877f2] rounded-md font-black text-2xl flex items-center justify-center shadow-md mb-1">
            f
          </div>
          <span className="text-[10px] font-bold text-blue-100">Game Card</span>
        </div>
      );

    case 'hulu':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#1ce783] flex flex-col items-center justify-center p-2 text-black ${className}`}>
          <span className="font-black text-2xl tracking-tighter text-black">hulu</span>
        </div>
      );

    case 'crunchyroll':
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-[#f47521] flex flex-col items-center justify-center p-2 text-white ${className}`}>
          <div className="w-9 h-9 rounded-full bg-white text-[#f47521] flex items-center justify-center text-lg font-bold shadow-md mb-1">
            ◑
          </div>
          <span className="font-extrabold text-xs tracking-wider">crunchyroll</span>
        </div>
      );

    default:
      return (
        <div className={`relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br ${card.cardTheme.bgGradient} flex flex-col items-center justify-center p-2 text-white shadow-inner ${className}`}>
          <span className="font-black text-sm tracking-wider uppercase text-center drop-shadow-sm">{card.name}</span>
          <span className="text-[10px] font-bold opacity-90 mt-0.5">{card.denomination}</span>
        </div>
      );
  }
};
