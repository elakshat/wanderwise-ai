import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto prose prose-slate dark:prose-invert"
        >
          <h1>Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TravelMate, you accept and agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use our services.
          </p>

          <h2>2. Booking and Payments</h2>
          <p>
            All bookings made through TravelMate are subject to availability and confirmation. Prices are 
            displayed in Indian Rupees (₹) and include applicable taxes unless otherwise stated. Payment must 
            be made in full at the time of booking.
          </p>

          <h2>3. Cancellation and Refunds</h2>
          <p>
            Cancellation and refund policies vary by service provider (airline, hotel, cab service). Please 
            review the specific cancellation policy before booking. Refunds, if applicable, will be processed 
            within 7-10 business days.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use the service only for lawful purposes</li>
            <li>Not interfere with the operation of our services</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on TravelMate, including text, graphics, logos, and software, is the property of 
            TravelMate or its licensors and is protected by copyright and other intellectual property laws.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            TravelMate acts as an intermediary between you and service providers. We are not responsible for 
            the quality of services provided by airlines, hotels, or cab services. Our liability is limited 
            to the amount paid for the booking.
          </p>

          <h2>7. Service Availability</h2>
          <p>
            While we strive to ensure continuous availability, TravelMate does not guarantee uninterrupted 
            access to our services. We may modify or discontinue services without notice.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Your use of TravelMate is also governed by our Privacy Policy. Please review our Privacy Policy 
            to understand how we collect, use, and protect your information.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective 
            immediately upon posting. Your continued use of TravelMate constitutes acceptance of the modified terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to 
            the exclusive jurisdiction of courts in Mumbai, Maharashtra.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            For questions about these Terms and Conditions, please contact us at legal@travelmate.com or 
            call +91 1800-123-4567.
          </p>
        </motion.div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Terms;
