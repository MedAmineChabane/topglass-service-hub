import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReassuranceBanner from "@/components/ReassuranceBanner";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WelcomeBanner from "@/components/WelcomeBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WelcomeBanner />
      <Header />
      <Hero />
      <ReassuranceBanner />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
