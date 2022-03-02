import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@mmticketing-course/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
