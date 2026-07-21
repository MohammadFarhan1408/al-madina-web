import { LegalPage } from "./LegalPage";

export function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The terms that govern your use of Al Madina Ittar."
      sections={[
        {
          heading: "Orders & Pricing",
          body: [
            "All prices are listed in AED and are inclusive of applicable taxes unless stated otherwise. We reserve the right to correct pricing errors before an order is confirmed.",
            "An order is only confirmed once payment is authorized (card/wallet) or accepted (cash on delivery) and you receive an order confirmation.",
          ],
        },
        {
          heading: "Account Responsibility",
          body: [
            "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.",
          ],
        },
        {
          heading: "Product Availability",
          body: [
            "Availability is shown at the time of browsing. In the rare case an item becomes unavailable after ordering, we will contact you to arrange a refund or substitute.",
          ],
        },
        {
          heading: "Intellectual Property",
          body: [
            "All content on this site — including product imagery, names and brand marks — is the property of Al Madina Ittar and may not be reproduced without permission.",
          ],
        },
        {
          heading: "Governing Law",
          body: ["These terms are governed by the laws of the United Arab Emirates."],
        },
      ]}
    />
  );
}
