import { Container, Heading, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <Container>
        <div className="space-y-6">
          <Heading size="8" className="tracking-tight">
            Welcome to Next.js 14
          </Heading>
          <Text size="5" className="text-muted-foreground">
            Get started by editing src/app/page.tsx
          </Text>
        </div>
      </Container>
    </main>
  );
}
