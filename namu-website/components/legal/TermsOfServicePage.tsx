import { Entry, EntryA, EntryP, EntryUl, FootNote, LegalDocLayout, type LegalTocItem } from "./LegalDocLayout";

const LAST_UPDATED = "June 19, 2026";

const TOC: LegalTocItem[] = [
  { id: "acceptance",   label: "01  Introduction & acceptance" },
  { id: "about",        label: "02  About Namu and the Services" },
  { id: "eligibility",  label: "03  Who can use the Services" },
  { id: "content",      label: "04  Your content and our output" },
  { id: "model-use",    label: "05  Using content to improve our models" },
  { id: "accuracy",     label: "06  Accuracy & limitations of output" },
  { id: "acceptable",   label: "07  Acceptable use" },
  { id: "ip",           label: "08  Intellectual property" },
  { id: "term",         label: "09  Term, suspension & termination" },
  { id: "disclaimers",  label: "10  Disclaimers" },
  { id: "liability",    label: "11  Limitation of liability" },
  { id: "indemnity",    label: "12  Indemnification" },
  { id: "governing-law",label: "13  Governing law & disputes" },
  { id: "general",      label: "14  General terms" },
  { id: "contact",      label: "15  Contact us" },
];

export function TermsOfServicePage() {
  return (
    <LegalDocLayout
      kicker="Legal"
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={
        'These Terms of Service ("Terms") govern your access to and use of namu-ai.org and Namu\'s ' +
        'Playground demo (together, the "Services"). By using the Services, you agree to these Terms — ' +
        "please read them carefully."
      }
      toc={TOC}
    >
      <Entry id="acceptance" num="01" title="Introduction & acceptance">
        <EntryP>
          These Terms form an agreement between you and Namu ("Namu," "we," "us") governing your access to and
          use of the Services. By accessing or using the Services, you agree to be bound by these Terms and
          our <EntryA href="/privacy">Privacy Policy</EntryA>. If you do not agree, do not use the Services.
        </EntryP>
      </Entry>

      <Entry id="about" num="02" title="About Namu and the Services">
        <EntryP>
          Namu is an African AI research and technology company building speech-native AI infrastructure for
          African languages, starting with Hausa. The Services currently include this website, our blog, and
          the Playground, where you can try early demonstrations of our speech recognition, speech synthesis,
          and language features.
        </EntryP>
        <EntryP>
          Namu is an early-stage company. Products and models referenced on the Services, including any marked
          "in development," may not yet be publicly available, and any part of the Services — including
          features, availability, and accuracy — may change, be suspended, or be discontinued at any time.
        </EntryP>
      </Entry>

      <Entry id="eligibility" num="03" title="Who can use the Services">
        <EntryP>
          You must be able to form a binding contract with Namu to use the Services, and you must comply with
          all laws applicable to your use. If you are using the Services on behalf of an organization, you
          represent that you have the authority to bind that organization to these Terms. If you are under the
          age of majority in your jurisdiction, you may use the Services only with the involvement and consent
          of a parent or guardian.
        </EntryP>
      </Entry>

      <Entry id="content" num="04" title="Your content and our output">
        <EntryP>
          The Services may let you submit text, audio, images, or other material, including audio captured
          through your microphone ("Content"). You retain any ownership rights you already have in your
          Content.
        </EntryP>
        <EntryP>
          Where a feature of the Services produces a result based on your Content — such as a transcript or
          synthesized speech ("Output") — Namu assigns you all of its right, title, and interest, if any, in
          that Output, so you may use it for your own lawful purposes, subject to these Terms.
        </EntryP>
        <EntryP>
          You're responsible for your Content and for making sure you have the rights necessary to submit it.
          Don't submit Content that you don't have the right to share, or that contains sensitive personal
          information about yourself or others beyond what's necessary for the feature you're using.
        </EntryP>
      </Entry>

      <Entry id="model-use" num="05" title="Using content to improve our models">
        <EntryP>
          Building AI for African languages depends on real speech and language data. Where a feature asks for
          your permission to use your Content to help develop or evaluate Namu's models, we will tell you
          before you provide it, and we will only use it for that purpose where you've given that permission or
          where the law otherwise allows it. You can withdraw your permission, and ask us to delete Content
          you've submitted, at any time — see our <EntryA href="/privacy">Privacy Policy</EntryA>.
        </EntryP>
      </Entry>

      <Entry id="accuracy" num="06" title="Accuracy & limitations of output">
        <EntryP>
          Our speech and language models are under active development and may produce Output that is
          incomplete, inaccurate, or unavailable. Output may not always reflect reality, and you should
          independently verify it before relying on it, especially for anything important. The Services,
          including the Playground, are provided for demonstration and evaluation purposes and should not be
          relied on as the sole basis for any decision.
        </EntryP>
      </Entry>

      <Entry id="acceptable" num="07" title="Acceptable use">
        <EntryP>When using the Services, you agree not to:</EntryP>
        <EntryUl
          items={[
            "Violate any applicable law, or infringe the intellectual property, privacy, or other rights of any person.",
            "Use the Services to generate or share content that is harmful, abusive, deceptive, or that misrepresents a real person — in particular, members of the African language communities Namu serves.",
            "Probe, scan, reverse-engineer, or attempt to extract Namu's models, model weights, source code, or training data.",
            "Interfere with or disrupt the integrity or performance of the Services, including through malicious code or unauthorized automated access.",
            "Misrepresent your affiliation with Namu, or use Namu's name, logo, or other marks without our permission.",
          ]}
        />
      </Entry>

      <Entry id="ip" num="08" title="Intellectual property">
        <EntryP>
          Namu owns the Services and all related software, technology, and content, other than your Content
          and Output, and other than material owned by third parties. Except for the rights expressly granted
          to you in these Terms, no other rights or licenses are granted, by implication or otherwise.
        </EntryP>
        <EntryP>
          The Namu name, logo, and other Namu trademarks may not be used in connection with any product or
          service without our prior written permission.
        </EntryP>
      </Entry>

      <Entry id="term" num="09" title="Term, suspension & termination">
        <EntryP>
          These Terms apply for as long as you use the Services. We may suspend or terminate your access to the
          Services at any time, including if we reasonably believe you've violated these Terms, to protect the
          Services or other users, or to comply with law. You may stop using the Services at any time.
          Provisions of these Terms that by their nature should survive termination will survive, including
          ownership, disclaimers, and limitations of liability.
        </EntryP>
      </Entry>

      <Entry id="disclaimers" num="10" title="Disclaimers">
        <EntryP>
          The Services, including all Output, are provided "as is" and "as available," without warranties of
          any kind, whether express, implied, or statutory, including warranties of merchantability, fitness
          for a particular purpose, or non-infringement. Namu does not warrant that the Services will be
          uninterrupted, secure, or error-free, or that any Output will be accurate or reliable.
        </EntryP>
      </Entry>

      <Entry id="liability" num="11" title="Limitation of liability">
        <EntryP>
          To the maximum extent permitted by law, Namu and its founders, employees, and partners will not be
          liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, data, or goodwill, arising from your use of the Services, even if Namu has been advised of
          the possibility of such damages. Namu's total liability for any claim arising from these Terms or the
          Services will not exceed one hundred U.S. dollars ($100).
        </EntryP>
      </Entry>

      <Entry id="indemnity" num="12" title="Indemnification">
        <EntryP>
          You agree to indemnify and hold harmless Namu and its founders, employees, and partners from any
          claim, loss, or demand, including reasonable legal fees, arising from your Content, your use of the
          Services, or your violation of these Terms.
        </EntryP>
      </Entry>

      <Entry id="governing-law" num="13" title="Governing law & disputes">
        <EntryP>
          These Terms are governed by the laws of [Governing law jurisdiction — to be confirmed once Namu's
          entity is formed], without regard to conflict-of-laws principles. Before this clause is relied upon,
          please confirm the governing jurisdiction with counsel.
        </EntryP>
        <EntryP>
          If a dispute arises from these Terms or the Services, please contact us first at{" "}
          <EntryA href="mailto:legal@namuai.org">legal@namuai.org</EntryA> so we can try to resolve it
          informally.
        </EntryP>
      </Entry>

      <Entry id="general" num="14" title="General terms">
        <EntryP>
          These Terms, together with our Privacy Policy, are the entire agreement between you and Namu
          regarding the Services and supersede any prior agreements between you and Namu about the Services. If
          any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.
          Our failure to enforce any provision is not a waiver of our right to do so later. You may not assign
          these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale
          of assets. We may update these Terms as the Services evolve; continued use of the Services after a
          change means you accept the updated Terms.
        </EntryP>
      </Entry>

      <Entry id="contact" num="15" title="Contact us">
        <EntryP>
          Questions about these Terms can be sent to{" "}
          <EntryA href="mailto:legal@namuai.org">legal@namuai.org</EntryA>.
        </EntryP>
      </Entry>

      <FootNote>
        See also our <EntryA href="/privacy">Privacy Policy</EntryA>.
      </FootNote>
    </LegalDocLayout>
  );
}
