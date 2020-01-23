import mongoose from 'mongoose';
import { Readable } from 'stream';

import Contact from '~/schemas/Contact';
import Tag from '~/schemas/Tag';

import ImportContactsService from './importContactService';

describe('Import', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
    await Tag.deleteMany({});
  });

  it('should be able to create new contacts', async () => {
    await Contact.create({ email: 'gusflopes86@gmail.com' });

    const list = await Contact.find({});

    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'gusflopes86@gmail.com',
        }),
      ])
    );
  });

  it('should be able to import new contacts', async () => {
    const contactsFileStream = Readable.from([
      'gusflopes86@gmail.com\n',
      'gustavo@lscont.com.br\n',
      'orthoclinicms@gmail.com\n',
    ]);

    const importContacts = new ImportContactsService();

    await importContacts.run(contactsFileStream, ['Students', 'Class A']);

    const createdTags = await Tag.find({}).lean();

    expect(createdTags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Students' }),
        expect.objectContaining({ title: 'Class A' }),
      ])
    );

    const createdTagsIds = createdTags.map(tag => tag._id);

    const createdContacts = await Contact.find({}).lean(); // .lean() retorna objeto JS

    expect(createdContacts).toEqual([
      expect.objectContaining({
        email: 'gusflopes86@gmail.com',
        tags: createdTagsIds,
      }),
      expect.objectContaining({
        email: 'gustavo@lscont.com.br',
        tags: createdTagsIds,
      }),
      expect.objectContaining({
        email: 'orthoclinicms@gmail.com',
        tags: createdTagsIds,
      }),
    ]);
  });

  it('should not recreate tags that already exists', async () => {
    const contactsFileStream = Readable.from([
      'gusflopes86@gmail.com\n',
      'gustavo@lscont.com.br\n',
      'orthoclinicms@gmail.com\n',
    ]);

    const importContacts = new ImportContactsService();

    await Tag.create({ title: 'Students' });

    await importContacts.run(contactsFileStream, ['Students', 'Class A']);

    const createdTags = await Tag.find({}).lean();

    expect(createdTags).toEqual([
      expect.objectContaining({ title: 'Students' }),
      expect.objectContaining({ title: 'Class A' }),
    ]);
  });

  it('should not recreate contacts that already exists', async () => {
    const contactsFileStream = Readable.from([
      'gusflopes86@gmail.com\n',
      'gustavo@lscont.com.br\n',
      'orthoclinicms@gmail.com\n',
    ]);

    const tag = await Tag.create({ title: 'Students' });
    await Contact.create({ email: 'gusflopes86@gmail.com', tags: [tag._id] });

    const importContacts = new ImportContactsService();

    await importContacts.run(contactsFileStream, ['Class A']);

    const contacts = await Contact.find({
      email: 'gusflopes86@gmail.com',
    })
      .populate('tags') // trazer as informações e não apenas o ID
      .lean(); // retornar objeto Javascript

    expect(contacts.length).toBe(1);
    expect(contacts[0].tags).toEqual([
      expect.objectContaining({ title: 'Students' }),
      expect.objectContaining({ title: 'Class A' }),
    ]);
  });
  // next test
});
