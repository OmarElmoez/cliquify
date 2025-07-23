import { ReactNode, useState } from "react";
import {
  MoveRight,
  MoveLeft,
} from "lucide-react";
import { ArrowUp, ArrowDown } from "@/assets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const TermsOfService = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const Section = ({
    id,
    title,
    icon: Icon,
    children,
    defaultExpanded = false,
  }: {
    id: string;
    title: string;
    icon?: LucideIcon;
    children: ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections[id] ?? defaultExpanded;

    return (
      <div
        className={cn(
          "border border-[#FFCCE5] overflow-hidden rounded-lg mb-4 shadow-sm",
          isExpanded ? "bg-white" : "bg-[#FF017D0A]"
        )}
      >
        <button
          onClick={() => toggleSection(id)}
          className="w-full py-9 px-6 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-4">
            {Icon && <Icon className="w-5 h-5 text-mainColor" />}
            <h3 className="text-xl font-medium text-blackColor text-left">
              {title}
            </h3>
          </div>
          {isExpanded ? (
            <div className="bg-[#F5F8FA] min-w-[38px] h-[38px] rounded-md flex items-center justify-center">
              <img src={ArrowUp} alt="arrow up" />
            </div>
          ) : (
            <div className="bg-white min-w-[38px] h-[38px] rounded-md flex items-center justify-center">
              <img src={ArrowDown} alt="arrow down" />
            </div>
          )}
        </button>
        {isExpanded && (
          <div className="px-6 pb-4 text-gray-700 leading-relaxed">
            {children}
          </div>
        )}
      </div>
    );
  };

  const Subsection = ({ title, children }) => (
    <div className="mb-4">
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <div className="pl-4 border-l-2 border-blue-100">{children}</div>
    </div>
  );

  const ContactCard = ({ title, email, description }) => (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-900 mb-2">{title}</h4>
      <p className="text-blue-800 mb-2">{description}</p>
      <a
        href={`mailto:${email}`}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        {email}
      </a>
    </div>
  );

  const ProhibitedPracticeItem = ({ title, description }) => (
    <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-3">
      <h5 className="font-semibold text-red-900 mb-1">{title}</h5>
      <p className="text-red-800 text-sm">{description}</p>
    </div>
  );

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center gap-11">
      <section className="max-w-[628px]">
        <button className="text-lg text-grayColor border border-[#BBCFDD] rounded-lg w-[130px] h-[48px]">
          <Link to="/" className="flex items-center justify-center gap-2">
            <MoveLeft />
            Back
          </Link>
        </button>
        <h1 className="font-bold text-[64px] mt-6">
          <span className="text-mainColor">Cliquify</span> Terms of Service
        </h1>
        <p className="font-medium text-lg text-grayColor">
          Last updated :{" "}
          {new Date().toLocaleDateString([], { dateStyle: "long" })}
        </p>
        <div className="bg-[#FF017D0A] p-8 rounded-xl mt-[70px]">
          <h2 className="font-semibold text-blackColor text-[32px]">
            Questions about Terms of Service ?
          </h2>
          <p className="font-medium text-lg text-grayColor mt-4">
            These Terms of Service (“Terms”) govern your access to and use of
            the Cliquify platform (“Service”), operated by CliquifyInc. By using
            our Service, you agree to be bound by these Terms.
          </p>
          <Button
            asChild
            className="bg-mainColor hover:bg-mainColor text-white text-lg font-semibold w-[210px] h-[50px] rounded-lg mt-12"
          >
            <a
              href="mailto:privacy@cliquify.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Email Privacy Team
            </a>
          </Button>
        </div>
      </section>
      <section className="flex-1">
        {/* First Group */}
        {activeIdx === 0 && (
          <article>
            <Section id="eligibility" title="1. Eligibility">
              <p>
                You must be at least 18 years old and have the legal authority
                to enter into these Terms.
              </p>
            </Section>
            <Section id="responsibility" title="2. Account Responsibility">
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password and for all activities that occur under
                your account.
              </p>
            </Section>
            <Section id="acceptable-use" title="3. Acceptable Use">
              <p>
                You agree not to misuse the Service, including but not limited
                to attempting to gain unauthorized access, disrupting the
                system, or violating any laws.
              </p>
            </Section>
            <Section
              id="third-party-integrations"
              title="4. Third-Party Integrations"
            >
              <p>
                Cliquify connects with services such as Google Ads and Meta Ads.
                You are responsible for complying with the respective terms and
                policies of those services.
              </p>
            </Section>
            <Section
              id="intellectual-property"
              title="5. Intellectual Property"
            >
              <p>
                All content and software associated with Cliquify is the
                property of Cliquifyor its licensors. You may not copy,
                distribute, or reverse engineer any part of the platform.
              </p>
            </Section>
          </article>
        )}

        {/* Second Group */}
        {activeIdx === 1 && (
          <article>
            <Section id="termination" title="6. Termination">
              <p>
                We may suspend or terminate your access to the Service at any
                time, with or without cause or notice.
              </p>
            </Section>
            <Section
              id="disclaimer"
              title="7. Disclaimer & Limitation of Liability"
            >
              <p>
                The Service is provided "as is" without warranties of any kind.
                Cliquify is not liable for any damages arising from your use of
                the Service.
              </p>
            </Section>
            <Section id="changes-to-terms" title="8. Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time.
                Continued use of the Service after changes means you accept the
                updated Terms.
              </p>
            </Section>
            <Section id="contact" title="9. Contact">
              <p>
                For questions or concerns regarding these Terms, please contact
                us at support@cliquify.com.
              </p>
            </Section>
          </article>
        )}
        <div className="flex items-center justify-center gap-10 mt-9">
          <button
            className={cn(
              "flex items-center justify-center bg-mainColor text-white rounded-lg w-11 h-11",
              activeIdx === 0 && "opacity-50 pointer-events-none"
            )}
            onClick={() => setActiveIdx((prev) => prev - 1)}
          >
            <MoveLeft />
          </button>
          <button
            className={cn(
              "flex items-center justify-center bg-mainColor text-white rounded-lg w-11 h-11",
              activeIdx >= 1 && "opacity-50 pointer-events-none"
            )}
            onClick={() => setActiveIdx((prev) => prev + 1)}
          >
            <MoveRight />
          </button>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
