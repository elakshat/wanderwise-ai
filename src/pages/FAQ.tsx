import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book a flight on TravelMate?",
      answer: "Simply go to the Flights page, enter your origin, destination, travel dates, and number of passengers. Click 'Search Flights' to view available options and select the one that suits you best."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets. All transactions are secure and encrypted."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking from the 'My Bookings' page. Cancellation and modification policies vary by airline, hotel, or cab service provider."
    },
    {
      question: "How do I use the TravelMate AI Assistant?",
      answer: "Click the chat icon on the right side of the screen to open the AI Assistant. Ask questions about destinations, get travel recommendations, or request help with bookings."
    },
    {
      question: "Are prices shown in Indian Rupees?",
      answer: "Yes, all prices on TravelMate are displayed in Indian Rupees (₹) for your convenience."
    },
    {
      question: "How do I save my favorite trips?",
      answer: "When viewing destinations or booking details, click the 'Save Trip' button. You can access all saved trips from the 'My Bookings' page."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your personal and payment information. Read our Privacy Policy for more details."
    },
    {
      question: "Can I book for multiple passengers?",
      answer: "Yes, you can book for multiple passengers when searching for flights or hotels. Simply select the number of travelers during the search process."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, our customer support team is available 24/7. You can reach us via email at support@travelmate.com or call +91 1800-123-4567."
    },
    {
      question: "How do I get booking confirmation?",
      answer: "After successful payment, you'll receive a booking confirmation on screen and via email/SMS with all booking details and your unique booking ID."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about TravelMate
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default FAQ;
