import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from "modules/users/entities/user.entity";
import { Address } from 'modules/addresses/entities/address.entity';

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column('decimal', { precision: 2, scale: 2 })
  public size: number;

  @Column('decimal', { precision: 2, scale: 2 })
  public yield: number;

  @ManyToOne(() => User, user => user.farms)
  @JoinColumn()
  public user: User;

  @OneToOne(() => Address)
  @JoinColumn()
  public address: Address;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}