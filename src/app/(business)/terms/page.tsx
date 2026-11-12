import { Container } from "@/components/layout/container";
import { PageBand } from "@/components/layout/page-band";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <main className="flex-1">
      <PageBand
        eyebrow="Legal"
        title="Terms of Use"
        description="Last updated: June 2026"
      />

      <Container className="py-12">
        <Card>
          <CardContent className="pt-6 prose prose-slate max-w-none">
            <section className="space-y-4">
              <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using the Niger State Open Data Portal, you accept and agree
                to be bound by these Terms of Use. If you do not agree to these terms, please
                do not use the portal.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">2. Data Licenses</h2>
              <p className="text-muted-foreground">
                Public datasets are available under open licenses that permit reuse,
                redistribution, and derivative works, subject to proper attribution.
                Restricted datasets require registration and approval and may have additional
                usage constraints.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">3. User Responsibilities</h2>
              <p className="text-muted-foreground">
                Users must:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate registration information</li>
                <li>Respect data licenses and usage restrictions</li>
                <li>Not misrepresent or misuse datasets</li>
                <li>Cite data sources appropriately</li>
                <li>Not attempt to identify individuals from anonymized data</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">4. Data Quality and Accuracy</h2>
              <p className="text-muted-foreground">
                While we strive to provide accurate and up-to-date data, the Niger State
                Government makes no warranty regarding the completeness, accuracy, or
                reliability of datasets. Users are responsible for verifying data quality
                for their intended use.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">5. Prohibited Uses</h2>
              <p className="text-muted-foreground">
                Users must not use the portal to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware or conduct security attacks</li>
                <li>Scrape or overload the portal infrastructure</li>
                <li>Misrepresent affiliation with Niger State Government</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">6. Account Termination</h2>
              <p className="text-muted-foreground">
                The Niger State Government reserves the right to suspend or terminate user
                accounts that violate these terms or engage in misuse of the portal.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">7. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms of Use from time to time. Continued use of the
                portal after changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">8. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at{" "}
                <a href="mailto:opendata@niger.gov.ng" className="text-primary hover:underline">
                  opendata@niger.gov.ng
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
