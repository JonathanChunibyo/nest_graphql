// Libraries
import { Field, ObjectType } from "@nestjs/graphql";
import { 
    BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn 
} from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
@ObjectType()
export class User {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    @Field()
    id: string;

    @Column('text')
    @Field()
    name: string;

    @Column('text')
    @Field()
    cellphoneNumber: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
    })
    @Field()
    nickName: string

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
    })
    @Field()
    email: string

    @Column('text')
    @Field()
    password: string;

    @Column({ type: 'boolean', default: true })
    @Field()
    isState: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    @Field()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    @Field()
    updatedAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.id = uuidv4();
    }
}
