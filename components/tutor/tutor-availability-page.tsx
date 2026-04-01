"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import {
  addTutorAvailabilitySlot,
  clearTutorAvailabilitySlots,
  fetchTutorAvailability,
  getFallbackTutorAvailability,
  updateTutorAvailability,
  type TutorAvailabilityApiSlot,
} from "@/lib/api/tutor-availability-api";
import {
  tutorAvailabilityDays,
  tutorAvailabilityTimes,
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

const fallbackAvailability = getFallbackTutorAvailability();

export function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<TutorAvailabilityApiSlot[]>(fallbackAvailability.slots);
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState(String(fallbackAvailability.max_sessions_per_day));
  const [noticeRequired, setNoticeRequired] = useState(fallbackAvailability.notice_required);
  const [slotDate, setSlotDate] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [mutatingSlots, setMutatingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

  const slotMap = useMemo(() => {
    return slots.reduce<Record<string, TutorAvailabilityApiSlot>>((map, slot) => {
      map[`${slot.day}-${slot.time}`] = slot;
      return map;
    }, {});
  }, [slots]);

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

  async function handleAddSlot() {
    if (!slotDate || !slotStart || !slotEnd) {
      setError("Select a date, start time, and end time before adding a slot.");
      return;
    }

    const dayIndex = new Date(slotDate).getDay();
    const dayKeys: TutorAvailabilityDay[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const day = dayKeys[dayIndex];

    if (!day || day === "sun") {
      setError("Availability slots can only be added on Monday through Saturday.");
      return;
    }

    const displayStart = slotStart.replace(/^0/, "");
    const displayEnd = slotEnd.replace(/^0/, "");
    const timeKey = new Date(`2026-03-30T${slotStart}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    setMutatingSlots(true);
    setError(null);
    setMessage(null);

    try {
      const created = await addTutorAvailabilitySlot({
        day,
        time: timeKey,
        label: `Available\n${displayStart}-${displayEnd}`,
        status: "available",
        date: slotDate,
        start_time: slotStart,
        end_time: slotEnd,
      });

      setSlots((current) => [
        ...current.filter((slot) => !(slot.day === created.day && slot.time === created.time)),
        normalizeSlot(created),
      ]);
      setMessage("Availability slot added.");
      setSlotDate("");
      setSlotStart("");
      setSlotEnd("");
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Failed to add availability slot.");
    } finally {
      setMutatingSlots(false);
    }
  }

  async function handleRemoveAllAvailability() {
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
    }
  }

  const isBusy = loading || savingSettings || mutatingSlots;

  return (
    <TutorShell>
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Availability</h1>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRemoveAllAvailability}
              disabled={isBusy}
              className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove All
            </button>
            <button
              type="button"
              onClick={handleAddSlot}
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280]"
                  aria-label="Previous week"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-[16px] font-bold text-[#20242b]">March 30 – April 5, 2026</h2>
                <button
                  type="button"
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

            <div className="overflow-x-auto">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[84px_repeat(7,minmax(0,1fr))] border-b border-[#eceef2] bg-[#fafafb]">
                  <div className="border-r border-[#eceef2]" />
                  {tutorAvailabilityDays.map((day) => (
                    <div
                      key={day.key}
                      className="border-r border-[#eceef2] px-3 py-2 text-center last:border-r-0"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                        {day.label}
                      </p>
                      <p className="text-[28px] font-bold leading-none text-[#20242b]">{day.date}</p>
                    </div>
                  ))}
                </div>

                {tutorAvailabilityTimes.map((time) => (
                  <div
                    key={time}
                    className="grid grid-cols-[84px_repeat(7,minmax(0,1fr))] border-b border-[#eceef2] last:border-b-0"
                  >
                    <div className="border-r border-[#eceef2] px-2 py-4 text-[13px] text-[#6b7280]">{time}</div>
                    {tutorAvailabilityDays.map((day) => {
                      const slot = slotMap[`${day.key}-${time}`];

                      return (
                        <div
                          key={`${day.key}-${time}`}
                          className="min-h-[66px] border-r border-[#eceef2] px-3 py-2 last:border-r-0"
                        >
                          {slot ? (
                            <div
                              className={`rounded-[8px] border px-3 py-2 text-[12px] font-semibold leading-4 ${getSlotClass(slot.status)}`}
                            >
                              {slot.label.split("\n").map((line) => (
                                <div key={line}>{line}</div>
                              ))}
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

              <div className="border-t border-[#eceef2] pt-5">
                <h3 className="text-[16px] font-bold text-[#20242b]">Add Availability Slot</h3>

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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[13px] font-semibold text-[#6b7280]">Start</label>
                      <input
                        type="time"
                        value={slotStart}
                        onChange={(event) => setSlotStart(event.target.value)}
                        className="mt-2 h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[13px] font-semibold text-[#6b7280]">End</label>
                      <input
                        type="time"
                        value={slotEnd}
                        onChange={(event) => setSlotEnd(event.target.value)}
                        className="mt-2 h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSlot}
                    disabled={isBusy}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Add Slot
                  </button>
                </div>
              </div>

              <div className="border-t border-[#eceef2] pt-5">
                <button
                  type="button"
                  onClick={handleRemoveAllAvailability}
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
      </div>
    </TutorShell>
  );
}
