"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import {
  addTutorAvailabilitySlot,
  clearTutorAvailabilitySlots,
  deleteTutorAvailabilitySlot,
  fetchTutorAvailability,
  getFallbackTutorAvailability,
  updateTutorAvailabilitySlot,
  updateTutorAvailability,
  type TutorAvailabilityApiSlot,
} from "@/lib/api/tutor-availability-api";
import {
  type TutorAvailabilityDay,
  type TutorAvailabilitySlot,
} from "@/lib/tutor/availability-data";

function getSlotClass(status: TutorAvailabilitySlot["status"]) {
  return status === "booked"
    ? "border-[#f5d674] bg-[#fff6d8] text-[#9a7600]"
    : "border-[#f191a5] bg-[#fff1f4] text-[#d61c3f]";
}

function normalizeSlot(slot: TutorAvailabilityApiSlot): TutorAvailabilityApiSlot {
  return {
    id: slot.id,
    user_id: slot.user_id ?? "",
    day: slot.day,
    time: slot.time,
    label: slot.label,
    status: slot.status,
    date: slot.date ?? "",
    start_time: slot.start_time ?? "",
    end_time: slot.end_time ?? "",
  };
}

const WEEKDAY_KEYS: TutorAvailabilityDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const fallbackAvailability = getFallbackTutorAvailability();

