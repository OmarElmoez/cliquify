import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 to-muted py-20 flex flex-col items-center justify-center">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-2xl w-full px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Manage Your Ads Effortlessly with <span className="text-primary text-blue-400">Cliquify</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            All your advertising campaigns, analytics, and optimizations in one powerful platform.
          </p>
          <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
            <Link to="/sign-in">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl w-full mx-auto mt-20 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="flex flex-col items-center p-6 shadow-lg border-0 bg-muted/60">
          <span className="text-3xl mb-3">📊</span>
          <CardTitle className="font-semibold text-lg mb-2">Centralized Dashboard</CardTitle>
          <CardContent className="p-0">
            <p className="text-sm text-center text-muted-foreground">
              View and manage all your ad campaigns from a single, easy-to-use dashboard.
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center p-6 shadow-lg border-0 bg-muted/60">
          <span className="text-3xl mb-3">⚡</span>
          <CardTitle className="font-semibold text-lg mb-2">Real-Time Analytics</CardTitle>
          <CardContent className="p-0">
            <p className="text-sm text-center text-muted-foreground">
              Get instant insights and analytics to optimize your ad performance.
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center p-6 shadow-lg border-0 bg-muted/60">
          <span className="text-3xl mb-3">🔒</span>
          <CardTitle className="font-semibold text-lg mb-2">Secure & Private</CardTitle>
          <CardContent className="p-0">
            <p className="text-sm text-center text-muted-foreground">
              Your data is protected with industry-leading security and privacy standards.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* About Section */}
      <section className="max-w-3xl w-full mx-auto mt-20 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Cliquify?</h2>
        <p className="text-muted-foreground text-base md:text-lg mb-6">
          Our platform is designed to save you time and maximize your advertising ROI. Whether you're a small business or a large enterprise, Cliquify adapts to your needs and grows with you.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          <div className="flex-1 bg-muted rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Easy Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect your favorite ad networks and tools in minutes.
            </p>
          </div>
          <div className="flex-1 bg-muted rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Customizable Reports</h3>
            <p className="text-sm text-muted-foreground">
              Generate detailed reports tailored to your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full mt-20 py-12 bg-primary/10 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Ready to simplify your ad management?</h2>
        <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
          <Link to="/sign-in">Start Now</Link>
        </Button>
      </section>

      <footer className="w-full py-4 border-t flex justify-center gap-8 bg-muted">
        <Link
          to="/privacy-policy"
          className="text-sm text-muted-foreground hover:underline"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms-of-services"
          className="text-sm text-muted-foreground hover:underline"
        >
          Terms of Service
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;