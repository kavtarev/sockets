export const allowedEvents = ['join', 'create', 'leave', 'message'] as const;
export type IEvents = (typeof allowedEvents)[number];
