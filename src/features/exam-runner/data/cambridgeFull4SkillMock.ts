import type { FullIeltsExamManifest } from '../types/fullExam.types'
import { cambridgeAcademicMock18 } from './cambridgeMock18'

export const cambridgeFull4SkillMock: FullIeltsExamManifest = {
  id: 'CAM-18-ACAD-FULL-01',
  title: 'Cambridge Academic IELTS — Full 4-Skill Simulation Test',
  code: 'IELTS-HT-CBT-4SKILLS-01',
  type: 'ACADEMIC',
  description:
    'Full Computer-Based Test (CBT) covering all 4 skills: Listening (40 Qs), Reading (40 Qs), Writing (2 Tasks), and Speaking (3 Parts). 100% schema-driven and extensible.',
  skills: {
    /* ═══════════════════════════════════════════════════════════════
       1. LISTENING SKILL (4 SECTIONS — 40 QUESTIONS)
    ═══════════════════════════════════════════════════════════════ */
    listening: {
      durationMinutes: 32, // 30 mins audio + 2 mins review
      totalQuestions: 40,
      sections: [
        {
          sectionNumber: 1,
          title: 'Section 1: Conference Venue Booking',
          scenario: 'A telephone enquiry between a client and a hotel conference manager.',
          audioUrl: 'https://cdn.example.com/audio/ielts-lis-sec1.mp3',
          questionRange: [1, 10],
          questions: [
            {
              id: 1,
              type: 'FORM_COMPLETION',
              instruction:
                'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Contact Person Name: Mr. Andrew ___________',
              correctAnswer: 'Harrison',
              explanation: 'The caller clearly spells out his surname: H-A-R-R-I-S-O-N.',
              referenceLocation: 'Audio: 01:15',
            },
            {
              id: 2,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Company Name: ___________ Logistics International',
              correctAnswer: 'Apex',
              explanation: 'Caller states: "We are from Apex Logistics International."',
              referenceLocation: 'Audio: 01:42',
            },
            {
              id: 3,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Requested Date: 14th ___________',
              correctAnswer: 'November',
              explanation: 'The client requests the conference room for the 14th of November.',
              referenceLocation: 'Audio: 02:10',
            },
            {
              id: 4,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Number of Delegates expected: ___________ attendees',
              correctAnswer: '85',
              explanation:
                'Manager asks: "How many guests?", Client answers: "We expect around 85 attendees."',
              referenceLocation: 'Audio: 02:35',
            },
            {
              id: 5,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Room Selected: The ___________ Suite',
              correctAnswer: 'Orchard',
              explanation:
                'Manager recommends the Orchard Suite which accommodates up to 100 people.',
              referenceLocation: 'Audio: 03:02',
            },
            {
              id: 6,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Seating layout preferred: ___________ style',
              correctAnswer: 'theatre',
              explanation: 'Client specifies: "We prefer a standard theatre style setup."',
              referenceLocation: 'Audio: 03:30',
            },
            {
              id: 7,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Equipment needed: Ceiling mounted projector and ___________ microphones',
              correctAnswer: 'wireless',
              explanation: 'Client notes: "We will definitely need two wireless microphones."',
              referenceLocation: 'Audio: 04:00',
            },
            {
              id: 8,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Catering requirements: Morning tea and hot ___________ buffet',
              correctAnswer: 'lunch',
              explanation:
                'Manager confirms: "We include morning pastries and a hot lunch buffet."',
              referenceLocation: 'Audio: 04:30',
            },
            {
              id: 9,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Special dietary requests: 12 vegetarian and 4 ___________ meals',
              correctAnswer: 'gluten-free',
              explanation: 'Client requests 4 gluten-free meals for their overseas guests.',
              referenceLocation: 'Audio: 05:05',
            },
            {
              id: 10,
              type: 'FORM_COMPLETION',
              instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
              prompt: 'Deposit required by Friday: £___________',
              correctAnswer: '450',
              explanation: 'Deposit amount is quoted as four hundred and fifty pounds (£450).',
              referenceLocation: 'Audio: 05:40',
            },
          ],
        },
        {
          sectionNumber: 2,
          title: 'Section 2: Riverfront Nature Reserve Orientation',
          scenario: 'A talk by a park ranger introducing volunteer programs and reserve trails.',
          audioUrl: 'https://cdn.example.com/audio/ielts-lis-sec2.mp3',
          questionRange: [11, 20],
          questions: [
            {
              id: 11,
              type: 'MULTIPLE_CHOICE',
              instruction: 'Choose the correct letter, A, B or C.',
              prompt: 'Why was the Riverfront Reserve originally established in 1985?',
              options: [
                { key: 'A', text: 'To provide recreational boating facilities for tourists' },
                {
                  key: 'B',
                  text: 'To protect migratory wetland birds from industrial development',
                },
                { key: 'C', text: 'To generate commercial timber for local paper mills' },
              ],
              correctAnswer: 'B',
              explanation:
                'Ranger states the wetland was gazetted to prevent urban sprawl from harming bird populations.',
              referenceLocation: 'Audio: 07:15',
            },
            {
              id: 12,
              type: 'MULTIPLE_CHOICE',
              instruction: 'Choose the correct letter, A, B or C.',
              prompt: 'What should volunteers bring with them for Sunday clean-up duty?',
              options: [
                { key: 'A', text: 'Sturdy waterproof boots and their own gloves' },
                { key: 'B', text: 'Heavy pruning shears and power tools' },
                { key: 'C', text: 'A signed medical clearance from a physician' },
              ],
              correctAnswer: 'A',
              explanation:
                'The ranger emphasizes wearing sturdy waterproof boots as terrain is muddy.',
              referenceLocation: 'Audio: 08:20',
            },
            {
              id: 13,
              type: 'MULTIPLE_CHOICE',
              instruction: 'Choose the correct letter, A, B or C.',
              prompt: 'At what time does the main gate to the visitor centre close?',
              options: [
                { key: 'A', text: '5:00 PM' },
                { key: 'B', text: '6:30 PM' },
                { key: 'C', text: '8:00 PM' },
              ],
              correctAnswer: 'B',
              explanation: 'Gates close promptly at six-thirty PM every evening.',
              referenceLocation: 'Audio: 09:10',
            },
            {
              id: 14,
              type: 'MAP_DIAGRAM_LABELING',
              instruction:
                'Label the map below. Choose the correct letter (A–F) for each location.',
              prompt: 'Bird Watching Hide',
              targetLabel: 'Location 14 on Map',
              matchingPool: [
                { id: 'A', title: 'Location A: North Boardwalk' },
                { id: 'B', title: 'Location B: Western Lake Shore' },
                { id: 'C', title: 'Location C: Central Meadow' },
                { id: 'D', title: 'Location D: East Forest Pavilion' },
              ],
              correctAnswer: 'B',
              explanation:
                'Follow the western shoreline past the wooden footbridge to reach the hide.',
              referenceLocation: 'Audio: 10:15',
            },
            {
              id: 15,
              type: 'MAP_DIAGRAM_LABELING',
              instruction: 'Label the map below. Choose the correct letter (A–F).',
              prompt: 'Native Plant Nursery',
              targetLabel: 'Location 15 on Map',
              matchingPool: [
                { id: 'A', title: 'Location A: North Boardwalk' },
                { id: 'C', title: 'Location C: Central Meadow' },
                { id: 'D', title: 'Location D: East Forest Pavilion' },
              ],
              correctAnswer: 'D',
              explanation: 'Located directly adjacent to the East Forest Pavilion.',
              referenceLocation: 'Audio: 11:00',
            },
            {
              id: 16,
              type: 'SENTENCE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'The newly constructed children’s educational trail is called the ___________ Path.',
              correctAnswer: 'Discovery',
              explanation:
                'The ranger announces: "We have opened the Discovery Path for young children."',
              referenceLocation: 'Audio: 11:45',
            },
            {
              id: 17,
              type: 'SENTENCE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt: 'Cycling is only permitted on roads paved with ___________.',
              correctAnswer: 'asphalt',
              explanation: 'Bikes must remain on asphalt surfaces to prevent erosion.',
              referenceLocation: 'Audio: 12:20',
            },
            {
              id: 18,
              type: 'SENTENCE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt: 'Dog owners must keep their pets on a ___________ at all times.',
              correctAnswer: 'short leash',
              explanation:
                'Ranger states: "Dogs must be kept on a short leash to protect nesting waterfowl."',
              referenceLocation: 'Audio: 13:00',
            },
            {
              id: 19,
              type: 'SENTENCE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Annual family membership tickets include free parking and a quarterly ___________.',
              correctAnswer: 'magazine',
              explanation: 'Members receive our quarterly nature magazine delivered by post.',
              referenceLocation: 'Audio: 13:40',
            },
            {
              id: 20,
              type: 'SENTENCE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt: 'The emergency contact number is clearly printed on every trail ___________.',
              correctAnswer: 'marker',
              explanation: 'In an emergency, check the code on the nearest trail marker.',
              referenceLocation: 'Audio: 14:15',
            },
          ],
        },
        {
          sectionNumber: 3,
          title: 'Section 3: Academic Tutorial on Tidal Turbine Engineering',
          scenario: 'Two engineering students, Maya and Liam, consult their professor Dr. Chen.',
          audioUrl: 'https://cdn.example.com/audio/ielts-lis-sec3.mp3',
          questionRange: [21, 30],
          questions: [
            {
              id: 21,
              type: 'MULTIPLE_CHOICE',
              instruction: 'Choose the correct letter, A, B or C.',
              prompt:
                'What primary advantage of tidal power does Dr. Chen emphasize over wind energy?',
              options: [
                { key: 'A', text: 'Tidal currents are predictable decades in advance' },
                { key: 'B', text: 'Turbines in water never suffer mechanical corrosion' },
                { key: 'C', text: 'Tidal installations require zero capital investment' },
              ],
              correctAnswer: 'A',
              explanation:
                'Unlike wind, marine tides are governed by planetary mechanics and 100% predictable.',
              referenceLocation: 'Audio: 16:30',
            },
            {
              id: 22,
              type: 'MULTIPLE_CHOICE',
              instruction: 'Choose the correct letter, A, B or C.',
              prompt: 'Why did the students decide to abandon their original rotor blade design?',
              options: [
                { key: 'A', text: 'The composite material was too flexible under heavy drag' },
                {
                  key: 'B',
                  text: 'Manufacturing the curved titanium blades was excessively costly',
                },
                {
                  key: 'C',
                  text: 'The software simulation failed to run on their university computers',
                },
              ],
              correctAnswer: 'A',
              explanation:
                'Maya explains the polymer blades flexed too much in high velocity currents.',
              referenceLocation: 'Audio: 17:45',
            },
            {
              id: 23,
              type: 'MULTIPLE_CHOICE',
              instruction: 'Choose the correct letter, A, B or C.',
              prompt: 'How will the team measure environmental impact on marine mammals?',
              options: [
                { key: 'A', text: 'By deploying acoustic underwater hydrophone monitors' },
                { key: 'B', text: 'By tagging dolphins with GPS satellite transponders' },
                { key: 'C', text: 'By stationing observers on cliffs with binoculars' },
              ],
              correctAnswer: 'A',
              explanation:
                'Liam confirms they installed underwater hydrophones to detect mammal clicks.',
              referenceLocation: 'Audio: 19:10',
            },
            {
              id: 24,
              type: 'NOTE_COMPLETION',
              instruction:
                'Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Key challenge identified: Sea water causes rapid ___________ of metallic shafts.',
              correctAnswer: 'corrosion',
              explanation: 'Saline environment speeds up electrochemical corrosion.',
              referenceLocation: 'Audio: 20:05',
            },
            {
              id: 25,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt: 'Recommended protective measure: Apply an organic ___________ coating.',
              correctAnswer: 'ceramic',
              explanation: 'Dr. Chen suggests an organic ceramic layer to insulate the shaft.',
              referenceLocation: 'Audio: 20:50',
            },
            {
              id: 26,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt: 'Deadline for submitting the complete CAD schematic is next ___________.',
              correctAnswer: 'Thursday',
              explanation: 'Dr. Chen specifies the CAD file must be uploaded before Thursday 5 PM.',
              referenceLocation: 'Audio: 21:30',
            },
            {
              id: 27,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'The pilot test will be conducted in the coastal channel near ___________ Bay.',
              correctAnswer: 'Kestrel',
              explanation: 'The test location is officially designated as Kestrel Bay.',
              referenceLocation: 'Audio: 22:15',
            },
            {
              id: 28,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Minimum flow velocity needed to generate electrical output: ___________ m/s.',
              correctAnswer: '1.8',
              explanation:
                'Turbines begin generating electricity once velocity exceeds 1.8 meters per second.',
              referenceLocation: 'Audio: 23:00',
            },
            {
              id: 29,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt: 'Maximum rated power output for prototype: ___________ kilowatts.',
              correctAnswer: '250',
              explanation: 'The team expects a maximum rating of 250 kW.',
              referenceLocation: 'Audio: 23:45',
            },
            {
              id: 30,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Final project defense will take place before a panel of ___________ experts.',
              correctAnswer: 'industry',
              explanation: 'Grading includes an evaluation by three industry experts.',
              referenceLocation: 'Audio: 24:20',
            },
          ],
        },
        {
          sectionNumber: 4,
          title: 'Section 4: Global Ocean Acidification & Reef Ecosystems',
          scenario: 'A university lecture by Professor Helen Vance on marine chemical equilibrium.',
          audioUrl: 'https://cdn.example.com/audio/ielts-lis-sec4.mp3',
          questionRange: [31, 40],
          questions: [
            {
              id: 31,
              type: 'NOTE_COMPLETION',
              instruction:
                'Complete the lecture notes. Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'The oceans absorb roughly 30 percent of human-produced ___________ gas annually.',
              correctAnswer: 'carbon dioxide',
              explanation:
                'Lecture notes that marine waters sequester huge amounts of anthropogenic carbon dioxide.',
              referenceLocation: 'Audio: 26:10',
            },
            {
              id: 32,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'When CO2 reacts with seawater, it generates carbonic acid, releasing ___________ ions.',
              correctAnswer: 'hydrogen',
              explanation: 'Carbonic acid dissociates to release free hydrogen ions, lowering pH.',
              referenceLocation: 'Audio: 26:55',
            },
            {
              id: 33,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Since the industrial revolution, surface ocean pH has dropped by ___________ units.',
              correctAnswer: '0.1',
              explanation:
                'A 0.1 decrease in pH represents an approximate 30% increase in acidity.',
              referenceLocation: 'Audio: 27:35',
            },
            {
              id: 34,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Shell-building calcifiers struggle to synthesize calcium ___________ for their shells.',
              correctAnswer: 'carbonate',
              explanation:
                'Acidity depletes the saturation state of carbonate ions needed for calcium carbonate.',
              referenceLocation: 'Audio: 28:15',
            },
            {
              id: 35,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Pteropods, tiny sea snails known as sea ___________, are vital food for wild salmon.',
              correctAnswer: 'butterflies',
              explanation: 'Professor explains pteropods are nicknamed sea butterflies.',
              referenceLocation: 'Audio: 28:50',
            },
            {
              id: 36,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Corals expel their photosynthetic symbiotic algae, causing severe coral ___________.',
              correctAnswer: 'bleaching',
              explanation: 'Thermal stress combined with acidity triggers coral bleaching.',
              referenceLocation: 'Audio: 29:30',
            },
            {
              id: 37,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Coral reefs provide coastal storm ___________ for millions of human inhabitants.',
              correctAnswer: 'protection',
              explanation: 'Reefs dissipate wave energy and provide coastal protection.',
              referenceLocation: 'Audio: 30:10',
            },
            {
              id: 38,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Economic losses to global shellfish fisheries may reach billions of ___________ per year.',
              correctAnswer: 'dollars',
              explanation: 'Economic models forecast losses exceeding billions of dollars.',
              referenceLocation: 'Audio: 30:45',
            },
            {
              id: 39,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt: 'One natural buffer is the restoration of coastal ___________ beds.',
              correctAnswer: 'seagrass',
              explanation: 'Seagrass meadows absorb carbon locally, acting as ocean acid buffers.',
              referenceLocation: 'Audio: 31:20',
            },
            {
              id: 40,
              type: 'NOTE_COMPLETION',
              instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
              prompt:
                'Ultimately, stabilizing ocean chemistry requires drastic cuts in greenhouse ___________.',
              correctAnswer: 'emissions',
              explanation: 'The conclusion underscores reducing greenhouse gas emissions globally.',
              referenceLocation: 'Audio: 31:55',
            },
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════
       2. READING SKILL (3 PASSAGES — 40 QUESTIONS)
    ═══════════════════════════════════════════════════════════════ */
    reading: {
      durationMinutes: 60,
      totalQuestions: 40,
      passages: cambridgeAcademicMock18.passages.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        contentParagraphs: p.contentParagraphs,
        questionRange: p.questionRange,
        questions: cambridgeAcademicMock18.questions
          .filter((q) => q.passageId === p.id)
          .map((q) => ({
            id: q.id,
            type: q.type,
            instruction: q.instruction,
            prompt: q.prompt,
            options: q.options,
            matchingPool: q.matchingHeadingsPool,
            targetLabel: q.paragraphTarget,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            referenceLocation: q.referenceLocation,
          })),
      })),
    },

    /* ═══════════════════════════════════════════════════════════════
       3. WRITING SKILL (TASK 1 & TASK 2 — 60 MINUTES)
    ═══════════════════════════════════════════════════════════════ */
    writing: {
      durationMinutes: 60,
      tasks: [
        {
          taskNumber: 1,
          title: 'Writing Task 1: Renewable Energy Generation in Europe',
          minWords: 150,
          recommendedMinutes: 20,
          visualType: 'BAR_CHART',
          chartDataPoints: [
            {
              category: 'Denmark',
              startYearValue: 35,
              endYearValue: 60,
              colorClass: 'bg-emerald-500',
            },
            {
              category: 'Germany',
              startYearValue: 17,
              endYearValue: 42,
              colorClass: 'bg-blue-500',
            },
            { category: 'Spain', startYearValue: 25, endYearValue: 39, colorClass: 'bg-amber-500' },
            { category: 'UK', startYearValue: 7, endYearValue: 38, colorClass: 'bg-purple-500' },
            { category: 'Italy', startYearValue: 14, endYearValue: 22, colorClass: 'bg-slate-500' },
          ],
          prompt:
            'The chart below shows the percentage of electricity generated from renewable sources in five European countries (Germany, United Kingdom, Denmark, Spain, Italy) in 2010, 2015, and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
          sampleModelAnswer:
            'The bar chart illustrates the proportion of electricity produced from renewable energy sources across five European nations—Germany, the United Kingdom, Denmark, Spain, and Italy—in the years 2010, 2015, and 2020.\n\nOverall, it is noticeable that all five countries experienced an upward trend in renewable power generation over the ten-year period. Denmark consistently led the group by a wide margin throughout the timeframe, while the United Kingdom registered the most dramatic rate of increase.\n\nIn 2010, Denmark generated approximately 35% of its electricity from renewable sources, followed by Spain at 25% and Germany at 17%. By contrast, Italy and the UK produced much smaller shares, at 14% and 7% respectively.\n\nBy 2020, Denmark’s figure surged to nearly 60%, maintaining its dominant position. Germany and the UK demonstrated substantial growth, reaching 42% and 38% respectively, with the UK witnessing a more than fivefold increase from its initial level. Spain saw a steady climb to 39%, whereas Italy progressed more modestly, finishing at 22%.',
        },
        {
          taskNumber: 2,
          title: 'Writing Task 2: Higher Education Financing',
          minWords: 250,
          recommendedMinutes: 40,
          prompt:
            'Some people believe that university education should be completely free for all students, funded entirely by the government. Others argue that students and their families should contribute tuition fees, as higher education directly benefits individuals.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
          sampleModelAnswer:
            'The question of whether tertiary education should be state-funded or financed through individual tuition fees remains a topic of intense debate. While tuition-free universities promote social equity and cultivate an educated workforce, I believe that a hybrid model—where students pay subsidized fees backed by income-contingent loans and merit-based grants—strikes the most sustainable balance.\n\nAdvocates of universally free university education emphasize equality of opportunity. Proponents argue that high tuition fees act as an insurmountable barrier for students from underprivileged socio-economic backgrounds, thereby perpetuating social disparities. When a government finances higher education, talented young individuals can pursue medicine, engineering, and scientific research irrespective of their household income. Furthermore, higher national graduation rates yield long-term societal dividends, such as higher tax revenues and accelerated technological innovation.\n\nConversely, supporters of tuition fees maintain that higher education is primarily a private investment that yields substantial personal returns. University graduates typically earn considerably higher lifetime salaries and enjoy greater career mobility than non-graduates. Therefore, it is arguably unjust to burden ordinary taxpayers—many of whom did not attend university themselves—with the full cost of tertiary schooling. Additionally, when students invest their own resources into their degrees, they are generally more conscientious and driven to complete their studies efficiently.\n\nIn conclusion, while free higher education embodies an egalitarian ideal, it frequently places severe strain on public budgets. A pragmatic approach combining subsidized fees with generous need-based scholarships ensures both equitable access and sustainable university standards.',
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════
       4. SPEAKING SKILL (3 PARTS — 11 TO 14 MINUTES)
    ═══════════════════════════════════════════════════════════════ */
    speaking: {
      durationMinutes: 14,
      part1: {
        partNumber: 1,
        topic: 'Introduction & Daily Routine',
        description:
          'The examiner will introduce themselves and ask general questions about your life, studies, and habits.',
        questions: [
          { id: 1, text: 'Do you work or are you currently studying?' },
          { id: 2, text: 'What do you find most interesting about your field of study or job?' },
          {
            id: 3,
            text: 'Let’s talk about your hometown. What is the most famous place in your hometown?',
          },
          { id: 4, text: 'Has your hometown changed significantly over the last ten years?' },
          { id: 5, text: 'How do you usually spend your mornings before starting your day?' },
          {
            id: 6,
            text: 'Do you prefer planning your daily routine strictly or keeping it flexible?',
          },
        ],
      },
      part2: {
        partNumber: 2,
        topicTitle: 'A Memorable Journey by Public Transport',
        prepTimeSeconds: 60,
        speakTimeSeconds: 120,
        cueCardPoints: [
          'Where you were travelling to',
          'What form of public transport you used',
          'Who was travelling with you',
          'And explain why this journey was particularly memorable to you.',
        ],
      },
      part3: {
        partNumber: 3,
        discussionTopic: 'Transportation Systems, Urbanization & Future Mobility',
        questions: [
          {
            id: 1,
            text: 'How has the expansion of high-speed rail networks transformed regional economies in your country?',
            guidance: 'Consider economic connectivity, tourism, and real estate decentralization.',
          },
          {
            id: 2,
            text: 'Do you think governments should heavily subsidize public transit to encourage people away from private automobiles?',
            guidance:
              'Evaluate environmental benefits versus taxation and operational maintenance costs.',
          },
          {
            id: 3,
            text: 'In what ways might artificial intelligence and autonomous vehicles alter urban traffic in the next two decades?',
            guidance: 'Discuss traffic congestion, safety, logistics, and ethical considerations.',
          },
          {
            id: 4,
            text: 'Why do some people still prefer personal cars even when rapid public transit is available?',
            guidance: 'Think about privacy, flexibility, status, and comfort.',
          },
        ],
      },
    },
  },
}
