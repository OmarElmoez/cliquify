import { useState } from "react";
import {
  Shield,
  Lock,
  Users,
  FileText,
  Globe,
  AlertTriangle,
  Phone,
  MoveRight,
  MoveLeft,
} from "lucide-react";
import { ArrowUp, ArrowDown } from "@/assets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});
  // const [searchTerm, setSearchTerm] = useState("");

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
            <Icon className="w-5 h-5 text-mainColor" />
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
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-8 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Cliquify Privacy Policy</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Last updated:{" "}
          {new Date().toLocaleDateString([], { dateStyle: "long" })}
        </p>
        <p className="text-blue-100 mt-2">
          Meta Developer Platform Terms Compliant • GDPR & CCPA Ready
        </p>
      </div> */}

      {/* Search */}
      {/* <div className="mb-6">
        <input
          type="text"
          placeholder="Search policy sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div> */}

      {/* Introduction */}
      {/* <div className="bg-white p-6 rounded-lg mb-6 shadow-sm border border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          Cliquify ("we," "us," or "our") is committed to protecting your
          privacy and complying with all applicable data protection laws and
          platform requirements, including Meta's Developer Platform Terms. This
          policy explains how we collect, use, process, share, and protect your
          personal information.
        </p>
      </div> */}
      <section className="max-w-[628px]">
        <button className="text-lg text-grayColor border border-[#BBCFDD] rounded-lg w-[130px] h-[48px]">
          <Link to="/" className="flex items-center justify-center gap-2">
            <MoveLeft />
            Back
          </Link>
        </button>
        <h1 className="font-bold text-[64px] mt-6">
          <span className="text-mainColor">Cliquify</span> Privacy Policy
        </h1>
        <p className="font-medium text-lg text-grayColor">
          Last updated :{" "}
          {new Date().toLocaleDateString([], { dateStyle: "long" })}
        </p>
        <div className="bg-[#FF017D0A] p-8 rounded-xl mt-[70px]">
          <h2 className="font-semibold text-blackColor text-[32px]">
            Questions about this policy ?
          </h2>
          <p className="font-medium text-lg text-grayColor mt-4">
            Contact our Privacy Team for assistance with any privacy-related
            questions or concerns.
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
            <Section
              id="info-collect"
              title="Information We Collect"
              icon={FileText}
            >
              <Subsection title="Account Information">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Account credentials:</strong> Name, email address,
                    phone number
                  </li>
                  <li>
                    <strong>Authentication data:</strong> Encrypted passwords,
                    security questions
                  </li>
                  <li>
                    <strong>Profile information:</strong> Company name, business
                    address, billing information
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Platform Data from Meta Products">
                <p className="mb-2">
                  When you connect your Meta accounts (Facebook, Instagram), we
                  may collect:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Profile information:</strong> Name, profile picture,
                    username
                  </li>
                  <li>
                    <strong>Ad campaign data:</strong> Campaign performance
                    metrics, audience insights
                  </li>
                  <li>
                    <strong>Business information:</strong> Page details, ad
                    account information
                  </li>
                  <li>
                    <strong>Analytics data:</strong> Reach, engagement,
                    conversion metrics
                  </li>
                  <li>
                    <strong>OAuth tokens:</strong> Access tokens for API
                    authentication (stored securely)
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Usage and Technical Data">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Service usage:</strong> Features accessed, actions
                    performed, time spent
                  </li>
                  <li>
                    <strong>Device information:</strong> IP address, browser
                    type, operating system
                  </li>
                  <li>
                    <strong>Log data:</strong> Error logs, performance metrics,
                    security events
                  </li>
                </ul>
              </Subsection>
            </Section>
            <Section
              id="data-use"
              title="How We Use Your Information"
              icon={Users}
            >
              <Subsection title="Primary Purposes">
                <p className="mb-2">
                  We process your data solely for the following legitimate
                  business purposes:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Service delivery:</strong> Providing and operating
                    our advertising management platform
                  </li>
                  <li>
                    <strong>Performance analytics:</strong> Analyzing campaign
                    effectiveness and user behavior
                  </li>
                  <li>
                    <strong>Platform integration:</strong> Authenticating and
                    maintaining connections with Meta and other platforms
                  </li>
                  <li>
                    <strong>Customer support:</strong> Responding to inquiries
                    and resolving technical issues
                  </li>
                  <li>
                    <strong>Service improvement:</strong> Enhancing features and
                    user experience
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Legal Basis for Processing">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Contract performance:</strong> Processing necessary
                    to provide our services
                  </li>
                  <li>
                    <strong>Legitimate interests:</strong> Improving our
                    services and preventing fraud
                  </li>
                  <li>
                    <strong>Legal compliance:</strong> Meeting regulatory and
                    platform requirements
                  </li>
                  <li>
                    <strong>Consent:</strong> Where explicitly provided for
                    specific processing activities
                  </li>
                </ul>
              </Subsection>
            </Section>
            <Section
              id="prohibited-practices"
              title="Prohibited Practices"
              icon={AlertTriangle}
            >
              <p className="mb-4 text-red-700 font-medium">
                We strictly prohibit and will never engage in the following
                activities:
              </p>
              <ProhibitedPracticeItem
                title="Discrimination"
                description="We will not process Platform Data to discriminate based on race, ethnicity, religion, gender, or other protected characteristics."
              />
              <ProhibitedPracticeItem
                title="Eligibility Determinations"
                description="We will not use Platform Data to make eligibility determinations for housing, employment, insurance, education, or credit."
              />
              <ProhibitedPracticeItem
                title="Surveillance"
                description="We will not process Platform Data for surveillance purposes, including law enforcement activities."
              />
              <ProhibitedPracticeItem
                title="Data Monetization"
                description="We will never sell, license, or purchase Platform Data or build user profiles without consent."
              />
              <ProhibitedPracticeItem
                title="Data Manipulation"
                description="We will not attempt to decode, reverse-engineer, or re-identify anonymized data."
              />
            </Section>
            <Section
              id="data-sharing"
              title="Data Sharing and Disclosure"
              icon={Globe}
            >
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Restricted Sharing
                </h4>
                <p className="text-yellow-800">
                  We only share your data in the following limited
                  circumstances:
                </p>
              </div>
              <Subsection title="Service Providers">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Authorized vendors:</strong> Only with service
                    providers who assist in delivering our services
                  </li>
                  <li>
                    <strong>Contractual requirements:</strong> All service
                    providers must agree to use data solely for our purposes
                  </li>
                  <li>
                    <strong>Data separation:</strong> Platform data from
                    different sources is maintained separately
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Legal Requirements">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Court orders:</strong> When required by valid legal
                    process
                  </li>
                  <li>
                    <strong>Regulatory compliance:</strong> To meet applicable
                    laws and regulations
                  </li>
                  <li>
                    <strong>Documentation:</strong> We retain proof of legal
                    requirements
                  </li>
                </ul>
              </Subsection>
              <Subsection title="What We Don't Share">
                <ul className="list-disc pl-6 space-y-1">
                  <li>We never sell or rent your personal information</li>
                  <li>
                    We don't share data for third-party marketing without
                    explicit consent
                  </li>
                  <li>
                    We don't transfer data to countries without adequate data
                    protection
                  </li>
                </ul>
              </Subsection>
            </Section>
            <Section id="data-security" title="Data Security" icon={Lock}>
              <Subsection title="Technical Safeguards">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Encryption:</strong> All data encrypted in transit
                    (TLS 1.3) and at rest (AES-256)
                  </li>
                  <li>
                    <strong>Access controls:</strong> Role-based access with
                    multi-factor authentication
                  </li>
                  <li>
                    <strong>Network security:</strong> Firewalls, intrusion
                    detection, and monitoring systems
                  </li>
                  <li>
                    <strong>Secure storage:</strong> Cloud infrastructure with
                    enterprise-grade security certifications
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Administrative Safeguards">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Personnel screening:</strong> Background checks for
                    employees with data access
                  </li>
                  <li>
                    <strong>Training programs:</strong> Regular security and
                    privacy training for all staff
                  </li>
                  <li>
                    <strong>Access limitations:</strong> Strict need-to-know
                    basis for data access
                  </li>
                  <li>
                    <strong>Incident response:</strong> Documented procedures
                    for security breach response
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Token Protection">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>OAuth tokens:</strong> Securely stored and never
                    shared except with authorized service providers
                  </li>
                  <li>
                    <strong>Access tokens:</strong> Regularly rotated and
                    monitored for suspicious activity
                  </li>
                  <li>
                    <strong>App secrets:</strong> Protected with enterprise key
                    management systems
                  </li>
                </ul>
              </Subsection>
            </Section>
          </article>
        )}

        {/* Second Group */}
        {activeIdx === 1 && (
          <article>
            <Section
              id="data-retention"
              title="Data Retention and Deletion"
              icon={FileText}
            >
              <Subsection title="Retention Periods">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Platform Data:</strong> Retained only as long as
                    necessary for legitimate business purposes
                  </li>
                  <li>
                    <strong>Account data:</strong> Retained while your account
                    is active and for 30 days after closure
                  </li>
                  <li>
                    <strong>Analytics data:</strong> Aggregated data may be
                    retained for up to 2 years
                  </li>
                  <li>
                    <strong>Legal requirements:</strong> Some data may be
                    retained longer if required by law
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Your Data Rights">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    data
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a
                    structured format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing based on
                    legitimate interests
                  </li>
                </ul>
              </Subsection>
            </Section>
            <Section
              id="user-rights"
              title="User Rights and Contact"
              icon={Phone}
            >
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <ContactCard
                  title="General Privacy Inquiries"
                  email="privacy@cliquify.com"
                  description="For privacy-related questions or to exercise your rights"
                />
                <ContactCard
                  title="Data Protection Officer"
                  email="dpo@cliquify.com"
                  description="For complex privacy matters and compliance issues"
                />
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">
                  Response Commitment
                </h4>
                <ul className="text-green-800 space-y-1">
                  <li>• Privacy inquiries: 48 hours</li>
                  <li>• Data requests: 30 days</li>
                  <li>• Security incidents: 24 hours</li>
                  <li>• Most requests processed at no charge</li>
                </ul>
              </div>
            </Section>
            <Section
              id="incident-response"
              title="Incident Response"
              icon={AlertTriangle}
            >
              <Subsection title="Security Incident Reporting">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Immediate response:</strong> We investigate and
                    contain security incidents immediately
                  </li>
                  <li>
                    <strong>Platform notification:</strong> Meta and other
                    platforms notified within 24 hours
                  </li>
                  <li>
                    <strong>User notification:</strong> Affected users notified
                    in accordance with legal requirements
                  </li>
                  <li>
                    <strong>Remediation:</strong> Prompt implementation of
                    corrective measures
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Vulnerability Reporting">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 mb-2">
                    <strong>Security contact:</strong>{" "}
                    <a
                      href="mailto:security@cliquify.com"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      security@cliquify.com
                    </a>
                  </p>
                  <p className="text-blue-800 text-sm">
                    We acknowledge vulnerability reports within 24 hours and
                    have documented procedures for addressing security issues.
                  </p>
                </div>
              </Subsection>
            </Section>
            <Section
              id="compliance"
              title="Compliance and Monitoring"
              icon={Shield}
            >
              <Subsection title="Regular Audits">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Internal audits:</strong> Regular reviews of data
                    processing activities
                  </li>
                  <li>
                    <strong>Third-party assessments:</strong> External security
                    and privacy audits
                  </li>
                  <li>
                    <strong>Platform compliance:</strong> Ongoing monitoring of
                    platform requirement adherence
                  </li>
                  <li>
                    <strong>Corrective actions:</strong> Prompt remediation of
                    identified issues
                  </li>
                </ul>
              </Subsection>
              <Subsection title="Platform Cooperation">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Audit rights:</strong> We cooperate fully with
                    platform audits and reviews
                  </li>
                  <li>
                    <strong>Information requests:</strong> Prompt response to
                    platform information requests
                  </li>
                  <li>
                    <strong>Certification:</strong> Regular certifications of
                    compliance with platform requirements
                  </li>
                  <li>
                    <strong>Monitoring:</strong> Continuous monitoring of data
                    processing activities
                  </li>
                </ul>
              </Subsection>
            </Section>
            <Section
              id="policy-changes"
              title="Changes to This Policy"
              icon={FileText}
            >
              <Subsection title="Policy Updates">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Notification:</strong> We provide reasonable advance
                    notice of material changes
                  </li>
                  <li>
                    <strong>Effective date:</strong> Changes take effect 30 days
                    after notification
                  </li>
                  <li>
                    <strong>Continued use:</strong> Continued use of our
                    services constitutes acceptance of changes
                  </li>
                  <li>
                    <strong>Archive:</strong> Previous versions available upon
                    request
                  </li>
                </ul>
              </Subsection>
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
      {/* Footer */}
      {/* <div className="bg-gray-800 text-white p-6 rounded-lg mt-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            Questions about this policy?
          </h3>
          <p className="text-gray-300 mb-4">
            Contact our Privacy Team for assistance with any privacy-related
            questions or concerns.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:privacy@cliquify.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Email Privacy Team
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PrivacyPolicy;
