import Container from "@/components/ui/Container";

export default function ContentHighlightsSection() {
  return (
    <section className="border-t border-border">
      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Highlights</h2>
        <p className="mt-2 text-sm opacity-75">
          Announcements, important dates, and key documents will appear here.
        </p>
      </Container>
    </section>
  );
}