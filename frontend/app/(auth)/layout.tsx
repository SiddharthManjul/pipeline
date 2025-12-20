export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Web3 Talent Connect
          </h1>
          <p className="text-muted-foreground">
            Connecting developers with founders
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
