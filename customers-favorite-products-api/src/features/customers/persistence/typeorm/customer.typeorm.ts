import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm';

export const UQ_CUSTOMER_EMAIL = "UQ_CUSTOMER_EMAIL";

@Unique(UQ_CUSTOMER_EMAIL, ["email"])
@Entity('customers')
export class CustomerTypeOrm {

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    email: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}