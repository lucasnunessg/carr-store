import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: Partial<Contact>) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
} 