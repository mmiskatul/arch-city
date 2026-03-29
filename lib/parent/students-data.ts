export type ParentStudentRecord = {
  id: string;
  initials: string;
  name: string;
  addedLabel: string;
  grade: string;
  school: string;
  focusAreas: string[];
  activeTutorInitials: string;
  activeTutorName: string;
  sessionsTotal: number;
};

export const parentStudentsData: ParentStudentRecord[] = [
  {
    id: "stu1",
    initials: "JW",
    name: "Jordan Wilson",
    addedLabel: "Added Jan 2024",
    grade: "11th Grade",
    school: "Parkway North High",
    focusAreas: ["Pre-Calculus", "SAT Prep"],
    activeTutorInitials: "MT",
    activeTutorName: "Marcus T.",
    sessionsTotal: 8,
  },
  {
    id: "stu2",
    initials: "MW",
    name: "Maya Wilson",
    addedLabel: "Added Mar 2025",
    grade: "8th Grade",
    school: "Ladue Middle School",
    focusAreas: ["Biology", "Algebra I"],
    activeTutorInitials: "AP",
    activeTutorName: "Dr. Patel",
    sessionsTotal: 4,
  },
];

export function getParentStudentById(id: string) {
  return parentStudentsData.find((student) => student.id === id);
}