function startOfWeek(date: Date) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const daysSinceMonday = (day + 6) % 7;
  weekStart.setDate(weekStart.getDate() - daysSinceMonday);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatWeekRangeLabel(weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${formatter.format(weekStart)} - ${formatter.format(weekEnd)}`;
}

function formatDayNumber(date: Date) {
  return String(date.getDate());
}

const TIME_HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));
const TIME_MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));
const TIME_PERIODS = ["AM", "PM"] as const;

function formatClockTime(hour: string, minute: string, period: "AM" | "PM") {
  return `${Number(hour) || 12}:${minute} ${period}`;
}

function format24HourTime(hour: string, minute: string, period: "AM" | "PM") {
  const normalizedHour = Number(hour) % 12;
  const hour24 = period === "PM" ? normalizedHour + 12 : normalizedHour;
  const safeHour = String(hour24 === 24 ? 0 : hour24).padStart(2, "0");
  return `${safeHour}:${minute}`;
}

function formatCalendarBucket(hour: string, period: "AM" | "PM") {
  return `${Number(hour) || 12}:00 ${period}`;
}

type PendingAddSlot = {
  day: TutorAvailabilityDay;
  date: string;
  displayStart: string;
  displayEnd: string;
  rowTime: string;
  startTime: string;
  endTime: string;
  label: string;
};

type SlotFormState = {
  day: TutorAvailabilityDay;
  date: string;
  startHour: string;
  startMinute: string;
  startPeriod: "AM" | "PM";
  endHour: string;
  endMinute: string;
  endPeriod: "AM" | "PM";
};

function parseClockTimeToMinutes(value: string) {
  const trimmed = value.trim().toUpperCase();
  const twelveHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (twelveHourMatch) {
    const hour = Number(twelveHourMatch[1]) % 12;
    const minute = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3] as "AM" | "PM";
    return period === "PM" ? hour * 60 + 12 * 60 + minute : hour * 60 + minute;
  }

  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    return Number(twentyFourHourMatch[1]) * 60 + Number(twentyFourHourMatch[2]);
  }

  return null;
}

function formatTimelineTime(minutes: number) {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function formatHourCellLabel(minutes: number) {
  const hourStart = Math.floor(minutes / 60) * 60;
  return formatTimelineTime(hourStart);
}

function buildCalendarHours(daySlots: Array<{ slots: TutorAvailabilityApiSlot[] }>) {
  const allWindows = daySlots.flatMap((day) => day.slots.map(resolveSlotWindow));

  if (allWindows.length === 0) {
    return ["3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"] as const;
  }

  const minStart = Math.min(...allWindows.map((window) => window.start));
  const maxEnd = Math.max(...allWindows.map((window) => window.end));
  const startHour = Math.floor(minStart / 60) * 60;
  const endHour = Math.ceil(maxEnd / 60) * 60;

  const hours: string[] = [];
  for (let current = startHour; current <= endHour; current += 60) {
    hours.push(formatTimelineTime(current));
  }

  return hours;
}

function resolveSlotWindow(slot: TutorAvailabilityApiSlot) {
  const start = parseClockTimeToMinutes(slot.start_time || "");
  const end = parseClockTimeToMinutes(slot.end_time || "");

  if (start !== null && end !== null) {
    return { start, end };
  }

  const labelMatch = slot.label.match(/(\d{1,2}:\d{2})(?:\s*(AM|PM))?\s*-\s*(\d{1,2}:\d{2})(?:\s*(AM|PM))?/i);
  if (labelMatch) {
    const startLabel = `${labelMatch[1]} ${labelMatch[2] ?? ""}`.trim();
    const endLabel = `${labelMatch[3]} ${labelMatch[4] ?? ""}`.trim();
    const parsedStart = parseClockTimeToMinutes(startLabel);
    const parsedEnd = parseClockTimeToMinutes(endLabel);
    if (parsedStart !== null && parsedEnd !== null) {
      return { start: parsedStart, end: parsedEnd };
    }
  }

  const fallbackStart = parseClockTimeToMinutes(slot.time) ?? 0;
  return { start: fallbackStart, end: fallbackStart + 60 };
}

function minutesToClockParts(minutes: number) {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalizedMinutes / 60);
  const minute = String(normalizedMinutes % 60).padStart(2, "0");
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = String(hour24 % 12 || 12);
  return {
    hour: hour12,
    minute,
    period,
  } as const;
}

function slotFormFromSlot(slot: TutorAvailabilityApiSlot): SlotFormState {
  const { start, end } = resolveSlotWindow(slot);
  const startParts = minutesToClockParts(start);
  const endParts = minutesToClockParts(end);

  return {
    day: slot.day,
    date: slot.date || "",
    startHour: startParts.hour,
    startMinute: startParts.minute,
    startPeriod: startParts.period,
    endHour: endParts.hour,
    endMinute: endParts.minute,
    endPeriod: endParts.period,
  };
}

export function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<TutorAvailabilityApiSlot[]>(fallbackAvailability.slots);
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState(String(fallbackAvailability.max_sessions_per_day));
  const [noticeRequired, setNoticeRequired] = useState(fallbackAvailability.notice_required);
  const [slotDate, setSlotDate] = useState("");
  const [slotStartHour, setSlotStartHour] = useState("3");
  const [slotStartMinute, setSlotStartMinute] = useState("00");
  const [slotStartPeriod, setSlotStartPeriod] = useState<"AM" | "PM">("PM");
  const [slotEndHour, setSlotEndHour] = useState("4");
  const [slotEndMinute, setSlotEndMinute] = useState("00");
  const [slotEndPeriod, setSlotEndPeriod] = useState<"AM" | "PM">("PM");
  const [pendingAddSlot, setPendingAddSlot] = useState<PendingAddSlot | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [mutatingSlots, setMutatingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [visibleWeekStart, setVisibleWeekStart] = useState(() => startOfWeek(new Date()));

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      try {
        const data = await fetchTutorAvailability();
        if (!active) return;

        setSlots(data.slots.map(normalizeSlot));
        setMaxSessionsPerDay(String(data.max_sessions_per_day || fallbackAvailability.max_sessions_per_day));
        setNoticeRequired(data.notice_required ?? fallbackAvailability.notice_required);
        setError(null);
      } catch (loadError) {
        if (!active) return;

        setSlots(fallbackAvailability.slots);
        setMaxSessionsPerDay(String(fallbackAvailability.max_sessions_per_day));
        setNoticeRequired(fallbackAvailability.notice_required);
        setError(loadError instanceof Error ? loadError.message : "Failed to load availability.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAvailability();
    return () => {
      active = false;
    };
  }, []);

  const visibleWeekDays = useMemo(() => {
    return WEEKDAY_KEYS.map((dayKey, index) => {
      const date = addDays(visibleWeekStart, index);
      return {
        key: dayKey,
        label: dayKey.toUpperCase(),
        date: formatDayNumber(date),
        isoDate: formatDateInputValue(date),
      };
    });
  }, [visibleWeekStart]);

  const visibleDaySlots = useMemo(() => {
    const weekDateToDayKey = new Map(visibleWeekDays.map((day) => [day.isoDate, day.key]));

    return visibleWeekDays.map((day) => ({
      ...day,
      slots: slots
        .filter((slot) => {
          if (slot.date) {
            return weekDateToDayKey.get(slot.date) === day.key;
          }
          return slot.day === day.key;
        })
        .sort((a, b) => resolveSlotWindow(a).start - resolveSlotWindow(b).start),
    }));
  }, [slots, visibleWeekDays]);

  const editingSlot = useMemo(() => {
    if (!editingSlotId) return null;
    return slots.find((slot) => slot.id === editingSlotId) ?? null;
  }, [editingSlotId, slots]);

  const weekRangeLabel = useMemo(() => formatWeekRangeLabel(visibleWeekStart), [visibleWeekStart]);

  function goToPreviousWeek() {
    setVisibleWeekStart((current) => addDays(current, -7));
  }

  function goToNextWeek() {
    setVisibleWeekStart((current) => addDays(current, 7));
  }

  function handleVisibleDateChange(value: string) {
    const parsed = parseDateInputValue(value);
    if (!parsed) {
      return;
    }

    setVisibleWeekStart(startOfWeek(parsed));
  }

  async function handleSaveSettings() {
    setSavingSettings(true);
    setError(null);
    setMessage(null);

    try {
      const data = await updateTutorAvailability({
        slots,
        max_sessions_per_day: Number(maxSessionsPerDay) || fallbackAvailability.max_sessions_per_day,
        notice_required: noticeRequired,
      });

      setSlots(data.slots.map(normalizeSlot));
      setMaxSessionsPerDay(String(data.max_sessions_per_day || fallbackAvailability.max_sessions_per_day));
      setNoticeRequired(data.notice_required ?? "");
      setMessage("Availability settings saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save availability settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  function requestAddSlot() {
    if (!slotDate) {
      setError("Select a date and start/end times before adding a slot.");
      return;
    }

    const dayIndex = new Date(slotDate).getDay();
    const dayKeys: TutorAvailabilityDay[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const day = dayKeys[dayIndex];

    if (!day || day === "sun") {
      setError("Availability slots can only be added on Monday through Saturday.");
      return;
    }

    const displayStart = formatClockTime(slotStartHour, slotStartMinute, slotStartPeriod);
    const displayEnd = formatClockTime(slotEndHour, slotEndMinute, slotEndPeriod);
    const rowTime = formatCalendarBucket(slotStartHour, slotStartPeriod);
    const startMinutes = parseClockTimeToMinutes(displayStart);
    const endMinutes = parseClockTimeToMinutes(displayEnd);

    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
      setError("End time must be after start time.");
      return;
    }

    setError(null);
    setMessage(null);
    setPendingAddSlot({
      day,
      date: slotDate,
      displayStart,
      displayEnd,
      rowTime,
      startTime: format24HourTime(slotStartHour, slotStartMinute, slotStartPeriod),
      endTime: format24HourTime(slotEndHour, slotEndMinute, slotEndPeriod),
      label: `Available\n${displayStart} - ${displayEnd}`,
    });
  }

  function requestEditSlot(slot: TutorAvailabilityApiSlot) {
    const form = slotFormFromSlot(slot);
    setEditingSlotId(slot.id);
    setSlotDate(slot.date || "");
    setSlotStartHour(form.startHour);
    setSlotStartMinute(form.startMinute);
    setSlotStartPeriod(form.startPeriod);
    setSlotEndHour(form.endHour);
    setSlotEndMinute(form.endMinute);
    setSlotEndPeriod(form.endPeriod);
    setError(null);
    setMessage(null);
    const formElement = document.getElementById("availability-slot-form");
    formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function confirmAddSlot() {
    if (!pendingAddSlot) {
      return;
    }

    setMutatingSlots(true);
    setError(null);
    setMessage(null);

    try {
      const created = await addTutorAvailabilitySlot({
        day: pendingAddSlot.day,
        time: pendingAddSlot.rowTime,
        label: pendingAddSlot.label,
        status: "available",
        date: pendingAddSlot.date,
        start_time: pendingAddSlot.startTime,
        end_time: pendingAddSlot.endTime,
      });

      setSlots((current) => [
        ...current.filter((slot) => !(slot.day === created.day && slot.time === created.time)),
        normalizeSlot(created),
      ]);
      setMessage("Availability slot added.");
      setSlotDate("");
      setSlotStartHour("3");
      setSlotStartMinute("00");
      setSlotStartPeriod("PM");
      setSlotEndHour("4");
      setSlotEndMinute("00");
      setSlotEndPeriod("PM");
      setPendingAddSlot(null);
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Failed to add availability slot.");
    } finally {
      setMutatingSlots(false);
    }
  }

  async function confirmEditSlot() {
    if (!editingSlot) {
      return;
    }

    if (!slotDate) {
      setError("Select a date and start/end times before saving the slot.");
      return;
    }

    const displayStart = formatClockTime(slotStartHour, slotStartMinute, slotStartPeriod);
    const displayEnd = formatClockTime(slotEndHour, slotEndMinute, slotEndPeriod);
    const rowTime = formatCalendarBucket(slotStartHour, slotStartPeriod);
    const startMinutes = parseClockTimeToMinutes(displayStart);
    const endMinutes = parseClockTimeToMinutes(displayEnd);

    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
      setError("End time must be after start time.");
      return;
    }

    setMutatingSlots(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await updateTutorAvailabilitySlot(editingSlot.id, {
        day: editingSlot.day,
        time: rowTime,
        label: `Available\n${displayStart} - ${displayEnd}`,
        status: editingSlot.status,
        date: slotDate,
        start_time: format24HourTime(slotStartHour, slotStartMinute, slotStartPeriod),
        end_time: format24HourTime(slotEndHour, slotEndMinute, slotEndPeriod),
      });

      setSlots((current) => current.map((slot) => (slot.id === updated.id ? normalizeSlot(updated) : slot)));
      setMessage("Availability slot updated.");
      setEditingSlotId(null);
    } catch (editError) {
      setError(editError instanceof Error ? editError.message : "Failed to update availability slot.");
    } finally {
      setMutatingSlots(false);
    }
  }

  async function removeSlot(slotId: string) {
    setMutatingSlots(true);
    setError(null);
    setMessage(null);

    try {
      await deleteTutorAvailabilitySlot(slotId);
      setSlots((current) => current.filter((slot) => slot.id !== slotId));
      setMessage("Availability slot removed.");
      if (editingSlotId === slotId) {
        setEditingSlotId(null);
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete availability slot.");
    } finally {
      setMutatingSlots(false);
    }
  }

  function requestRemoveAllAvailability() {
    setError(null);
    setMessage(null);
    setShowRemoveConfirm(true);
  }

  async function confirmRemoveAllAvailability() {
    setMutatingSlots(true);
    setError(null);
    setMessage(null);

    try {
      await clearTutorAvailabilitySlots();
      setSlots((current) => current.filter((slot) => slot.status === "booked"));
      setMessage("Open availability slots removed.");
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Failed to clear availability slots.");
    } finally {
      setMutatingSlots(false);
      setShowRemoveConfirm(false);
    }
  }

  const isBusy = loading || savingSettings || mutatingSlots;
  const calendarHours = useMemo(() => buildCalendarHours(visibleDaySlots), [visibleDaySlots]);

  return (
    <TutorShell>
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Availability</h1>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={requestRemoveAllAvailability}
              disabled={isBusy}
              className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove All
            </button>
            <button
              type="button"
              onClick={requestAddSlot}
              disabled={isBusy}
              className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
            >
              + Add Slot
            </button>
          </div>
        </div>

        {(error || message) && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-[14px] ${
              error ? "border-[#f3c2c9] bg-[#fff5f7] text-[#b4233b]" : "border-[#c8e6c9] bg-[#f4fff4] text-[#226b2b]"
            }`}
          >
            {error ?? message}
          </div>
        )}

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_270px]">
          <section className="rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 border-b border-[#eceef2] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={goToPreviousWeek}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280]"
                  aria-label="Previous week"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <div>
                  <h2 className="text-[16px] font-bold text-[#20242b]">{weekRangeLabel}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <label className="text-[12px] font-semibold text-[#6b7280]" htmlFor="visible-week-date">
                      Jump to date
                    </label>
                    <input
                      id="visible-week-date"
                      type="date"
                      value={formatDateInputValue(visibleWeekStart)}
                      onChange={(event) => handleVisibleDateChange(event.target.value)}
                      className="h-8 rounded-lg border border-[#e5e7eb] bg-white px-3 text-[13px] text-[#20242b] outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={goToNextWeek}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280]"
                  aria-label="Next week"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-[13px] text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[4px] border border-[#f191a5] bg-[#fff1f4]" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[4px] border border-[#f5d674] bg-[#fff6d8]" />
                  <span>Booked</span>
                </div>
              </div>
            </div>

            <div className="overflow-auto" style={{ maxHeight: "760px" }}>
              <div className="min-w-[960px]">
                <div className="sticky top-0 z-30 grid grid-cols-[92px_repeat(7,minmax(0,1fr))] border-b border-[#eceef2] bg-[#fafafb] shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                  <div className="sticky left-0 z-40 border-r border-[#eceef2] bg-[#fafafb]" />
                  {visibleDaySlots.map((day) => (
                    <div
                      key={day.key}
                      className="border-r border-[#eceef2] px-3 py-2 text-center last:border-r-0"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                        {day.label}
                      </p>
                      <p className="text-[30px] font-bold leading-none text-[#20242b]">{day.date}</p>
                    </div>
                  ))}
                </div>

                {calendarHours.map((time) => (
                  <div
                    key={time}
                    className="grid grid-cols-[92px_repeat(7,minmax(0,1fr))] border-b border-[#eceef2] last:border-b-0"
                  >
                    <div className="sticky left-0 z-20 flex items-start justify-end border-r border-[#eceef2] bg-white px-3 py-4 text-[12px] font-semibold text-[#6b7280]">
                      {time}
                    </div>
                    {visibleDaySlots.map((day) => {
                      const matchingSlot = day.slots.find((slot) => {
                        const slotWindow = resolveSlotWindow(slot);
                        const slotStartHour = formatHourCellLabel(slotWindow.start);
                        return slotStartHour === time;
                      });

                      return (
                        <div
                          key={`${day.key}-${time}`}
                          className="min-h-[64px] border-r border-[#eceef2] bg-white px-2 py-2 last:border-r-0"
                        >
                          {matchingSlot ? (
                            <div
                              className={`group relative rounded-[10px] border px-3 py-2 text-[12px] font-semibold leading-4 shadow-sm transition hover:-translate-y-[1px] ${getSlotClass(matchingSlot.status)}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-[12px] font-bold">
                                    {matchingSlot.status === "booked" ? "Booked" : "Available"}
                                  </div>
                                  <div className="mt-1 whitespace-pre-line text-[12px] font-semibold">
                                    {matchingSlot.label}
                                  </div>
                                </div>
                              </div>

                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-[10px] bg-black/0 opacity-0 transition group-hover:pointer-events-auto group-hover:bg-black/10 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => requestEditSlot(matchingSlot)}
                                  className="inline-flex h-8 items-center rounded-full bg-white px-3 text-[11px] font-bold text-[#20242b] shadow-md transition hover:bg-[#f5f5f5]"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeSlot(matchingSlot.id)}
                                  className="inline-flex h-8 items-center rounded-full bg-[#d61c3f] px-3 text-[11px] font-bold text-white shadow-md transition hover:bg-[#be1837]"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold text-[#20242b]">Availability Settings</h2>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isBusy}
                className="inline-flex h-9 items-center rounded-full bg-[#20242b] px-4 text-[13px] font-semibold text-white transition hover:bg-[#121418] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save Settings
              </button>
            </div>
            <p className="mt-2 text-[12px] text-[#9ca3af]">
              Saves your calendar rules like maximum sessions per day and required notice before booking.
            </p>

            <div className="mt-5 space-y-6">
              <div>
                <label className="text-[14px] font-semibold text-[#374151]">Max Sessions Per Day</label>
                <input
                  type="text"
                  value={maxSessionsPerDay}
                  onChange={(event) => setMaxSessionsPerDay(event.target.value)}
                  className="mt-2 h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
                />
                <p className="mt-2 text-[12px] text-[#9ca3af]">
                  Students cannot book beyond this limit per day.
                </p>
              </div>

              <div>
                <label className="text-[14px] font-semibold text-[#374151]">Notice Required</label>
                <input
                  type="text"
                  value={noticeRequired}
                  onChange={(event) => setNoticeRequired(event.target.value)}
                  className="mt-2 h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
                />
              </div>

              <div id="availability-slot-form" className="border-t border-[#eceef2] pt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[16px] font-bold text-[#20242b]">
                    {editingSlot ? "Update Availability Slot" : "Add Availability Slot"}
                  </h3>
                  {editingSlot ? (
                    <button
                      type="button"
                      onClick={() => setEditingSlotId(null)}
                      className="inline-flex h-8 items-center rounded-full border border-[#e5e7eb] px-3 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                    >
                      Cancel Edit
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-[12px] text-[#9ca3af]">
                  Choose exact start and end times with 1-minute precision.
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-[13px] font-semibold text-[#6b7280]">Date</label>
                    <input
                      type="date"
                      value={slotDate}
                      onChange={(event) => setSlotDate(event.target.value)}
                      className="mt-2 h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#eceef2] bg-[#fafafa] p-3">
                      <label className="text-[13px] font-semibold text-[#6b7280]">Start</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <select
                          value={slotStartHour}
                          onChange={(event) => setSlotStartHour(event.target.value)}
                          className="h-10 rounded-xl border border-[#e5e7eb] bg-white px-3 text-[14px] outline-none"
                        >
                          {TIME_HOURS.map((hour) => (
                            <option key={`start-hour-${hour}`} value={hour}>
                              {hour}
                            </option>
                          ))}
                        </select>
                        <select
                          value={slotStartMinute}
                          onChange={(event) => setSlotStartMinute(event.target.value)}
                          className="h-10 rounded-xl border border-[#e5e7eb] bg-white px-3 text-[14px] outline-none"
                        >
                          {TIME_MINUTES.map((minute) => (
                            <option key={`start-minute-${minute}`} value={minute}>
                              {minute}
                            </option>
                          ))}
                        </select>
                        <select
                          value={slotStartPeriod}
                          onChange={(event) => setSlotStartPeriod(event.target.value as "AM" | "PM")}
                          className="h-10 rounded-xl border border-[#e5e7eb] bg-white px-3 text-[14px] outline-none"
                        >
                          {TIME_PERIODS.map((period) => (
                            <option key={`start-period-${period}`} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#eceef2] bg-[#fafafa] p-3">
                      <label className="text-[13px] font-semibold text-[#6b7280]">End</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <select
                          value={slotEndHour}
                          onChange={(event) => setSlotEndHour(event.target.value)}
                          className="h-10 rounded-xl border border-[#e5e7eb] bg-white px-3 text-[14px] outline-none"
                        >
                          {TIME_HOURS.map((hour) => (
                            <option key={`end-hour-${hour}`} value={hour}>
                              {hour}
                            </option>
                          ))}
                        </select>
                        <select
                          value={slotEndMinute}
                          onChange={(event) => setSlotEndMinute(event.target.value)}
                          className="h-10 rounded-xl border border-[#e5e7eb] bg-white px-3 text-[14px] outline-none"
                        >
                          {TIME_MINUTES.map((minute) => (
                            <option key={`end-minute-${minute}`} value={minute}>
                              {minute}
                            </option>
                          ))}
                        </select>
                        <select
                          value={slotEndPeriod}
                          onChange={(event) => setSlotEndPeriod(event.target.value as "AM" | "PM")}
                          className="h-10 rounded-xl border border-[#e5e7eb] bg-white px-3 text-[14px] outline-none"
                        >
                          {TIME_PERIODS.map((period) => (
                            <option key={`end-period-${period}`} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={editingSlot ? confirmEditSlot : requestAddSlot}
                    disabled={isBusy}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editingSlot ? "Update Slot" : "Add Slot"}
                  </button>
                </div>
              </div>

              <div className="border-t border-[#eceef2] pt-5">
                <button
                  type="button"
                  onClick={requestRemoveAllAvailability}
                  disabled={isBusy}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove All Availability
                </button>
                <p className="mt-2 text-[12px] text-[#9ca3af]">
                  This removes only open slots. Booked sessions stay on the calendar.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {pendingAddSlot ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl">
              <h3 className="text-[18px] font-bold text-[#20242b]">Confirm Add Slot</h3>
              <p className="mt-2 text-[13px] text-[#6b7280]">
                This will create a new availability block for the selected week date.
              </p>

              <div className="mt-5 space-y-3 rounded-2xl border border-[#eceef2] bg-[#fafafa] p-4 text-[14px] text-[#20242b]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">Date</span>
                  <span className="font-semibold">{pendingAddSlot.date}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">Day</span>
                  <span className="font-semibold uppercase">{pendingAddSlot.day}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">Start</span>
                  <span className="font-semibold">{pendingAddSlot.displayStart}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">End</span>
                  <span className="font-semibold">{pendingAddSlot.displayEnd}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingAddSlot(null)}
                  className="inline-flex h-11 items-center rounded-full border border-[#e5e7eb] px-5 text-[14px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAddSlot}
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  Confirm Add
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showRemoveConfirm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl">
              <h3 className="text-[18px] font-bold text-[#20242b]">Confirm Remove All</h3>
              <p className="mt-2 text-[13px] text-[#6b7280]">
                This will remove every open availability slot. Booked sessions stay untouched.
              </p>

              <div className="mt-5 rounded-2xl border border-[#f3c2c9] bg-[#fff5f7] p-4 text-[14px] text-[#b4233b]">
                This action is permanent for open slots.
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRemoveConfirm(false)}
                  className="inline-flex h-11 items-center rounded-full border border-[#e5e7eb] px-5 text-[14px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRemoveAllAvailability}
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  Confirm Remove
                </button>
              </div>
            </div>
          </div>
        ) : null}

      </div>
    </TutorShell>
  );
}
