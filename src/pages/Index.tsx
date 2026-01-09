import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReassuranceBanner from "@/components/ReassuranceBanner";
import DiagnosticForm from "@/components/DiagnosticForm";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ReassuranceBanner />
      <DiagnosticForm />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
