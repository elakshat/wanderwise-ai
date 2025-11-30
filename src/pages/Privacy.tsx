import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto prose prose-slate dark:prose-invert"
        >
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Information We Collect</h2>
          <p>
            TravelMate collects information you provide directly to us, such as when you create an account, 
            make a booking, or communicate with us. This includes your name, email address, phone number, 
            payment information, and travel preferences.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your bookings and payments</li>
            <li>Send booking confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Improve our services and user experience</li>
            <li>Send promotional offers (with your consent)</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We share your information only with service providers 
            necessary to complete your bookings (airlines, hotels, cab services) and with payment processors 
            to handle transactions securely.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information, including 
            encryption, secure servers, and regular security audits. However, no method of transmission over 
            the internet is 100% secure.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage, and deliver 
            personalized content. You can control cookies through your browser settings.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            TravelMate is not intended for children under 13. We do not knowingly collect personal information 
            from children under 13.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting 
            the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at privacy@travelmate.com or 
            call +91 1800-123-4567.
          </p>
        </motion.div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Privacy;
