import { Ticket } from '../ticket';

it('implements optimistc concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'Dividos',
    price: 2314,
    userId: '124sqad',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('Should not reach this point');
});

it('incremets the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Dividos',
    price: 2314,
    userId: '124sqad',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  const firstInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });

  await firstInstance!.save();
  expect(firstInstance!.version).toEqual(1);
  await firstInstance!.save();
  expect(firstInstance!.version).toEqual(2);
});
