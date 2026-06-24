import { Entry, EntryA, EntryP, EntryUl, FootNote, LegalDocLayout, type LegalTocItem } from "./LegalDocLayout";

const LAST_UPDATED = "June 19, 2026";

const TOC: LegalTocItem[] = [
  { id: "introduction",  label: "01  Introduction" },
  { id: "information",   label: "02  Personal information we collect" },
  { id: "use",           label: "03  How we use personal information" },
  { id: "model-data",    label: "04  Using content to develop our models" },
  { id: "disclosure",    label: "05  How we disclose personal information" },
  { id: "cookies",       label: "06  Cookies & similar technologies" },
  { id: "retention",     label: "07  Data retention" },
  { id: "rights",        label: "08  Your rights & choices" },
  { id: "security",      label: "09  Security" },
  { id: "international", label: "10  International data transfers" },
  { id: "children",      label: "11  Children's privacy" },
  { id: "changes",       label: "12  Changes to this policy" },
  { id: "contact",       label: "13  Contact us" },
];

export function PrivacyPolicyPage() {
  return (
    <LegalDocLayout
      kicker="Legal"
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        'Namu ("Namu," "we," "us") is an African AI research and technology company building speech-native ' +
        "AI infrastructure for African languages, starting with Hausa. This Privacy Policy explains what " +
        "personal information we collect through namu-ai.org and our Playground demo (together, the " +
        '"Services"), how we use and share it, and the choices available to you.'
      }
      toc={TOC}
    >
      <Entry id="introduction" num="01" title="Introduction">
        <EntryP>
          This Privacy Policy describes how Namu collects, uses, and shares personal information when you use
          the Services. It does not apply to products we have not yet publicly released, or to third-party
          services we don't control.
        </EntryP>
        <EntryP>
          By using the Services, you agree to the collection and use of information as described here. If you
          do not agree, please don't use the Services.
        </EntryP>
      </Entry>

      <Entry id="information" num="02" title="Personal information we collect">
        <EntryUl
          items={[
            <>
              <strong>Information you provide to us.</strong> Your name, email address, and the contents of
              any message you send us through our contact channels, as well as any information you provide if
              you ask to hear from us about new Namu products.
            </>,
            <>
              <strong>Content you submit through the Services.</strong> Text, audio, voice recordings, images,
              and files you submit through the Playground or similar features ("Content"), including audio
              captured through your microphone if you grant permission.
            </>,
            <>
              <strong>Output we generate for you.</strong> Results our models produce in response to your
              Content, such as a transcript of your speech or audio synthesized from your text ("Output").
            </>,
            <>
              <strong>Information collected automatically.</strong> IP address, browser and device type,
              operating system, referring pages, and similar diagnostic data, collected through standard
              server and hosting logs.
            </>,
          ]}
        />
      </Entry>

      <Entry id="use" num="03" title="How we use personal information">
        <EntryUl
          items={[
            "Provide, maintain, and secure the Services.",
            "Respond to questions and requests sent through our contact channels.",
            "Communicate with you about Namu, if you've asked to hear from us.",
            "Monitor and analyze usage to understand and improve the Services.",
            "Detect, investigate, and prevent fraud, abuse, and security incidents.",
            "Comply with our legal obligations.",
          ]}
        />
      </Entry>

      <Entry id="model-data" num="04" title="Using content to develop our models">
        <EntryP>
          Namu's mission is to build AI that understands and speaks African languages, including many that are
          barely represented in AI systems today. Doing that well depends on real speech and language data.
        </EntryP>
        <EntryP>
          Where a feature of the Services — such as the Playground — asks for your permission to use your
          Content to help train or evaluate Namu's models, we will tell you before you provide it. We only use
          your Content to develop or improve our models where you've given that permission, or where we're
          otherwise permitted to do so by law.
        </EntryP>
        <EntryP>
          You can withdraw that permission, and ask us to delete Content you've submitted, at any time — see{" "}
          <EntryA href="#rights">Your rights &amp; choices</EntryA>.
        </EntryP>
      </Entry>

      <Entry id="disclosure" num="05" title="How we disclose personal information">
        <EntryP>We do not sell your personal information. We may disclose it only to:</EntryP>
        <EntryUl
          items={[
            <>
              <strong>Service providers</strong> who host the Services or help us operate them, such as
              hosting and infrastructure providers, bound by confidentiality and data-protection obligations.
            </>,
            <>
              <strong>Legal and safety authorities</strong>, where required by law, regulation, or legal
              process, or to protect the rights, property, or safety of Namu, our users, or the public.
            </>,
            <>
              <strong>Successors</strong>, in connection with a merger, financing, acquisition, or sale of
              assets, subject to standard confidentiality arrangements.
            </>,
            <>
              <strong>Other parties with your consent</strong>, for any purpose we disclose to you at the time
              of collection.
            </>,
          ]}
        />
      </Entry>

      <Entry id="cookies" num="06" title="Cookies & similar technologies">
        <EntryP>
          The Services use limited local storage to remember your language preference (English or Hausa) so
          they work the way you left them. We do not currently use third-party advertising or analytics
          cookies. If that changes, we will update this policy and, where required, ask for your consent.
        </EntryP>
      </Entry>

      <Entry id="retention" num="07" title="Data retention">
        <EntryP>
          We retain personal information for as long as necessary to provide the Services, comply with our
          legal obligations, resolve disputes, and enforce our agreements. Content you submit through the
          Playground, including audio, is retained only for as long as needed for the purpose you provided it
          for, or until you ask us to delete it.
        </EntryP>
      </Entry>

      <Entry id="rights" num="08" title="Your rights & choices">
        <EntryP>Depending on where you live, you may have the right to:</EntryP>
        <EntryUl
          items={[
            "Access the personal information we hold about you.",
            "Correct inaccurate personal information.",
            "Delete personal information we hold about you.",
            "Object to, or restrict, certain processing of your personal information.",
            "Withdraw consent you've previously given us, including consent to use your Content to develop our models.",
            "Receive a copy of your personal information in a portable format.",
          ]}
        />
        <EntryP>
          To exercise any of these rights, email{" "}
          <EntryA href="mailto:legal@namuai.org">legal@namuai.org</EntryA>. We will respond to verified
          requests within the time required by applicable law.
        </EntryP>
      </Entry>

      <Entry id="security" num="09" title="Security">
        <EntryP>
          We use reasonable technical and organizational measures designed to protect personal information
          from loss, misuse, and unauthorized access. No method of transmission or storage is completely
          secure, and we cannot guarantee absolute security.
        </EntryP>
      </Entry>

      <Entry id="international" num="10" title="International data transfers">
        <EntryP>
          Namu is built in Niger and the United States. Your information may be transferred to, stored, and
          processed in either country, or in other countries where our service providers operate. Where
          required, we use appropriate safeguards to protect personal information transferred internationally.
        </EntryP>
      </Entry>

      <Entry id="children" num="11" title="Children's privacy">
        <EntryP>
          The Services are not directed to children, and we do not knowingly collect personal information from
          children under 13. If you believe a child has provided us with personal information, contact us so
          we can delete it.
        </EntryP>
      </Entry>

      <Entry id="changes" num="12" title="Changes to this policy">
        <EntryP>
          We may update this Privacy Policy as Namu and the Services evolve. We'll revise the date below and,
          where a change is material, take reasonable steps to notify you.
        </EntryP>
      </Entry>

      <Entry id="contact" num="13" title="Contact us">
        <EntryP>
          Questions about this policy or how we handle personal information can be sent to{" "}
          <EntryA href="mailto:legal@namuai.org">legal@namuai.org</EntryA>.
        </EntryP>
      </Entry>

      <FootNote>
        See also our <EntryA href="/terms">Terms of Service</EntryA>.
      </FootNote>
    </LegalDocLayout>
  );
}
