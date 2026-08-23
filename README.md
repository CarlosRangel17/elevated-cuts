# elevated-cuts
The premium, mobile-first customer booking application for Elevated Cuts (Lubbock, TX). Built with Next.js and Tailwind CSS, decoupled from internal scheduling and CMS layers.

# Elevated Cuts - Customer Booking Application (App 1)

This repository houses the modern, high-conversion customer-facing web application for **Elevated Cuts** based in Lubbock, TX. Designed with a premium, industrial-modern aesthetic, this platform delivers a frictionless, single-thumb booking experience optimized for mobile viewports.

## 🏗️ Architectural Topology
To prevent monolithic dependencies, this codebase acts strictly as an asynchronous data consumer within a decoupled multi-app ecosystem:
1. **App 1 (This Repo)**: Public-facing Next.js client application optimized for local SEO, performance, and digital checkouts (Apple Pay / Google Pay).
2. **App 2 (Internal Scheduler)**: Private dashboard for staff roster management, shifts, and time-off coordination.
3. **App 3 (Core API & Headless CMS)**: Central Vercel serverless layer routing live calendar data and dynamic textual/image payloads.

## 🛠️ Tech Stack & Token Strategy
- **Framework**: Next.js (App Router pattern) with full Server-Side Rendering (SSR) for local search dominance.
- **Styling**: Tailwind CSS utilizing responsive auto-layout paradigms and fluid spacing constraints.
- **Theme**: Seamless Light/Dark mode token synchronization mapping to custom component variants.

## 🚀 Key Interaction Workflows
- **Staff Grid Selection**: Fluid profiling of individual barbers/stylists with dynamic availability indicators.
- **Roster-Aware Micro-Calendar**: Custom calendar module displaying live open booking blocks while automatically stripping out conflict-blocked slots.
- **Skeletal State Hydration**: Shimmer state UI placeholders to neutralize layout shifts during network data fetching cycles.
