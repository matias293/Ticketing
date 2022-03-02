import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@mmticketing-course/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
