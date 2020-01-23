import mongoose from 'mongoose';
import Contact from '../../src/schemas/Contact';

describe('MongoDB-Jest', () => {
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
  });

  it('should be able to create new contacts', async () => {
    await Contact.create({ email: 'aleatorio@gmail.com' });

    const list = await Contact.find({});

    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'aleatorio@gmail.com',
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
