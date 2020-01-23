import mongoose from 'mongoose';
import { Readable } from 'stream';

import ImportContactsService from '@services/importContactService';

import Contact from '@schemas/Contact';
import Tag from '@schemas/Tag';

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

  it('should be able to import new contacts', () => {
    // Arquivo CSV
    // Importar CSV
    // Esper oque tenha os contatos de dentro do CSV salvos com a tag
    // Repassar uma tag
  });
  // next test
});
