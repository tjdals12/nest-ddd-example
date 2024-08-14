import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccessLogDocument = HydratedDocument<AccessLog>;

@Schema()
export class AccessLog {
    @Prop({ required: true })
    path: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    date: Date;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);
