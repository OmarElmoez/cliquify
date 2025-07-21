import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/20 backdrop-blur-md border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300">
            <p>
              These Terms of Service (“Terms”) govern your access to and use of the Cliquify platform (“Service”), operated by CliquifyInc. By using our Service, you agree to be bound by these Terms.
            </p>

            <div>
              <h3 className="font-semibold text-white mb-2">1. Eligibility</h3>
              <p>
                You must be at least 18 years old and have the legal authority to enter into these Terms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">2. Account Responsibility</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">3. Acceptable Use</h3>
              <p>
                You agree not to misuse the Service, including but not limited to attempting to gain unauthorized access, disrupting the system, or violating any laws.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">4. Third-Party Integrations</h3>
              <p>
                Cliquify connects with services such as Google Ads and Meta Ads. You are responsible for complying with the respective terms and policies of those services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">5. Intellectual Property</h3>
              <p>
                All content and software associated with Cliquify is the property of Cliquifyor its licensors. You may not copy, distribute, or reverse engineer any part of the platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">6. Termination</h3>
              <p>
                We may suspend or terminate your access to the Service at any time, with or without cause or notice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">7. Disclaimer & Limitation of Liability</h3>
              <p>
                The Service is provided "as is" without warranties of any kind. Cliquify is not liable for any damages arising from your use of the Service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">8. Changes to Terms</h3>
              <p>
                We reserve the right to modify these Terms at any time. Continued use of the Service after changes means you accept the updated Terms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">9. Contact</h3>
              <p>
                For questions or concerns regarding these Terms, please contact us at <strong>support@cliquify.com</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;