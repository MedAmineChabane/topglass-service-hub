import PromoBanner from "@/components/PromoBanner";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ReassuranceBanner from "@/components/ReassuranceBanner";
import DiagnosticForm from "@/components/DiagnosticForm";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Header />
      <Hero />
      <Services />
      <ReassuranceBanner />
      <DiagnosticForm />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
