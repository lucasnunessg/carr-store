import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  create(createContactDto: Partial<Contact>) {
    const contact = this.contactsRepository.create(createContactDto);
    return this.contactsRepository.save(contact);
  }

  findAll() {
    return this.contactsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.contactsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const contact = await this.findOne(id);
    if (!contact) {
      return null;
    }
    return this.contactsRepository.remove(contact);
  }
} 