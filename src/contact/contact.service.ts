
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../schemas/contact.schema';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    ) { }

    async create(createContactDto: CreateContactDto): Promise<Contact> {
        const createdContact = new this.contactModel(createContactDto);
        return createdContact.save();
    }

    async findAll(): Promise<Contact[]> {
        return this.contactModel.find().exec();
    }

    async findOne(id: string): Promise<Contact> {
        const contact = await this.contactModel.findById(id).exec();
        if (!contact) {
            throw new NotFoundException(`Contact inquiry with ID ${id} not found`);
        }
        return contact;
    }
}
