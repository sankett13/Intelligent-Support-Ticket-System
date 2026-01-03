require("dotenv").config();
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const KnowledgeBase = require("../models/knowledgebase");
const { embeddings } = require("../ai/embeddings");
const sequelize = require("../db");

async function ingestDocument(rawTexts) {
  try {
    await sequelize.sync({ alter: true });

    // 1. Initialize the Splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500, // Max characters per chunk
      chunkOverlap: 50, // "Leaking" 50 characters from previous chunk
    });

    for (const text of rawTexts) {
      // 2. Split the long text into smaller chunks
      const chunks = await splitter.splitText(text);
      console.log(`Splitting document into ${chunks.length} chunks...`);

      for (const chunk of chunks) {
        // 3. Embed each individual chunk
        const embeddingResponse = await embeddings.embedQuery(chunk);

        await KnowledgeBase.create({
          content: chunk,
          embedding: embeddingResponse,
        });
      }
    }

    console.log("✅ Ingestion with chunking complete.");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Example with a longer text
const longDocument = [
  `
  # CLINIC PROFILE: CITY-HEALTH PREMIER CARE
  City-Health Premier Care is a multi-specialty medical facility located at 123 Wellness Way, Metro City. 
  Our facility operates under the medical direction of Dr. Elena Rodriguez, specializing in Internal Medicine. 
  The clinic is divided into three primary wings: General Practice (Wing A), Pediatrics (Wing B), and 
  Advanced Diagnostics (Wing C).

  ## OPERATIONAL HOURS AND APPOINTMENTS
  The clinic is open Monday through Friday from 8:00 AM to 7:00 PM. On Saturdays, we offer urgent care 
  services from 9:00 AM to 2:00 PM. We are closed on Sundays and all major public holidays. 
  Patients can book appointments via our online portal, the "City-Health Mobile App," or by calling 
  the reception desk at 555-0199. 
  
  Cancellation Policy: We require at least 24 hours' notice for cancellations. Failure to do so 
  may result in a $25 "No-Show" fee, which is not covered by insurance providers.

  ## SPECIALIZED SERVICES
  1. Chronic Disease Management: Focused care for diabetes, hypertension, and asthma.
  2. Telehealth Consultations: Available for follow-up visits and non-emergency consultations 
     through our secure video platform.
  3. Lab Services: Our on-site lab (Wing C) provides blood work, urinalysis, and rapid strep testing 
     with results typically available within 24 to 48 hours.
  4. Immunization Clinic: We provide seasonal flu shots, travel vaccinations, and pediatric 
     immunization schedules.

  ## INSURANCE AND BILLING
  City-Health Premier Care is an "In-Network" provider for BlueShield, HealthLink, and GlobalCare. 
  For out-of-network patients, we offer a sliding scale fee based on household income. 
  Co-payments are due at the time of service and can be paid via credit card, cash, or HSA cards.

  ## FREQUENTLY ASKED QUESTIONS (FAQs)
  Q: Do I need a referral to see a specialist at your clinic?
  A: For Internal Medicine and General Practice, no referral is needed. However, our Cardiology 
  consultants (who visit on Tuesdays) require a referral from a primary care physician.

  Q: How can I access my medical records?
  A: Medical records are available through the "Patient Connect" portal. Users must register with 
  their Patient ID, which is provided during the first visit. Digital copies are free, while 
  printed copies incur a $0.10 per page printing fee.

  Q: What should I do if I have a medical emergency after hours?
  A: If you are experiencing a life-threatening emergency, please dial 911 immediately. 
  For urgent but non-life-threatening matters, you may call our after-hours nurse line at 555-0198 
  to speak with a triage professional.

  ## CLINIC STAFF CONTACTS
  - Chief Administrator: Marcus Thorne (m.thorne@cityhealth.test)
  - Head of Nursing: Sarah Jenkins, RN
  - Billing Department: billing@cityhealth.test
  `
];

ingestDocument(longDocument);
