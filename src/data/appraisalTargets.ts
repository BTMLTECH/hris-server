
export interface AppraisalTarget {
  id: string;
  category: 'OBJECTIVES' | 'FINANCIAL' | 'CUSTOMER' | 'INTERNAL_PROCESS' | 'LEARNING_AND_GROWTH';
  name: string;
  marks: number;
  kpi: string;
  measurementTracker: string;
}

export interface GroupedTargets {
  [department: string]: {
    financial?: AppraisalTarget[];
    customer?: AppraisalTarget[];
    internal_processes?: AppraisalTarget[];
    learning_and_growth?: AppraisalTarget[];
  };
}



export const groupedTargets : GroupedTargets = {
  it: {
    financial: [
      {
        id: 'unit-objective',
        category: 'FINANCIAL',
        name: 'Unit Objective',
        marks: 20,
        kpi: `IT Manager
        95% Uninterrupted internet connectivity (daily management of ISPs)
        Evaluate emerging technologies and provide thought leadership and perspective, for adoption within the business as appropriate. Allocation of functional worktools
        Biannual review of Functional domain licences and apps
        Quarterly vendor evaluation
        Quarterly Updates of systems
        Server Back ups for disaster control and recovery
        Quarterly management of solar panel/ inverter, server, 
        Monthly recharge and infrequent top up 3CX, call credit and data management
        Monthly Staff CUG top up and management,  
        Annual payment for 3CX, zoom and daily management of zoom meetings
        Maintain relationship with Traacs, Amadeus, etc suppliers and vendors
        Critical Report Sumbission: Weekly Departmental reports , Quarterly Board report due 5th day of new Quarter, Annual Board Report/ Budget due Q4 of the preceding year

        Development Resource
        Daily/ As needed response to client requests, attend client meetings
        Daily management and Error free HRIS system, HRIS version upgrade, error free concave, circle, zimbra and other apps 
        Daily management of website 
        Weekly management biometric machine, system trouble shooting
        Daily CCTV Management and Reports
        Daily Platform Project Update and Supervision
        Critical Report Sumbission: Weekly Departmental reports 

        Data/ MIS Officer
        MIS: Daily Data Entry on Traacs
        MIS: Bi-Monthly CWT Glory Integration Data
        MIS: Monthly client reports for BTM clients
        MIS: Quarterly Data warehousing and management
        MIS: Quarterly Client Review Report
        MIS: Quaterly Document Count for HR Performance review
        MIS: Weekly Consultants document count
        MIS: Airline Report (on request)
        Critical Report Sumbission: Weekly Departmental reports 

        IT Support
        Daily response to daily  requests via systemsupport, quickTAT for feedback
        Daily data entry on Traacs`,
      measurementTracker: `ITM: Show monthly internet performance report, Show updated worktools management register, quarterly vendor report, show monthly payment of CUGs, Beta SMS weekly payment evidence

      MIS: Show evidence (email time stamp) of bi-monthly Glory report upload (on email)
      Show email time stamp for monthly report (PWC- 15th; P&G-6th; Shell - 4th; Mastercard- 10th)

      Development Officer: Deliver version 2.0 HRIS by Q1 2024; Post launch management of all Platforms (Weekly Updates)`
      },
      {
        id: 'mandatory-sales',
        category: 'FINANCIAL',
        name: 'Mandatory Sales Requirement',
        marks: 15,
        kpi: 'Mandatory Sales: Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales) OR Show savings on expenditure budget',
        measurementTracker: 'Show evidence of total individual sales'
      }
    ],
    customer: [
        {
        id: 'internal-customer-service',
        category: 'CUSTOMER',
        name: 'Satisfactory service to internal customer',
        marks: 10,
        kpi: 'Satisfactory service to internal customer: Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX, when required. Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.',
        measurementTracker: 'Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission. Show screenshots of time stamps and links to weekly reports on concave. Show evidence/concave links to key specific role-related activities eg. daily age analysis, daily minutes of meetings with clients, quarterly vendor/supplier visits and evaluation etc.'
      },
      {
        id: 'client-complaints',
        category: 'CUSTOMER',
        name: 'Must keep the external client complaint volume down for the entire year',
        marks: 10,
        kpi: 'Must keep the external client complaint volume down for the entire year. Manage internal or external issues, generate QA investigation report and follow through till resolved',
        measurementTracker: 'Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings. Minimum of 2 internal/external commendations per appraisal period'
      },
      {
        id: 'sla-compliance',
        category: 'CUSTOMER',
        name: 'Followed up via calls, messages, emails etc and responded according to SLA',
        marks: 10,
        kpi: 'Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms, implementation of signed contract and agreed timelines',
        measurementTracker: 'Minimum of 80% customer satisfaction ratings. Show evidence of 100% vendor/supplier visit reports/Audit reports/renewal reports/vendor quarterly evaluation report'
      },
        ],
        internal_processes: [
          {
        id: 'sop-adherence',
        category: 'INTERNAL_PROCESS',
        name: 'Adherence to SOPs, documentation of processes, back up of key positions',
        marks: 5,
        kpi: 'Strict adherence to SOPs/stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned',
        measurementTracker: 'Show evidence of SOPs on flow charts, Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. For team leads, show documented evidence of leave relievers. Also show minimum of 3 self-driven initiatives that demonstrate profitability, professionalism, customer-oriented service, innovative process, adoption of technology or ethics and efficiency (GHI Core Values)'
      },
      {
        id: 'punctuality',
        category: 'INTERNAL_PROCESS',
        name: 'Punctuality and availability',
        marks: 5,
        kpi: 'Resumption as stated in departmental calendar/as directed at client\'s office, at internal/external meetings and at training sessions',
        measurementTracker: 'Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS. Evidence of training feedback form for all scheduled trainings'
      },
      {
        id: 'prime-responsibilities',
        category: 'INTERNAL_PROCESS',
        name: 'Prime responsibilities and duties',
        marks: 10,
        kpi: 'Prime Responsibilities and Duties (As listed in Job Description)',
        measurementTracker: 'Average of monthly evaluation scores/ QA biannual scores attained within appraisal period'
      },
    ],
    learning_and_growth: [
     {
    id: 'leadership-evaluation',
    category: 'LEARNING_AND_GROWTH',
    name: 'Leadership Evaluation and knowledge sharing',
    marks: 5,
    kpi: 'Compliance with BTM Culture tests — Annual Customer service certificate, Quarterly English and Geography tests',
    measurementTracker: 'Show certificates and screenshots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests'
  },
  {
    id: 'self-driven-training',
    category: 'LEARNING_AND_GROWTH',
    name: 'Individual/Self Driven Role Related Training',
    marks: 10,
    kpi: 'Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar. Personal Brand Positioning across digital platforms',
    measurementTracker: 'Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related brand awareness posts on social media per period. Alternatively, share evidence of degree completed, professional certification attained or published research work.'
  }
    ]
  },

  hr: {
     financial: [
       {
    id: 'unit-objective-hr-admin',
    category: 'FINANCIAL',
    name: 'Unit Objective',
    marks: 20,
    kpi: `ADMIN COORDINATOR: 
o Daily  supervision of day to day activities of Domestic Staff, Despatch Officer and Driving Officers
o ISO Certificate Maintenance: Quarterly Audits and Liaison with Internal and External Auditors
o Industrial Relations:  Update and Communicate SOPs, MAIR and Suggestion Link with ISO Consultant
o Annual renewal with NSITF,  other infrequent related activities (eg requests from ex-employees regarding PFA, reference, payslips etc)
o Office Management: Desk Allocation, Timely/ Quarterly Vehicle and Equipment Maintenance
o Meeting Management: Weekly Minutes of Meeting and Meeting Scheduling
o Brand Awareness and Positioning: Create Awareness of BTM towards Annual World Travel Awards, Design and Distribute Annual Corporate materials.
o Monitor the telephone systems, printers and work with IT in managing tools allocation, repairs and quarterly audits
o  Petty Cash: Manage the petty cash, weekly retirement of petty cash and requests, Vendor management 
o  Asset management: Manage the vehicles, bikes and other assets with evidence of quarterly maintenance
o Safety and Safety Wears:  Quarterly maintenance of first aid box, annual allocation of work wears 
o Daily Stock Management for all outstations and offices
o Daily Infrastructure Supply Management- power, water, security etc
o  Schedule company wide / general meetings and assist with communications
o  Assist with compilation of all supportive Bid/Sales documentation
o  Processing and directing mail and incoming packages or deliveries
o  Critical Reports:  Compile and produce quarterly board presentations and reports from all teams as directed by the the MD

Office Assistant
Daily filing of Documents
Daily Cleaning of Office environment
Daily restocking and procurement of consumables
Daily liaison with facility team for repairs, if applicable

DRIVER and Dispatch officer
Daily Dispatch of items and documents
Daily conveyance of personnel for meetings and appointments
Daily check of vehicle/ motorcycle and escalation of issues, where applicable

HRM: 
o Recruitment : Time to fill: 6-12 weeks
o Compensation and Benefits: Remuneration Administration including the monthly payroll: Submit Payroll on 23rd of every month; bi monthly transport stipend schedule (on 15th and 30th) ; 13th month schedule latest 15th November, consistency and accuracy in employee compensation calculations, leave allowance schedule alongside staff budget and severance benefits schedule latest on final day of staff, manage staff budget
o Performance Management System (3 marks): Communicate Quarterly document count, bi annual survey, coordinate  bi annual appraisal
o Compliance and Documentation: 100% retrieval and documentation of new staff documents, continuously align HR processes with ILO provisions, Guarantor Checks within probation period (6 months), Quarterly Update of Staff Files
o Foster BTM's Culture: Annual customer service training, Quarterly Englist tests, Quarterly Geography test, Quarterly reminder of core values (CHOICE), ensure minimum of Eight (8) hours of  training and workshops on annual basis,Visible impact on leadership empowerment
o Manpower Planning, including Succession Planning: Annual staff budget/ plan, Sign off all induction checklist of all new personnel,   Coordinate all Staff related activities from  Employment , Confirmation , and up to Exit Letters, Ensure 100% leave relief/ succession plan for level 4 and above
o Training and Development: Sign off all induction checklist of all new personnel,  Design and drive the annual training calendar  and coordinate activities with monthly training feedback evidence
o Staff Welfare: Quarterly Touch Base across all Locations, Follow through disbursement of welfare funds as need arises, Approve leave maximum of 48 hours to commencement, Continuous engagement of employees and leaders for feedback.
o Staff Discipline and Grievance: Weekly commendation, disciplinary and query points inclusion on the HRIS
o Internal communication: Monthly internal memos, Whatsapp Birthday Celebration
o  HMO Management: Renew Biannually; Schedule Preemployment tests for all new personnel
o Share monthly PFA and Tax remittance schedule
o Brand Awareness and Positioning: Create Awareness of BTM towards Annual World Travel Awards, Design an annual event to drive digital awareness of BTM via staff's personal social media handles.
o Health and Safety Management: Annual renewal of fire extinguishers, renewal of group life and other insurances, including vehicle insurances and management, Quarterly reminder of health and safety tips, and protocols
o Critical Report Sumbission: Weekly Departmental reports , Quarterly Board report due 5th day of new Quarter
o Act as leave reliever for the Managing Director
`,
    measurementTracker: `"HR: Design and show SMART goals and performance tracking criteria across the organisation aligned with business goals (per appraisal period)
            Show status of training plan achievement (monthly)
            Show staffing plan and quarterly efficient recruitment status
            Track cost savings on staff budget



            Admin: Show monthly staff attendance records, quarterly vendor evaluation reports, quarterly ISO audit reports

            Admin Staff (Drivers, Dispatch, and Domestic Officer)
            Daily update of movement, incidents and needs on log books"
            `
      },
      {
        id: 'mandatory-sales-hr-admin',
        category: 'FINANCIAL',
  
        name: 'Mandatory Sales Requirement',
        marks: 15,
        kpi: 'Mandatory Sales: Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales) OR Show savings on expenditure budget',
        measurementTracker: 'Show evidence of total individual sales'
      },
     ],
     customer:[ {
    id: 'internal-customer-service-hr-admin',
    category: 'CUSTOMER',
    name: 'Satisfactory service to internal customer',
    marks: 10,
    kpi: 'Satisfactory service to internal customer \n Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.',
    measurementTracker: ' Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.\n\nShow screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc'
  },

  {
    id: 'client-complaints-hr-admin',
    category: 'CUSTOMER',
    name: 'Must keep the external client complaint volume down for the entire year',
    marks: 10,
    kpi: 'Must keep the external client complaint volume down for the entire year, Accurate and timely designs and Celebration of staff and client\'s birthdays. Manage internal or external issues, generate QA investigation report and follow through till resolved',
    measurementTracker: 'Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period'
  },
  {
    id: 'sla-compliance-hr-admin',
    category: 'CUSTOMER',
    name: 'Followed up via calls, messages, emails etc and responded according to SLA',
    marks: 10,
    kpi: 'Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines',
    measurementTracker: 'Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report  to update this'
  },],
     internal_processes:[  {
    id: 'sop-compliance-hr-admin',
    category: 'INTERNAL_PROCESS',
    name: 'Adherence to SOPs, documentation of processes, back up of key positions',
    marks: 5,
    kpi: 'Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned',
    measurementTracker: 'Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. \n\nAddition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)'
  },
  {
    id: 'punctuality-availability-hr-admin',
    category: 'INTERNAL_PROCESS',
    name: 'Punctuality and availability',
    marks: 5,
    kpi: 'Resumption as stated in departmental calendar/ as directed at client\'s office, at internal/ external meetings and at training sessions',
    measurementTracker: 'Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . \nEvidence of training feedback form of all scheduled trainings'
  },
  {
    id: 'prime-responsibilities-hr-admin',
    category: 'INTERNAL_PROCESS',
    name: 'Prime responsibilities and duties',
    marks: 10,
    kpi: 'Prime Responsibilities and Duties (As listed in Job Description)',
    measurementTracker: 'Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period'
  },
],
     learning_and_growth:[  {
    id: 'leadership-evaluation-hr-admin',
    category: 'LEARNING_AND_GROWTH',
    name: 'Leadership Evaluation and knowledge sharing',
    marks: 5,
    kpi: 'Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests',
    measurementTracker: 'Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests'
  },
  {
    id: 'self-driven-training-hr-admin',
    category: 'LEARNING_AND_GROWTH',
    name: 'Individual/ Self Driven Role Related Training',
    marks: 10,
    kpi: 'Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms',
    measurementTracker: 'Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.\nAlternatively, share evidence of degree completed, professional certification attained or research work published on journal.'
  }
]
  },

  ac: {
    financial: [ {
    id: 'unit-objective-hr-admin',
    category: 'FINANCIAL',
    name: 'Unit Objective',
    marks: 20,
    kpi: `ADMIN COORDINATOR: 
o Daily  supervision of day to day activities of Domestic Staff, Despatch Officer and Driving Officers
o ISO Certificate Maintenance: Quarterly Audits and Liaison with Internal and External Auditors
o Industrial Relations:  Update and Communicate SOPs, MAIR and Suggestion Link with ISO Consultant
o Annual renewal with NSITF,  other infrequent related activities (eg requests from ex-employees regarding PFA, reference, payslips etc)
o Office Management: Desk Allocation, Timely/ Quarterly Vehicle and Equipment Maintenance
o Meeting Management: Weekly Minutes of Meeting and Meeting Scheduling
o Brand Awareness and Positioning: Create Awareness of BTM towards Annual World Travel Awards, Design and Distribute Annual Corporate materials.
o Monitor the telephone systems, printers and work with IT in managing tools allocation, repairs and quarterly audits
o  Petty Cash: Manage the petty cash, weekly retirement of petty cash and requests, Vendor management 
o  Asset management: Manage the vehicles, bikes and other assets with evidence of quarterly maintenance
o Safety and Safety Wears:  Quarterly maintenance of first aid box, annual allocation of work wears 
o Daily Stock Management for all outstations and offices
o Daily Infrastructure Supply Management- power, water, security etc
o  Schedule company wide / general meetings and assist with communications
o  Assist with compilation of all supportive Bid/Sales documentation
o  Processing and directing mail and incoming packages or deliveries
o  Critical Reports:  Compile and produce quarterly board presentations and reports from all teams as directed by the the MD

Office Assistant
Daily filing of Documents
Daily Cleaning of Office environment
Daily restocking and procurement of consumables
Daily liaison with facility team for repairs, if applicable

DRIVER and Dispatch officer
Daily Dispatch of items and documents
Daily conveyance of personnel for meetings and appointments
Daily check of vehicle/ motorcycle and escalation of issues, where applicable

HRM: 
o Recruitment : Time to fill: 6-12 weeks
o Compensation and Benefits: Remuneration Administration including the monthly payroll: Submit Payroll on 23rd of every month; bi monthly transport stipend schedule (on 15th and 30th) ; 13th month schedule latest 15th November, consistency and accuracy in employee compensation calculations, leave allowance schedule alongside staff budget and severance benefits schedule latest on final day of staff, manage staff budget
o Performance Management System (3 marks): Communicate Quarterly document count, bi annual survey, coordinate  bi annual appraisal
o Compliance and Documentation: 100% retrieval and documentation of new staff documents, continuously align HR processes with ILO provisions, Guarantor Checks within probation period (6 months), Quarterly Update of Staff Files
o Foster BTM's Culture: Annual customer service training, Quarterly Englist tests, Quarterly Geography test, Quarterly reminder of core values (CHOICE), ensure minimum of Eight (8) hours of  training and workshops on annual basis,Visible impact on leadership empowerment
o Manpower Planning, including Succession Planning: Annual staff budget/ plan, Sign off all induction checklist of all new personnel,   Coordinate all Staff related activities from  Employment , Confirmation , and up to Exit Letters, Ensure 100% leave relief/ succession plan for level 4 and above
o Training and Development: Sign off all induction checklist of all new personnel,  Design and drive the annual training calendar  and coordinate activities with monthly training feedback evidence
o Staff Welfare: Quarterly Touch Base across all Locations, Follow through disbursement of welfare funds as need arises, Approve leave maximum of 48 hours to commencement, Continuous engagement of employees and leaders for feedback.
o Staff Discipline and Grievance: Weekly commendation, disciplinary and query points inclusion on the HRIS
o Internal communication: Monthly internal memos, Whatsapp Birthday Celebration
o  HMO Management: Renew Biannually; Schedule Preemployment tests for all new personnel
o Share monthly PFA and Tax remittance schedule
o Brand Awareness and Positioning: Create Awareness of BTM towards Annual World Travel Awards, Design an annual event to drive digital awareness of BTM via staff's personal social media handles.
o Health and Safety Management: Annual renewal of fire extinguishers, renewal of group life and other insurances, including vehicle insurances and management, Quarterly reminder of health and safety tips, and protocols
o Critical Report Sumbission: Weekly Departmental reports , Quarterly Board report due 5th day of new Quarter
o Act as leave reliever for the Managing Director
`,
measurementTracker: `"HR: Design and show SMART goals and performance tracking criteria across the organisation aligned with business goals (per appraisal period)
  Show status of training plan achievement (monthly) .Show staffing plan and quarterly efficient recruitment status
  Track cost savings on staff budget Admin: Show monthly staff attendance records, quarterly vendor evaluation reports, quarterly ISO audit reports Admin Staff (Drivers, Dispatch, and Domestic Officer)
            Daily update of movement, incidents and needs on log books"
            `
  },
  {
    id: 'mandatory-sales-hr-admin',
    category: 'FINANCIAL',
    name: 'Mandatory Sales Requirement',
    marks: 15,
    kpi: 'Mandatory Sales: Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales) OR Show savings on expenditure budget',
    measurementTracker: 'Show evidence of total individual sales'
  },
],
    customer: [ {
    id: 'internal-customer-service-hr-admin',
    category: 'CUSTOMER',
    name: 'Satisfactory service to internal customer',
    marks: 10,
    kpi: 'Satisfactory service to internal customer \n Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.',
    measurementTracker: ' Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.\n\nShow screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc'
  },

  {
    id: 'client-complaints-hr-admin',
    category: 'CUSTOMER',
    name: 'Must keep the external client complaint volume down for the entire year',
    marks: 10,
    kpi: 'Must keep the external client complaint volume down for the entire year, Accurate and timely designs and Celebration of staff and client\'s birthdays. Manage internal or external issues, generate QA investigation report and follow through till resolved',
    measurementTracker: 'Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period'
  },
  {
    id: 'sla-compliance-hr-admin',
    category: 'CUSTOMER',
    name: 'Followed up via calls, messages, emails etc and responded according to SLA',
    marks: 10,
    kpi: 'Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines',
    measurementTracker: 'Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report  to update this'
  },
],
    internal_processes: [ {
    id: 'sop-compliance-hr-admin',
    category: 'INTERNAL_PROCESS',
    name: 'Adherence to SOPs, documentation of processes, back up of key positions',
    marks: 5,
    kpi: 'Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned',
    measurementTracker: 'Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. \n\nAddition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)'
  },
  {
    id: 'punctuality-availability-hr-admin',
    category: 'INTERNAL_PROCESS',
    name: 'Punctuality and availability',
    marks: 5,
    kpi: 'Resumption as stated in departmental calendar/ as directed at client\'s office, at internal/ external meetings and at training sessions',
    measurementTracker: 'Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . \nEvidence of training feedback form of all scheduled trainings'
  },
  {
    id: 'prime-responsibilities-hr-admin',
    category: 'INTERNAL_PROCESS',
    name: 'Prime responsibilities and duties',
    marks: 10,
    kpi: 'Prime Responsibilities and Duties (As listed in Job Description)',
    measurementTracker: 'Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period'
  },],
    learning_and_growth: [ {
    id: 'leadership-evaluation-hr-admin',
    category: 'LEARNING_AND_GROWTH',
    name: 'Leadership Evaluation and knowledge sharing',
    marks: 5,
    kpi: 'Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests',
    measurementTracker: 'Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests'
  },
  {
    id: 'self-driven-training-hr-admin',
    category: 'LEARNING_AND_GROWTH',
    name: 'Individual/ Self Driven Role Related Training',
    marks: 10,
    kpi: 'Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms',
    measurementTracker: 'Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.\nAlternatively, share evidence of degree completed, professional certification attained or research work published on journal.'
  }
]
  },

  opt :{
  financial: [
    {
      id: 'unit-objective-fulfilment-sales',
      category: 'FINANCIAL',
      name: 'Unit Objective Fulfilment (Customer Service and Sales)',
      marks: 10,
      kpi: `Goal 1: Revenue target- Flights and Ancillary 
      Issue all Flight Tickets within 2 hours of receiving approved requests. 
      Where assigned, ensure  Flight Manifest is sent to the protocol team before 12 noon daily: If Applicable,provide accurate flight manifest of arrivals/departures on a daily basis along with additional manifest where applicable. 

    Ensure all tickets are issued according to the Travel policy of the particular account. Ensure that flight tickets are sold alongside ancillary services. 
    Ensured refunds are processed within the client’s SLAs. 
    Efficient handling of assigned clients according to SLA, Complied with policies and process workflows
    Ensure the highest quality of customer service standards are adhered to by all assigned personnel/ units
    Act as cover for team members on leave or unavoidably absent

    Utilise assigned work tools and amenities and keep them in good condition.
    Ensure daily reports are sent, reviewed and tasks are efficiently allocated to avoid escalations`,
      measurementTracker: `% of revenue targets achieved by the corporate department
% of Airline revenue targets achieved for operations team`
    },
    {
      id: 'individual-objective-fulfilment',
      category: 'FINANCIAL',
      name: 'Individual Objective Fulfilment/ Personal Target',
      marks: 10,
      kpi: `Goal 2: Individual Sales/ Mandatory Sales
      Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales, minimum of  2.5 million naira per quarter)`,
      measurementTracker: `Show evidence of total individual sales, minimum of 2.5 million naira per quarter`
    },
    {
      id: 'sales-funnel-health',
      category: 'FINANCIAL',
      name: 'Maintain a healthy sales funnel',
      marks: 10,
      kpi: `Goal 3: Sales Funnel and Pipeline
      Lead Measure (Total for the Corporate Sales Unit)
    - Cold and Warm Calls - Minimum of 20 calls daily and 100 calls weekly
    - New (inactive) and Follow Up Reach out - 15 every week 
    - New (Injactive) Qualified Leads' Sales Pitch - 5 every week
    - Brand awareness activity/ participation at external event (fortnightly)`,
      measurementTracker: `To have a minimum of 20 sales qualified leads per time in the sales pipeline of each business unit`
    },
    {
      id: 'accounts-management-sales',
      category: 'FINANCIAL',
      name: 'Accounts Management',
      marks: 5,
      kpi: `Daily use of TBS to manage requests. Escalate platform issues to E-Commerce and follow through till resolved`,
      measurementTracker: `Show week upon week improvement in the use of TBS to handle requests
      Also demonstrate collaboration with Marketing and other units`
    }
  ],
  customer: [
    {
      id: 'internal-customer-service-sales',
      category: 'CUSTOMER',
      name: 'Satisfactory service to internal customer',
      marks: 10,
      kpi: `Satisfactory service to internal customer 
      Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
      measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

      Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
    },
    {
      id: 'client-complaint-volume-sales',
      category: 'CUSTOMER',
      name: 'Must keep the external client complaint volume down for the entire year',
      marks: 10,
      kpi: `Must keep the external client complaint volume down for the entire year. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
      measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
    },
    {
      id: 'sla-compliance-sales',
      category: 'CUSTOMER',
      name: 'Followed up via calls, messages, emails etc and responded according to SLA',
      marks: 10,
      kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
      measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
    }
  ],
  internal_processes: [
    {
      id: 'sop-compliance-sales',
      category: 'INTERNAL_PROCESS',
      name: 'Adherence to SOPs, documentation of processes, back up of key positions',
      marks: 5,
      kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
      measurementTracker: `Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

      Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
    },
    {
      id: 'punctuality-availability-sales',
      category: 'INTERNAL_PROCESS',
      name: 'Punctuality and availability',
      marks: 5,
      kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
      measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . 
      Evidence of training feedback form of all scheduled trainings`
    },
    {
      id: 'prime-responsibilities-sales',
      category: 'INTERNAL_PROCESS',
      name: 'Prime responsibilities and duties',
      marks: 10,
      kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
      measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
    }
  ],
  learning_and_growth: [
    {
      id: 'leadership-evaluation-sales',
      category: 'LEARNING_AND_GROWTH',
      name: 'Leadership Evaluation and knowledge sharing',
      marks: 5,
      kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
      measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
    },
    {
      id: 'self-driven-training-sales',
      category: 'LEARNING_AND_GROWTH',
      name: 'Individual/ Self Driven Role Related Training',
      marks: 10,
      kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
      measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
      Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
    }
  ]
       },

  su : {
    financial: [
      {
        id: 'unit-objective-visa-admin',
        category: 'FINANCIAL',
        name: 'Unit Objective',
        marks: 20,
        kpi: `Timely and Accurate fulfilment of all visa and immigration requests as received via email; Track all sales`,
        measurementTracker: `Show evidence on daily report on HRIS, Weekly Visa and Immigration request fulfilment data and sales. MIS tracking report. 1 negative mark per missed/ delayed requests due to human error.`
      },
      {
        id: 'mandatory-sales-visa-admin',
        category: 'FINANCIAL',
        name: 'Mandatory Sales Requirement',
        marks: 15,
        kpi: `Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales)`,
        measurementTracker: `(Show evidence of total individual sales)`
      }
    ],
    customer: [
      {
        id: 'internal-customer-service-visa-admin',
        category: 'CUSTOMER',
        name: 'Satisfactory service to internal customer',
        marks: 10,
        kpi: `Satisfactory service to internal customer 
        Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
        measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

      Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
      },
      {
        id: 'client-complaints-visa-admin',
        category: 'CUSTOMER',
        name: 'Must keep the external client complaint volume down for the entire year',
        marks: 10,
        kpi: `Must keep the external client complaint volume down for the entire year. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
        measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
      },
      {
        id: 'sla-compliance-visa-admin',
        category: 'CUSTOMER',
        name: 'Followed up via calls, messages, emails etc and responded according to SLA',
        marks: 10,
        kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
        measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
      }
    ],
    internal_processes: [
      {
        id: 'sop-compliance-visa-admin',
        category: 'INTERNAL_PROCESS',
        name: 'Adherence to SOPs, documentation of processes, back up of key positions',
        marks: 5,
        kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
        measurementTracker: `Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

      Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
      },
      {
        id: 'punctuality-availability-visa-admin',
        category: 'INTERNAL_PROCESS',
        name: 'Punctuality and availability',
        marks: 5,
        kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
        measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . 
  Evidence of training feedback form of all scheduled trainings`
      },
      {
        id: 'prime-responsibilities-visa-admin',
        category: 'INTERNAL_PROCESS',
        name: 'Prime responsibilities and duties',
        marks: 10,
        kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
        measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
      }
    ],
    learning_and_growth: [
      {
        id: 'leadership-evaluation-visa-admin',
        category: 'LEARNING_AND_GROWTH',
        name: 'Leadership Evaluation and knowledge sharing',
        marks: 5,
        kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
        measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
      },
      {
        id: 'self-driven-training-visa-admin',
        category: 'LEARNING_AND_GROWTH',
        name: 'Individual/ Self Driven Role Related Training',
        marks: 10,
        kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
        measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
        Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
      }
    ]
  },

  ecs :{
    financial: [
      {
        id: 'unit-objective-training-qa',
        category: 'FINANCIAL',
        name: 'Unit Objective',
        marks: 20,
        kpi: `Serve as liaison between Product Team and BTM Operations at the testing stage
  Track staff login
  Product Training: Train on various aspects of platforms
  Email and Call Etiquette training for new team members and retraining for other team members
  Double hat as Quality Assurance Manager (monitor QA team performance)`,
        measurementTracker: `Daily Checklist before 5pm
  Weekly, Monthly, Quarterly, Biannual and Annual QA Report
  TBS Login Access Register`
      },
      {
        id: 'mandatory-sales-training-qa',
        category: 'FINANCIAL',
        name: 'Mandatory Sales Requirement',
        marks: 15,
        kpi: `Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales)`,
        measurementTracker: `(Show evidence of total individual sales)`
      }
    ],
    customer: [
      {
        id: 'internal-customer-service-training-qa',
        category: 'CUSTOMER',
        name: 'Satisfactory service to internal customer',
        marks: 10,
        kpi: `Satisfactory service to internal customer 
  Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
        measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

  Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
      },
      {
        id: 'client-complaints-training-qa',
        category: 'CUSTOMER',
        name: 'Must keep the external client complaint volume down for the entire year',
        marks: 10,
        kpi: `Must keep the external client complaint volume down for the entire year, Manage internal or external issues, generate QA investigation report and follow through till resolved`,
        measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
      },
      {
        id: 'sla-compliance-training-qa',
        category: 'CUSTOMER',
        name: 'Followed up via calls, messages, emails etc and responded according to SLA',
        marks: 10,
        kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
        measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
      }
    ],
    internal_processes: [
      {
        id: 'sop-compliance-training-qa',
        category: 'INTERNAL_PROCESS',
        name: 'Adherence to SOPs, documentation of processes, back up of key positions',
        marks: 5,
        kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
        measurementTracker: `Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

  Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
      },
      {
        id: 'punctuality-availability-training-qa',
        category: 'INTERNAL_PROCESS',
        name: 'Punctuality and availability',
        marks: 5,
        kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
        measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . 
  Evidence of training feedback form of all scheduled trainings`
      },
      {
        id: 'prime-responsibilities-training-qa',
        category: 'INTERNAL_PROCESS',
        name: 'Prime responsibilities and duties',
        marks: 10,
        kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
        measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
      }
    ],
    learning_and_growth: [
      {
        id: 'leadership-evaluation-training-qa',
        category: 'LEARNING_AND_GROWTH',
        name: 'Leadership Evaluation and knowledge sharing',
        marks: 5,
        kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
        measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
      },
      {
        id: 'self-driven-training-training-qa',
        category: 'LEARNING_AND_GROWTH',
        name: 'Individual/ Self Driven Role Related Training',
        marks: 10,
        kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
        measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
  Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
      }
    ]
  },
  mk :{
    financial: [
      {
        id: 'unit-objective-marketing',
        category: 'FINANCIAL',
        name: 'Unit Objective Fulfilment (Achieved revenue target)',
        marks: 10,
        kpi: `Goal 1 (General): Generate monthly/ quarterly revenue with minimum of 20%  increment compared to similar period in 2024.  

  Graphic designer: Work in sync with Retail and Channel team to design and timely upload approved tour packages. Design bespoke packages upon request by corporate , retail, channel of other departments/ cllients. Support the social media and team lead

  Social Media: Minimum of thrice weekly uploads on social media with daily response to chat/ comments or private social media requests. Oversee all social media posts, engagements, and live events – on and offline. Significantly grow social media followers (minimum total of 1,000 new followers per quarter). Create a social media calendar for the quarter and the year, and work with team lead and graphic designer to ensure post deadlines are met. Carry out quarterly PESTLE and SWOT analyses; to keep abreast of market trends, and share same as monthly and quarterly business reports 

  Team Lead: Uphold, adhere to and communicate BTM's value and brand leadership.
  Ensure ROI of all initiatives, qualify all leads generated and refer to appropriate units  Oversee team's processes and organize them to enhance customer satisfaction by: 
  a. Reviewing all previous-day interactions on all communication channels before the start of a new day, and identifying opportunities for process improvement 
  b. Reviewing all brand communications (both digital and non-digital media) to ensure adherence to established brand standard.
  Stay up-to-date with the latest trends and best practices in online marketing and measurement. Generate weekly marketing performance reports (CPC, Leads generated, Engagement across channels and growth of followers across handles). 
  Mentor interns and any other assigned tasks. All other unit objectives that directly affect the company's bottomline or directly affect another team's financial objective.`,
        measurementTracker: `Revenue achieved per period. 
  Extent of achievement of daily, weekly, monthly and quarterly set targets by team  members`
      },
      {
        id: 'individual-target-marketing',
        category: 'FINANCIAL',
        name: 'Individual Objective Fulfilment/ Personal Target',
        marks: 10,
        kpi: `Goal 2: Individual Sales/ Mandatory Sales
  Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales, minimum of  2.5 million naira per quarter)`,
        measurementTracker: `Show evidence of total individual sales, minimum of 2.5 million naira per quarter`
      },
      {
        id: 'sales-funnel-marketing',
        category: 'FINANCIAL',
        name: 'Maintain a healthy sales funnel',
        marks: 10,
        kpi: `Goal 3: Sales Funnel and Pipeline
  Lead Measure 
  - Cold and Warm Calls - Minimum of 20 calls daily and 100 calls weekly
  New and Follow Up Meetings - 15 every week 
  - New Qualified Leads' Sales Pitch - 5 every week
  Brand awareness activity/ participation at external event (fortnightly)`,
        measurementTracker: `Refer sales qualified leads per time in the sales pipeline of each business unit`
      },
      {
        id: 'accounts-management-marketing',
        category: 'FINANCIAL',
        name: 'Accounts Management',
        marks: 5,
        kpi: `Drive traffic to the websites. Escalate platform issues to E-Commerce and follow through till resolved`,
        measurementTracker: `Show week upon week improvement in the website conversions
  Also demonstrate collaboration with other units`
      }
    ],
    customer: [
      {
        id: 'internal-customer-service-marketing',
        category: 'CUSTOMER',
        name: 'Satisfactory service to internal customer',
        marks: 10,
        kpi: `Satisfactory service to internal customer 
  Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
        measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

  Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
      },
      {
        id: 'client-complaints-marketing',
        category: 'CUSTOMER',
        name: 'Must keep the external client complaint volume down for the entire year',
        marks: 10,
        kpi: `Must keep the external client complaint volume down for the entire year, Accurate and timely designs and Celebration of staff and client's birthdays. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
        measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
      },
      {
        id: 'sla-compliance-marketing',
        category: 'CUSTOMER',
        name: 'Followed up via calls, messages, emails etc and responded according to SLA',
        marks: 10,
        kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
        measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
      }
    ],
    internal_processes: [
      {
        id: 'sop-compliance-marketing',
        category: 'INTERNAL_PROCESS',
        name: 'Adherence to SOPs, documentation of processes, back up of key positions',
        marks: 5,
        kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
        measurementTracker: `Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

  Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
      },
      {
        id: 'punctuality-availability-marketing',
        category: 'INTERNAL_PROCESS',
        name: 'Punctuality and availability',
        marks: 5,
        kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
        measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . 
  Evidence of training feedback form of all scheduled trainings`
      },
      {
        id: 'prime-responsibilities-marketing',
        category: 'INTERNAL_PROCESS',
        name: 'Prime responsibilities and duties',
        marks: 10,
        kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
        measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
      }
    ],
    learning_and_growth: [
      {
        id: 'leadership-evaluation-marketing',
        category: 'LEARNING_AND_GROWTH',
        name: 'Leadership Evaluation and knowledge sharing',
        marks: 5,
        kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
        measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
      },
      {
        id: 'self-driven-training-marketing',
        category: 'LEARNING_AND_GROWTH',
        name: 'Individual/ Self Driven Role Related Training',
        marks: 10,
        kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
        measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
  Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
      }
    ]
  },

  ch : {
    financial: [
      {
        id: 'unit-objective-retail-channel',
        category: 'FINANCIAL',
        name: 'Unit Objective Fulfilment (Achieved revenue target)',
        marks: 10,
        kpi: `Goal 1: Revenue target- Flights and Ancillary 
  To onboard online and offline clients worth  Q1, Q2, Q3 and Q4 2025 revenue.

  To align with regional expansion, strategic initiatives, travel club, destination sales and packages and airline targets: (total of 10 newly onboarded clients per quarter and a wide range of online and offline sales, activities and adverts at end of H1 2024). Also to replicate similar targets for Q3 and Q4 2025`,
        measurementTracker: `% of revenue targets achieved.
  Also Show evidence of closed sales for Retail offline and BTM Holidays (with  signed contracts with DMCs), tour packages etc travel volume capable of generating equivalent of stated yearly revenue. Show evidence of content uploaded on Market Place/ Packages created and uploaded on other platforms and month on month comparative sales

  Show evidence of closed sales for Channel offline and JournerEasy, also signed contracts with Sub agents and travel clubs  with travel volume capable of generating equivalent of stated yearly revenue. Share evidence of incremental sales from JV and HahnAir weekly and monthly report to partner/ client`
      },
      {
        id: 'gross-profit-retail-channel',
        category: 'FINANCIAL',
        name: 'Sales Objective Fulfilment/ Gross Profit Target',
        marks: 10,
        kpi: `Goal 2: Gross Profit Target - Flights and Ancillary
  To achieve targeted gross profit target in Q1, Q2, Q3 and Q4 2025, leveraging upselling & cross selling opportunities. 

  By Q4 2024 and subject to sales achievements, to commence process of expanding the Retail/ Channel sales unit doubling revenue and gross profit targets in 2026 year`,
        measurementTracker: `Show evidence of 85% minimum achievement of gross profit targets per quarter`
      },
      {
        id: 'sales-funnel-retail-channel',
        category: 'FINANCIAL',
        name: 'Maintain a healthy sales funnel',
        marks: 10,
        kpi: `Goal 3: Sales Funnel and Pipeline
  Lead Measure (Total for the Corporate Sales Unit)
  - Cold and Warm Calls - Minimum of 20 calls daily and 100 calls weekly
  New and Follow Up Meetings - 15 every week 
  - New Qualified Leads' Sales Pitch - 5 every week
  Brand awareness activity/ participation at external event (fortnightly)`,
        measurementTracker: `To have a minimum of 20 sales qualified leads per time in the sales pipeline of each business unit`
      },
      {
        id: 'accounts-management-retail-channel',
        category: 'FINANCIAL',
        name: 'Accounts Management',
        marks: 5,
        kpi: `To calendarise and maintain strategic communication/ meetings with prospective and existing clients (see goal 3 for specifics). Drive online sales, close online sales both offline and online. Escalate platform issues to E-Commerce and follow through till resolved`,
        measurementTracker: `Show week upon week improvement of online sales.
  Also demonstrate collaboration with Marketing and other units`
      }
    ],
    customer: [
      {
        id: 'internal-customer-service-retail-channel',
        category: 'CUSTOMER',
        name: 'Satisfactory service to internal customer',
        marks: 10,
        kpi: `Satisfactory service to internal customer 
  Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
        measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

  Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
      },
      {
        id: 'client-complaints-retail-channel',
        category: 'CUSTOMER',
        name: 'Must keep the external client complaint volume down for the entire year',
        marks: 10,
        kpi: `Must keep the external client complaint volume down for the entire year, Accurate and timely designs and Celebration of client's birthdays. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
        measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
      },
      {
        id: 'sla-compliance-retail-channel',
        category: 'CUSTOMER',
        name: 'Followed up via calls, messages, emails etc and responded according to SLA',
        marks: 10,
        kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
        measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
      }
    ],
    internal_processes: [
      {
        id: 'sop-compliance-retail-channel',
        category: 'INTERNAL_PROCESS',
        name: 'Adherence to SOPs, documentation of processes, back up of key positions',
        marks: 5,
        kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
        measurementTracker: `Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

  Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
      },
      {
        id: 'punctuality-availability-retail-channel',
        category: 'INTERNAL_PROCESS',
        name: 'Punctuality and availability',
        marks: 5,
        kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
        measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . 
  Evidence of training feedback form of all scheduled trainings`
      },
      {
        id: 'prime-responsibilities-retail-channel',
        category: 'INTERNAL_PROCESS',
        name: 'Prime responsibilities and duties',
        marks: 10,
        kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
        measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
      }
    ],
    learning_and_growth: [
      {
        id: 'leadership-evaluation-retail-channel',
        category: 'LEARNING_AND_GROWTH',
        name: 'Leadership Evaluation and knowledge sharing',
        marks: 5,
        kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
        measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
      },
      {
        id: 'self-driven-training-retail-channel',
        category: 'LEARNING_AND_GROWTH',
        name: 'Individual/ Self Driven Role Related Training',
        marks: 10,
        kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
        measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
  Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
      }
    ]
  },

  cb : {
  financial: [
    {
      id: 'unit-objective-corporate-sales',
      category: 'FINANCIAL',
      name: 'Unit Objective Fulfilment (Achieved revenue target)',
      marks: 10,
      kpi: `Goal 1: Revenue target- Flights and Ancillary 
To onboard at least two corporate clients as well as 4 SMB clients worth  Q1 2025 revenue.
To on-board additional of these SMBs and corporate clients worth $50K yearly revenue (and  it's equivalent of SMBs) worth $50K yearly Revenue by the end of Q2  2025: (total of 4 onboarded corporate clients and a wide range of SMBs at end of H1 2024). Also to replicate similar targets for Q3 and Q4 2025`,
      measurementTracker: `% of revenue targets achieved.
Also show evidence of closed sales for new SMBs and 2 signed contracts for corporate clients with travel volume capable of generating equivalent of $50K yearly revenue.`
    },
    {
      id: 'gross-profit-target-corporate-sales',
      category: 'FINANCIAL',
      name: 'Sales Objective Fulfilment/ Gross Profit Target',
      marks: 10,
      kpi: `Goal 2: Gross Profit Target - Flights and Ancillary
To achieve targeted gross profit target in Q1, Q2, Q3 and Q4 2025, leveraging upselling & cross selling opportunities. 

By Q4 2024 and subject to sales achievements, to commence process of expanding the corporate sales unit doubling revenue and gross profit targets in 2026 year`,
      measurementTracker: `Show evidence of 85% minimum achievement of gross profit targets per quarter`
    },
    {
      id: 'sales-funnel-corporate-sales',
      category: 'FINANCIAL',
      name: 'Maintain a healthy sales funnel',
      marks: 10,
      kpi: `Goal 3: Sales Funnel and Pipeline
        Lead Measure (Total for the Corporate Sales Unit)
        - Cold and Warm Calls - Minimum of 20 calls daily and 100 calls weekly
        New and Follow Up Meetings - 15 every week 
        - New Qualified Leads' Sales Pitch - 5 every week
        Brand awareness activity/ participation at external event (fortnightly)`,
      measurementTracker: `To have a minimum of 20 sales qualified leads per time in the sales pipeline of each business unit`
    },
    {
      id: 'accounts-management-corporate-sales',
      category: 'FINANCIAL',
      name: 'Accounts Management',
      marks: 5,
      kpi: `To calendarise and maintain strategic communication/ meetings with prospective and existing clients (see goal 3 for specifics). Minimum of one quarterly review with MIS report for onboarded clients. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
      measurementTracker: `Show MIS report and quarterly client review meeting calendar`
    }
  ],
  customer: [
    {
      id: 'internal-customer-service-corporate-sales',
      category: 'CUSTOMER',
      name: 'Satisfactory service to internal customer',
      marks: 10,
      kpi: `Satisfactory service to internal customer 
Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
      measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
    },
    {
      id: 'client-complaints-corporate-sales',
      category: 'CUSTOMER',
      name: 'Must keep the external client complaint volume down for the entire year',
      marks: 10,
      kpi: `Must keep the external client complaint volume down for the entire year, Accurate and timely designs and Celebration of staff and client's birthdays. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
      measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
    },
    {
      id: 'sla-compliance-corporate-sales',
      category: 'CUSTOMER',
      name: 'Followed up via calls, messages, emails etc and responded according to SLA',
      marks: 10,
      kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
      measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
    }
  ],
  internal_processes: [
    {
      id: 'sop-compliance-corporate-sales',
      category: 'INTERNAL_PROCESS',
      name: 'Adherence to SOPs, documentation of processes, back up of key positions',
      marks: 5,
      kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
      measurementTracker: `Show evidence of SOPs  on flow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer oriented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
    },
    {
      id: 'punctuality-availability-corporate-sales',
      category: 'INTERNAL_PROCESS',
      name: 'Punctuality and availability',
      marks: 5,
      kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
      measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS. 
Evidence of training feedback form of all scheduled trainings`
    },
    {
      id: 'prime-responsibilities-corporate-sales',
      category: 'INTERNAL_PROCESS',
      name: 'Prime responsibilities and duties',
      marks: 10,
      kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
      measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
    }
  ],
  learning_and_growth: [
    {
      id: 'leadership-evaluation-corporate-sales',
      category: 'LEARNING_AND_GROWTH',
      name: 'Leadership Evaluation and knowledge sharing',
      marks: 5,
      kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
      measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
    },
    {
      id: 'self-driven-training-corporate-sales',
      category: 'LEARNING_AND_GROWTH',
      name: 'Individual/ Self Driven Role Related Training',
      marks: 10,
      kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
      measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
      Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
    }
  ]
},

apghi : {
  financial: [
    {
      id: 'unit-objective-manifest-fulfilment',
      category: 'FINANCIAL',
      name: 'Unit Objective: 100% Manifest Fulfilment',
      marks: 20,
      kpi: `Same day fulfilment of Manifest as forwarded. Also 100% fulfilment of requests not included on manifest or communicated at short notice
Daily SMS and feedback form to clients
Angola: To build relationship with key contacts and chase pending tasks as listed in 2024 meeting action points
GHI Airlines and Airport: To convert sales from GHI Airlines and Airport worth 5 million naira revenue monthly`,
      measurementTracker: `% of revenue targets achieved.

Also daily flight manifest report as shared via Email , also weekly report on SMSs shared included in weekly departmental report
Angola: Show completed renewal of pending documents for Angola
GHI Airlines and Airport: Show evidence of achievement of revenue target`
    },
    {
      id: 'mandatory-sales-manifest',
      category: 'FINANCIAL',
      name: 'Mandatory Sales Requirement',
      marks: 15,
      kpi: `Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales)`,
      measurementTracker: `(Show evidence of total individual sales)`
    }
  ],
  customer: [
    {
      id: 'internal-customer-service-manifest',
      category: 'CUSTOMER',
      name: 'Satisfactory service to internal customer',
      marks: 10,
      kpi: `Satisfactory service to internal customer 
Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
      measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
    },
    {
      id: 'client-complaints-manifest',
      category: 'CUSTOMER',
      name: 'Must keep the external client complaint volume down for the entire year',
      marks: 10,
      kpi: `Must keep the external client complaint volume down for the entire year, Accurate and timely designs and Celebration of staff and client's birthdays. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
      measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
    },
    {
      id: 'sla-compliance-manifest',
      category: 'CUSTOMER',
      name: 'Followed up via calls, messages, emails etc and responded according to SLA',
      marks: 10,
      kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
      measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
    }
  ],
  internal_processes: [
    {
      id: 'sop-compliance-manifest',
      category: 'INTERNAL_PROCESS',
      name: 'Adherence to SOPs, documentation of processes, back up of key positions',
      marks: 5,
      kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
      measurementTracker: `Show evidence of SOPs  on flow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
    },
    {
      id: 'punctuality-availability-manifest',
      category: 'INTERNAL_PROCESS',
      name: 'Punctuality and availability',
      marks: 5,
      kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
      measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS. 
Evidence of training feedback form of all scheduled trainings`
    },
    {
      id: 'prime-responsibilities-manifest',
      category: 'INTERNAL_PROCESS',
      name: 'Prime responsibilities and duties',
      marks: 10,
      kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
      measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
    }
  ],
  learning_and_growth: [
    {
      id: 'leadership-evaluation-manifest',
      category: 'LEARNING_AND_GROWTH',
      name: 'Leadership Evaluation and knowledge sharing',
      marks: 5,
      kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
      measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
    },
    {
      id: 'self-driven-training-manifest',
      category: 'LEARNING_AND_GROWTH',
      name: 'Individual/ Self Driven Role Related Training',
      marks: 10,
      kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
      measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
    }
  ]
},

rogh : {
  financial: [
    {
      id: 'ghana-revenue-target',
      category: 'FINANCIAL',
      name: 'Unit Objective Fulfilment (Achieved revenue target)',
      marks: 10,
      kpi: `Goal 1: Revenue target- Flights and Ancillary 
To onboard at least two Ghana corporate clients in Q1 2025 worth $50K yearly Revenue, as well as its equivalent in Retail and Channel combined. Total of  $100k worth clients for Q1 2025.
To on-board additional 2 of these Ghana corporate clients worth $50K yearly revenue (and  it's equivalent in Retail and Channel) worth $50K yearly Revenue by the end of Q2  2025: (total of 4 onboarded corporate clients and a wide range of retail and channel clients at end of H1 2024). Also to replicate similar targets for Q3 and Q4 2025`,
      measurementTracker: `Ghana: Show evidence of closed sales for Retail and Channel/ and 2 signed contracts for corporates of stated worth per quarter.`
    },
    {
      id: 'ghana-gross-profit',
      category: 'FINANCIAL',
      name: 'Sales Objective Fulfilment/ Gross Profit Target',
      marks: 10,
      kpi: `Goal 2: Gross Profit Target - Flights and Ancillary
To achieve $5k gross profit target in Q1 2025, $10k gross profit target in Q2 2025, $15k gross profit target in Q3 2025 and $10k gross profit target in Q4 2025. To leverage upselling & cross selling opportunities. 

By Q4 2024 and subject to sales achievements, to commence process of expanding the Ghana office towards doubling revenue and gross profit targets in 2026 year`,
      measurementTracker: `Show evidence of 85% minimum achievement of gross profit targets per quarter`
    },
    {
      id: 'ghana-sales-funnel',
      category: 'FINANCIAL',
      name: 'Maintain a healthy sales funnel',
      marks: 10,
      kpi: `Goal 3: Sales Funnel and Pipeline
Lead Measure (Total for the Ghana Team)
- Cold and Warm Calls - Minimum of 20 calls daily and 100 calls weekly
New and Follow Up Meetings - 15 every week 
- New Qualified Leads' Sales Pitch - 5 every week
Brand awareness activity/ participation at external event (fortnightly)`,
      measurementTracker: `To have a minimum of 20 sales qualified leads per time in the sales pipeline of each business unit`
    },
    {
      id: 'ghana-accounts-management',
      category: 'FINANCIAL',
      name: 'Accounts Management',
      marks: 5,
      kpi: `To calendarise and maintain strategic communication/ meetings with prospective and existing clients (see goal 3 for specifics). Minimum of one quarterly review with MIS report for onboarded clients. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
      measurementTracker: `Show MIS report and quarterly client review meeting calendar`
    }
  ],
  customer: [
    {
      id: 'ghana-internal-service',
      category: 'CUSTOMER',
      name: 'Satisfactory service to internal customer',
      marks: 10,
      kpi: `Satisfactory service to internal customer 
Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX,  when required.  Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.`,
      measurementTracker: `Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission.

Show screen shots of time stamps and  link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc`
    },
    {
      id: 'ghana-complaints',
      category: 'CUSTOMER',
      name: 'Must keep the external client complaint volume down for the entire year',
      marks: 10,
      kpi: `Must keep the external client complaint volume down for the entire year, Accurate and timely designs and Celebration of staff and client's birthdays. Manage internal or external issues, generate QA investigation report and follow through till resolved`,
      measurementTracker: `Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period`
    },
    {
      id: 'ghana-sla-compliance',
      category: 'CUSTOMER',
      name: 'Followed up via calls, messages, emails etc and responded according to SLA',
      marks: 10,
      kpi: `Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms,  implementation of signed contract and agreed timelines`,
      measurementTracker: `Minimum of 80% customer satisfaction ratings.  Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/  vendor quarterly evaluation report`
    }
  ],
  internal_processes: [
    {
      id: 'ghana-sop',
      category: 'INTERNAL_PROCESS',
      name: 'Adherence to SOPs, documentation of processes, back up of key positions',
      marks: 5,
      kpi: `Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned`,
      measurementTracker: `Show evidence of SOPs  on fllow charts,  Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. 

Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer priented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)`
    },
    {
      id: 'ghana-punctuality',
      category: 'INTERNAL_PROCESS',
      name: 'Punctuality and availability',
      marks: 5,
      kpi: `Resumption as stated in departmental calendar/ as directed at client's office, at internal/ external meetings and at training sessions`,
      measurementTracker: `Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS . 
Evidence of training feedback form of all scheduled trainings`
    },
    {
      id: 'ghana-prime-responsibilities',
      category: 'INTERNAL_PROCESS',
      name: 'Prime responsibilities and duties',
      marks: 10,
      kpi: `Prime Responsibilities and Duties (As listed in Job Description)`,
      measurementTracker: `Average of monthly evaluation scores/ QA  biannual scores attained within appraisal period`
    }
  ],
  learning_and_growth: [
    {
      id: 'ghana-leadership-evaluation',
      category: 'LEARNING_AND_GROWTH',
      name: 'Leadership Evaluation and knowledge sharing',
      marks: 5,
      kpi: `Compliance with BTM Culture tests-  Annual Customer service certificate, Quarterly English and Geography tests`,
      measurementTracker: `Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests`
    },
    {
      id: 'ghana-training',
      category: 'LEARNING_AND_GROWTH',
      name: 'Individual/ Self Driven Role Related Training',
      marks: 10,
      kpi: `Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms`,
      measurementTracker: `Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related  brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.
Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.`
    }
  ]
}

};
