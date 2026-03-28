export type TutorAvailabilityDay =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export type TutorAvailabilityStatus = "available" | "booked";

export type TutorAvailabilitySlot = {
  id: string;
  day: TutorAvailabilityDay;
  time: string;
  label: string;
  status: TutorAvailabilityStatus;
};

export const tutorAvailabilityDays = [
  { key: "mon", label: "MON", date: "30" },
  { key: "tue", label: "TUE", date: "31" },
  { key: "wed", label: "WED", date: "1" },
  { key: "thu", label: "THU", date: "2" },
  { key: "fri", label: "FRI", date: "3" },
  { key: "sat", label: "SAT", date: "4" },
  { key: "sun", label: "SUN", date: "5" },
] as const;

export const tutorAvailabilityTimes = ["3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"] as const;

export const tutorAvailabilitySlots: TutorAvailabilitySlot[] = [
  {
    id: "slot-1",
    day: "mon",
    time: "3:00 PM",
    label: "Available\n3:00-4:00",
    status: "available",
  },
  {
    id: "slot-2",
    day: "mon",
    time: "4:00 PM",
    label: "Jordan D.\n4:00-5:00",
    status: "booked",
  },
  {
    id: "slot-3",
    day: "tue",
    time: "4:00 PM",
    label: "Available\n4:00-5:00",
    status: "available",
  },
  {
    id: "slot-4",
    day: "tue",
    time: "5:00 PM",
    label: "Aisha L.\n5:00-5:45",
    status: "booked",
  },
  {
    id: "slot-5",
    day: "wed",
    time: "5:00 PM",
    label: "Tyler M.\n5:00-6:00",
    status: "booked",
  },
  {
    id: "slot-6",
    day: "thu",
    time: "4:00 PM",
    label: "Available\n4:00-5:00",
    status: "available",
  },
  {
    id: "slot-7",
    day: "thu",
    time: "6:00 PM",
    label: "Available\n6:00-7:00",
    status: "available",
  },
  {
    id: "slot-8",
    day: "fri",
    time: "4:00 PM",
    label: "Available\n4:00-5:00",
    status: "available",
  },
];
