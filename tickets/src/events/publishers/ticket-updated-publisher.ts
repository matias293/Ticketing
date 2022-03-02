import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@mmticketing-course/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
