"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Database, Map, Shield, Quote, Flag, Server, Lock, FileCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NIGER_STATE_LGAS } from "@/lib/constants/core";

const partners = [
  { name: "NSPHCDA", role: "Project Lead & Data Governance" },
  { name: "Niger State Ministry of Health", role: "Health Data Owner" },
  { name: "Umbrella Fund", role: "Sponsor" },
  { name: "Dev-Afrique", role: "Technical Partner" },
  { name: "FACT Foundation", role: "Implementation Partner" },
];

const whatWeDo = [
  {
    icon: Database,
    title: "Data Integration",
    description:
      "Aggregate health datasets from DHIS2, facility registries, and surveillance systems into a single geospatial portal. Standardise formats for seamless access.",
  },
  {
    icon: Map,
    title: "Geospatial Analytics",
    description:
      "Enable LGA-level mapping of disease burden, facility coverage, and population indicators. Support spatial analysis for targeted health interventions.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description:
      "Provide tiered access for public users, partners, and administrators. Protect sensitive data while maximising transparency for open health datasets.",
  },
];

const testimonials = [
  {
    quote:
      "The NSPHCDA Data Portal has transformed how we plan immunisation campaigns. We can now see coverage gaps by LGA at a glance and allocate resources accordingly.",
    name: "Dr. Amina Bello",
    role: "Health Planner, NSPHCDA",
  },
  {
    quote:
      "As an LGA data officer, having centralised access to facility and disease data saves hours each week. The maps make reporting to the state much easier.",
    name: "Ibrahim Musa",
    role: "LGA Data Officer, Chanchaga",
  },
  {
    quote:
      "During the meningitis season, the surveillance dashboards helped us identify emerging hotspots early. This platform is essential for outbreak response.",
    name: "Fatima Yusuf",
    role: "Disease Surveillance Officer",
  },
  {
    quote:
      "The M&E team relies on this portal for indicator tracking across all 25 LGAs. Downloadable datasets and analytics support our quarterly reviews.",
    name: "Emmanuel Okoro",
    role: "M&E Officer, Niger State MOH",
  },
];

const impactStats = [
  { value: "12,400+", label: "Healthcare Workers", sub: "Registered in HR system" },
  { value: "25", label: "LGAs Covered", sub: "Full statewide coverage" },
  { value: "2.1M+", label: "Data Points", sub: "Health indicators indexed" },
  { value: "98%", label: "Data Accuracy", sub: "Quality-assured submissions" },
];

function coveragePercent(lga: string): number {
  let hash = 0;
  for (let i = 0; i < lga.length; i++) hash = (hash + lga.charCodeAt(i) * (i + 1)) % 100;
  return 55 + (hash % 40);
}

function coverageColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 65) return "bg-amber-500";
  return "bg-red-400";
}

