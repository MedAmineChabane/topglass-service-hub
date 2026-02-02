import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import technicianHandover from "@/assets/technician-handover-new.png";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
const testimonials = [{
  name: "Marie L.",
  location: "Marseille",
  rating: 5,
  text: "Service impeccable ! Le technicien est venu chez moi en moins de 24h. Pare-brise remplacé en 1h30, aucune avance de frais. Je recommande vivement.",
  date: "Il y a 2 semaines"
}, {
  name: "Thomas B.",
  location: "Aix-en-Provence",
  rating: 5,
  text: "Très professionnel, intervention rapide et soignée. Ma franchise m'a été remboursée comme promis. Excellent rapport qualité-prix.",
  date: "Il y a 1 mois"
}, {
  name: "Sophie M.",
  location: "Aubagne",
  rating: 5,
  text: "J'étais stressée car j'avais besoin de ma voiture pour le travail. Ils sont intervenus le jour même ! Merci Topglass.",
  date: "Il y a 3 semaines"
}, {
  name: "Jean-Pierre D.",
  location: "La Ciotat",
  rating: 5,
  text: "Deuxième fois que je fais appel à leurs services. Toujours aussi efficaces et professionnels. Le technicien était très sympathique.",
  date: "Il y a 1 mois"
}, {
  name: "Nadia K.",
  location: "Marseille",
  rating: 5,
  text: "Prise en charge directe avec mon assurance, je n'ai rien eu à avancer. Le pare-brise est parfait, aucun défaut visible.",
  date: "Il y a 2 mois"
}, {
  name: "Laurent G.",
  location: "Vitrolles",
  rating: 4,
  text: "Bon service, technicien ponctuel. Seul bémol : le délai de remboursement de la franchise a été un peu long. Mais le travail est impeccable.",
  date: "Il y a 1 mois"
}];
const TestimonialCard = ({
  testimonial
}: {
  testimonial: typeof testimonials[0];
}) => <div className="bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-medium transition-shadow h-full">
    {/* Quote Icon */}
    <Quote className="w-8 h-8 text-primary/20 mb-4" />
    
    {/* Rating */}
    <div className="flex gap-1 mb-4">
      {Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />)}
    </div>

    {/* Text */}
    <p className="text-foreground mb-6 leading-relaxed">
      "{testimonial.text}"
    </p>

    {/* Author */}
    <div className="flex items-center justify-between border-t border-border pt-4">
      <div>
        <p className="font-semibold text-foreground">{testimonial.name}</p>
        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
      </div>
      <span className="text-sm text-muted-foreground">{testimonial.date}</span>
    </div>
  </div>;
const Testimonials = () => {
  return <section id="temoignages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header with illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl shadow-medium">
              <img src={technicianHandover} alt="Technicien Topglass remettant les clés à une cliente satisfaite" className="w-full object-cover transition-transform duration-500 hover:scale-110" />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">4.9/5 sur 2 847 avis</span>
            </motion.div>
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ce que disent nos clients
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }} className="text-muted-foreground text-lg max-w-2xl">Des milliers de clients satisfaits à Marseille et en région Paca Nos techniciens certifiés vous accompagnent de A à Z pour une intervention sans stress.</motion.p>
          </div>
        </div>

        {/* Carousel */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }}>
          <Carousel opts={{
          align: "start",
          loop: true
        }} plugins={[Autoplay({
          delay: 4000,
          stopOnInteraction: true,
          stopOnMouseEnter: true
        })]} className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>)}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 border-0" />
              <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 border-0" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>;
};
export default Testimonials;