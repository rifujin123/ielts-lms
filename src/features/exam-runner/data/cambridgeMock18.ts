import type { IeltsExamManifest } from '../types/ielts.types'

export const cambridgeAcademicMock18: IeltsExamManifest = {
  id: 'CAM-18-ACAD-TEST-01',
  title: 'Cambridge Academic Reading — Full Test Simulation',
  code: 'IELTS-HT-ACAD-01',
  durationMinutes: 60,
  totalQuestions: 40,
  passages: [
    {
      id: 1,
      title: 'The Secret History of the Common Pencil',
      subtitle: 'From a Borrowdale storm to the space age writing instrument',
      questionRange: [1, 13],
      contentParagraphs: [
        {
          label: 'A',
          text: 'The modern pencil is an object so ubiquitous that its ingenious design and fascinating heritage are frequently overlooked. Today, billions of pencils are manufactured annually across the globe, yet the journey of this modest wooden cylinder began with an unforeseen geological discovery in the rugged hills of Cumbria, England, in the middle of the sixteenth century.',
        },
        {
          label: 'B',
          text: 'In 1564, a ferocious tempest uprooted a grove of ancient oak trees near the hamlet of Borrowdale. Beneath the torn root systems, local shepherds stumbled upon a massive deposit of a strange, dark, lustrous substance. Initially mistaken for a form of lead or hardened coal, the miners soon realized that this substance was exceptionally pure, chemically stable, and capable of leaving a dark, indelible mark on sheep fleece and parchment without smudging. In reality, it was graphite — a crystalline allotrope of carbon — and Borrowdale possessed the only deposit of solid, lump graphite ever discovered on Earth.',
        },
        {
          label: 'C',
          text: 'Because of its remarkable smoothness and refractory properties, the British Crown quickly recognized Borrowdale graphite as a material of profound military value. It was uniquely suited for lining the crucibles used to cast round cannonballs of uniform caliber, significantly improving artillery range and accuracy. Consequently, armed guards were stationed at the mine, and digging was strictly limited to a few weeks each year to maintain an artificial monopoly and sky-high market prices on the London exchange.',
        },
        {
          label: 'D',
          text: 'Early attempts to use graphite for writing involved wrapping sticks of raw mineral in string, sheepskin, or hazel twigs to prevent fingers from blackening. However, raw graphite was brittle and snapped under moderate pressure. It was not until the French Revolutionary Wars in 1795, when Britain imposed a naval blockade cutting off French access to English graphite, that a technological breakthrough occurred. The French engineer and inventor Nicolas-Jacques Conté developed a technique of pulverizing low-grade graphite powder, mixing it thoroughly with powdered clay and water, shaping the paste into slender rods, and firing them in a kiln.',
        },
        {
          label: 'E',
          text: 'Conté’s revolutionary invention not only circumvented the English monopoly but also allowed manufacturers to regulate the pencil’s hardness with scientific precision. By increasing the proportion of clay relative to graphite, the fired lead produced a lighter, harder line (now denoted as H grades); by maximizing the graphite ratio, the result was a velvety, darker mark (B grades). In the mid-nineteenth century, the American craftsman John Eberhard and German manufacturers like Faber-Castell standardized the hexagonal wooden casing, ensuring that pencils would no longer roll off tilted drafting desks.',
        },
      ],
    },
    {
      id: 2,
      title: 'Biomimetic Architecture: Designing Buildings from Nature',
      subtitle:
        'How engineers and architects mimic biological organisms to create climate-resilient cities',
      questionRange: [14, 26],
      contentParagraphs: [
        {
          label: 'A',
          text: 'For millions of years, biological organisms have adapted through evolutionary pressure to survive severe thermodynamic and structural constraints. Modern human architecture, by contrast, has historically relied on brute force: consuming staggering quantities of fossil energy to heat, cool, and structurally stabilize steel-and-glass skyscrapers. In recent decades, a paradigm shift known as biomimicry has gained momentum, urging civil engineers to treat the natural world not merely as a quarry of raw materials, but as an expansive catalog of mature, tested engineering solutions.',
        },
        {
          label: 'B',
          text: 'One of the most widely celebrated emblems of biomimetic design is the Eastgate Centre, a mid-rise shopping and office complex situated in Harare, Zimbabwe. Designed by architect Mick Pearce in collaboration with Arup engineers, the building consumes 90 percent less energy for climate control than conventional commercial buildings of equivalent volume. Instead of implementing expensive air-conditioning systems, Pearce drew inspiration from the colossal mounds constructed by macrotermes termites across the African savanna.',
        },
        {
          label: 'C',
          text: 'Termite mounds must maintain an internal nursery temperature of approximately 30 degrees Celsius within a fraction of a degree, despite ambient exterior temperatures that oscillate violently between 40 degrees by day and freezing at night. The termites achieve this through an ingenious passive ventilation matrix: cool air is drawn into subterranean flues, warmed by metabolic body heat and fungi gardens, and expelled through porous chimneys at the mound’s summit via thermal buoyancy. Pearce faithfully replicated this mechanism in the Eastgate Centre using hollow concrete slabs and massive fans that operate during chilly nighttime hours to flush daytime heat.',
        },
        {
          label: 'D',
          text: 'Beyond thermodynamics, biomimicry is transforming the structural integrity of tall buildings. In London, the 180-meter-tall skyscraper at 30 St Mary Axe — colloquially named "The Gherkin" — features an exterior diagrid skeleton directly inspired by the Venus flower basket sponge (Euplectella aspergillum). This deep-sea creature thrives under crushing hydrostatic pressure on the ocean floor thanks to a cylindrical silica lattice reinforced with diagonal spiral struts. By borrowing this lattice geometry, the skyscraper withstood severe wind shears with 20 percent less structural steel than traditional orthogonal beam systems.',
        },
        {
          label: 'E',
          text: 'Water management in arid metropolitan centers presents another frontier for biomimetic innovation. Designers in desert climates are currently deploying building facade coatings modeled after the Namib Desert beetle (Stenocara gracilipes). This beetle survives in one of the driest landscapes on the planet by angling its hardened wing shells into morning fog banks. Hydrophilic microscopic bumps on its shell capture moisture droplets, which then slide smoothly along hydrophobic waxy troughs directly into the insect’s mouth.',
        },
        {
          label: 'F',
          text: 'Despite these remarkable achievements, practitioners caution that biomimicry should not be treated as simplistic visual replication. Natural systems evolve to optimize survivability, whereas human engineering often prioritizes economic cost, regulatory compliance, and rapid fabrication. True biomimicry requires deep interdisciplinary symbiosis between biologists, materials scientists, and computer algorithms, moving beyond superficial biomimicry toward systemic functional coherence.',
        },
      ],
    },
    {
      id: 3,
      title: 'The Psychology of Decision Fatigue and Heuristics',
      subtitle:
        'Investigating how cognitive exhaustion distorts human judgment and organizational choices',
      questionRange: [27, 40],
      contentParagraphs: [
        {
          label: 'A',
          text: 'In an era dominated by instantaneous information and perpetual options, the average adult makes an estimated 35,000 choices every single day. From inconsequential micro-decisions — such as choosing which garment to wear or which email to answer first — to momentous medical, financial, and judicial verdicts, each choice exacts an invisible metabolic toll. Over the past two decades, cognitive psychologists have identified a phenomenon known as "decision fatigue": the quantifiable deterioration in the quality of decisions made by an individual after a prolonged session of continuous decision-making.',
        },
        {
          label: 'B',
          text: 'The conceptual foundation of decision fatigue rests upon the "ego depletion" model formulated by social psychologist Roy Baumeister. According to this framework, human willpower and conscious executive function are not inexhaustible spiritual resources; rather, they behave like a physiological muscle that consumes finite stores of biological fuel, particularly glucose. When an individual engages in active self-control, deliberation, or trade-off evaluation, the brain’s prefrontal cortex gradually experiences cognitive depletion, regardless of whether the tasks involve intellectual reasoning or moral restraint.',
        },
        {
          label: 'C',
          text: 'A famous 2011 study conducted by Shai Danziger, Jonathan Levav, and Liora Avnaim-Pesso examined over 1,100 judicial rulings made by Israeli parole boards over a ten-month period. The researchers documented a dramatic pattern: prisoners who appeared before judges early in the morning received favorable parole in approximately 65 percent of cases. As the morning wore on, the probability of parole steadily plummeted toward zero. However, immediately after the judges took a scheduled mid-day break for coffee and lunch, the favorable ruling rate spiked right back up to 65 percent before dwindling again toward the end of the afternoon.',
        },
        {
          label: 'D',
          text: 'When mentally depleted, human decision-makers rarely pause to replenish their mental reserves consciously. Instead, the brain instinctively shifts into an energy-conservation mode by resorting to mental shortcuts, or heuristics. One primary shortcut is "default paralysis" — preserving the status quo. In the parole experiment, denying parole represented the cognitively easy default choice: it preserved the prison status quo and carried zero risk of freeing a convict who might reoffend. Another common response to decision fatigue is impulsivity: opting for immediate gratification without weighing long-term hazards.',
        },
        {
          label: 'E',
          text: 'Prominent organizational leaders have famously adopted radical simplifications to insulate themselves from decision fatigue. Steve Jobs was renowned for wearing an identical black turtleneck and blue jeans every day, and Barack Obama similarly restricted his wardrobe exclusively to gray or blue suits during his presidency. As Obama noted in a 2012 interview, eliminating trivial morning choices allowed him to preserve mental bandwidth for weighty decisions concerning geopolitical treaties and national security.',
        },
        {
          label: 'F',
          text: 'In consumer environments, digital retailers deliberately exploit decision fatigue through a tactic known as "choice overload". By overwhelming shoppers with hundreds of variations of a single product category, merchants induce cognitive exhaustion, prompting customers to either abandon careful comparison and purchase pre-packaged defaults, or succumb to impulse upsells placed near the final checkout step. Recognizing the symptoms of decision fatigue has therefore become an essential literacy in contemporary life.',
        },
      ],
    },
  ],
  questions: [
    // ── PASSAGE 1: Questions 1 to 13 ──────────────────────────────
    {
      id: 1,
      passageId: 1,
      type: 'TRUE_FALSE_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.',
      prompt:
        'The discovery of Borrowdale graphite occurred as an accidental result of severe weather.',
      correctAnswer: 'TRUE',
      explanation:
        'Paragraph B states: "In 1564, a ferocious tempest uprooted a grove of ancient oak trees... beneath the torn root systems, local shepherds stumbled upon a massive deposit."',
      referenceLocation: 'Passage 1, Paragraph B',
    },
    {
      id: 2,
      passageId: 1,
      type: 'TRUE_FALSE_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.',
      prompt:
        'Borrowdale was one of several major sites in Europe known to have solid lump graphite deposits.',
      correctAnswer: 'FALSE',
      explanation:
        'Paragraph B explicitly says: "Borrowdale possessed the only deposit of solid, lump graphite ever discovered on Earth."',
      referenceLocation: 'Passage 1, Paragraph B',
    },
    {
      id: 3,
      passageId: 1,
      type: 'TRUE_FALSE_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.',
      prompt:
        'The British military prized graphite primarily because it could be used directly as gunpowder.',
      correctAnswer: 'FALSE',
      explanation:
        'Paragraph C states it was used for lining crucibles to cast round cannonballs of uniform caliber, not as gunpowder.',
      referenceLocation: 'Passage 1, Paragraph C',
    },
    {
      id: 4,
      passageId: 1,
      type: 'TRUE_FALSE_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.',
      prompt:
        'Digging in the Borrowdale mine was strictly restricted to only certain weeks each year.',
      correctAnswer: 'TRUE',
      explanation:
        'Paragraph C mentions: "digging was strictly limited to a few weeks each year to maintain an artificial monopoly."',
      referenceLocation: 'Passage 1, Paragraph C',
    },
    {
      id: 5,
      passageId: 1,
      type: 'TRUE_FALSE_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.',
      prompt:
        'Nicolas-Jacques Conté received financial support from the French Emperor Napoleon Bonaparte.',
      correctAnswer: 'NOT GIVEN',
      explanation:
        'The text mentions Conté invented his technique during the French Revolutionary Wars in 1795, but gives no information regarding whether he received financial support from Napoleon.',
      referenceLocation: 'Passage 1, Paragraph D',
    },
    {
      id: 6,
      passageId: 1,
      type: 'TRUE_FALSE_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.',
      prompt:
        'A higher proportion of clay mixed with graphite leads to a softer and darker writing mark.',
      correctAnswer: 'FALSE',
      explanation:
        'Paragraph E states: "By increasing the proportion of clay relative to graphite, the fired lead produced a lighter, harder line... by maximizing graphite, the result was a velvety, darker mark."',
      referenceLocation: 'Passage 1, Paragraph E',
    },
    {
      id: 7,
      passageId: 1,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Shepherds in Cumbria first used Borrowdale graphite to mark parchment and ___________.',
      correctAnswer: 'sheep fleece',
      explanation:
        'In Paragraph B: "...capable of leaving a dark, indelible mark on sheep fleece and parchment without smudging."',
      referenceLocation: 'Passage 1, Paragraph B',
    },
    {
      id: 8,
      passageId: 1,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'The British Crown valued graphite to line crucibles for casting cannonballs of consistent ___________.',
      correctAnswer: 'caliber',
      explanation: 'Paragraph C: "...casting round cannonballs of uniform caliber."',
      referenceLocation: 'Passage 1, Paragraph C',
    },
    {
      id: 9,
      passageId: 1,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Early writers wrapped sticks of raw graphite in string, hazel twigs, or ___________ to keep hands clean.',
      correctAnswer: 'sheepskin',
      explanation:
        'Paragraph D: "...wrapping sticks of raw mineral in string, sheepskin, or hazel twigs..."',
      referenceLocation: 'Passage 1, Paragraph D',
    },
    {
      id: 10,
      passageId: 1,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'France suffered from a shortage of English graphite due to a British ___________ in 1795.',
      correctAnswer: 'naval blockade',
      explanation:
        'Paragraph D: "...when Britain imposed a naval blockade cutting off French access..."',
      referenceLocation: 'Passage 1, Paragraph D',
    },
    {
      id: 11,
      passageId: 1,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Conté fired his mixture of clay and graphite powder in a ___________ to create hard rods.',
      correctAnswer: 'kiln',
      explanation:
        'Paragraph D: "...shaping the paste into slender rods, and firing them in a kiln."',
      referenceLocation: 'Passage 1, Paragraph D',
    },
    {
      id: 12,
      passageId: 1,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Harder pencil leads that create lighter lines are designated by the letter ___________.',
      correctAnswer: 'H',
      explanation:
        'Paragraph E: "...the fired lead produced a lighter, harder line (now denoted as H grades)."',
      referenceLocation: 'Passage 1, Paragraph E',
    },
    {
      id: 13,
      passageId: 1,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Manufacturers standardized a ___________ wooden shape so pencils would stay stationary on sloping desks.',
      correctAnswer: 'hexagonal',
      explanation:
        'Paragraph E: "...standardized the hexagonal wooden casing, ensuring that pencils would no longer roll off tilted drafting desks."',
      referenceLocation: 'Passage 1, Paragraph E',
    },

    // ── PASSAGE 2: Questions 14 to 26 ─────────────────────────────
    {
      id: 14,
      passageId: 2,
      type: 'MATCHING_HEADINGS',
      instruction:
        'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for Paragraph A from the list of headings below.',
      prompt: 'Heading for Paragraph A',
      paragraphTarget: 'Paragraph A',
      matchingHeadingsPool: [
        { id: 'i', title: 'i. Replicating subterranean airflow for thermal balance' },
        { id: 'ii', title: 'ii. Natural lessons in structural resistance to ocean depth' },
        { id: 'iii', title: 'iii. A shifting mindset from exploitation to emulation' },
        { id: 'iv', title: 'iv. Trapping vapor in hyper-arid habitats' },
        { id: 'v', title: 'v. The limits of mimicry and need for systemic science' },
        { id: 'vi', title: 'vi. Substantial energy cuts in a southern African landmark' },
        { id: 'vii', title: 'vii. Why ancient species failed to survive modern climate' },
      ],
      correctAnswer: 'iii',
      explanation:
        'Paragraph A introduces the shift from brute force energy consumption to viewing nature as a catalog of mature solutions ("A paradigm shift known as biomimicry").',
      referenceLocation: 'Passage 2, Paragraph A',
    },
    {
      id: 15,
      passageId: 2,
      type: 'MATCHING_HEADINGS',
      instruction: 'Choose the correct heading for Paragraph B from the list of headings.',
      prompt: 'Heading for Paragraph B',
      paragraphTarget: 'Paragraph B',
      matchingHeadingsPool: [
        { id: 'i', title: 'i. Replicating subterranean airflow for thermal balance' },
        { id: 'ii', title: 'ii. Natural lessons in structural resistance to ocean depth' },
        { id: 'iii', title: 'iii. A shifting mindset from exploitation to emulation' },
        { id: 'iv', title: 'iv. Trapping vapor in hyper-arid habitats' },
        { id: 'v', title: 'v. The limits of mimicry and need for systemic science' },
        { id: 'vi', title: 'vi. Substantial energy cuts in a southern African landmark' },
      ],
      correctAnswer: 'vi',
      explanation:
        'Paragraph B highlights the Eastgate Centre in Harare, Zimbabwe, which achieves 90% energy reduction by mimicking termites.',
      referenceLocation: 'Passage 2, Paragraph B',
    },
    {
      id: 16,
      passageId: 2,
      type: 'MATCHING_HEADINGS',
      instruction: 'Choose the correct heading for Paragraph C from the list of headings.',
      prompt: 'Heading for Paragraph C',
      paragraphTarget: 'Paragraph C',
      matchingHeadingsPool: [
        { id: 'i', title: 'i. Replicating subterranean airflow for thermal balance' },
        { id: 'ii', title: 'ii. Natural lessons in structural resistance to ocean depth' },
        { id: 'iv', title: 'iv. Trapping vapor in hyper-arid habitats' },
        { id: 'v', title: 'v. The limits of mimicry and need for systemic science' },
      ],
      correctAnswer: 'i',
      explanation:
        'Paragraph C explains the biological mechanism of termite ventilation (cool air in subterranean flues, thermal buoyancy) and how it was replicated.',
      referenceLocation: 'Passage 2, Paragraph C',
    },
    {
      id: 17,
      passageId: 2,
      type: 'MATCHING_HEADINGS',
      instruction: 'Choose the correct heading for Paragraph D from the list of headings.',
      prompt: 'Heading for Paragraph D',
      paragraphTarget: 'Paragraph D',
      matchingHeadingsPool: [
        { id: 'ii', title: 'ii. Natural lessons in structural resistance to ocean depth' },
        { id: 'iv', title: 'iv. Trapping vapor in hyper-arid habitats' },
        { id: 'v', title: 'v. The limits of mimicry and need for systemic science' },
      ],
      correctAnswer: 'ii',
      explanation:
        'Paragraph D discusses London’s "Gherkin" skyscraper, which uses a diagrid skeleton based on deep-sea Venus flower basket sponges.',
      referenceLocation: 'Passage 2, Paragraph D',
    },
    {
      id: 18,
      passageId: 2,
      type: 'MATCHING_HEADINGS',
      instruction: 'Choose the correct heading for Paragraph E from the list of headings.',
      prompt: 'Heading for Paragraph E',
      paragraphTarget: 'Paragraph E',
      matchingHeadingsPool: [
        { id: 'iv', title: 'iv. Trapping vapor in hyper-arid habitats' },
        { id: 'v', title: 'v. The limits of mimicry and need for systemic science' },
      ],
      correctAnswer: 'iv',
      explanation:
        'Paragraph E describes water harvesting facade coatings inspired by the Namib Desert beetle capturing moisture from morning fogs.',
      referenceLocation: 'Passage 2, Paragraph E',
    },
    {
      id: 19,
      passageId: 2,
      type: 'MATCHING_HEADINGS',
      instruction: 'Choose the correct heading for Paragraph F from the list of headings.',
      prompt: 'Heading for Paragraph F',
      paragraphTarget: 'Paragraph F',
      matchingHeadingsPool: [
        { id: 'v', title: 'v. The limits of mimicry and need for systemic science' },
        { id: 'vii', title: 'vii. Why ancient species failed to survive modern climate' },
      ],
      correctAnswer: 'v',
      explanation:
        'Paragraph F warns against superficial visual copying and calls for deep interdisciplinary science between biologists and engineers.',
      referenceLocation: 'Passage 2, Paragraph F',
    },
    {
      id: 20,
      passageId: 2,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt: 'Why does the Eastgate Centre in Zimbabwe require significantly less electricity?',
      options: [
        { key: 'A', text: 'It relies on massive solar panel farms on its roof' },
        { key: 'B', text: 'It employs passive ventilation inspired by termite mounds' },
        { key: 'C', text: 'It is built entirely underground beneath the city streets' },
        { key: 'D', text: 'It imports geothermal energy from neighboring valleys' },
      ],
      correctAnswer: 'B',
      explanation:
        'Paragraph B notes that instead of conventional AC, Mick Pearce mimicked macrotermes termite mounds to create passive airflow.',
      referenceLocation: 'Passage 2, Paragraph B',
    },
    {
      id: 21,
      passageId: 2,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt:
        'What was the primary structural benefit of copying the Venus flower basket sponge in "The Gherkin"?',
      options: [
        { key: 'A', text: 'It eliminated the need for elevators inside the core' },
        { key: 'B', text: 'It allowed the skyscraper to resist wind sheer using 20% less steel' },
        { key: 'C', text: 'It created glass windows that clean themselves automatically' },
        { key: 'D', text: 'It prevented seismic vibrations from shaking the foundation' },
      ],
      correctAnswer: 'B',
      explanation:
        'Paragraph D states: "the skyscraper withstood severe wind shears with 20 percent less structural steel than traditional orthogonal beam systems."',
      referenceLocation: 'Passage 2, Paragraph D',
    },
    {
      id: 22,
      passageId: 2,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt: 'How do the microscopic features on the Namib Desert beetle collect drinking water?',
      options: [
        { key: 'A', text: 'They absorb morning sunlight to melt surrounding frost' },
        { key: 'B', text: 'They dig subterranean channels down to deep groundwater' },
        { key: 'C', text: 'Hydrophilic bumps catch fog droplets which roll down waxy channels' },
        { key: 'D', text: 'They spin electrostatic webs that attract ambient vapor molecules' },
      ],
      correctAnswer: 'C',
      explanation:
        'Paragraph E: "Hydrophilic microscopic bumps on its shell capture moisture droplets, which then slide smoothly along hydrophobic waxy troughs directly into the insect’s mouth."',
      referenceLocation: 'Passage 2, Paragraph E',
    },
    {
      id: 23,
      passageId: 2,
      type: 'SUMMARY_COMPLETION',
      instruction:
        'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Macrotermes termites must keep their internal nursery at roughly 30°C to nurture their fungal gardens and young. They achieve this using subterranean flues and chimneys operating on ___________.',
      correctAnswer: 'thermal buoyancy',
      explanation:
        'Paragraph C explains that warm air rises and is expelled through chimneys via thermal buoyancy.',
      referenceLocation: 'Passage 2, Paragraph C',
    },
    {
      id: 24,
      passageId: 2,
      type: 'SUMMARY_COMPLETION',
      instruction:
        'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'The Venus flower basket sponge survives under high hydrostatic pressure due to a cylindrical ___________ structure.',
      correctAnswer: 'silica lattice',
      explanation:
        'Paragraph D: "...thanks to a cylindrical silica lattice reinforced with diagonal spiral struts."',
      referenceLocation: 'Passage 2, Paragraph D',
    },
    {
      id: 25,
      passageId: 2,
      type: 'SUMMARY_COMPLETION',
      instruction:
        'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Modern facade coatings based on Stenocara gracilipes are especially valuable in ___________ environments.',
      correctAnswer: 'desert',
      explanation:
        'Paragraph E: "Designers in desert climates are currently deploying building facade coatings..."',
      referenceLocation: 'Passage 2, Paragraph E',
    },
    {
      id: 26,
      passageId: 2,
      type: 'SUMMARY_COMPLETION',
      instruction:
        'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Successful biomimicry requires comprehensive ___________ between biologists, algorithm designers, and material engineers.',
      correctAnswer: 'interdisciplinary symbiosis',
      explanation:
        'Paragraph F: "True biomimicry requires deep interdisciplinary symbiosis between biologists, materials scientists, and computer algorithms..."',
      referenceLocation: 'Passage 2, Paragraph F',
    },

    // ── PASSAGE 3: Questions 27 to 40 ─────────────────────────────
    {
      id: 27,
      passageId: 3,
      type: 'YES_NO_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees, NO if it contradicts, or NOT GIVEN if it is impossible to say.',
      prompt:
        'Roy Baumeister’s ego depletion model suggests that human willpower functions similarly to a muscle that tires with use.',
      correctAnswer: 'YES',
      explanation:
        'Paragraph B states: "...human willpower and conscious executive function... behave like a physiological muscle that consumes finite stores of biological fuel."',
      referenceLocation: 'Passage 3, Paragraph B',
    },
    {
      id: 28,
      passageId: 3,
      type: 'YES_NO_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees, NO if it contradicts, or NOT GIVEN if it is impossible to say.',
      prompt:
        'In the 2011 Israeli parole study, prisoners who appeared before judges just prior to lunch had the highest chance of release.',
      correctAnswer: 'NO',
      explanation:
        'Paragraph C explains that parole chances steadily plummeted toward zero right before breaks, and spiked only early in the morning and right after lunch.',
      referenceLocation: 'Passage 3, Paragraph C',
    },
    {
      id: 29,
      passageId: 3,
      type: 'YES_NO_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees, NO if it contradicts, or NOT GIVEN if it is impossible to say.',
      prompt:
        'Judges who participated in the parole study were aware of the psychological factors skewing their verdicts.',
      correctAnswer: 'NOT GIVEN',
      explanation:
        'The passage documents the statistical variance in verdicts, but does not state whether the judges were aware of their bias at the time.',
      referenceLocation: 'Passage 3, Paragraph C',
    },
    {
      id: 30,
      passageId: 3,
      type: 'YES_NO_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees, NO if it contradicts, or NOT GIVEN if it is impossible to say.',
      prompt:
        'When suffering from decision fatigue, the human brain typically prefers the status quo option because it is less cognitively taxing.',
      correctAnswer: 'YES',
      explanation:
        'Paragraph D: "One primary shortcut is \'default paralysis\' — preserving the status quo. In the parole experiment, denying parole represented the cognitively easy default choice."',
      referenceLocation: 'Passage 3, Paragraph D',
    },
    {
      id: 31,
      passageId: 3,
      type: 'YES_NO_NOT_GIVEN',
      instruction:
        'Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees, NO if it contradicts, or NOT GIVEN if it is impossible to say.',
      prompt:
        'Simplifying mundane daily habits such as clothing choices can help preserve cognitive bandwidth for higher-stakes choices.',
      correctAnswer: 'YES',
      explanation:
        'Paragraph E explains how Jobs and Obama simplified their wardrobes to eliminate trivial morning choices and conserve mental bandwidth.',
      referenceLocation: 'Passage 3, Paragraph E',
    },
    {
      id: 32,
      passageId: 3,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt:
        'According to Paragraph A, how many choices does an ordinary adult make each day on average?',
      options: [
        { key: 'A', text: 'Approximately 500 decisions' },
        { key: 'B', text: 'Around 3,500 decisions' },
        { key: 'C', text: 'An estimated 35,000 choices' },
        { key: 'D', text: 'Over 100,000 micro-actions' },
      ],
      correctAnswer: 'C',
      explanation:
        'Paragraph A explicitly notes: "...the average adult makes an estimated 35,000 choices every single day."',
      referenceLocation: 'Passage 3, Paragraph A',
    },
    {
      id: 33,
      passageId: 3,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt:
        'Which specific area of the human brain is most subject to cognitive depletion during prolonged deliberation?',
      options: [
        { key: 'A', text: 'The amygdala' },
        { key: 'B', text: 'The prefrontal cortex' },
        { key: 'C', text: 'The cerebellum' },
        { key: 'D', text: 'The occipital lobe' },
      ],
      correctAnswer: 'B',
      explanation:
        'Paragraph B: "...the brain’s prefrontal cortex gradually experiences cognitive depletion..."',
      referenceLocation: 'Passage 3, Paragraph B',
    },
    {
      id: 34,
      passageId: 3,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt:
        'What immediate effect occurred in the Israeli parole study when judges concluded their food and coffee breaks?',
      options: [
        { key: 'A', text: 'Parole approval rates immediately returned to approximately 65%' },
        { key: 'B', text: 'Judges dismissed all pending afternoon hearings' },
        { key: 'C', text: 'Judges spent significantly more time questioning guards' },
        { key: 'D', text: 'Prisoners refused to enter the courtroom' },
      ],
      correctAnswer: 'A',
      explanation:
        'Paragraph C: "...immediately after the judges took a scheduled mid-day break for coffee and lunch, the favorable ruling rate spiked right back up to 65 percent..."',
      referenceLocation: 'Passage 3, Paragraph C',
    },
    {
      id: 35,
      passageId: 3,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt: 'How do digital merchants leverage "choice overload" against online consumers?',
      options: [
        { key: 'A', text: 'By hiding prices until the customer signs in' },
        {
          key: 'B',
          text: 'By inundating shoppers with countless product variants to provoke cognitive weariness',
        },
        { key: 'C', text: 'By offering only one single product with no customization' },
        { key: 'D', text: 'By reducing the return period to 24 hours' },
      ],
      correctAnswer: 'B',
      explanation:
        'Paragraph F: "By overwhelming shoppers with hundreds of variations of a single product category, merchants induce cognitive exhaustion..."',
      referenceLocation: 'Passage 3, Paragraph F',
    },
    {
      id: 36,
      passageId: 3,
      type: 'MULTIPLE_CHOICE',
      instruction: 'Choose the correct letter, A, B, C or D.',
      prompt:
        'Which of the following is described as an alternative, reckless consequence of decision fatigue alongside inaction?',
      options: [
        { key: 'A', text: 'Extreme athletic overexertion' },
        { key: 'B', text: 'Impulsivity and seeking immediate gratification' },
        { key: 'C', text: 'Severe memory amnesia' },
        { key: 'D', text: 'Hypersensitive auditory hearing' },
      ],
      correctAnswer: 'B',
      explanation:
        'Paragraph D: "Another common response to decision fatigue is impulsivity: opting for immediate gratification without weighing long-term hazards."',
      referenceLocation: 'Passage 3, Paragraph D',
    },
    {
      id: 37,
      passageId: 3,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Roy Baumeister’s psychological hypothesis regarding willpower limits is known as the ___________ model.',
      correctAnswer: 'ego depletion',
      explanation:
        'Paragraph B: "...rests upon the \'ego depletion\' model formulated by social psychologist Roy Baumeister."',
      referenceLocation: 'Passage 3, Paragraph B',
    },
    {
      id: 38,
      passageId: 3,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'The biological fuel most critically consumed by executive mental tasks in the brain is ___________.',
      correctAnswer: 'glucose',
      explanation:
        'Paragraph B: "...consumes finite stores of biological fuel, particularly glucose."',
      referenceLocation: 'Passage 3, Paragraph B',
    },
    {
      id: 39,
      passageId: 3,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'When the brain avoids making a difficult judgment and clings to current conditions, it suffers from ___________.',
      correctAnswer: 'default paralysis',
      explanation:
        'Paragraph D: "One primary shortcut is \'default paralysis\' — preserving the status quo."',
      referenceLocation: 'Passage 3, Paragraph D',
    },
    {
      id: 40,
      passageId: 3,
      type: 'SENTENCE_COMPLETION',
      instruction:
        'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      prompt:
        'Weary online consumers frequently fall victim to impulse ___________ positioned near the final payment button.',
      correctAnswer: 'upsells',
      explanation:
        'Paragraph F: "...or succumb to impulse upsells placed near the final checkout step."',
      referenceLocation: 'Passage 3, Paragraph F',
    },
  ],
}
