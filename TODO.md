# TODO: Update Nurse Schemas

- [ ] Define enums for NurseServiceType and NurseAppointmentStatus in a shared file or inline
- [ ] Update src/schemas/nurse.schema.ts to match the new Nurse type (remove old fields, add name, specialization, experienceYears, rating, serviceTypes)
- [ ] Create src/schemas/nurse-timeslot.schema.ts for NurseTimeSlot (fields: nurseId, serviceType, time, date, isAvailable)
- [ ] Create src/schemas/nurse-appointment.schema.ts for NurseAppointment (fields: nurseId, nurseName, serviceType, date, time, status, statusLabel)
