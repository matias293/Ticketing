import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@mmticketing-course/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