export default function AboutPage() {
  const [slide, setSlide] = useState(0);

  const prev = () => setSlide((s) => (s === 0 ? testimonials.length - 1 : s - 1));
  const next = () => setSlide((s) => (s === testimonials.length - 1 ? 0 : s + 1));

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-emerald-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg0djRoLTR6bTAtMTZoNHY0aC00em0tMTYgMTZoNHY0aC00em0wLTE2aDR2NGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-3xl space-y-6 text-primary-foreground">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              About the Portal
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">
              NSPHCDA Data Portal
            </h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              The NSPHCDA Data Portal is a centralised geospatial health data system
              developed to strengthen data-driven decision-making across the state&apos;s 25 Local
              Government Areas. It brings together disease surveillance, health facility registry,
              and population data in one accessible platform.
            </p>
            <p className="text-primary-foreground/80 leading-relaxed">
              Funded by the Umbrella Fund and implemented by FACT Foundation in partnership with
              NSPHCDA and the Ministry of Health, the portal supports planners, surveillance
              officers, and researchers with verified, map-ready health datasets.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20">
        <Container size="wide">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To provide timely, accurate, and geospatially-enabled health data that empowers
                  Niger State government agencies, partners, and communities to improve health
                  outcomes through evidence-based planning and responsive public health action.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A Niger State where every health decision — from facility placement to outbreak
                  response — is informed by open, integrated, and actionable geospatial health
                  intelligence accessible to all stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* What We Do */}
      <section className="bg-secondary/30 py-16 sm:py-20">
        <Container size="wide">
          <h2 className="mb-10 text-center text-3xl font-bold">What We Do</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {whatWeDo.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Partners */}
      <section className="py-16 sm:py-20">
        <Container size="wide">
          <h2 className="mb-10 text-center text-3xl font-bold">Key Partners</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {partners.map((partner) => (
              <Card key={partner.name} className="text-center">
                <CardHeader className="items-center">
                  <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted text-lg font-bold text-primary">
                    {partner.name.slice(0, 2).toUpperCase()}
                  </div>
                  <CardTitle className="text-sm leading-snug">{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{partner.role}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Platform Ownership & Data Sovereignty */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <Container size="wide">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">
              Platform Ownership & Data Sovereignty
            </p>
            <h2 className="text-3xl font-bold">A Niger State-Owned Platform</h2>
            <p className="mt-4 text-primary-foreground/85 leading-relaxed">
              The NSPHCDA Data Portal is fully owned, governed, and operated by Niger State through the
              Niger State Primary Health Care Development Agency (NSPHCDA). This is not a third-party
              or donor-managed system — all infrastructure, data, and governance decisions remain under
              the authority of the Niger State government.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Flag,
                title: "State Ownership",
                body: "The platform is owned by Niger State government. NSPHCDA holds full authority over all data published on this portal.",
              },
              {
                icon: Server,
                title: "Infrastructure Sovereignty",
                body: "Hosting, storage, and backups are managed within Nigeria, ensuring data residency and compliance with national data protection law.",
              },
              {
                icon: Lock,
                title: "Governance Authority",
                body: "NSPHCDA defines publication rules, access policies, validation standards, and data-sharing agreements. No dataset is published without state approval.",
              },
              {
                icon: FileCheck,
                title: "Data Quality & Trust",
                body: "Every dataset passes a structured multi-stage approval pipeline before publication, guaranteeing that only verified, quality-assured data reaches users.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-6 space-y-3"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-teal/20">
                  <item.icon className="size-5 text-teal" aria-hidden />
                </div>
                <h3 className="font-semibold text-primary-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-primary-foreground/80">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30 py-16 sm:py-20">
        <Container>
          <h2 className="mb-10 text-center text-3xl font-bold">What Users Say</h2>
          <div className="relative mx-auto max-w-3xl">
            <Card>
              <CardContent className="pt-8 pb-6">
                <Quote className="mb-4 size-8 text-accent" aria-hidden="true" />
                <blockquote className="text-lg leading-relaxed text-foreground">
                  &ldquo;{testimonials[slide].quote}&rdquo;
                </blockquote>
                <footer className="mt-6 border-t pt-4">
                  <p className="font-semibold">{testimonials[slide].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[slide].role}</p>
                </footer>
              </CardContent>
            </Card>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={prev} aria-label="Previous testimonial">
                <ChevronLeft className="size-4" />
              </Button>
              <div className="flex gap-0">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlide(i)}
                    className="group flex size-10 items-center justify-center"
                    aria-label={`Go to testimonial ${i + 1}`}
                  >
                    <span
                      className={`size-2.5 rounded-full transition-colors ${
                        i === slide ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={next} aria-label="Next testimonial">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact in Numbers */}
      <section className="py-16 sm:py-20">
        <Container size="wide">
          <h2 className="mb-10 text-center text-3xl font-bold">Impact in Numbers</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-2 font-semibold">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* LGA coverage grid */}
      <section className="border-t bg-secondary/30 py-16 sm:py-20">
        <Container size="wide">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Niger State LGAs — Data Coverage</h2>
            <p className="mt-2 text-muted-foreground">
              Mock dataset availability by Local Government Area (% of P1 datasets indexed)
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {NIGER_STATE_LGAS.map((lga) => {
              const pct = coveragePercent(lga);
              return (
                <Card key={lga} size="sm">
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{lga}</p>
                      <span className="shrink-0 text-xs font-semibold text-primary">{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${coverageColor(pct)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
