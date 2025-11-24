import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../components/user/user.entity';

const usersSeed: Array<{ email: string; name: string; password: string }> = [
  {
    email: 'test@test.com',
    name: 'Test User',
    password: '0424Sam??',
  },
];

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  for (const seedUser of usersSeed) {
    const exists = await userRepository.findOne({
      where: { email: seedUser.email },
      withDeleted: false,
    });

    if (exists) {
      console.log(`⚠️  Usuario ${seedUser.email} ya existe, se omite.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(seedUser.password, 10);

    const user = userRepository.create({
      email: seedUser.email,
      name: seedUser.name,
      password: hashedPassword,
    });

    await userRepository.save(user);
    console.log(`✅ Usuario ${seedUser.email} creado.`);
  }
}

