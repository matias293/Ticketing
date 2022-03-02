import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from '@mmticketing-course/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
