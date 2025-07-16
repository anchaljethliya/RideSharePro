import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import DriverSection from "@/components/driver-section";
import BusinessSection from "@/components/business-section";
import FleetSection from "@/components/fleet-section";
import AppDownloadSection from "@/components/app-download-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DriverSection />
        <BusinessSection />
        <FleetSection />
        <AppDownloadSection />
      </main>
      <Footer />
    </div>
  );
}
