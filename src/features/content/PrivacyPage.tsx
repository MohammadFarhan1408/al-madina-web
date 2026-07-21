import { LegalPage } from "./LegalPage";

export function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How Al Madina Ittar collects, uses and protects your information."
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "When you create an account, place an order or contact us, we collect information such as your name, email, phone number, delivery address and order history.",
            "We do not store your card details — payments are processed by our payment partners.",
          ],
        },
        {
          heading: "How We Use Your Information",
          body: [
            "Your information is used to process orders, provide customer support, personalize your experience and send order or account notifications.",
            "We never sell your personal information to third parties.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use cookies to keep you signed in, remember your cart and wishlist, and understand how the site is used.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "You may access, update or delete your account information at any time from your Account settings, or by contacting us directly.",
          ],
        },
        {
          heading: "Contact Us",
          body: ["Questions about this policy can be sent to concierge@almadinaittar.com."],
        },
      ]}
    />
  );
}
