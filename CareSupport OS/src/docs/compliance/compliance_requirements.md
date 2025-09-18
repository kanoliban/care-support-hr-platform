# CareRadar Database: Home Health Care Compliance Requirements (February 2025)

This is the first manual CareRadar database for CareSupport.com, supporting HAAS (59 employees, 39 clients in Minnesota) as of February 24, 2025. It lists prioritized federal and Minnesota requirements, with a summary table for quick access and detailed Frameworks, Documents, Policies, and Controls for non-technical validation in Google Docs. Do not simplify details—preserve all for production readiness. Use this to prompt Bolt.new for MVP integration later.

## Summary Table

### Federal Requirements

| Title                                      | Authority                              | Citation                          | Published          | Effective          | Jurisdiction | Category         | Cross-References                        | Source Link                                                                 |
|--------------------------------------------|----------------------------------------|-----------------------------------|-------------------|-------------------|--------------|-----------------|-----------------------------|-------------------------------------------------------------------------------|
| Medicare Conditions of Participation       | CMS                                    | 42 CFR Part 484                  | Jan 13, 2017       | Jan 13, 2018       | Federal      | Compliance/Operations | HIPAA, OIG Guidance         | [CMS Home Health](https://www.cms.gov/medicare/health-safety-standards/guidance-for-laws-regulations/home-health-agencies) |
| HIPAA Privacy & Security Rules             | HHS OCR                                | 45 CFR Parts 160, 164            | Dec 28, 2000       | Apr 14, 2003       | Federal      | Privacy/Security | CMS CoPs                    | [HHS HIPAA](https://www.hhs.gov/hipaa/for-professionals/index.html)           |
| OIG Compliance Program Guidance            | HHS OIG                                | 63 FR 42410 (1998); GCPG 2023    | Aug 7, 1998        | Voluntary          | Federal      | Compliance       | Anti-Kickback, False Claims | [OIG Guidance](https://oig.hhs.gov/compliance/compliance-guidance/)            |
| Medicare Home Health Face-to-Face          | CMS                                    | 42 CFR §424.22(a)(1)(v)          | Nov 17, 2010       | Jan 1, 2011        | Federal      | Compliance/Funding | Medicare CoPs               | [CMS Face-to-Face](https://www.cms.gov/files/document/may-20-2014-home-health-face-face-special-open-door-forum-presentation-508-cleanpdf) |
| Medicaid Home Health Services Final Rule   | CMS                                    | 42 CFR §440.70                   | Feb 2, 2016        | Jul 1, 2016        | Federal      | Compliance/Operations | Medicare F2F               | [Federal Register](https://www.federalregister.gov/documents/2016/02/02/2016-01585/medicaid-program-face-to-face-requirements-for-home-health-services-policy-changes-and) |

### Minnesota Requirements

| Title                                      | Authority                              | Citation                          | Published          | Effective          | Jurisdiction | Category         | Cross-References                        | Source Link                                                                 |
|--------------------------------------------|----------------------------------------|-----------------------------------|-------------------|-------------------|--------------|-----------------|-----------------------------|-------------------------------------------------------------------------------|
| Minnesota Home Care Provider Licensing     | Minnesota Department of Health (MDH)   | Minn. Stat. §144A.471            | 2013              | Jul 1, 2014        | Minnesota    | Compliance/Operations | Minn. Stat. §245C         | [Minn. Stat. §144A.471](https://www.revisor.mn.gov/statutes/cite/144A.471)    |
| Minnesota Home Care Operational Standards  | MDH                                    | Minn. Stat. §§144A.479–144A.4798 | 2013              | Jul 1, 2014        | Minnesota    | Operations/Compliance | Federal CoPs             | [MDH Statutes](https://www.health.state.mn.us/facilities/regulation/homecare/laws/statutes.html) |
| Minnesota Home Care Bill of Rights         | MDH                                    | Minn. Stat. §144A.44             | 1987; amended 2019 | Aug 1, 1988        | Minnesota    | Compliance       | Vulnerable Adults Act     | [Minn. Stat. §144A.44](https://www.revisor.mn.gov/statutes/cite/144A.44)      |
| Minnesota Home Care Documentation Standards| MDH                                    | Minn. Stat. §§144A.4791–144A.4792| 2013              | Jul 1, 2014        | Minnesota    | Documentation/Compliance | Federal CoPs            | [MDH Statutes](https://www.health.state.mn.us/facilities/regulation/homecare/laws/statutes.html) |
| Minnesota Home Care Quality Improvement    | MDH                                    | Minn. Stat. §144A.483            | 2013              | 2014               | Minnesota    | Operations/Compliance | 42 CFR 484.65            | [MDH Statutes](https://www.health.state.mn.us/facilities/regulation/homecare/laws/statutes.html) |

## Detailed Frameworks

### Medicare Conditions of Participation (42 CFR Part 484)

#### Documents
- **Patient Rights Notice**: A notice given to patients before care starts, detailing their rights (e.g., to be informed, to voice grievances) per 42 CFR 484.50. Ensures HAAS’s clients know their rights daily. [Source](https://www.law.cornell.edu/cfr/text/42/484.50)
- **Individualized Plan of Care**: A physician-approved care plan outlining services, reviewed every 60 days per 42 CFR 484.60. Critical for HAAS’s scheduling and audits. [Source](https://www.law.cornell.edu/cfr/text/42/484.60)
- **Emergency Preparedness Plan**: A plan for emergencies, updated every 2 years per 42 CFR 484.102. Ensures HAAS’s readiness for disruptions. [Source](https://www.law.cornell.edu/cfr/text/42/484.102)
- **Clinical Records**: Patient records with assessments, care plans, and notes per 42 CFR 484.110. Vital for HAAS’s documentation and compliance. [Source](https://www.law.cornell.edu/cfr/text/42/484.110)

#### Policies
- **Quality Assessment and Performance Improvement (QAPI) Program**: A data-driven program to improve care quality per 42 CFR 484.65. Ensures HAAS’s service quality meets federal standards. [Source](https://www.customsmobile.com/regulations/expand/title42_chapterIV-i3_part484_subpartB_section484.65)
- **Infection Prevention and Control Policy**: Procedures to prevent infections per 42 CFR 484.70. Protects HAAS’s clients and staff daily. [Source](https://www.law.cornell.edu/cfr/text/42/484.70)
- **Patient Rights and Complaint Policy**: Protects patient rights and handles complaints per 42 CFR 484.50. Ensures HAAS’s client satisfaction. [Source](https://www.law.cornell.edu/cfr/text/42/484.50)
- **Emergency Preparedness Procedures**: Details staff actions during emergencies per 42 CFR 484.102. Prepares HAAS for crises. [Source](https://www.law.cornell.edu/cfr/text/42/484.102)
- **Personnel Qualification and Training Policy**: Ensures staff are qualified and trained per 42 CFR 484.115. Maintains HAAS’s compliance daily. [Source](https://www.law.cornell.edu/cfr/text/42/484.115)

#### Controls
- **Verify Caregiver Qualifications**: Checks staff credentials before care per 42 CFR 484.115. Ensures HAAS’s 59 employees meet standards daily. [Source](https://www.law.cornell.edu/cfr/text/42/484.115)
- **Initial Assessment and Admission Protocol**: Assesses patients within 5 days per 42 CFR 484.55. Supports HAAS’s client intake. [Source](https://www.law.cornell.edu/cfr/text/42/484.55)
- **Plan of Care Review and Physician Orders**: Updates care plans every 60 days per 42 CFR 484.60. Keeps HAAS aligned with federal rules. [Source](https://www.law.cornell.edu/cfr/text/42/484.60)
- **Clinical Record Audits**: Ensures records comply with 42 CFR 484.110. Prepares HAAS for audits. [Source](https://www.law.cornell.edu/cfr/text/42/484.110)
- **Emergency Drill and Staff Training**: Tests emergency plans annually per 42 CFR 484.102. Ensures HAAS’s readiness. [Source](https://www.law.cornell.edu/cfr/text/42/484.102)
- **QAPI Performance Reviews**: Monitors care quality per 42 CFR 484.65. Improves HAAS’s service delivery. [Source](https://www.customsmobile.com/regulations/expand/title42_chapterIV-i3_part484_subpartB_section484.65)
- **Patient Rights Enforcement**: Verifies rights protection per 42 CFR 484.50. Ensures HAAS’s client rights daily. [Source](https://www.law.cornell.edu/cfr/text/42/484.50)

### HIPAA Privacy & Security Rules (45 CFR Parts 160, 164)

#### Documents
- **Notice of Privacy Practices (NPP)**: Explains PHI use and patient rights per 45 CFR 164.520. Ensures HAAS protects client data daily. [Source](https://www.govinfo.gov/app/details/CFR-2011-title45-vol1/CFR-2011-title45-vol1-sec164-520)
- **HIPAA Policies and Procedures Documentation**: Details privacy/security measures per 45 CFR 164.530(j). Critical for HAAS’s data handling. [Source](https://www.govinfo.gov/content/pkg/CFR-2007-title45-vol1/pdf/CFR-2007-title45-vol1-sec164-530.pdf)
- **Risk Analysis and Risk Management Reports**: Assesses ePHI risks per 45 CFR 164.308(a)(1)(ii)(A). Ensures HAAS’s security compliance. [Source](https://www.law.cornell.edu/cfr/text/45/164.308)
- **Business Associate Agreements (BAAs)**: Contracts with PHI-handling vendors per 45 CFR 164.502(e). Protects HAAS’s partnerships. [Source](https://www.law.cornell.edu/cfr/text/45/164.502)
- **HIPAA Training Records**: Proves staff training per 45 CFR 164.530(b). Ensures HAAS’s staff are trained daily. [Source](https://www.govinfo.gov/content/pkg/CFR-2007-title45-vol1/pdf/CFR-2007-title45-vol1-sec164-530.pdf)

#### Policies
- **HIPAA Privacy Policy**: Governs PHI protection per 45 CFR 164.502. Ensures HAAS’s client privacy daily. [Source](https://www.law.cornell.edu/cfr/text/45/164.502)
- **HIPAA Security Policy**: Secures ePHI per 45 CFR 164.308. Protects HAAS’s electronic systems. [Source](https://www.law.cornell.edu/cfr/text/45/164.308)
- **Breach Notification Policy**: Outlines breach response per 45 CFR 164.400-414. Prepares HAAS for incidents. [Source](https://www.law.cornell.edu/cfr/text/45/164.400)
- **Data Retention and Disposal Policy**: Manages PHI retention/destruction per 45 CFR 164.530(j). Ensures HAAS’s data security. [Source](https://www.govinfo.gov/content/pkg/CFR-2007-title45-vol1/pdf/CFR-2007-title45-vol1-sec164-530.pdf)
- **Workforce Sanctions and Training Policy**: Sets sanctions and training per 45 CFR 164.530(e)&(b). Enforces HAAS’s compliance. [Source](https://www.govinfo.gov/content/pkg/CFR-2007-title45-vol1/pdf/CFR-2007-title45-vol1-sec164-530.pdf)

#### Controls
- **Access Control and User Authentication**: Limits PHI access per 45 CFR 164.312(a)(2)(i). Ensures HAAS’s data security daily. [Source](https://www.law.cornell.edu/cfr/text/45/164.312)
- **Encryption of ePHI**: Protects ePHI per 45 CFR 164.312(a)(2)(iv). Secures HAAS’s systems. [Source](https://www.law.cornell.edu/cfr/text/45/164.312)
- **Regular Risk Analysis**: Assesses ePHI risks annually per 45 CFR 164.308(a)(1). Maintains HAAS’s compliance. [Source](https://www.law.cornell.edu/cfr/text/45/164.308)
- **Audit Logs and Monitoring**: Tracks system activity per 45 CFR 164.308(a)(1)(ii)(D). Ensures HAAS’s security. [Source](https://www.law.cornell.edu/cfr/text/45/164.308)
- **Secure PHI Disposal**: Ensures safe disposal per 45 CFR 164.310(d)(2)(i). Protects HAAS’s data. [Source](https://www.law.cornell.edu/cfr/text/45/164.310)
- **Business Associate Management**: Verifies BAAs per 45 CFR 164.502(e). Ensures HAAS’s partnerships. [Source](https://www.law.cornell.edu/cfr/text/45/164.502)

### OIG Compliance Program Guidance

#### Documents
- **Code of Conduct**: Sets ethical standards per OIG guidance. Ensures HAAS’s integrity daily. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Comprehensive Compliance Policies and Procedures**: Covers risk areas per OIG guidance. Maintains HAAS’s compliance. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Compliance Training Materials**: Educates staff per OIG guidance. Prepares HAAS’s team. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Fraud and Abuse Prevention Plan**: Prevents fraud per OIG guidance. Protects HAAS’s funding. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Compliance Committee Minutes/Reports**: Records oversight per OIG guidance. Ensures HAAS’s accountability. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)

#### Policies
- **Compliance Reporting & Non-Retaliation Policy**: Encourages reporting per OIG guidance. Supports HAAS’s transparency. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Disciplinary Action Policy**: Enforces standards per OIG guidance. Maintains HAAS’s discipline. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Billing and Coding Compliance Policy**: Ensures accurate billing per OIG guidance. Protects HAAS’s funding. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Anti-Kickback and Referral Relations Policy**: Prevents illegal referrals per OIG guidance. Ensures HAAS’s legality. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Exclusion Screening Policy**: Avoids excluded hires per OIG guidance. Maintains HAAS’s compliance. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)

#### Controls
- **Appoint a Compliance Officer and Committee**: Oversees compliance per OIG guidance. Ensures HAAS’s oversight. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Training and Education Program**: Trains staff per OIG guidance. Prepares HAAS’s team. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Internal Audits and Monitoring**: Detects issues per OIG guidance. Ensures HAAS’s audits. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Hotline and Issue Tracking**: Facilitates reporting per OIG guidance. Supports HAAS’s reporting. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Exclusion List Screening Checks**: Screens staff per OIG guidance. Maintains HAAS’s compliance. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)
- **Disciplinary Enforcement Actions**: Enforces accountability per OIG guidance. Ensures HAAS’s standards. [Source](https://oig.hhs.gov/documents/compliance-guidance/804/HHAg.pdf)

### Medicare Home Health Face-to-Face Encounter Requirement (42 CFR §424.22(a)(1)(v))

#### Documents
- **Face-to-Face Encounter Documentation**: Proves patient eligibility per 42 CFR 424.22. Ensures HAAS’s Medicare compliance daily. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **Physician Certification/Plan of Care (with F2F Attestation)**: Includes F2F attestation per 42 CFR 424.22. Supports HAAS’s intake. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **Face-to-Face Visit Checklist/Template**: Ensures compliance per 42 CFR 424.22. Prepares HAAS for audits. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)

#### Policies
- **Face-to-Face Compliance Policy**: Ensures F2F occurs per 42 CFR 424.22. Maintains HAAS’s Medicare eligibility. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **Physician Communication Policy**: Secures timely documentation per 42 CFR 424.22. Ensures HAAS’s efficiency. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **Admission Intake Policy (Medicare)**: Verifies F2F at intake per 42 CFR 424.22. Supports HAAS’s operations. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)

#### Controls
- **Admission Checklist Verification**: Confirms F2F before admission per 42 CFR 424.22. Ensures HAAS’s compliance. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **EMR Alert for F2F**: Tracks F2F completion per 42 CFR 424.22. Supports HAAS’s tracking. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **Quality Review of Narratives**: Checks narrative adequacy per 42 CFR 424.22. Ensures HAAS’s accuracy. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **Timely Physician Follow-up**: Ensures timely F2F per 42 CFR 424.22. Maintains HAAS’s compliance. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)
- **No-Bill Hold**: Prevents billing without F2F per 42 CFR 424.22. Protects HAAS’s funding. [Source](https://www.law.cornell.edu/cfr/text/42/424.22)

### Medicaid Home Health Services Final Rule (42 CFR §440.70)

#### Documents
- **Medicaid Face-to-Face Encounter Record**: Confirms eligibility per 42 CFR 440.70. Ensures HAAS’s Medicaid compliance. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **Physician’s Order and Plan of Care**: Authorizes services per 42 CFR 440.70. Supports HAAS’s operations. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **State Medicaid Prior Authorization Forms (if applicable)**: Secures approvals per 42 CFR 440.70. Ensures HAAS’s funding. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)

#### Policies
- **Medicaid Face-to-Face Policy**: Ensures F2F compliance per 42 CFR 440.70. Maintains HAAS’s Medicaid eligibility. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **Medicaid Coverage and Authorization Policy**: Defines covered services per 42 CFR 440.70. Ensures HAAS’s service alignment. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **Telehealth Utilization Policy**: Allows telehealth F2F per 42 CFR 440.70. Supports HAAS’s flexibility. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)

#### Controls
- **Medicaid Eligibility and Order Verification**: Confirms eligibility per 42 CFR 440.70. Ensures HAAS’s compliance. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **Face-to-Face Encounter Tracking (Medicaid)**: Tracks F2F per 42 CFR 440.70. Supports HAAS’s tracking. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **Service Utilization Reviews**: Matches services to plans per 42 CFR 440.70. Ensures HAAS’s accuracy. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **Integration with State Systems (EVV if applicable)**: Ensures EVV compliance per 42 CFR 440.70. Prepares HAAS for scaling (optional for MVP). [Source](https://www.law.cornell.edu/cfr/text/42/440.70)
- **No Service Prior to F2F for DME**: Verifies F2F for equipment per 42 CFR 440.70. Protects HAAS’s funding. [Source](https://www.law.cornell.edu/cfr/text/42/440.70)

## Minnesota Requirements

### Minnesota Home Care Provider Licensing (Minn. Stat. §144A.471)

#### Documents
- **Home Care License Certificate**: Proves licensure per Minn. Stat. §144A.471. Ensures HAAS’s compliance daily. [Source](https://www.revisor.mn.gov/statutes/cite/144A.471)
- **License Application and Renewal Records**: Tracks licensing per Minn. Stat. §144A.471. Maintains HAAS’s status. [Source](https://www.revisor.mn.gov/statutes/cite/144A.471)
- **Background Study Verification**: Confirms checks per Minn. Stat. §144A.476. Ensures HAAS’s staff safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.476)
- **Liability Insurance Policy**: Ensures coverage per Minn. Stat. §144A.479. Protects HAAS’s operations. [Source](https://www.revisor.mn.gov/statutes/cite/144A.479)

#### Policies
- **Scope of Service and Geographic Area Policy**: Defines services per Minn. Stat. §144A.471. Ensures HAAS’s clarity. [Source](https://www.revisor.mn.gov/statutes/cite/144A.471)
- **License Maintenance and Reporting Policy**: Ensures renewal per Minn. Stat. §144A.475. Maintains HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.475)
- **Manager Qualifications and Responsibilities Policy**: Sets roles per Minn. Stat. §144A.476. Ensures HAAS’s leadership. [Source](https://www.revisor.mn.gov/statutes/cite/144A.476)
- **Regulatory Compliance Policy**: Commits to laws per Minn. Stat. §144A.43. Ensures HAAS’s adherence. [Source](https://www.revisor.mn.gov/statutes/cite/144A.43)

#### Controls
- **Active License Monitoring**: Tracks status per Minn. Stat. §144A.471. Ensures HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.471)
- **Background Study Compliance Checks**: Verifies studies per Minn. Stat. §144A.476. Ensures HAAS’s safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.476)
- **Personnel Roster Reporting**: Updates MDH per Minn. Stat. §144A.475. Ensures HAAS’s accuracy. [Source](https://www.revisor.mn.gov/statutes/cite/144A.475)
- **Survey Readiness Binder**: Prepares for surveys per Minn. Stat. §144A.474. Ensures HAAS’s readiness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.474)
- **Incident Reporting to MDH**: Reports incidents per Minn. Stat. §144A.45. Ensures HAAS’s accountability. [Source](https://www.revisor.mn.gov/statutes/cite/144A.45)

### Minnesota Home Care Operational Standards (Minn. Stat. §§144A.479–144A.4798)

#### Documents
- **Comprehensive Client Service Plan**: Details care per Minn. Stat. §144A.4791. Ensures HAAS’s client care. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Emergency and Disaster Preparedness Plan**: Plans emergencies per Minn. Stat. §144A.4791. Ensures HAAS’s readiness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Client Record (Individual Chart)**: Stores all records per Minn. Stat. §144A.4794. Ensures HAAS’s documentation. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Staff Orientation and Training Records**: Proves training per Minn. Stat. §144A.4796. Ensures HAAS’s staff readiness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4796)
- **Infection Control Log**: Tracks infections per Minn. Stat. §144A.4798. Ensures HAAS’s safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4798)

#### Policies
- **Client Admission and Assessment Policy**: Assesses clients per Minn. Stat. §144A.4791. Ensures HAAS’s intake. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Handling and Documentation of Incidents**: Manages incidents per Minn. Stat. §144A.4791. Ensures HAAS’s accountability. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Medication Management Policy**: Ensures safe meds per Minn. Stat. §144A.4792. Ensures HAAS’s client safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4792)
- **Client Complaint and Grievance Policy**: Handles complaints per Minn. Stat. §144A.4791. Ensures HAAS’s satisfaction. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Infection Control Policy**: Prevents infections per Minn. Stat. §144A.4798. Ensures HAAS’s health. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4798)

#### Controls
- **Service Plan Audit and Review**: Reviews plans per Minn. Stat. §144A.4791. Ensures HAAS’s accuracy. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Client Record Completeness Checks**: Verifies records per Minn. Stat. §144A.4794. Ensures HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Staff Training Compliance Tracking**: Tracks training per Minn. Stat. §144A.4796. Ensures HAAS’s readiness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4796)
- **Medication Administration Oversight**: Monitors meds per Minn. Stat. §144A.4792. Ensures HAAS’s safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4792)
- **Complaint Resolution Monitoring**: Resolves complaints per Minn. Stat. §144A.4791. Ensures HAAS’s satisfaction. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Emergency Plan Drill**: Tests plans per Minn. Stat. §144A.4791. Ensures HAAS’s readiness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)

### Minnesota Home Care Bill of Rights (Minn. Stat. §144A.44)

#### Documents
- **Home Care Bill of Rights Notice**: Lists client rights per Minn. Stat. §144A.44. Ensures HAAS’s client awareness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.44)
- **Client Rights Acknowledgment Form**: Confirms receipt per Minn. Stat. §144A.4794. Ensures HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)

#### Policies
- **Client Rights Policy**: Upholds rights per Minn. Stat. §144A.44. Ensures HAAS’s client protection. [Source](https://www.revisor.mn.gov/statutes/cite/144A.44)
- **Complaint and Grievance Policy**: Supports complaints per Minn. Stat. §144A.4791. Ensures HAAS’s resolution. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Respect and Dignity Policy**: Ensures respect per Minn. Stat. §144A.44. Ensures HAAS’s service quality. [Source](https://www.revisor.mn.gov/statutes/cite/144A.44)
- **Rights Education Policy**: Trains staff per Minn. Stat. §144A.44. Ensures HAAS’s readiness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.44)

#### Controls
- **Rights Delivery Verification**: Confirms rights given per Minn. Stat. §144A.44. Ensures HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.44)
- **Monitoring of Rights Compliance via Client Surveys**: Checks rights via surveys per Minn. Stat. §144A.44. Ensures HAAS’s quality. [Source](https://www.revisor.mn.gov/statutes/cite/144A.44)
- **Care Plan Review with Client**: Involves clients per Minn. Stat. §144A.44. Ensures HAAS’s engagement. [Source](https://www.revisor.mn.gov/statutes/cite/144A.44)
- **Complaint Resolution Tracking**: Tracks resolutions per Minn. Stat. §144A.4791. Ensures HAAS’s accountability. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Non-Retaliation Enforcement**: Prevents retaliation per Minn. Stat. §144A.4791. Ensures HAAS’s fairness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)

### Minnesota Home Care Documentation Standards (Minn. Stat. §§144A.4791–144A.4792)

#### Documents
- **Individual Client Record**: Contains all records per Minn. Stat. §144A.4794. Ensures HAAS’s compliance daily. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Service Plan Agreements**: Shows agreed care per Minn. Stat. §144A.4791. Ensures HAAS’s planning. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Medication Administration Record (MAR)**: Logs meds per Minn. Stat. §144A.4792. Ensures HAAS’s safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4792)
- **Client Communication Log**: Records communications per Minn. Stat. §144A.4794. Ensures HAAS’s accountability. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Retention and Transfer Records**: Tracks retention per Minn. Stat. §144A.4794. Ensures HAAS’s security. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)

#### Policies
- **Client Record Management Policy**: Manages records per Minn. Stat. §144A.4794. Ensures HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Service Plan and Reassessment Policy**: Updates plans per Minn. Stat. §144A.4791. Ensures HAAS’s accuracy. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4791)
- **Documentation Procedures Policy**: Guides documentation per Minn. Stat. §144A.4794. Ensures HAAS’s consistency. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Medication Management and Documentation Policy**: Ensures med records per Minn. Stat. §144A.4792. Ensures HAAS’s safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4792)
- **Backup and Security Policy for Records**: Secures records per Minn. Stat. §144A.4794. Ensures HAAS’s security. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)

#### Controls
- **Document Timeliness Enforcement**: Ensures timely entries per Minn. Stat. §144A.4794. Ensures HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Access Control and Record Audit Trail**: Limits access per Minn. Stat. §144A.4794. Ensures HAAS’s security. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Quarterly Clinical Record Audit**: Reviews records per Minn. Stat. §144A.4794. Ensures HAAS’s audits. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Electronic Health Record (EHR) Validations**: Ensures data entry per Minn. Stat. §144A.4794. Ensures HAAS’s accuracy. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)
- **Medication Error Reporting and Review**: Checks med errors per Minn. Stat. §144A.4792. Ensures HAAS’s safety. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4792)
- **Retention and Destruction Log**: Tracks retention per Minn. Stat. §144A.4794. Ensures HAAS’s compliance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.4794)

### Minnesota Home Care Quality Improvement Program (Minn. Stat. §144A.483)

#### Documents
- **Annual Quality Improvement Report**: Summarizes QI efforts per Minn. Stat. §144A.483. Ensures HAAS’s improvement. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Quality Improvement Plan**: Outlines QI goals per Minn. Stat. §144A.483. Ensures HAAS’s strategy. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Client Satisfaction Surveys and Summaries**: Collects feedback per Minn. Stat. §144A.483. Ensures HAAS’s quality. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Performance Improvement Project (PIP) Documentation**: Details projects per Minn. Stat. §144A.483. Ensures HAAS’s progress. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Minutes of Quality Meetings**: Records QI discussions per Minn. Stat. §144A.483. Ensures HAAS’s accountability. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)

#### Policies
- **Quality Improvement (QI) Program Policy**: Commits to QI per Minn. Stat. §144A.483. Ensures HAAS’s focus. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Data Collection and Analysis Policy**: Guides data use per Minn. Stat. §144A.483. Ensures HAAS’s accuracy. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Client Outcomes and Follow-up Policy**: Tracks outcomes per Minn. Stat. §144A.483. Ensures HAAS’s results. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Regulatory Compliance Monitoring Policy**: Ensures compliance per Minn. Stat. §144A.483. Ensures HAAS’s adherence. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)

#### Controls
- **Scheduled Quality Meetings**: Holds regular QI reviews per Minn. Stat. §144A.483. Ensures HAAS’s oversight. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Dashboard Monitoring**: Tracks metrics per Minn. Stat. §144A.483. Ensures HAAS’s performance. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Plan-Do-Check-Act (PDCA) Cycle Requirement**: Ensures QI cycles per Minn. Stat. §144A.483. Ensures HAAS’s improvement. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **Survey Preparedness Drills**: Prepares for surveys per Minn. Stat. §144A.483. Ensures HAAS’s readiness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)
- **External Benchmarking**: Compares performance per Minn. Stat. §144A.483. Ensures HAAS’s competitiveness. [Source](https://www.revisor.mn.gov/statutes/cite/144A.483)