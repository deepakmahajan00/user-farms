import { Address } from "modules/addresses/entities/address.entity";
import { Farm } from "modules/farms/entities/farm.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, JoinColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @ManyToOne(() => Address, address => address.users)
  @JoinColumn()
  public address: Address;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Farm, farm => farm.user)
  public farms: Farm[];
}
